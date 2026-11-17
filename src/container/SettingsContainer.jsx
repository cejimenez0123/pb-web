



import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";
import { IonContent, IonLoading, useIonRouter } from "@ionic/react";
import { SocialLogin } from "@capgo/capacitor-social-login";
import {
 
  deleteUserAccounts,

  signOutAction,
} from "../actions/UserActions";
import { updateProfile } from "../actions/UserActions";
import { deletePicture } from "../actions/UserActions";
import {uploadProfilePicture  } from "../actions/ProfileActions";
import { useAlert } from "../core/useAlert.jsx";
import AlertType from "../core/AlertType.js";
import checkResult from "../core/checkResult";
import Enviroment from "../core/Enviroment";
import Paths from "../core/paths";
import fetchCity from "../core/fetchCity";


import {
  fetchBlockedProfiles,
  unblockProfile,
} from "../actions/ModerationAcitons.jsx";

import { useDialog } from "../domain/usecases/useDialog";
import GoogleMapSearch from "./collection/GoogleMapSearch";
import styles from "../styles/style.js";

const SPRINT_SLOTS = [
  { id: "morning", label: "Morning", emoji: "🌅", time: "7:00 AM" },
  { id: "midday", label: "Midday", emoji: "☀️", time: "12:00 PM" },
  { id: "afternoon", label: "Afternoon", emoji: "🌤", time: "3:00 PM" },
  { id: "evening", label: "Evening", emoji: "🌆", time: "7:00 PM" },
  { id: "night", label: "Night", emoji: "🌙", time: "10:00 PM" },
];

const DEFAULT_PICTURE = "https://placehold.co/200";

const FIELD_CLASSES = `
text-base
  input-bordered
  border-plumb-borderStrong
  bg-plumb-surface
  text-plumb-ink
  placeholder:text-plumb-subtle
  dark:border-plumb-darkBorderStrong
  dark:bg-plumb-dark-elevated
  dark:text-plumb-darkText
  dark:placeholder:text-plumb-darkSubtle
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-plumb-focus
  focus-visible:ring-offset-2
  focus-visible:ring-offset-plumb-paper
  dark:focus-visible:ring-plumb-mintLight
  dark:focus-visible:ring-offset-plumb-dark-surface
`;

const BUTTON_FOCUS = `
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-plumb-focus
  focus-visible:ring-offset-2
  focus-visible:ring-offset-plumb-paper
  dark:focus-visible:ring-plumb-mintLight
  dark:focus-visible:ring-offset-plumb-dark-surface
  motion-reduce:transition-none
  disabled:cursor-not-allowed
  disabled:opacity-60
`;

