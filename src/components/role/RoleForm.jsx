import { IonList, IonItem, IonText, IonInput } from "@ionic/react";
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
  const [search, setSearch] = useState("");

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
      
      <IonItem key={profile.id || i} className="border-none bg-transparent ">
        <div className="flex justify-between items-center w-full border-2 border-emerald-200  w-full py-2 my-2 px-2 rounded-full shadow-sm">
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
  const filteredProfiles = profiles.filter((p) =>
    p.username?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="w-full w-[100vw] flex p-4">
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
          className="mx-auto mb-6 flex items-center justify-center py-2 text-xl rounded-full text-white bg-emerald-700 hover:bg-emerald-600 transition-colors font-medium shadow-md"
        >
          Save
        </button>
        <div className="mx-4">
 <input
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Search by username..."
  className="ion- bg-emerald-50 border mx-2 px-3 py-2 rounded-full text-emerald-700"
></input>
</div>
        {/* Profile List */}
        <div className="">
        <IonList lines="none" className="max-h-[50vh]  flex overflow-auto rounded-lg">
          {pending && (
            <IonText className="text-emerald-800 text-center py-2 block">Loading...</IonText>
          )}
          {!pending && profiles.length > 0 ? <div className="mx-auto  sm:max-w-[50em]"> 
            {filteredProfiles.map(renderProfileItem)}
          </div> : (
            <IonText className="text-emerald-800 text-center p-4 block">
              No profiles available
            </IonText>
          )}
        </IonList>
        </div>
      </div>
    </div>
  );
}
