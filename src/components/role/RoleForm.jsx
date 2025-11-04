import { IonList, IonItem, IonText } from "@ionic/react";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfiles } from "../../actions/ProfileActions";
import { patchRoles } from "../../actions/RoleActions";
import { patchCollectionRoles } from "../../actions/CollectionActions";
import { RoleType } from "../../core/constants";
import Role from "../../domain/models/role";
import checkResult from "../../core/checkResult";
import Context from "../../context";
import ProfileCircle from "../profile/ProfileCircle";

export default function RoleForm({ item, onClose }) {
  const dispatch = useDispatch();
  const profiles = useSelector((state) => state.users.profilesInView);
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const pending = useSelector((state) => state.roles.loading);

  const { error, success, setError, setSuccess } = useContext(Context);
  const [roles, setRoles] = useState([]);

  // Fetch profiles on mount
  useLayoutEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  // Initialize roles
  useEffect(() => {
    if (!item) return;

    const source = item.roles || item.betaReaders || [];
    const list = source.map(
      (role) =>
        new Role(role.id, role.profile, role.collection || role.story, role.role, role.created)
    );
    setRoles(list);
  }, [item]);

  const handlePatchRoles = () => {
    if (!currentProfile) {
      setError("No current profile found.");
      setSuccess(null);
      return;
    }

    const onSuccess = () => {
      setSuccess("Roles updated successfully!");
      setError(null);
    };
    const onError = () => {
      setError("Error saving roles.");
      setSuccess(null);
    };

    const action = item.storyIdList
      ? patchCollectionRoles({ roles, profile: currentProfile, collection: item })
      : patchRoles({ roles, profileId: currentProfile.id, storyId: item.id });

    dispatch(action).then((res) => checkResult(res, onSuccess, onError));
  };

  const handleUpdateRole = ({ role, profile }) => {
    const updatedRole = new Role(null, profile, item, role);
    const newRoles = roles.filter((r) => r.profile.id !== profile.id);
    setRoles([...newRoles, updatedRole]);
  };

  const renderProfileItem = (profile, i) => {
    const role = roles.find((r) => r.profile.id === profile.id);
    const dropdownPosition = i > profiles.length / 2 ? "dropdown-top" : "dropdown-bottom";

    return (
      <IonItem key={profile.id || i} className="border-none bg-transparent px-0   mb-3">
        <div className="flex justify-between items-center w-full border-2 border-emerald-200  my-3 rounded-full p-3 shadow-sm">
          <ProfileCircle profile={profile} color="text-emerald-700" />

          <div className={`dropdown ${dropdownPosition} dropdown-end`}>
            <div
              tabIndex={0}
              role="button"
              className="py-2 px-4 rounded-full bg-emerald-50 text-emerald-700 mont-medium underline cursor-pointer"
            >
              {role ? role.role : "Select Role"}
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu bg-emerald-50 rounded-box z-[1] w-48 p-2 shadow"
            >
              {Object.values(RoleType).map((roleType) => (
                <li key={roleType} onClick={() => handleUpdateRole({ role: roleType, profile })}>
                  <a className="text-emerald-600 hover:text-emerald-800">{roleType}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </IonItem>
    );
  };

  return (
    <div className="w-full p-4">
      {/* Alerts */}
      {(error || success) && (
        <div
          role="alert"
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] md:w-[60%] text-center px-4 py-2 rounded-lg text-white ${
            success ? "bg-emerald-600" : "bg-amber-500"
          } shadow-lg transition-all`}
        >
          {error || success}
        </div>
      )}

      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <IonText className="text-emerald-900 text-lg font-medium">
            {item?.title?.length ? item.title : "Untitled"}
          </IonText>
        </div>

        {/* Save Button */}
        <button
          onClick={handlePatchRoles}
          className="mx-auto mb-6 flex items-center justify-center w-28 h-12 rounded-full text-white bg-emerald-700 hover:bg-emerald-600 transition-colors font-medium shadow-md"
        >
          Save
        </button>

        {/* Profile List */}
        <IonList lines="none" className="max-h-[50vh] overflow-auto rounded-lg">
          {pending && (
            <IonText className="text-emerald-800 text-center py-2 block">Loading...</IonText>
          )}
          {!pending && profiles.length > 0 ? (
            profiles.map(renderProfileItem)
          ) : (
            <IonText className="text-emerald-800 text-center p-4 block">
              No profiles available
            </IonText>
          )}
        </IonList>
      </div>
    </div>
  );
}

// import { IonList, IonItem, IonText, IonImg } from "@ionic/react";
// import { useContext, useEffect, useLayoutEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchProfiles } from "../../actions/ProfileActions";
// import { patchRoles } from "../../actions/RoleActions";
// import { RoleType } from "../../core/constants";
// import Role from "../../domain/models/role";
// import checkResult from "../../core/checkResult";
// import { patchCollectionRoles } from "../../actions/CollectionActions";
// import Context from "../../context";
// import ProfileCircle from "../profile/ProfileCircle";

// function RoleForm({ item, onClose }) {
//   const profiles = useSelector((state) => state.users.profilesInView);
//   const currentProfile = useSelector((state) => state.users.currentProfile);

//   const { error, success, setError, setSuccess } = useContext(Context);
//   const pending = useSelector((state) => state.roles.loading);

//   const [roles, setRoles] = useState([]);
//   const dispatch = useDispatch();

//   useLayoutEffect(() => {
//     dispatch(fetchProfiles());
//   }, [dispatch]);

//   useEffect(() => {
//     if (item && item.storyIdList && item.roles) {
//       const list = item.roles.map(
//         (role) =>
//           new Role(role.id, role.profile, role.collection, role.role, role.created)
//       );
//       setRoles(list);
//     } else if (item && item.betaReaders) {
//       const list = item.betaReaders.map(
//         (role) =>
//           new Role(role.id, role.profile, role.story, role.role, role.created)
//       );
//       setRoles(list);
//     }
//   }, [item]);

//   const handlePatchRoles = () => {
//     if (!currentProfile) {
//       setError("No current Profile");
//       setSuccess(null);
//       return;
//     }
//     if (item.storyIdList) {
//       dispatch(patchCollectionRoles({ roles, profile: currentProfile, collection: item })).then(
//         (res) =>
//           checkResult(
//             res,
//             () => {
//               setSuccess("Successful Save");
//               setError(null);
//             },
//             () => {
//               setError("Error Saving");
//               setSuccess(null);
//             }
//           )
//       );
//     } else {
//       dispatch(
//         patchRoles({ roles: roles, profileId: currentProfile.id, storyId: item.id })
//       ).then(
//         (res) =>
//           checkResult(
//             res,
//             () => {
//               setSuccess("Successful Save");
//               setError(null);
//             },
//             () => {
//               setError("Error Saving");
//               setSuccess(null);
//             }
//           )
//       );
//     }
//   };

//   const handleUpdateRole = ({ role, profile }) => {
//     const newRole = new Role(null, profile, item, role);
//     const newRoles = roles.filter((r) => r.profile.id !== profile.id);
//     setRoles([...newRoles, newRole]);
//   };

//   const renderProfileItem = (profile, i) => {
//     const role = roles.find((r) => r.profile.id === profile.id);

//     return (
//       <IonItem
//         key={profile.id || i}
        
        
//         className="shadow-sm   "
//       >
//         <div className="border-2 border-emerald-200 rounded-full py-4 px-2 justify-between mb-2 w-[20rem]">
//         <div className="flex justify-between flex-row w-full">
//           <ProfileCircle profile={profile} color="text-emerald-700" />

    
//             <div
//               className={`dropdown ${
//                 i > profiles.length / 2 ? "dropdown-top" : "dropdown-bottom"
//               } dropdown-end`}
//             >
//               <div
//                 tabIndex={0}
//                 role="button"
//                 className="bg-opacity-90 py-2 w-[9em] px-4 mont-medium flex justify-center underline cursor-pointer"
//               >
//                 <h6 className="my-auto">{role ? role.role : "Role"}</h6>
//               </div>

//               <ul
//                 tabIndex={0}
//                 className="dropdown-content menu bg-emerald-50 rounded-box z-[1] w-52 p-2 shadow"
//               >
//                 {Object.values(RoleType).map((roleType) => (
//                   <li
//                     key={roleType}
//                     onClick={() => handleUpdateRole({ role: roleType, profile })}
//                   >
//                     <a className="label text-emerald-600">{roleType}</a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </IonItem>
//     );
//   };
// console.log(item)
//   return (
//     <div className=" lg:p-2 w-full   ">
//       <div className="fixed top-4 left-0 right-0 md:left-[20%] w-[96vw] mx-4 md:w-[60%] z-50 mx-auto">
//         {(error || success) && (
//           <div
//             role="alert"
//             className={`alert ${success ? "alert-success" : "alert-warning"} animate-fade-out`}
//           >
//             {error ? error : success}
//           </div>
//         )}
//       </div>

//       <div className="pt-4 px-4">
//         <div className="flex text-emerald-900 justify-between items-center">
//           {/* <h1 className="text-[2rem] mont-medium">Share</h1> */}

      
//         </div>

//         <div className="py-4">
//           <IonText className="text-sm text-emerald-900 block">{item.title ||(item.title && item.title.length>0)?item.title: "Untitled"}</IonText>
//         </div>

//         <div
//           className="text-white border rounded-full flex text-l lg:text-xl w-[6rem] h-[3rem] mont-medium shadow-sm border-white mb-8 bg-emerald-800 cursor-pointer select-none items-center justify-center"
//           onClick={handlePatchRoles}
//           role="button"
//           tabIndex={0}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" || e.key === " ") handlePatchRoles();
//           }}
//         >
//           <IonText className="text-[1.2rem]">Save</IonText>
//         </div>

//         <IonList lines="none" className="max-h-[50vh] overflow-auto rounded-lg">
//           {profiles.length > 0 ? (
//             profiles.map(renderProfileItem)
//           ) : (
//             <IonText className="text-emerald-800 text-center p-4">No profiles available</IonText>
//           )}
//           {pending && (
//             <IonText className="text-emerald-800 text-center py-2">Loading...</IonText>
//           )}
//         </IonList>
//       </div>
      
//     </div>
//   );
// }

// export default RoleForm;

