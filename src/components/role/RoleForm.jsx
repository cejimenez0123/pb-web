import { IonSearchbar} from "@ionic/react";
import { useContext, useEffect,  useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfiles } from "../../actions/ProfileActions";
import { patchRoles } from "../../actions/RoleActions";
import { fetchCollection, patchCollectionRoles } from "../../actions/CollectionActions";
import { RoleType } from "../../core/constants";
import Role from "../../domain/models/role";
import checkResult from "../../core/checkResult";
import Context from "../../context";
import ProfileCircle from "../profile/ProfileCircle";
import { getStory } from "../../actions/StoryActions";
import Enviroment from "../../core/Enviroment";
import Pill from "../Pill";

export default function RoleForm({ item }) {
  const dispatch = useDispatch();
  const profiles = useSelector((state) => state.users.profilesInView);
  
  const currentProfile = useSelector((state) => state.users.currentProfile);

  const { error, success, setError, setSuccess } = useContext(Context);

  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
const handleResetAllRoles = () => {
 const newRoles = roles.map(role=>{
 return new Role(role.id, role.profile, item, "none",role.created)
  })
 
  setRoles(newRoles);
};
const handleUpdateRole = ({ role, profile }) => {

  setRoles((prevRoles) =>
    prevRoles.map((r) =>{
     
      return r.profile.id === profile.id
        ? new Role(r.id, profile, item, role, r.created) // preserve id & created
        : r
 } )
  );
};
 
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

  const handlePatchRoles = () => {
    if (!currentProfile) return;

    const action = item?.storyIdList
      ? patchCollectionRoles({ roles, profile: currentProfile, collection: item })
      : patchRoles({ roles, profileId: currentProfile.id, storyId: item.id });

    dispatch(action).then((res) =>
      checkResult(
        res,
        () => {
          
          item.data?dispatch(getStory({ id: item.id })):dispatch(fetchCollection({id:item.id}))
          setSuccess("Saved")},
        () => setError("Error saving")
      )
    );
  };
 useEffect(() => {
    dispatch(fetchProfiles());
  }, [currentProfile,dispatch])


// const cycleRole = (profile) => {
//   const roleTypes = Object.values(RoleType);
//   const current = roles.find((r) => r.profile.id === profile.id)?.role;

//   const currentIndex = roleTypes.indexOf(current);
//   const nextIndex =
//     currentIndex === -1 ? 0 : (currentIndex + 1) % roleTypes.length;

//   handleUpdateRole({
//     role: roleTypes[nextIndex],
//     profile,
//   });
// };
const cycleRole = (profile) => {
  const roleTypes = Object.values(RoleType);
  const current = roles.find((r) => r.profile.id === profile.id)?.role ?? "none";

  const currentIndex = roleTypes.indexOf(current);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % roleTypes.length;

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
}, [profiles, search,dispatch]);
console.log("Filtered Profiles:", filteredProfiles.slice(0,5), "Search:", search, "Roles:", roles);
  return (
    <div className="bg-base-surface  ">

      {/* TITLE */}
   <div className="mb-6">
  <h1 className="text-2xl font-serif text-text-primary dark:text-base-surface leading-tight">
    {item?.title || "Untitled"}
  </h1>
  <p className="text-sm text-text-secondary dark:text-text-secondary mt-1">
    Who is in conversation with this piece
  </p>
</div>
 
      <div className="flex flex-row justify-center gap-6 mb-4">
                <Pill
          label="Reset All Roles"
           onClick={handleResetAllRoles}
          variant="secondary"
          baseClass={"bg-button-primary"}
        />
    
 
        <Pill
          label="Save Changes"
           onClick={handlePatchRoles}
          variant="primary"
        baseClass="bg-soft text-white"
        />

  
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
            "--background": Enviroment.palette.base.surface,
            "--border-radius": "8px",
          }}
        />
      </div>

      {/* LIST */}
      <div className="space-y-4 bg-base-surface overflow-y-auto min-w-[20em] w-[100%] mb-4 max-h-[30rem]">
        {filteredProfiles.map((profile) => {
 
          const role = roles.find((r) => r.profile.id === profile.id);
          return (
//             <div
//   key={profile.id}
//   className="flex items-center bg-base-bg dark:bg-text-primary py-2 justify-between border-b border-border-default dark:border-border-soft px-2 rounded-full"
// >
//   <div className="flex items-center gap-3">
//     <ProfileCircle profile={profile} includeUsername={false} />
//     <span className="text-sm text-text-primary dark:text-base-surface">{profile.username}</span>
//   </div>
// <button onClick={() => cycleRole(profile)}
//     className="text-sm text-text-primary dark:text-base-surface italic hover:text-text-primary dark:hover:text-text-inverse transition"
//   >
// {role?.role ?? "none"}
// </button>
// </div>
  <div
  key={profile.id}
  className="flex items-center bg-base-bg dark:bg-text-primary py-3 justify-between border-b border-border-default dark:border-border-soft px-3 rounded-2xl"
>
  <div className="flex items-center gap-3">
    <ProfileCircle profile={profile} includeUsername={false} />
    <span className="text-sm text-text-primary dark:text-base-surface">{profile.username}</span>
  </div>
  <button
    onClick={() => cycleRole(profile)}
    className="min-w-[5.5rem] text-center px-3 py-2 rounded-full text-xs font-semibold transition-colors duration-150 cursor-pointer
      bg-base-surface dark:bg-text-primary
      text-text-brand dark:text-base-surface
      border border-border-focus dark:border-border-soft
      active:scale-95 active:bg-button-primary-bg active:text-text-inverse"
  >
    {role?.role ?? "none"}
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
