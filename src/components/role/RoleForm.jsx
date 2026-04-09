import { IonSearchbar} from "@ionic/react";
import { useContext, useEffect,  useMemo, useState } from "react";
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
 
// useEffect(() => {
//   if (!item || !profiles) return;

//   const sourceRoles = item.roles || item.betaReaders || [];

//   const roleMap = new Map(
//     sourceRoles.map((r) => [r.profile.id, r])
//   );

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

//   useEffect(() => {
//     if (!item) return;

//     const source = item.storyIdList?item.roles: item.betaReaders 
      
//     console.log("X SOURCE",source)
//     const list = source.map(
//       (role) =>
//         new Role(
//           role.id,
//           role.profile,
//           item,
          
//           role.role,
//           role.created
//         )
//     );
// console.log("X< ROLES",roles)
//     setRoles(list);
//   }, [item,dispatch]);

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
 useEffect(() => {
    dispatch(fetchProfiles());
  }, [currentProfile,dispatch])

//   const cycleRole = (profile) => {

//     const roleTypes = Object.values(RoleType);
//  console.log("Current L",roles)
//     const current = roles.find((r) => r.profile.id === profile.id)

//     const nextIndex =
//       (roleTypes.indexOf(current) + 1) % roleTypes.length;
// console.log("RR CUR",roleTypes[nextIndex])
//     handleUpdateRole({
//       role: roleTypes[nextIndex],
//       profile,
//     });
//   };
const cycleRole = (profile) => {
  const roleTypes = Object.values(RoleType);
  const current = roles.find((r) => r.profile.id === profile.id)?.role;

  const currentIndex = roleTypes.indexOf(current);
  const nextIndex =
    currentIndex === -1 ? 0 : (currentIndex + 1) % roleTypes.length;

  handleUpdateRole({
    role: roleTypes[nextIndex],
    profile,
  });
};
  //  const cycleRole = (profile) => {
  //   const roleTypes = Object.values(RoleType);
  //   const current = roles.find((r) => r.profile.id === profile.id)?.role;

  //   const nextIndex =
  //     (roleTypes.indexOf(current) + 1) % roleTypes.length;

  //   handleUpdateRole({
  //     role: roleTypes[nextIndex],
  //     profile,
  //   });
  // };
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
        <h1 className="text-2xl font-serif text-gray-900 leading-tight">
          {item?.title || "Untitled"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
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
     {/* <button
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
  </button> */}
  
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
                      <div
              key={profile.id}
              className="flex items-center bg-base-bg py-2 justify-between border-b  border-gray-200 px-2 rounded-full"
            >
              <div className="flex items-center gap-3">
                <ProfileCircle profile={profile} includeUsername={false} />
                <span className="text-sm text-gray-800">{profile.username}</span>
              </div>

            <button
                onClick={() => cycleRole(profile)}
                className="text-sm text-gray-500 italic hover:text-gray-800 transition"
              >
                {role?.role}
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
// import { IonSearchbar } from "@ionic/react";
// import { useContext, useEffect, useMemo, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchProfiles } from "../../actions/ProfileActions";
// import { patchRoles } from "../../actions/RoleActions";
// import { fetchCollection, patchCollectionRoles } from "../../actions/CollectionActions";
// import { RoleType } from "../../core/constants";
// import Role from "../../domain/models/role";
// import checkResult from "../../core/checkResult";
// import Context from "../../context";
// import ProfileCircle from "../profile/ProfileCircle";
// import { getStory } from "../../actions/StoryActions";
// import Pill from "../Pill";

// export default function RoleForm({ item }) {
//   const dispatch = useDispatch();
//   const profiles = useSelector((state) => state.users.profilesInView);
//   const currentProfile = useSelector((state) => state.users.currentProfile);
//   const { error, success, setError, setSuccess } = useContext(Context);

//   const [roles, setRoles] = useState([]);
//   const [search, setSearch] = useState("");

//   const handleResetAllRoles = () => {
//     const updatedRoles = profiles.map((r) => new Role(null, r, item, "none"));
//     setRoles(updatedRoles);
//   };

//   // Initialize roles whenever item or profiles change
//   useEffect(() => {
//     if (!item || !profiles) return;

//     const sourceRoles = item.roles || item.betaReaders || [];
//     // console.log("SORUE",item)
//     const roleMap = new Map(sourceRoles.map((r) => [r.profile.id, r]));

//     const list = profiles.map((profile) => {
//       const existing = roleMap.get(profile.id);
//       return new Role(
//         existing?.id || null,
//         profile,
//         item,
//         existing?.role || "none",
//         existing?.created || null
//       );
//     });

//     setRoles(list);
//   }, [item]);

//  const handlePatchRoles = () => {
//     if (!currentProfile) return;

//     const action = item?.storyIdList
//       ? patchCollectionRoles({ roles, profile: currentProfile, collection: item })
//       : patchRoles({ roles, profileId: currentProfile.id, storyId: item.id });

//     dispatch(action).then((res) =>
//       checkResult(
//         res,
//         () => {
//           item?.storyIdList? fetchCollection({id:item.id}):
//           dispatch(getStory({ id: item.id }))
//           setSuccess("Saved")},
//         () => setError("Error saving")
//       )
//     );
//   };
//   const handleUpdateRole = ({ role, profile }) => {
//     const updatedRole = new Role(null, profile, item, role);
//     const newRoles = roles.filter((r) => r.profile.id !== profile.id);
//     setRoles([...newRoles, updatedRole]);
//   };
  
//    const cycleRole = (profile) => {
//     const roleTypes = Object.values(RoleType);
//     const current = roles.find((r) => r.profile.id === profile.id)?.role;

//     const nextIndex =
//       (roleTypes.indexOf(current) + 1) % roleTypes.length;

//     handleUpdateRole({
//       role: roleTypes[nextIndex],
//       profile,
//     });
//   };
//  useEffect(() => {
//     dispatch(fetchProfiles());
//   }, [currentProfile,dispatch]);
//   const filteredProfiles = useMemo(() => {
//     if (!profiles?.length) return [];

//     let result = profiles;
//     if (search) {
//       result = result.filter((p) =>
//         p.username?.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     const roleMap = new Map(roles.map((r) => [r.profile.id, r.role]));
//     return [...result].sort((a, b) => {
//       const roleA = roleMap.get(a.id) || "none";
//       const roleB = roleMap.get(b.id) || "none";

//       const isNoneA = roleA === "none";
//       const isNoneB = roleB === "none";

//       if (isNoneA !== isNoneB) return isNoneA ? 1 : -1;

//       const rolePriority = { editor: 1, writer: 2, commenter: 3, reader: 4, none: 5 };
//       return (rolePriority[roleA] || 99) - (rolePriority[roleB] || 99);
//     });
//   }, [profiles, search, roles]);

//   return (
//     <div className="bg-base-surface p-6 min-w-[20rem] max-w-[30rem]">
//       {/* TITLE */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-serif text-gray-900 leading-tight">
//           {item?.title || "Untitled"}
//         </h1>
//         <p className="text-sm text-gray-500 mt-1">
//           Who is in conversation with this piece
//         </p>
//       </div>

//       {/* ACTION BUTTONS */}
//       <div className="flex flex-row gap-4 mb-6">
//         {/* <button
        
//           className="text-sm hover:text-red-700 underline underline-offset-4 px-2 py-1 rounded"
//         >
      
//         </button> */}
//          <Pill
//           label="Reset All Roles"
//            onClick={handleResetAllRoles}
//           variant="secondary"
//           color="soft"
//         />
    
 
//         <Pill
//           label="Save Changes"
//            onClick={handlePatchRoles}
//           variant="primary"
//           color="soft"
//         />
//      </div>
//       {/* SEARCH */}
//       <div className="mb-6">
//         <IonSearchbar
//           value={search}
//           onIonInput={(e) => setSearch(e.target.value)}
//           placeholder="Search contributors"
//           style={{ "--background": "#ffffff", "--border-radius": "8px" }}
//         />
//       </div>

//       {/* PROFILE LIST */}
//       <div className="space-y-3 overflow-y-auto max-h-[25rem]">
//         {filteredProfiles.map((profile) => {
//           const role = roles.find((r) => r.profile.id === profile.id);
//           return (
//             <div
//               key={profile.id}
//               className="flex items-center bg-base-bg py-2 justify-between border-b border-gray-200 px-2 rounded-full"
//             >
//               <div className="flex items-center gap-3">
//                 <ProfileCircle profile={profile} includeUsername={false} />
//                 <span className="text-sm text-gray-800">{profile.username}</span>
//               </div>

//               <button
//                 onClick={() => cycleRole(profile)}
//                 className="text-sm text-gray-500 italic hover:text-gray-800 transition px-2 py-1"
//               >
//                 {role?.role || "reader"}
//               </button>
//             </div>
//           );
//         })}
//       </div>

//       {/* FEEDBACK */}
//       {(error || success) && (
//         <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-700 px-4 py-2 bg-white rounded shadow-md">
//           {error || success}
//         </div>
//       )}
//     </div>
//   );
// }