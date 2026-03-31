import { IonList, IonItem, IonText, IonInput, IonSearchbar, IonContent } from "@ionic/react";
import { useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfiles } from "../../actions/ProfileActions";
import { patchRoles } from "../../actions/RoleActions";
import { patchCollectionRoles } from "../../actions/CollectionActions";
import { RoleType } from "../../core/constants";
import Role from "../../domain/models/role";
import checkResult from "../../core/checkResult";
import Context from "../../context";
import ProfileCircle from "../profile/ProfileCircle";
import { getStory } from "../../actions/StoryActions";

export default function RoleForm({ item }) {
  const dispatch = useDispatch();
  const profiles = useSelector((state) => state.users.profilesInView);
  
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const pending = useSelector((state) => state.roles.loading);

  const { error, success, setError, setSuccess } = useContext(Context);

  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
const handleResetAllRoles = () => {
  const updatedRoles = profiles.map((r) => new Role(null, r, item, "none"));
  setRoles(updatedRoles);
};
// useEffect(() => {
//   if (!item || !profiles) return;

//   const sourceRoles = item.roles || item.betaReaders || [];
//   console.log("Source roles:", sourceRoles);
//   const roleMap = new Map(sourceRoles.map((r) => [r.profile.id, r]));

//   const list = profiles.map((profile) => {
//     const existing = roleMap.get(profile.id);
//     return new Role(
//       existing?.id || null,
//       profile,
//       item,
//       existing?.role || "none",
//       existing?.created || null
//     );
//   });

//   setRoles(list);
// }, [item, profiles]);
  useLayoutEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch,currentProfile]);
useEffect(() => {
  if (!item || !profiles) return;

  const sourceRoles = item.roles || item.betaReaders || [];

  const roleMap = new Map(
    sourceRoles.map((r) => [r.profile.id, r])
  );

  const list = profiles.map((profile) => {
    const existing = roleMap.get(profile.id);

    return new Role(
      existing?.id || null,
      profile,
      item,
      existing?.role || "none",
      existing?.created || null
    );
  });

  setRoles(list);
}, [item, profiles]);
  // useEffect(() => {
  //   if (!item) return;

  //   const source = item.roles || item.betaReaders || [];
  //   const list = source.map(
  //     (role) =>
  //       new Role(
  //         role.id,
  //         role.profile,
  //         role.collection || role.story,
  //         role.role,
  //         role.created
  //       )
  //   );

  //   setRoles(list);
  // }, [item]);

  const handlePatchRoles = () => {
    if (!currentProfile) return;

    const action = item?.storyIdList
      ? patchCollectionRoles({ roles, profile: currentProfile, collection: item })
      : patchRoles({ roles, profileId: currentProfile.id, storyId: item.id });

    dispatch(action).then((res) =>
      checkResult(
        res,
        () => {
          
          dispatch(getStory({ id: item.id }))
          setSuccess("Saved")},
        () => setError("Error saving")
      )
    );
  };

  const handleUpdateRole = ({ role, profile }) => {
    const updatedRole = new Role(null, profile, item, role);
    const newRoles = roles.filter((r) => r.profile.id !== profile.id);
    setRoles([...newRoles, updatedRole]);
  };
  const cycleRole = (profile) => {
    const roleTypes = Object.values(RoleType);
    const current = roles.find((r) => r.profile.id === profile.id)?.role;

    const nextIndex =
      (roleTypes.indexOf(current) + 1) % roleTypes.length;

    handleUpdateRole({
      role: roleTypes[nextIndex],
      profile,
    });
  };

 const filteredProfiles = useMemo(() => {
  if (!profiles?.length) return [];

  let result = profiles;

  // 🔍 search filter
  if (search) {
    result = result.filter((p) =>
      p.username?.toLowerCase().includes(search.toLowerCase())
    );
  }

  // ⚡ build role map once (O(n))
  const roleMap = new Map(
    roles.map((r) => [r.profile.id, r.role])
  );


const sortedResult = [...result].sort((a, b) => {
  const roleA = roleMap.get(a.id) || "none";
  const roleB = roleMap.get(b.id) || "none";

  const isNoneA = roleA === "none";
  const isNoneB = roleB === "none";

  // ✅ ALWAYS push "none" to bottom
  if (isNoneA !== isNoneB) {
    return isNoneA ? 1 : -1;
  }

  // 🎯 then sort by priority
  const rolePriority = {
    editor: 1,
    writer: 2,
    commenter: 3,
    reader: 4,
    none: 5,
  };

  return (
    (rolePriority[roleA] || 99) -
    (rolePriority[roleB] || 99)
  );
});
 console.log(`sortedResult after filtering with search="${search}":`, sortedResult.slice(0,5));
  return sortedResult;
}, [profiles, search]);
console.log("Filtered Profiles:", filteredProfiles.slice(0,5), "Search:", search, "Roles:", roles);
  return (
    <div className="bg-[#f8f6f1] ">

      {/* TITLE */}
   
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-gray-900 leading-tight">
          {item?.title || "Untitled"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Who is in conversation with this piece
        </p>
      </div>
      <div className="flex flex-row gap-6 mb-4">
     <button
    onClick={handleResetAllRoles}
    className="text-sm  hover:text-red-700 underline underline-offset-4"
  >
    Reset All Roles
  </button>
   <button
    onClick={handlePatchRoles}
    className="text-sm text-gray-700 hover:text-black underline underline-offset-4"
  >
    Save changes
  </button>
  
  </div>
  {(error || success) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-700">
          {error || success}
        </div>
      )}
      {/* SEARCH */}
      <div className="mb-6">
        <IonSearchbar
          value={search}
          onIonInput={(e) => setSearch(e.target.value)}
          placeholder="Search contributors"
          style={{
            "--background": "#ffffff",
            "--border-radius": "8px",
          }}
        />
      </div>

      {/* LIST */}
      <div className="space-y-4 overflow-y-auto min-w-[20em] w-[100%] mb-4 max-h-[30rem]">
        {filteredProfiles.map((profile) => {
          const role = roles.find((r) => r.profile.id === profile.id);

          return (
            <div
              key={profile.id}
              className="flex items-center justify-between border-b border-gray-200 pb-3"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <ProfileCircle profile={profile} includeUsername={false} />

                <span className="text-[0.95rem] text-gray-800">
                  {profile.username}
                </span>
              </div>

              {/* RIGHT (Editorial Role) */}
              <button
                onClick={() => cycleRole(profile)}
                className="text-sm text-gray-500 italic hover:text-gray-800 transition"
              >
                {role?.role || "reader"}
              </button>
            </div>
          );
        })}
      </div>

      {/* SAVE */}
     

      {/* FEEDBACK */}
      
    </div>
  );
}