
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

export default function PageViewItem({ page }) {
  const router = useIonRouter();
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const [commenting, setCommenting] = useState(false);

  useLayoutEffect(() => {
    initGA();
    sendGAEvent("View Story", JSON.stringify(page));
  }, []);
  const closeInput = () => {
    setCommenting(false)
  };
  const handleClose = () => setCommenting(false);

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
      <PageViewButtonRow page={page} profile={currentProfile} setCommenting={setCommenting} />

 
    { commenting && <div>
           {/* <div
      className="fixed inset-0 z-40 bg-black bg-opacity-30"
      onClick={closeInput}  // clicking overlay closes input
    />
  <div
    className={`fixed left-0 right-0 z-50 transition-transform duration-300 bg-white shadow-lg border-t border-gray-200`}
    style={{
      bottom: "64px",        // adjust to your navbar height
      maxHeight: "50%",      // prevent covering too much
      overflowY: "auto",
    }}
  > */}
    <div
    className={`fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity duration-300 ${
      commenting ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    }`}
    onClick={closeInput}
  />

  {/* Sliding input panel */}
  <div
    className={`fixed left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200 transition-transform duration-300 ${
      commenting ? "translate-y-0" : "translate-y-full"
    }`}
      style={{
      bottom: "64px", // leave space for navbar
      maxHeight: "50%",
      overflowY: "auto",
    }}>
      <CommentInput page={page} handleClose={handleClose} />
    </div></div>
  }
      </div>
   
  );
}

PageViewItem.propTypes = { page: PropTypes.object.isRequired };