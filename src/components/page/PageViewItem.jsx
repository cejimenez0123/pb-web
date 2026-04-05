
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
  const header = () => (
    <div className="bg-cream rounded-xl shadow-sm p-4 mb-4">
      <div className="flex items-center gap-3">
        <ProfileCircle profile={page?.author} color="emerald-700" />
        <h6
          className="text-emerald-800 text-lg font-semibold truncate cursor-pointer"
          onClick={() => {
            router.push(Paths.page.createRoute(page.id));
          }}
        >
          {page?.title || ""}
        </h6>
      </div>
      {page?.description && (
        <div className="mt-2 text-left">
          {page.needsFeedback && <label className="text-emerald-700 font-medium">Feedback Request:</label>}
          <p className="text-emerald-800 mt-1">{page.description}</p>
        </div>
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