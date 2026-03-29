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

// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";

// export default function RoleForm({ item, onClose }) {
//   const dispatch = useDispatch();
//   const profiles = useSelector((state) => state.users.profilesInView);
//   const currentProfile = useSelector((state) => state.users.currentProfile);
//   const pending = useSelector((state) => state.roles.loading);
//   const [search, setSearch] = useState("");

//   const { error, success, setError, setSuccess } = useContext(Context);
//   const [roles, setRoles] = useState([]);

//   // Fetch profiles on mount
//   useLayoutEffect(() => {
//     dispatch(fetchProfiles());
//   }, [dispatch]);

//   // Initialize roles
//   useEffect(() => {
//     if (!item) return;

//     const source = item.roles || item.betaReaders || [];
//     const list = source.map(
//       (role) =>
//         new Role(role.id, role.profile, role.collection || role.story, role.role, role.created)
//     );
//     setRoles(list);
//   }, [item]);

//   const handlePatchRoles = () => {
//     if (!currentProfile) {
//       setError("No current profile found.");
//       setSuccess(null);
//       return;
//     }

//     const onSuccess = () => {
//       setSuccess("Roles updated successfully!");
//       setError(null);
//     };
//     const onError = () => {
//       setError("Error saving roles.");
//       setSuccess(null);
//     };

//     const action = item.storyIdList
//       ? patchCollectionRoles({ roles, profile: currentProfile, collection: item })
//       : patchRoles({ roles, profileId: currentProfile.id, storyId: item.id });

//     dispatch(action).then((res) => checkResult(res, onSuccess, onError));
//   };

//   const handleUpdateRole = ({ role, profile }) => {
//     const updatedRole = new Role(null, profile, item, role);
//     const newRoles = roles.filter((r) => r.profile.id !== profile.id);
//     setRoles([...newRoles, updatedRole]);
//   };

//   const renderProfileItem = (profile, i) => {
//     const role = roles.find((r) => r.profile.id === profile.id);
//     const dropdownPosition = i > profiles.length / 2 ? "dropdown-top" : "dropdown-bottom";
//  // <IonItem key={profile.id || i} style={{"--background-color":"#f4f4e0"}}className=" ">
//     return (
      
     
//         <div style={{"--background-color":"#f4f4e0"}} className="flex bg-cream justify-between items-center w-[100%] border-2 border-blueSea  py-2 my-2 px-2 rounded-full shadow-sm">
//           <ProfileCircle profile={profile} color="text-emerald-700" fontSize="text-[1rem]"/>

//           <div className={`dropdown bg-cream ${dropdownPosition} dropdown-end`}>
//             <IonText
//               tabIndex={0}
//               role="button"
//               className="py-2 px-4 rounded-full text-[1.2rem] text-emerald-700  underline cursor-pointer"
//             >
//               {role ? role.role : "Select Role"}
//             </IonText>
//             <ul
//               tabIndex={0}
//               className="dropdown-content menu bg-emerald-50 rounded-box z-[1] w-48 p-2 shadow"
//             >
//               {Object.values(RoleType).map((roleType) => (
//                 <li key={roleType} onClick={() => handleUpdateRole({ role: roleType, profile })}>
//                   <a className="text-emerald-600 hover:text-emerald-800">{roleType}</a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

  
//     );
//   };
   
//    const filteredProfiles = useMemo(() => {
//     if (!profiles?.length) return [];
//     if (!search||search.length==0) return profiles;
//     const lower = search.toLowerCase();
//     return profiles.filter((p) =>
//       p.username?.toLowerCase().includes(lower)
//     );
//   }, [profiles, search]);
//   return (
//     // <IonContent scrollY fullscreen={true} className="ion-padding pt-4">
//     <div className="flex flex-col bg-cream  w-[100%]">
//       {/* Alerts */}
//       {(error || success) && (
//         <div
//           role="alert"
//           className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] md:w-[60%] text-center px-4 py-2 rounded-lg text-white ${
//             success ? "bg-emerald-600" : "bg-amber-500"
//           } shadow-lg transition-all`}
//         >
//           {error || success}
//         </div>
//       )}

