import { Preferences } from "@capacitor/preferences";
import menu from "../../images/icons/menu.svg"
import { useEffect, useState } from "react";
import Paths from "../../core/paths";
function TopBarDropdown({
  id,
  router,
  editPage,
  openFeedback,
  handleChange,
  parameters,
  setOpenHashtag,
  openHashtag,
  openGoogleDrive,
  openRoleFormDialog,
  openConfirmDeleteDialog,
}) {
const driveTokenKey = "googledrivetoken";
   const TOKEN_EXPIRY_KEY = "googledrivetoken_expiry"; // 
const [accessToken,setAccessToken]=useState(null)
  async function checkAccessToken() {
    const token = (await Preferences.get({ key: driveTokenKey })).value;
    const tokenExpiry = (await Preferences.get({ key: TOKEN_EXPIRY_KEY })).value;
    const tokenValid = token && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10);

    if(tokenValid){
      setAccessToken(token);
    }else{
      setAccessToken(null)
    }
    
  }
useEffect(()=>{ 
    
  checkAccessToken()},[])
  return (
    <div className="dropdown dropdown-bottom dropdown-end flex-shrink-0">
      <div tabIndex={0} role="button" className="rounded-md">
        <img
          className="w-[2.8rem] h-[2.8rem] rounded-lg"
          src={menu}
          style={{ backgroundColor: "#40906f" }}
        />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-white rounded-box shadow-lg z-[10] p-2"
        style={{ minWidth: "12rem" }}
      >
        <li
          className="text-emerald-600 pt-3 pb-2 cursor-pointer"
          onClick={() => router.push(Paths.addStoryToCollection.story(id))}
        >
          Add to Collection
        </li>

        <li
          className="text-emerald-600 pt-3 pb-2 cursor-pointer"
          onClick={() => openFeedback(true)}
        >
          Get Feedback
        </li>
  {accessToken && <li
          className="text-emerald-600 pt-3 pb-2 cursor-pointer"
          onClick={() => openGoogleDrive()}
        >
          Google Doc Import
        </li>}
        {editPage && editPage?.id && (
          <li
            className="text-emerald-600 pt-3 pb-2 cursor-pointer"
            onClick={() => router.push(Paths.page.createRoute(editPage.id))}
          >
            View
          </li>
        )}

        {editPage?.id? (
          parameters.isPrivate ? (
            <li
              className="text-emerald-600 pt-3 pb-2 cursor-pointer"
              onClick={() => openFeedback(false)}
            >
              Share Now
            </li>
          ) : (
            <li
              className="text-emerald-600 pt-3 pb-2 cursor-pointer"
              onClick={() => handleChange("isPrivate", true)}
            >
              Make Private
            </li>
          )
        ) : null}

        <li
          className="text-emerald-600 pt-3 pb-2 cursor-pointer"
          onClick={() => setOpenHashtag(!openHashtag)}
        >
          {openHashtag ? "Close Hashtag" : "Add Hashtag"}
        </li>

        {editPage && (
          <li
            className="text-emerald-600 pt-3 pb-2 cursor-pointer"
            onClick={() => openRoleFormDialog(parameters.page)}
          >
            Manage Access
          </li>
        )}

        <li
          className="text-emerald-600 pt-3 pb-2 cursor-pointer"
          onClick={openConfirmDeleteDialog}
        >
          Delete
        </li>
      </ul>
    </div>
  );
}
export default TopBarDropdown
