

// PageViewItem.propTypes = { page: PropTypes.object.isRequired };
import { useSelector } from "react-redux";
import { useLayoutEffect, useEffect } from "react";
import PropTypes from "prop-types";
import { useIonRouter } from "@ionic/react";
import Paths from "../../core/paths";
import PageViewButtonRow from "./PageViewButtonRow";
import CommentInput from "../comment/CommentInput";
import ProfileCircle from "../profile/ProfileCircle";
import DataElement from "./DataElement";
import { initGA, sendGAEvent } from "../../core/ga4";
import { useDialog } from "../../domain/usecases/useDialog";
import { fetchCommentsOfPage } from "../../actions/PageActions";
import { useDispatch } from "react-redux";

export default function PageViewItem({ page, canEdit }) {
  const router = useIonRouter();
  const dispatch = useDispatch();
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const { openDialog, } = useDialog();

  useLayoutEffect(() => {
    initGA();
    sendGAEvent("View Story", JSON.stringify(page));
  }, []);

  // ── Load comments so annotation highlights render ─────────────────────────
 
  // ── Unlock text selection inside ion-content ──────────────────────────────
  // Ionic sets user-select:none on its scroll container which prevents
  // selectionchange from firing and stops all text selection on mobile.
  useEffect(() => {
    const unlock = () => {
      // All ion-content elements on the page (handles nested routes)
      document.querySelectorAll("ion-content").forEach((host) => {
        // Method 1: inline style on host
        host.style.webkitUserSelect = "text";
        host.style.userSelect = "text";

        // Method 2: shadow DOM inner-scroll div (Ionic 5 / 6)
        try {
          const inner = host.shadowRoot?.querySelector(".inner-scroll");
          if (inner) {
            inner.style.webkitUserSelect = "text";
            inner.style.userSelect = "text";
          }
        } catch (_) {}

        // Method 3: getScrollElement async API (Ionic 5+)
        host.getScrollElement?.()
          .then((el) => {
            if (el) {
              el.style.webkitUserSelect = "text";
              el.style.userSelect = "text";
            }
          })
          .catch(() => {});
      });
    };

    // Delay so Ionic has finished rendering its shadow DOM
    const t = setTimeout(unlock, 150);
    return () => clearTimeout(t);
  }, []);

// PageViewItem.jsx
const handleOpenCommentInput = (anchorText = null) => {

  openDialog({
    isOpen:true,
    title: "",
    height: 50,
    text: (
      <CommentInput
        page={page}
        anchorText={anchorText}    // ← verify this is here
   
      />
    ),
    disagreeText: null,
    disagree: null,
  });
};

  const header = () => (
    <div className="bg-cream rounded-xl shadow-sm p-4 mb-4 flex items-start justify-between gap-4">
      <div className="flex flex-col flex-1 min-w-0">
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

        {page?.description && (
          <div className="mt-2 text-sm">
            {(page?.status === "workshop" || page.needsFeedback) && (
              <span className="text-emerald-700 font-medium mr-1">
                Feedback Request:
              </span>
            )}
            <span className="text-emerald-800">{page.description}</span>
          </div>
        )}
      </div>

      {canEdit && (
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
      <DataElement
        page={page}
        isGrid={false}
        onAnnotationComment={handleOpenCommentInput}
      />
      <PageViewButtonRow
        page={page}
        profile={currentProfile}
        setCommenting={() => handleOpenCommentInput(null)}
      />
    </div>
  );
}

PageViewItem.propTypes = { page: PropTypes.object.isRequired };