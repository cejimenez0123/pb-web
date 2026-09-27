import { IonSearchbar } from "@ionic/react";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchProfiles } from "../../actions/ProfileActions";
import { patchRoles } from "../../actions/RoleActions";
import {
  fetchCollection,
  patchCollectionRoles,
} from "../../actions/CollectionActions";
import Role from "../../domain/models/role";
import checkResult from "../../core/checkResult";
import ProfileCircle from "../profile/ProfileCircle";
import { getStory } from "../../actions/StoryActions";
import Enviroment from "../../core/Enviroment";
import Pill from "../Pill";
import { useAlert } from "../../core/useAlert";
import AlertType from "../../core/AlertType";

const ROLE_OPTIONS = [
  {
    value: "editor",
    label: "Editor",
    description: "Can edit and help shape this piece.",
  },
  {
    value: "writer",
    label: "Writer",
    description: "Can write and contribute to this piece.",
  },
  {
    value: "commenter",
    label: "Commenter",
    description: "Can read and leave feedback.",
  },
  {
    value: "reader",
    label: "Reader",
    description: "Can privately read this piece.",
  },
  {
    value: "none",
    label: "No access",
    description: "Cannot open new content.",
  },
];

const ROLE_PRIORITY = {
  owner: 0,
  editor: 1,
  writer: 2,
  commenter: 3,
  reader: 4,
  none: 5,
};

const getRoleDescription = (role) => {
  if (role === "owner") {
    return "Owns and manages this piece.";
  }

  return (
    ROLE_OPTIONS.find((option) => option.value === role)
      ?.description || ""
  );
};

