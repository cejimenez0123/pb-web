
import { Preferences } from "@capacitor/preferences";
import { useEffect, useState } from "react";
import Paths from "../../core/paths";
import { useParams } from "react-router";
import { useDialog } from "../../domain/usecases/useDialog";
import RoleForm from "../role/RoleForm";


function TopBarDropdown({
  id, router, editPage, openFeedback, handleChange,
  handleView, parameters, setOpenHashtag, openHashtag,
  openGoogleDrive, openConfirmDeleteDialog,
}) {
  const driveTokenKey = "googledrivetoken";
  const TOKEN_EXPIRY_KEY = "googledrivetoken_expiry";

  const { dialog, openDialog, closeDialog, resetDialog } = useDialog();
  const [accessToken, setAccessToken] = useState(null);

  async function checkAccessToken() {
    const token = (await Preferences.get({ key: driveTokenKey })).value;
    const tokenExpiry = (await Preferences.get({ key: TOKEN_EXPIRY_KEY })).value;
    const tokenValid = token && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10);
    setAccessToken(tokenValid ? token : null);
  }
const handleMenuClick = (action) => (e) => {
  e.currentTarget.blur();
  action();
};
  const openRoleFormDialog = () => {
    openDialog({
      ...dialog,
      text: <RoleForm item={parameters.page} />,
      disagreeText: null,
      disagree: null,
    });
  };

  useEffect(() => { checkAccessToken() }, []);
  const MENU=<svg xmlns="http://www.w3.org/2000/svg" className="my-auto" viewBox="0 0 24 24" height="40px" width="40px" fill="#FFFFFF"><path d="M3,18V16H21v2H3Zm0-5V11H21v2H3ZM3,8V6H21V8H3Z"/></svg>
  return (
    <div className="dropdown dropdown-bottom  dropdown-end items-center flex-shrink-0">
      <div tabIndex={0} role="button" className="rounded-2xl bg-plumb-mint dark:border p-1 border-2 dark:border-2 dark:border-plumb-darkText">
    {MENU}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu  bg-plumb-mint text-center rounded-box shadow-lg z-[10] py-2"
        style={{ minWidth: "12rem" }}
      >
                {editPage && (
  <li
    className="dark:text-plumb-darkText pt-3 pb-2 text-center cursor-pointer"
    onClick={handleMenuClick(() =>
   
         openFeedback(false)
       
    )}
  >
    Share
  </li>
)}
        <li className="dark:text-plumb-darkText pt-3 pb-2 cursor-pointer"
          onClick={() => router.push(Paths.addStoryToCollection.story(id))}>
          Add to Collection
        </li>
        {accessToken && (
          <li className="dark:text-plumb-darkText pt-3 pb-2 cursor-pointer"
            onClick={() => openGoogleDrive()}>
            Google Doc Import
          </li>
        )}

    
        {editPage && (
          <li className="dark:text-plumb-darkText pt-3 pb-2 cursor-pointer"
            onClick={() => openRoleFormDialog(parameters.page)}>
            Manage Access
          </li>
        )}
      </ul>
    </div>
  );
}

export default TopBarDropdown;