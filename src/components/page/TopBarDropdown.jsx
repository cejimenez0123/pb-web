
import { Preferences } from "@capacitor/preferences";
import menu from "../../images/icons/menu.svg"
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
  const { id: pageId } = useParams();
  const { dialog, openDialog, closeDialog, resetDialog } = useDialog();
  const [accessToken, setAccessToken] = useState(null);

  async function checkAccessToken() {
    const token = (await Preferences.get({ key: driveTokenKey })).value;
    const tokenExpiry = (await Preferences.get({ key: TOKEN_EXPIRY_KEY })).value;
    const tokenValid = token && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10);
    setAccessToken(tokenValid ? token : null);
  }

  const openRoleFormDialog = () => {
    openDialog({
      ...dialog,
      text: <RoleForm item={parameters.page} />,
      disagreeText: null,
      disagree: null,
    });
  };

  useEffect(() => { checkAccessToken() }, []);

  return (
    <div className="dropdown dropdown-bottom dropdown-end flex-shrink-0">
      <div tabIndex={0} role="button" className="rounded-md">
        <img
          className="w-[3.6rem] h-[3.6rem] rounded-lg"
          src={menu}
          style={{ backgroundColor: "#40906f" }}
        />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-surface rounded-box shadow-lg z-[10] p-2"
        style={{ minWidth: "12rem" }}
      >
        <li className="text-emerald-600 pt-3 pb-2 cursor-pointer"
          onClick={() => router.push(Paths.addStoryToCollection.story(id))}>
          Add to Collection
        </li>
        {accessToken && (
          <li className="text-emerald-600 pt-3 pb-2 cursor-pointer"
            onClick={() => openGoogleDrive()}>
            Google Doc Import
          </li>
        )}
        {editPage?.id && (
          <li className="text-emerald-600 pt-3 pb-2 cursor-pointer"
            onClick={() => parameters.isPrivate ? openFeedback(false) : handleChange("isPrivate", true)}>
            {parameters.isPrivate ? "Share / Get Feedback" : "Make Private"}
          </li>
        )}
        {editPage && (
          <li className="text-emerald-600 pt-3 pb-2 cursor-pointer"
            onClick={() => openRoleFormDialog(parameters.page)}>
            Manage Access
          </li>
        )}
      </ul>
    </div>
  );
}

export default TopBarDropdown;