export default function RoleForm({ item }) {
  const dispatch = useDispatch();

  const profiles = useSelector(
    (state) => state.users.profilesInView
  );

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const { showAlert } = useAlert();

  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const isCollection = Boolean(item?.storyIdList);

  /*
   * ------------------------------------------------------------
   * STABLE SYNC KEYS
   * ------------------------------------------------------------
   *
   * Do not use `item` or `profiles` directly as dependencies
   * for the role-building effect.
   *
   * Redux/parent components can provide new object/array
   * references even when the actual data has not changed.
   *
   * Using primitive signatures prevents:
   *
   * render
   * -> effect
   * -> setRoles
   * -> render
   * -> effect
   * -> ...
   */

  const itemId = item?.id || "";

  const profileSignature = useMemo(() => {
    if (!profiles?.length) return "";

    return profiles
      .map((profile) => profile?.id)
      .filter(Boolean)
      .sort()
      .join("|");
  }, [profiles]);

  const sourceRoles = item?.roles || item?.betaReaders || [];

  const roleSignature = useMemo(() => {
    if (!sourceRoles?.length) return "";

    return sourceRoles
      .filter((role) => role?.profile?.id)
      .map(
        (role) =>
          `${role.profile.id}:${role.role || "none"}:${role.id || ""}`
      )
      .sort()
      .join("|");
  }, [sourceRoles]);

  /*
   * ------------------------------------------------------------
   * LOAD PROFILES
   * ------------------------------------------------------------
   */

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  /*
   * ------------------------------------------------------------
   * BUILD ROLE STATE
   * ------------------------------------------------------------
   *
   * "none" is a frontend-only state.
   *
   * When saved:
   *
   * existing role + none = backend deletes relationship
   * no role + actual role = backend creates relationship
   * existing role + actual role = backend updates relationship
   */

  useEffect(() => {
    if (!itemId || !profiles?.length) {
      return;
    }

    const roleMap = new Map(
      sourceRoles
        .filter((role) => role?.profile?.id)
        .map((role) => [role.profile.id, role])
    );

    const nextRoles = profiles.map((profile) => {
      const existing = roleMap.get(profile.id);

      return new Role(
        existing?.id || null,
        profile,
        item,
        existing?.role || "none",
        existing?.created || null
      );
    });

    setRoles(nextRoles);
  }, [
    itemId,
    profileSignature,
    roleSignature,
  ]);

  /*
   * ------------------------------------------------------------
   * ROLE MAP
   * ------------------------------------------------------------
   */

  const roleMap = useMemo(() => {
    return new Map(
      roles
        .filter((role) => role?.profile?.id)
        .map((role) => [
          role.profile.id,
          role.role || "none",
        ])
    );
  }, [roles]);

  /*
   * ------------------------------------------------------------
   * ACTIVE COUNT
   * ------------------------------------------------------------
   */

  const activeCount = useMemo(() => {
    return roles.filter(
      (role) =>
        role.role &&
        role.role !== "none" &&
        role.role !== "owner"
    ).length;
  }, [roles]);

  /*
   * ------------------------------------------------------------
   * UPDATE ROLE
   * ------------------------------------------------------------
   */

  const handleUpdateRole = (profile, nextRole) => {
    setRoles((previousRoles) =>
      previousRoles.map((existingRole) => {
        if (existingRole.profile.id !== profile.id) {
          return existingRole;
        }

        /*
         * Owner cannot be changed from this form.
         */
        if (existingRole.role === "owner") {
          return existingRole;
        }

        return new Role(
          existingRole.id,
          profile,
          item,
          nextRole,
          existingRole.created
        );
      })
    );
  };

  /*
   * ------------------------------------------------------------
   * RESET ACCESS
   * ------------------------------------------------------------
   *
   * Owner is preserved.
   *
   * Everyone else becomes frontend state "none".
   * The story PUT endpoint turns existing "none" roles into
   * DELETE operations.
   */

  const handleResetAllRoles = () => {
    setRoles((previousRoles) =>
      previousRoles.map((role) => {
        if (role.role === "owner") {
          return role;
        }

        return new Role(
          role.id,
          role.profile,
          item,
          "none",
          role.created
        );
      })
    );
  };

  /*
   * ------------------------------------------------------------
   * SEARCH + SORT
   * ------------------------------------------------------------
   */

  const filteredProfiles = useMemo(() => {
    if (!profiles?.length) return [];

    const normalizedSearch = search.trim().toLowerCase();

    const filtered = profiles.filter((profile) => {
      if (!normalizedSearch) return true;

      return profile.username
        ?.toLowerCase()
        .includes(normalizedSearch);
    });

    return [...filtered].sort((a, b) => {
      const roleA = roleMap.get(a.id) || "none";
      const roleB = roleMap.get(b.id) || "none";

      const priorityA = ROLE_PRIORITY[roleA] ?? 99;
      const priorityB = ROLE_PRIORITY[roleB] ?? 99;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      return (a.username || "").localeCompare(
        b.username || ""
      );
    });
  }, [profiles, search, roleMap]);

  /*
   * ------------------------------------------------------------
   * SAVE
   * ------------------------------------------------------------
   */

  const handlePatchRoles = () => {
    if (!currentProfile || !item || saving) return;

    setSaving(true);

    const action = isCollection
      ? patchCollectionRoles({
          roles,
          profile: currentProfile,
          collection: item,
        })
      : patchRoles({
          roles,
          profileId: currentProfile.id,
          storyId: item.id,
        });

    dispatch(action).then((res) =>
      checkResult(
        res,
        () => {
          if (isCollection) {
            dispatch(
              fetchCollection({
                id: item.id,
              })
            );
          } else {
            dispatch(
              getStory({
                id: item.id,
              })
            );
          }

          setSaving(false);

          showAlert({
            message: "Access updated",
            type: AlertType.success,
          });
        },
        () => {
          setSaving(false);

          showAlert({
            message: "There was a problem saving access.",
            type: AlertType.error,
          });
        }
      )
    );
  };

  /*
   * ------------------------------------------------------------
   * EMPTY ITEM
   * ------------------------------------------------------------
   */

  if (!item) {
    return null;
  }

  /*
   * ------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------
   */

  return (
    <div
      className="
        flex
        w-full
        min-w-0
        flex-col
        bg-cream
        text-text-primary
        dark:bg-base-bgDark
        dark:text-base-surface
      "
    >
      {/* HEADER */}

      <div className="shrink-0 px-1 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className="
                mb-1
                text-[11px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-text-brand
              "
            >
              {isCollection
                ? "Collection access"
                : "Story access"}
            </p>

            <h2
              className="
                truncate
                font-serif
                text-xl
                leading-tight
                text-text-primary
                dark:text-base-surface
                sm:text-2xl
              "
            >
              {item.title || item.name || "Untitled"}
            </h2>
          </div>

          <div
            className="
              shrink-0
              rounded-full
              bg-soft
              px-3
              py-1.5
              text-xs
              text-white
              font-semibold
              text-text-brand
              dark:bg-base-surfaceDark
            "
          >
            {activeCount}{" "}
            {activeCount === 1 ? "person" : "people"}
          </div>
        </div>

        <p
          className="
            mt-2
            max-w-lg
            text-sm
            leading-relaxed
            text-text-secondary
          "
        >
          Choose what each person can do. Reader access
          includes private stories and rooms.
        </p>
      </div>

      {/* SEARCH */}

      <div className="shrink-0 pb-3">
        <IonSearchbar
          value={search}
          onIonInput={(event) =>
            setSearch(event.target.value || "")
          }
          placeholder="Search people"
          style={{
            "--background":
              Enviroment.palette.base.surface,
            "--border-radius": "999px",
            "--box-shadow": "none",
            "--placeholder-color":
              Enviroment.palette.text.secondary,
            "--color":
              Enviroment.palette.text.primary,
          }}
          className="px-0"
        />
      </div>

      {/* ROLE EXPLANATION */}

      <div
        className="
          mb-3
          shrink-0
          rounded-2xl
          bg-base-bg
          px-3
          py-2.5
          dark:bg-base-surfaceDark
        "
      >
        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
          {ROLE_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="
                flex
                items-center
                gap-1
                text-[11px]
                leading-tight
              "
            >
              <span
                className="
                  font-semibold
                  text-text-brand
                "
              >
                {option.label}
              </span>

              <span className="text-text-secondary">
                {option.description.replace(/\.$/, "")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* PEOPLE */}

      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overscroll-contain
          pr-0.5
        "
      >
        {filteredProfiles.length > 0 ? (
          <div className="space-y-2">
            {filteredProfiles.map((profile) => {
              const role =
                roleMap.get(profile.id) || "none";

              const isOwner = role === "owner";
              const hasAccess = role !== "none";

              return (
                <div
                  key={profile.id}
                  className={`
                    flex
                    min-h-[60px]
                    items-center
                    justify-between
                    gap-3
                    rounded-2xl
                    border
                    px-3
                    py-2
                    transition-colors
                    duration-150
                    ${
                      hasAccess
                        ? "border-border-focus bg-base-bg dark:bg-base-surfaceDark"
                        : "border-border-soft/60 bg-base-bg/60 dark:bg-base-surfaceDark/60"
                    }
                  `}
                >
                  {/* PERSON */}

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <ProfileCircle
                      profile={profile}
                      includeUsername={true}
                    />
                  </div>

                  {/* ROLE */}

                  <div
                    className="
                      flex
                      shrink-0
                      flex-col
                      items-end
                    "
                  >
                    <div className="relative">
                      <select
                        value={role}
                        disabled={isOwner}
                        onChange={(event) =>
                          handleUpdateRole(
                            profile,
                            event.target.value
                          )
                        }
                        aria-label={`Access for ${profile.username}`}
                        className={`
                          min-h-[42px]
                          max-w-[145px]
                          appearance-none
                          rounded-full
                          border
                          py-2
                          pl-3
                          pr-8
                          text-xs
                          font-semibold
                          outline-none
                          transition-all
                          focus:ring-2
                          focus:ring-button-primary/30
                          ${
                            isOwner
                              ? `
                                cursor-default
                                border-button-primary/30
                                bg-soft
                                text-white
                              `
                              : hasAccess
                              ? `
                                cursor-pointer
                                border-button-primary
                                bg-soft
                                text-white
                                hover:border-button-primary
                              `
                              : `
                                cursor-pointer
                                border-border-soft
                                bg-transparent
                                text-text-secondary
                                hover:border-button-primary
                                hover:text-text-brand
                              `
                          }
                        `}
                      >
                        {isOwner ? (
                          <option value="owner">
                            Owner
                          </option>
                        ) : (
                          ROLE_OPTIONS.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))
                        )}
                      </select>

                      {!isOwner && (
                        <span
                          aria-hidden="true"
                          className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-[10px]
                            text-text-secondary
                          "
                        >
                          ▼
                        </span>
                      )}
                    </div>

                    <p
                      className="
                        mt-1
                        max-w-[145px]
                        truncate
                        text-right
                        text-[10px]
                        leading-tight
                        text-text-secondary
                      "
                    >
                      {getRoleDescription(role)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="
              flex
              min-h-[160px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-border-soft
              px-6
              text-center
            "
          >
            <p
              className="
                font-serif
                text-lg
                text-text-primary
                dark:text-base-surface
              "
            >
              {search
                ? "No one found"
                : "No people available"}
            </p>

            <p
              className="
                mt-1
                text-sm
                text-text-secondary
              "
            >
              {search
                ? `Nothing matched "${search}".`
                : "There aren't any profiles to manage yet."}
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-text-brand
                  underline-offset-2
                  hover:underline
                "
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* ACTIONS */}

      <div
        className="
          shrink-0
          border-t
          border-border-soft
          bg-cream
          pt-3
          dark:bg-base-bgDark
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-2
          "
        >
          <Pill
            label="Reset access"
            onClick={handleResetAllRoles}
            variant="secondary"
            baseClass="
              border
              border-border-soft
              bg-transparent
              text-text-secondary
              hover:bg-soft
              dark:border-border-soft
              dark:bg-transparent
              dark:text-cream
            "
          />

          <Pill
            label={saving ? "Saving..." : "Save changes"}
            onClick={handlePatchRoles}
            variant="primary"
            baseClass="
              bg-button-primary
              text-white
              shadow-sm
              hover:opacity-90
            "
          />
        </div>
      </div>
    </div>
  );
}