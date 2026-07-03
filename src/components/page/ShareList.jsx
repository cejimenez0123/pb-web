
import { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { IonText, useIonRouter } from "@ionic/react";
import { useSelector } from "react-redux";
import bookmarkFill from "../../images/bookmarkfill.svg";
import bookmarkadd from "../../images/bookmark_add.svg";
import Context from "../../context";
import { sendGAEvent } from "../../core/ga4";
import { deleteStoryFromCollection, addStoryListToCollection } from "../../actions/CollectionActions";
import checkResult from "../../core/checkResult";
import Enviroment from "../../core/Enviroment";
import Paths from "../../core/paths";
import { Preferences } from "@capacitor/preferences";
import { useDialog } from "../../domain/usecases/useDialog";
import computePermissions from "../../core/compusePermissions";
import { blockProfile } from "../../actions/ModerationAcitons.jsx";
import ReportContentDialog from "../auth/ReportProfileDialog.jsx";



export default function ShareList({ page, profile, authorProfile, archive, setArchive, bookmark, setBookmarked }) {
  const { setSuccess, setError } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [isReportDialogOpen, setReportDialogOpen] = useState(false);

  const currentProfile = useSelector(state => state.users.currentProfile);
  const router = useIonRouter();
  const dispatch = useDispatch();
  const { openDialog, closeDialog, resetDialog, dialog } = useDialog();


  const { canEdit } = computePermissions(page, currentProfile, {
    getAccessList: (s) => s.betaReaders,
    getAccessRole: (r) => r.permission,
    isPrivate: (s) => s.isPrivate,
    isOpen: () => false,
    canWriteRoles: ["commenter", "editor"],
    canEditRoles: ["editor"],
  });


  const getShareSource = () => {
    const pathname = router.routeInfo?.pathname || "";
    if (pathname.startsWith("/profile")) return "profile_page";
    if (pathname.startsWith("/dashboard")) return "dashboard";
    if (pathname.startsWith("/collection")) return "collection";
    if (pathname.startsWith("/discovery")) return "discovery";
    return "unknown";
  };


  const getArchive = () => {
    if (currentProfile?.profileToCollections) {
      let ptc = currentProfile.profileToCollections.find((ptc) => ptc.type === "archive");
      setArchive(ptc?.collection);
    }
  };


  const isBookmarked = () => {
    if (currentProfile && archive) {
      let found = archive.storyIdList.find((stc) => stc.storyId == page.id);
      setBookmarked(found);
    }
    setLoading(false);
  };


  useEffect(() => { getArchive(); }, [currentProfile]);
  useEffect(() => { isBookmarked(); }, [archive, currentProfile]);


  const onBookmarkPage = () => {
    setLoading(true);
    if (currentProfile?.profileToCollections) {
      let ptc = currentProfile.profileToCollections.find((ptc) => ptc.type === "archive");
      if (ptc?.collectionId && page?.id) {
        dispatch(addStoryListToCollection({ id: ptc.collectionId, list: [page], profile: currentProfile })).then((res) => {
          checkResult(res, ({ collection }) => {
            let found = collection.storyIdList.find((stc) => stc.storyId == page.id);
            setArchive(collection);
            setBookmarked(found);
            setLoading(false);
            setSuccess("Added Successfully");
          }, () => {
            setError("Error");
            setLoading(false);
          });
        });
      }
    } else {
      setLoading(false);
    }
  };


  const deleteStc = () => {
    setLoading(true);
    dispatch(deleteStoryFromCollection({ storyId: page.id, collectionId: archive.id })).then((res) => {
      checkResult(res, ({ collection }) => {
        setArchive(collection[0]);
        setBookmarked(null);
        setLoading(false);
        isBookmarked();
      }, () => {
        setBookmarked(null);
        setLoading(false);
        isBookmarked();
      });
    });
  };


  const handleBookmarkClick = async () => {
    if (loading) return;
    if (bookmark) {
      deleteStc();
    } else {
      onBookmarkPage();
    }
  };


  const copyShareLink = () => {
    openDialog({ ...dialog, isOpen: false });
    sendGAEvent("story_share_copy_link", { story_id: page.id, source: getShareSource() });
    navigator.clipboard.writeText(Enviroment.domain + Paths.page.createRoute(page.id)).then(() => {
      setSuccess("Ready to share");
    });
  };


const handleBlockUser = () => {
  // Use the author profile passed from parent
  console.log("Author profile from parent:", authorProfile);
  const targetProfileId = authorProfile?.id || page.profileId;

  if (!targetProfileId) {
    setError("Cannot identify user to block");
    return;
  }

  const targetUsername =
    authorProfile?.username ||
    page.profile?.username ||
    "this user";

  console.log("Profile to block:", {
    authorProfile,
    pageProfile: page.profile,
    targetProfileId,
    targetUsername,
  });

  openDialog({
    title: `Block @${targetUsername}?`,
    height: 30,
    text: (
      <div className="p-4 text-sm text-slate-600 dark:text-slate-300">
        You won't see their content anymore, and they won't be able to interact with yours.
      </div>
    ),
    agreeText: "Block",
    agree: () => {
      dispatch(
        blockProfile({
          blockedProfileId: targetProfileId,
          reason: "Blocked from content share menu",
        })
      ).then((res) =>
        checkResult(
          res,
          () => {
            closeDialog();
            setSuccess("User blocked");
          },
          (err) => setError(err.message || "Error blocking user")
        )
      );
    },
    disagreeText: "Cancel",
    disagree: closeDialog,
  });
};


  const LI = "py-3 border-b  bg-cream dark:bg-base-bgDark";
  const TEXT = "text-[1rem] text-soft  bg-cream dark:bg-base-bgDark dark:text-cream px-4";


  return (
    <>
      <div className="flex flex-col bg-cream dark:bg-base-bgDark overflow-hidden">

        <li className={LI}>
          <div
            className="py-3 "
            onClick={async () => {
              resetDialog();
              if (profile && (await Preferences.get({ key: "token" })).value) {
                sendGAEvent("story_add_to_collection_click", { story_id: page.id, source: getShareSource() });
                router.push(Paths.addStoryToCollection.story(page.id));
              } else {
                setError("Please Sign Up");
              }
            }}
          >
            <h5 className={TEXT}>Add to Collection</h5>
          </div>
        </li>


        {canEdit && (
          <li className={LI}>
            <div
              className="py-3"
              onClick={() => {
                sendGAEvent("story_edit_open", { story_id: page.id, source: getShareSource() });
                openDialog({ ...dialog, isOpen: false });
                router.push(Paths.editPage.createRoute(page.id, page.type));
              }}
            >
              <h5 className={TEXT}>Edit</h5>
            </div>
          </li>
        )}


        <li className={LI}>
          <div className="py-3" onClick={copyShareLink}>
            <h5 className={TEXT}>Copy Share Link</h5>
          </div>
        </li>


        {/* Report / Block section (non-owner only) */}
        {!canEdit && (
          <>
            <li className={LI}>
              <div
                className="py-3"
                onClick={() =>
                  currentProfile ? setReportDialogOpen(true) : setError("Please Sign In")
                }
              >
                <h5 className={TEXT}>Report</h5>
              </div>
            </li>

            <li className={LI}>
              <div
                className="py-3"
                onClick={() =>
                  currentProfile ? handleBlockUser() : setError("Please Sign In")
                }
              >
                <h5 className={`${TEXT} text-red-600`}>Block user</h5>
              </div>
            </li>
          </>
        )}


        <li
          className={LI}
          onClick={() => currentProfile ? handleBookmarkClick() : setError("Please Sign In")}
        >
          {/* Bookmark UI commented out as in your original */}
        </li>

      </div>

      {/* Reusable report dialog with reason details */}
      <ReportContentDialog
        contentType={String(page.type).toLowerCase()}
        contentId={page.id}
        reportedProfileId={page.profileId || profile?.id}
        isOpen={isReportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        onSuccess={() => setSuccess("Report submitted")}
      />
    </>
  );
}