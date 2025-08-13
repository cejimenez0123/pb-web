import { IonList, IonItem, IonText, IonImg } from "@ionic/react";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfiles } from "../../actions/ProfileActions";
import { patchRoles } from "../../actions/RoleActions";
import { RoleType } from "../../core/constants";

import checkResult from "../../core/checkResult";
import { patchCollectionRoles } from "../../actions/CollectionActions";
import Context from "../../context";
import ProfileCircle from "../profile/ProfileCircle";

function RoleForm({ item, onClose }) {
  const profiles = useSelector((state) => state.users.profilesInView);
  const currentProfile = useSelector((state) => state.users.currentProfile);

  const { error, success, setError, setSuccess } = useContext(Context);
  const pending = useSelector((state) => state.roles.loading);

  const [roles, setRoles] = useState([]);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  useEffect(() => {
    if (item && item.storyIdList && item.roles) {
      const list = item.roles.map(
        (role) =>
          new Role(role.id, role.profile, role.collection, role.role, role.created)
      );
      setRoles(list);
    } else if (item && item.betaReaders) {
      const list = item.betaReaders.map(
        (role) =>
          new Role(role.id, role.profile, role.story, role.role, role.created)
      );
      setRoles(list);
    }
  }, [item]);

  const handlePatchRoles = () => {
    if (!currentProfile) {
      setError("No current Profile");
      setSuccess(null);
      return;
    }
    if (item.storyIdList) {
      dispatch(patchCollectionRoles({ roles, profile: currentProfile, collection: item })).then(
        (res) =>
          checkResult(
            res,
            () => {
              setSuccess("Successful Save");
              setError(null);
            },
            () => {
              setError("Error Saving");
              setSuccess(null);
            }
          )
      );
    } else {
      dispatch(
        patchRoles({ roles: roles, profileId: currentProfile.id, storyId: item.id })
      ).then(
        (res) =>
          checkResult(
            res,
            () => {
              setSuccess("Successful Save");
              setError(null);
            },
            () => {
              setError("Error Saving");
              setSuccess(null);
            }
          )
      );
    }
  };

  const handleUpdateRole = ({ role, profile }) => {
    const newRole = new Role(null, profile, item, role);
    const newRoles = roles.filter((r) => r.profile.id !== profile.id);
    setRoles([...newRoles, newRole]);
  };

  const renderProfileItem = (profile, i) => {
    const role = roles.find((r) => r.profile.id === profile.id);

    return (
      <IonItem
        key={profile.id || i}
        
        
        className="shadow-sm   "
      >
        <div className="border-2 border-emerald-200 rounded-full py-4 px-2 justify-between mb-2 w-[20rem]">
        <div className="flex justify-between flex-row w-full">
          <ProfileCircle profile={profile} color="text-emerald-700" />

    
            <div
              className={`dropdown ${
                i > profiles.length / 2 ? "dropdown-top" : "dropdown-bottom"
              } dropdown-end`}
            >
              <div
                tabIndex={0}
                role="button"
                className="bg-opacity-90 py-2 w-[9em] px-4 mont-medium flex justify-center underline cursor-pointer"
              >
                <h6 className="my-auto">{role ? role.role : "Role"}</h6>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu bg-emerald-50 rounded-box z-[1] w-52 p-2 shadow"
              >
                {Object.values(RoleType).map((roleType) => (
                  <li
                    key={roleType}
                    onClick={() => handleUpdateRole({ role: roleType, profile })}
                  >
                    <a className="label text-emerald-600">{roleType}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </IonItem>
    );
  };
console.log(item)
  return (
    <div className=" lg:p-2 w-full   ">
      <div className="fixed top-4 left-0 right-0 md:left-[20%] w-[96vw] mx-4 md:w-[60%] z-50 mx-auto">
        {(error || success) && (
          <div
            role="alert"
            className={`alert ${success ? "alert-success" : "alert-warning"} animate-fade-out`}
          >
            {error ? error : success}
          </div>
        )}
      </div>

      <div className="pt-4 px-4">
        <div className="flex text-emerald-900 justify-between items-center">
          {/* <h1 className="text-[2rem] mont-medium">Share</h1> */}

      
        </div>

        <div className="py-4">
          <IonText className="text-sm text-emerald-900 block">{item.title ||(item.title && item.title.length>0)?item.title: "Untitled"}</IonText>
        </div>

        <div
          className="text-white border rounded-full flex text-l lg:text-xl w-[6rem] h-[3rem] mont-medium shadow-sm border-white mb-8 bg-emerald-800 cursor-pointer select-none items-center justify-center"
          onClick={handlePatchRoles}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handlePatchRoles();
          }}
        >
          <IonText className="text-[1.2rem]">Save</IonText>
        </div>

        <IonList lines="none" className="max-h-[50vh] overflow-auto rounded-lg">
          {profiles.length > 0 ? (
            profiles.map(renderProfileItem)
          ) : (
            <IonText className="text-emerald-800 text-center p-4">No profiles available</IonText>
          )}
          {pending && (
            <IonText className="text-emerald-800 text-center py-2">Loading...</IonText>
          )}
        </IonList>
      </div>
      
    </div>
  );
}

export default RoleForm;