async function getPosition() {
  try {
    if (Capacitor.isNativePlatform()) {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    }

    if (navigator.geolocation) {
      return await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) =>
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
          }
        );
      });
    }

    const response = await fetch(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`,
      { method: "POST" }
    );

    if (!response.ok) {
      throw new Error("Unable to determine your location.");
    }

    const data = await response.json();

    if (!data?.location) {
      throw new Error("Location data was unavailable.");
    }

    return {
      latitude: data.location.lat,
      longitude: data.location.lng,
    };
  } catch (err) {
    console.error("Unable to get location:", err);
    throw err;
  }
}

export default function SettingsContainer() {
  const dispatch = useDispatch();
  const router = useIonRouter();

  const { openDialog, closeDialog } = useDialog();
  const { showAlert } = useAlert();
  const { currentProfile } = useSelector((state) => state.users);

  const [file, setFile] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    username: "",
    selfStatement: "",
    isPrivate: false,
    profilePicture: "",
    writingSprintSlots: [],
    location: {
      latitude: null,
      longitude: null,
      city: "",
    },
  });

  const [pictureUrl, setPictureUrl] = useState(DEFAULT_PICTURE);

  // Redirect when there is no authenticated profile.
  useEffect(() => {
    if (!currentProfile) {
      router.push(Paths.login, "root");
    }
  }, [currentProfile, router]);

  // Load profile information into the form.
  useEffect(() => {
    if (!currentProfile) return;

    const pic = currentProfile.profilePic;

    setForm({
      username: currentProfile.username ?? "",
      selfStatement: currentProfile.selfStatement ?? "",
      isPrivate: currentProfile.isPrivate ?? false,
      writingSprintSlots: currentProfile.writingSprintSlots ?? [],
      profilePicture: pic ?? "",
      location: {
        latitude: currentProfile.location?.latitude ?? null,
        longitude: currentProfile.location?.longitude ?? null,
        city: currentProfile.location?.city ?? "",
      },
    });

    if (pic) {
      setPictureUrl(
        pic.includes("http") ? pic : Enviroment.imageProxy(pic)
      );
    } else {
      setPictureUrl(DEFAULT_PICTURE);
    }
  }, [currentProfile]);

  // Update a top-level form field.
  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Toggle an available writing window.
  const toggleSlot = (slotId) => {
    setForm((prev) => {
      const current = prev.writingSprintSlots ?? [];

      return {
        ...prev,
        writingSprintSlots: current.includes(slotId)
          ? current.filter((slot) => slot !== slotId)
          : [...current, slotId],
      };
    });
  };

  // Use the device's current location.
  const handleUseCurrentLocation = async () => {
    setLocationLoading(true);

    try {
      const coords = await getPosition();
      const cityCountry = await fetchCity(coords);

      handleChange("location", {
        ...coords,
        city: cityCountry || "",
      });

      showAlert({
        message: "Location updated!",
        type: AlertType.success,
      });
    } catch (err) {
      console.error(err);

      showAlert({
        message: "Unable to fetch current location.",
        type: AlertType.error,
      });
    } finally {
      setLocationLoading(false);
    }
  };

  // Validate and preview a profile image.
  const handleImage = (event) => {
    const selected = event.target.files?.[0];

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      showAlert({
        message: "Upload a valid image.",
        type: AlertType.error,
      });

      event.target.value = "";
      return;
    }

    setFile(selected);
    setPictureUrl(URL.createObjectURL(selected));
  };

const handleSubmit = async () => {
  if (!currentProfile || saving) return;

  setSaving(true);

  const oldProfilePicture = currentProfile.profilePic;

  try {
    let profilePicture = form.profilePicture;

    // 1. Upload the replacement picture.
    if (file) {
      const upload = await dispatch(
        uploadProfilePicture({
          file,
          id: currentProfile.id,
        })
      ).unwrap();

      if (!upload?.fileName || !upload?.url) {
        throw new Error("Image upload did not return a valid result.");
      }

      profilePicture = upload.fileName;
    }

    // 2. Persist the profile changes.
    // updateProfile.fulfilled updates currentProfile in Redux.
    const result = await dispatch(
      updateProfile({
        profile: currentProfile,
        username: form.username,
        profilePicture,
        writingSprintSlots: form.writingSprintSlots,
        selfStatement: form.selfStatement,
        privacy: form.isPrivate,
        location: form.location,
      })
    ).unwrap();

    if (!result?.profile) {
      throw new Error("Profile update failed.");
    }

    // 3. Delete the previous picture only after successful persistence.
    if (
      file &&
      oldProfilePicture &&
      oldProfilePicture !== profilePicture
    ) {
      try {
        await dispatch(
          deletePicture({
            fileName: oldProfilePicture,
          })
        ).unwrap();
      } catch (error) {
        console.warn(
          "Old profile picture cleanup failed:",
          error
        );
      }
    }

    // 4. Update local state.
    setForm((prev) => ({
      ...prev,
      profilePicture,
    }));

    setFile(null);

    setPictureUrl(
      profilePicture
        ? Enviroment.imageProxy(profilePicture)
        : DEFAULT_PICTURE
    );

    showAlert({
      message: "Profile updated",
      type: AlertType.success,
    });

  } catch (err) {
    console.error("Profile update failed:", err);

    showAlert({
      message: err?.message || "Update failed",
      type: AlertType.error,
    });
  } finally {
    setSaving(false);
  }
};



  // Load blocked users and display the list.
  const handleShowBlocked = () => {
    openDialog({
      title: "Blocked Users",
      text: () => (
        <div className="p-4 text-center text-plumb-muted dark:text-plumb-darkMuted">
          Loading…
        </div>
      ),
      disagreeText: "Close",
      disagree: () => closeDialog(),
    });

    dispatch(fetchBlockedProfiles()).then((res) => {
      checkResult(
        res,
        () => {
          const list = res?.payload?.blockedProfiles || [];

          openDialog({
            title: "Blocked Users",
            height: 60,
            text: () => (
              <div className="max-h-64 overflow-y-auto p-4">
                {!Array.isArray(list) || list.length === 0 ? (
                  <div className="py-6 text-center text-sm text-plumb-muted dark:text-plumb-darkMuted">
                    You haven't blocked anyone.
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {list.map((profile) => {
                      const pic = profile.profilePic || "";

                      const src = pic.includes("http")
                        ? pic
                        : pic
                          ? Enviroment.imageProxy(pic)
                          : "https://placehold.co/40";

                      return (
                        <li
                          key={profile.id}
                          className="
                            flex items-center gap-3 rounded-xl border p-3
                            border-plumb-borderStrong bg-plumb-surface
                            dark:border-plumb-darkBorderStrong
                            dark:bg-plumb-dark-elevated
                          "
                        >
                          <img
                            src={src}
                            alt=""
                            className="size-10 shrink-0 rounded-full object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-plumb-ink dark:text-plumb-darkText">
                              {profile.username || "Unknown"}
                            </p>
                            <p className="text-xs text-plumb-muted dark:text-plumb-darkMuted">
                              Blocked
                            </p>
                          </div>

                          <button
                            type="button"
                            className={`
                              btn btn-sm btn-outline rounded-lg
                              border-plumb-borderStrong text-plumb-text
                              hover:bg-plumb-elevated
                              dark:border-plumb-darkBorderStrong
                              dark:text-plumb-darkText
                              dark:hover:bg-plumb-dark-surface
                              ${BUTTON_FOCUS}
                            `}
                            onClick={() =>
                              handleUnblock(profile.id, profile.username)
                            }
                          >
                            Unblock
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ),
            disagreeText: "Close",
            disagree: () => closeDialog(),
          });
        },
        (err) => {
          openDialog({
            title: "Blocked Users",
            text: () => (
              <div className="p-4 text-center text-red-700 dark:text-red-300">
                {err?.message || "Error loading blocked users"}
              </div>
            ),
            agreeText: "OK",
            agree: () => closeDialog(),
          });
        }
      );
    });
  };

  // Unblock a profile.
  const handleUnblock = (blockedProfileId, username) => {
    openDialog({
      title: "Unblock user?",
      text: `Unblock @${username || "this user"}?`,
      agreeText: "Unblock",
      agree: () => {
        dispatch(unblockProfile(blockedProfileId)).then((res) => {
          checkResult(
            res,
            () => {
              showAlert({
                message: "User unblocked",
                type: AlertType.success,
              });

              handleShowBlocked();
            },
            (err) => {
              showAlert({
                message: err?.message || "Failed to unblock",
                type: AlertType.error,
              });
            }
          );
        });
      },
      disagreeText: "Cancel",
      disagree: () => closeDialog(),
    });
  };

  // Delete account.
  const handleDelete = () => {
    openDialog({
      title: "Delete account?",
      text: "This cannot be undone.",
      agreeText: "Delete",
      agree: () => {
        dispatch(deleteUserAccounts()).then((res) => {
          checkResult(
            res,
            () => {
              showAlert({
                message: "Account deleted",
                type: AlertType.success,
              });

              router.push(Paths.login);
            },
            (err) => {
              showAlert({
                message: err.message,
                type: AlertType.error,
              });
            }
          );
        });
      },
      disagreeText: "Cancel",
      disagree: () => closeDialog(),
    });
  };

  // Sign out of the app.
  const handleLogout = async () => {
    try {
      await SocialLogin.logout({ provider: "google" });
    } catch (err) {
      // A provider logout failure should not prevent app sign-out.
      console.warn("Social login logout:", err);
    }

    dispatch(signOutAction({ profile: currentProfile })).then((res) => {
      checkResult(
        res,
        () => router.push(Paths.login),
        (err) =>
          showAlert({
            message: err.message,
            type: AlertType.error,
          })
      );
    });
  };

  if (!currentProfile) {
    return (
      <IonContent fullscreen>
        <IonLoading
          isOpen
          message="Loading your space..."
          spinner="crescent"
        />
      </IonContent>
    );
  }

  return (
    <IonContent fullscreen>
   
      <IonLoading
        isOpen={locationLoading || saving}
        message={
          saving ? "Saving your profile..." : "Finding your location..."
        }
        spinner="crescent"
      />
         <main className={[styles.pageShell.base, "px-2"].join(" ")}>
          <div className={styles.pageShell.body}>
<section className= {[styles.pageShell.body,`
            card h-fit w-full max-w-xl space-y-6
            rounded-3xl border p-6 sm:p-8
            border-plumb-borderStrong bg-plumb-paper
            dark:border-plumb-darkBorderStrong
            dark:bg-plumb-dark-surface
            shadow-sm
          `].join(" ")}
        > 
          <h2
            className="
              text-center font-serif text-2xl font-semibold
              tracking-tight text-plumb-ink
              dark:text-plumb-darkText
            "
          >
            Profile Settings
          </h2>

          {/* Log Out */}
          <button
            type="button"
            onClick={handleLogout}
            className={`
              btn w-full rounded-xl
              border border-plumb-borderStrong
              bg-plumb-surface text-plumb-text
              hover:bg-plumb-elevated
              dark:border-plumb-darkBorderStrong
              dark:bg-plumb-dark-elevated dark:text-plumb-darkText
              dark:hover:bg-plumb-dark-surface
              ${BUTTON_FOCUS}
            `}
          >
            Log Out
          </button>

          {/* Username */}
          <div className="form-control">
            <label
              htmlFor="settings-username"
              className="label justify-start"
            >
              <span className="label-text font-medium text-plumb-text dark:text-plumb-darkText">
                Username
              </span>
            </label>

            <input
              id="settings-username"
              type="text"
              autoComplete="username"
              className={`
                input w-full rounded-xl
                ${FIELD_CLASSES}
              `}
              value={form.username}
              onChange={(event) =>
                handleChange("username", event.target.value)
              }
            />
          </div>

          {/* Profile Image */}
          <div className="form-control items-center gap-4">
            <div className="avatar">
              <div
                className="
                  size-24 overflow-hidden rounded-2xl
                  ring-2 ring-plumb-borderStrong
                  dark:ring-plumb-darkBorderStrong
                "
              >
                <img
                  src={pictureUrl}
                  alt="Profile picture preview"
                />
              </div>
            </div>

            <label htmlFor="settings-picture"  className="w-[100%]">
              <span className="label  mb-2 block">
                <span className="label-text font-medium text-plumb-text dark:text-plumb-darkText">
                  Profile Picture
                </span>
              </span>
<div className="flex flex-row justify-start">
              <input
                id="settings-picture"
                type="file"
                accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png"

                className="
                  file-input file-input-bordered  w-[80%] mx-auto 
                  border-plumb-borderStrong
                  bg-plumb-surface text-plumb-text
                  file:border-0 file:bg-plumb-mint file:text-white
                  dark:border-plumb-darkBorderStrong
                  dark:bg-plumb-dark-elevated dark:text-plumb-darkText
                  dark:file:bg-plumb-mint
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-plumb-focus
                  focus-visible:ring-offset-2
                  dark:focus-visible:ring-mintLight
                  dark:focus-visible:ring-offset-plumb-dark-surface
                "
                onChange={handleImage}
              />
              </div>
            </label>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <div>
              <label className="label justify-start">
                <span className="label-text font-medium text-plumb-text dark:text-plumb-darkText">
                  Location
                </span>
              </label>

              <div className="flex justify-center">
                <GoogleMapSearch
                  initLocationName={form.location?.city}
                  onLocationSelected={(coordinates) => {
                    handleChange("location", coordinates);
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              className={`
                btn btn-outline btn-sm w-full rounded-xl
                border-plumb-borderStrong text-plumb-text
                hover:bg-plumb-elevated
                dark:border-plumb-darkBorderStrong
                dark:text-plumb-darkText
                dark:hover:bg-plumb-dark-elevated
                ${BUTTON_FOCUS}
              `}
              onClick={handleUseCurrentLocation}
              disabled={locationLoading}
            >
              {locationLoading ? "Fetching location..." : "Use Current Location"}
            </button>
          </div>

          {/* Self Statement */}
          <div className="form-control">
            <label
              htmlFor="settings-statement"
              className="label justify-start"
            >
              <span className="label-text font-medium text-plumb-text dark:text-plumb-darkText">
                Self Statement
              </span>
            </label>

            <textarea
              id="settings-statement"
              maxLength={120}
              aria-describedby="settings-statement-count"
              className={`

                textarea textarea-bordered
                min-h-32 w-full resize-y rounded-xl
                ${FIELD_CLASSES}
              `}
              value={form.selfStatement}
              onChange={(event) =>
                handleChange("selfStatement", event.target.value)
              }
            />

            <p
              id="settings-statement-count"
              className="mt-1 text-right text-xs text-plumb-muted dark:text-plumb-darkMuted"
              aria-live="polite"
            >
              {form.selfStatement.length}/120
            </p>
          </div>

          {/* Privacy */}
          <div
            className="
              flex items-center justify-between gap-4
              rounded-xl border p-4
              border-plumb-borderStrong bg-plumb-surface
              dark:border-plumb-darkBorderStrong
              dark:bg-plumb-dark-elevated
            "
          >
            <div className="min-w-0">
              <label
                htmlFor="settings-private"
                className="block text-sm font-medium text-plumb-text dark:text-plumb-darkText"
              >
                Private Profile
              </label>

              <p className="mt-1 text-xs leading-relaxed text-plumb-muted dark:text-plumb-darkMuted">
                Control who can view your profile.
              </p>
            </div>

            <input
              id="settings-private"
              type="checkbox"
              className={`
                toggle toggle-primary shrink-0
                ${BUTTON_FOCUS}
              `}
              checked={form.isPrivate}
              onChange={(event) =>
                handleChange("isPrivate", event.target.checked)
              }
            />
          </div>

          {/* Writing Windows */}
          <fieldset className="form-control space-y-3">
            <legend className="text-sm font-medium text-plumb-text dark:text-plumb-darkText">
              Your Writing Windows
            </legend>

            <p className="text-sm leading-relaxed text-plumb-muted dark:text-plumb-darkMuted">
              We'll send you a prompt at these times. Show up, write something.
            </p>

            <div className="grid grid-cols-1 gap-2">
              {SPRINT_SLOTS.map((slot) => {
                const selected = form.writingSprintSlots?.includes(slot.id);

                return (
                  <button
                    key={slot.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleSlot(slot.id)}
                    className={`
                      flex min-h-14 w-full items-center justify-between
                      gap-4 rounded-xl border px-4 py-3 text-left
                      transition-colors motion-reduce:transition-none
                      ${BUTTON_FOCUS}
                      ${
                        selected
                          ? `
                            border-plumb-mint bg-plumb-mint/10
                            text-plumb-ink
                            dark:border-plumb-mintLight
                            dark:bg-plumb-mint/15
                            dark:text-plumb-darkText
                          `
                          : `
                            border-plumb-borderStrong bg-plumb-surface
                            text-plumb-text hover:bg-plumb-elevated
                            dark:border-plumb-darkBorderStrong
                            dark:bg-plumb-dark-elevated
                            dark:text-plumb-darkText
                            dark:hover:bg-plumb-dark-surface
                          `
                      }
                    `}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span aria-hidden="true" className="text-lg">
                        {slot.emoji}
                      </span>

                      <span className="text-sm font-medium">
                        {slot.label}
                      </span>
                    </span>

                    <span className="flex shrink-0 items-center gap-3">
                      <span className="text-xs text-plumb-muted dark:text-plumb-darkMuted">
                        {slot.time}
                      </span>

                      <span
                        aria-hidden="true"
                        className={`
                          flex size-5 items-center justify-center
                          rounded-full border-2
                          ${
                            selected
                              ? "border-plumb-mint bg-plumb-mint text-white dark:border-plumb-mintLight"
                              : "border-plumb-borderStrong dark:border-plumb-darkBorderStrong"
                          }
                        `}
                      >
                        {selected && (
                          <svg
                            className="size-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Blocked Users */}
          <button
            type="button"
            className={`
              btn btn-outline w-full rounded-xl
              border-plumb-borderStrong text-plumb-text
              hover:bg-plumb-elevated
              dark:border-plumb-darkBorderStrong
              dark:text-plumb-darkText
              dark:hover:bg-plumb-dark-elevated
              ${BUTTON_FOCUS}
            `}
            onClick={handleShowBlocked}
          >
            Blocked Users
          </button>

          {/* Save */}
          <button
            type="button"
            className={`
              btn w-full rounded-xl border-none
              bg-plumb-mint text-white
              hover:bg-plumb-mintHover
              ${BUTTON_FOCUS}
            `}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>

          {/* Delete */}
          <button
            type="button"
            className={`
              btn btn-outline w-full rounded-xl
              border-red-700 text-red-700
              hover:bg-red-50 hover:text-red-800
              dark:border-red-400 dark:text-red-300
              dark:hover:bg-red-400/10 dark:hover:text-red-200
              ${BUTTON_FOCUS}
            `}
            onClick={handleDelete}
          >
            Delete Account
          </button>
          </section>
        </div>
</main>
    </IonContent>
  );
}