//       {/* <div className="mt-12"> */}
//         <div className="flex justify-between items-center mb-4">
//           <IonText className="text-emerald-900 text-lg font-medium">
//             {item?.title?.length ? item?.title : "Untitled"}
//           </IonText>
//         </div>

//         {/* Save Button */}
//         <button
//           onClick={handlePatchRoles}
//           className="mx-auto mb-6 flex items-center justify-center py-2 text-xl rounded-full text-white bg-emerald-700 hover:bg-emerald-600 transition-colors font-medium shadow-md"
//         >
//           Save
//         </button>
//         <div className="mx-4 w-[100%]">
//           <IonSearchbar 
// value={search}
//  onIonInput={(event) => {
// let query = '';
//       const target = event.target
//     if (target){
//        query = target.value.toLowerCase();
//          setSearch(query)}}}
//   placeholder="Search by username..."
//         />
// </div>
//         {/* Profile List */}
//         <div className="sm:max-w-[50em] w-[100%] md:w-[80%] bg-cream mx-auto sm:overflow-y-auto">
//         <IonList lines="none" style={{"--background-color":"#f4f4e0"}}  className=" bg-cream flex overflow-auto rounded-lg">
//           {pending && (
//             <IonText className="text-emerald-800 text-center py-2 block">Loading...</IonText>
//           )}
//           {!pending && profiles.length > 0 ? <div className="mx-auto bg-cream  w-[100%] sm:max-w-[50em]"> 
//             {filteredProfiles.map(renderProfileItem)}
//           </div> : (
//             <IonText className="text-emerald-800 text-center p-4 block">
//               No profiles available
//             </IonText>
//           )}
//         </IonList>
//         </div>
//       {/* </div> */}
//        {/* </IonContent> */}
//     </div>
   
//   );
// }

export default function RoleForm({ item }) {
  const dispatch = useDispatch();
  const profiles = useSelector((state) => state.users.profilesInView);
  // console.log("PROFILES",profiles)
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const pending = useSelector((state) => state.roles.loading);

  const { error, success, setError, setSuccess } = useContext(Context);

  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");

  useLayoutEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch,currentProfile]);

  useEffect(() => {
    if (!item) return;

    const source = item.roles || item.betaReaders || [];
    const list = source.map(
      (role) =>
        new Role(
          role.id,
          role.profile,
          role.collection || role.story,
          role.role,
          role.created
        )
    );

    setRoles(list);
  }, [item]);

  const handlePatchRoles = () => {
    if (!currentProfile) return;

    const action = item.storyIdList
      ? patchCollectionRoles({ roles, profile: currentProfile, collection: item })
      : patchRoles({ roles, profileId: currentProfile.id, storyId: item.id });

    dispatch(action).then((res) =>
      checkResult(
        res,
        () => setSuccess("Saved"),
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
    if (!search) return profiles;

    return profiles.filter((p) =>
      p.username?.toLowerCase().includes(search.toLowerCase())
    );
  }, [profiles, search]);

  return (
    <div className="bg-[#f8f6f1] min-h-screen px-6 py-8">

      {/* TITLE */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-gray-900 leading-tight">
          {item?.title || "Untitled"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Who is in conversation with this piece
        </p>
      </div>

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
      <div className="space-y-4 overflow-y-auto max-h-[30rem]">
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
      <div className="mt-10 flex justify-end">
        <button
          onClick={handlePatchRoles}
          className="text-sm text-gray-700 hover:text-black underline underline-offset-4"
        >
          Save changes
        </button>
      </div>

      {/* FEEDBACK */}
      {(error || success) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-700">
          {error || success}
        </div>
      )}
    </div>
  );
}