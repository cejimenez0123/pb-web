
import { useSelector } from "react-redux";
import { useLayoutEffect, useState } from "react";
import PropTypes from "prop-types";
import { useIonRouter } from "@ionic/react";
import Paths from "../../core/paths";
import PageViewButtonRow from "./PageViewButtonRow";
import CommentInput from "../comment/CommentInput";
import ProfileCircle from "../profile/ProfileCircle";
import DataElement from "./DataElement";
import { initGA, sendGAEvent } from "../../core/ga4";
import { useDialog } from "../../domain/usecases/useDialog";

export default function PageViewItem({ page }) {
  const router = useIonRouter();
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const [commenting, setCommenting] = useState(false);
const {openDialog,resetDialog,closeDialog,dialog}=useDialog()
  useLayoutEffect(() => {
    initGA();
    sendGAEvent("View Story", JSON.stringify(page));
  }, []);
  const closeInput = () => {
    setCommenting(false)
  };
  
const handleOpenCommentInput = () => {
  openDialog({
    title: "", // optional, you can hide it if you want
    height: 50, // 👈 replaces your old "maxHeight: 35%"
    text: (
      <CommentInput
        page={page}
     
        handleClose={closeDialog} // important
      />
    ),
    disagreeText: null,
    disagree: null
  });
};
const canUserEdit = (() => {
  if (!currentProfile || !page) return false;
  if (currentProfile.id === page.authorId) return true; // author can edit
  // check beta readers
  const roles = ["editor"];
  return !!page.betaReaders?.find(
    (r) => r.profileId === currentProfile.id && roles.includes(r.role)
  );
})();

//   const header = () => (
//     <div className="bg-cream flex flex-row rounded-xl justify-between shadow-sm p-4 mb-4">
//       <div className=" w-[66%]">
//       <div className="flex items-center justify-around gap-12">
//        {page?.author && <ProfileCircle profile={page?.author} includeUsername={false} color="emerald-700" />}
//         <h6
//           className="text-emerald-800 text-md font-semibold truncate cursor-pointer"
//           onClick={() => {
//             router.push(Paths.page.createRoute(page.id));
//           }}
//         >
//           {page?.title || ""}
//         </h6>
//       </div>
//       {page?.description && (
//         <div className="mt-2 text-left">
//           {page.needsFeedback && <label className="text-emerald-700 font-medium">Feedback Request:</label>}
//           <p className="text-emerald-800 mt-1">{page.description}</p>
//         </div>
//       )}
//       </div>
//             {canUserEdit && (
//   <div
//     onClick={() => router.push(Paths.editPage.createRoute(page.id), "forward")}
//     className="rounded-full  btn bg-base-surface  text-emerald-800 hover:bg-emerald-300 transition"
//   >
//     ✏️ 
//   </div>
// )}
  //   </div>
  // );
const header = () => (
  <div className="bg-cream rounded-xl shadow-sm p-4 mb-4 flex items-start justify-between gap-4">
    
    {/* Left content */}
    <div className="flex flex-col flex-1 min-w-0">
      
      {/* Top row */}
      <div className="flex items-center gap-3">
        {page?.author && (
          <ProfileCircle
            profile={page.author}
            includeUsername={false}
            color="emerald-700"
          />
        )}

        <h6
          className="text-emerald-800 text-md font-semibold truncate cursor-pointer hover:underline"
          onClick={() => router.push(Paths.page.createRoute(page.id))}
        >
          {page?.title || "Untitled"}
        </h6>
      </div>

      {/* Description */}
      {page?.description && (
        <div className="mt-2 text-sm">
          {page?.status=="workshop"||page.needsFeedback && (
            <span className="text-emerald-700 font-medium mr-1">
              Feedback Request:
            </span>
          )}
          <span className="text-emerald-800">
            {page.description}
          </span>
        </div>
      )}
    </div>

    {/* Edit button */}
    {canUserEdit && (
      <button
        onClick={() =>
          router.push(Paths.editPage.createRoute(page.id), "forward")
        }
        className="btn btn-sm btn-ghost text-emerald-800 hover:bg-emerald-200 rounded-full"
      >
        ✏️
      </button>
    )}
  </div>
);
  return (
    <div>
      {header()}
      <DataElement page={page} isGrid={false} />
      <PageViewButtonRow page={page} profile={currentProfile} setCommenting={handleOpenCommentInput} />

 


      </div>
   
  );
}

PageViewItem.propTypes = { page: PropTypes.object.isRequired };