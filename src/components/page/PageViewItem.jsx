

// // PageViewItem.propTypes = { page: PropTypes.object.isRequired };
// import { useSelector } from "react-redux";
// import { useLayoutEffect, useEffect } from "react";
// import PropTypes from "prop-types";
// import { useIonRouter } from "@ionic/react";
// import Paths from "../../core/paths";
// import PageViewButtonRow from "./PageViewButtonRow";
// import CommentInput from "../comment/CommentInput";
// import ProfileCircle from "../profile/ProfileCircle";
// import DataElement from "./DataElement";
// import { initGA, sendGAEvent } from "../../core/ga4";
// import { useDialog } from "../../domain/usecases/useDialog";
// import { fetchCommentsOfPage } from "../../actions/PageActions";
// import { useDispatch } from "react-redux";

// export default function PageViewItem({ page, canEdit }) {
//   const router = useIonRouter();
//   const dispatch = useDispatch();
//   const currentProfile = useSelector((state) => state.users.currentProfile);
//   const { openDialog, } = useDialog();

//   useLayoutEffect(() => {
//     initGA();
//     sendGAEvent("View Story", JSON.stringify(page));
//   }, []);

//   // ── Load comments so annotation highlights render ─────────────────────────
 
//   // ── Unlock text selection inside ion-content ──────────────────────────────
//   // Ionic sets user-select:none on its scroll container which prevents
//   // selectionchange from firing and stops all text selection on mobile.
//   useEffect(() => {
//     const unlock = () => {
//       // All ion-content elements on the page (handles nested routes)
//       document.querySelectorAll("ion-content").forEach((host) => {
//         // Method 1: inline style on host
//         host.style.webkitUserSelect = "text";
//         host.style.userSelect = "text";

//         // Method 2: shadow DOM inner-scroll div (Ionic 5 / 6)
//         try {
//           const inner = host.shadowRoot?.querySelector(".inner-scroll");
//           if (inner) {
//             inner.style.webkitUserSelect = "text";
//             inner.style.userSelect = "text";
//           }
//         } catch (_) {}

//         // Method 3: getScrollElement async API (Ionic 5+)
//         host.getScrollElement?.()
//           .then((el) => {
//             if (el) {
//               el.style.webkitUserSelect = "text";
//               el.style.userSelect = "text";
//             }
//           })
//           .catch(() => {});
//       });
//     };

//     // Delay so Ionic has finished rendering its shadow DOM
//     const t = setTimeout(unlock, 150);
//     return () => clearTimeout(t);
//   }, []);

// // PageViewItem.jsx
// const handleOpenCommentInput = (anchorText = null) => {

//   openDialog({
//     isOpen:true,
//     title: "",
//     height: 50,
//     text: (
//       <CommentInput
//         page={page}
//         anchorText={anchorText}    // ← verify this is here
   
//       />
//     ),
//     disagreeText: null,
//     disagree: null,
//   });
// };

//   const header = () => (
//     <div className="bg-cream dark:bg-base-bgDark border-b border-1 border-cream rounded-xl shadow-sm px-4 flex items-start justify-between gap-4">
//       <div className="flex flex-col flex-1 min-w-0">
//         <div className="flex items-center gap-3">
//           {page?.author && (
//             <ProfileCircle
//               profile={page.author}
//               includeUsername={false}
//               color="emerald-700 dark:text-cream"
//             />
//           )}
//           <h6
//             className="text-emerald-800 text-md  dark:text-cream font-semibold truncate cursor-pointer hover:underline"
//             onClick={() => router.push(Paths.page.createRoute(page.id))}
//           >
//             {page?.title || "Untitled"}
//           </h6>
//         </div>

//         {page?.description && (
//           <div className="py-2 text-sm">
//             {(page?.status === "workshop" || page.needsFeedback) && (
//               <span className="text-emerald-700 dark:text-cream font-medium mr-1">
//                 Feedback Request:
//               </span>
//             )}
//             <span className="text-emerald-800 dark:text-cream">{page.description}</span>
//           </div>
//         )}
//       </div>

//       {canEdit && (
//         <div
//           onClick={() =>
//             router.push(Paths.editPage.createRoute(page.id), "forward")
//           }
//           className="btn btn-sm btn-ghost text-emerald-800 hover:bg-emerald-200 rounded-full"
//         >
//           ✏️
//        </div>
//       )}
//     </div>
//   );

//   return (
//     <div>
//       {header()}
//       <DataElement
//         page={page}
//         isGrid={false}
//         onAnnotationComment={handleOpenCommentInput}
//       />
//       <PageViewButtonRow
//         page={page}
//         profile={currentProfile}
//         setCommenting={() => handleOpenCommentInput(null)}
//       />
//     </div>
//   );
// }

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
import { useDispatch } from "react-redux";

export default function PageViewItem({ page, canEdit }) {
  const router = useIonRouter();
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const { openDialog } = useDialog();

  useLayoutEffect(() => {
    initGA();
    sendGAEvent("View Story", JSON.stringify(page));
  }, []);

  useEffect(() => {
    const unlock = () => {
      document.querySelectorAll("ion-content").forEach((host) => {
        host.style.webkitUserSelect = "text";
        host.style.userSelect = "text";
        try {
          const inner = host.shadowRoot?.querySelector(".inner-scroll");
          if (inner) {
            inner.style.webkitUserSelect = "text";
            inner.style.userSelect = "text";
          }
        } catch (_) {}
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
    const t = setTimeout(unlock, 150);
    return () => clearTimeout(t);
  }, []);

  const handleOpenCommentInput = (anchorText = null) => {
    openDialog({
      isOpen: true,
      title: "",
      height: 50,
      text: <CommentInput page={page} anchorText={anchorText} />,
      disagreeText: null,
      disagree: null,
    });
  };

  const header = () => (
    <div className="bg-base-surface dark:bg-base-bgDark border-b border-base-border dark:border-soft rounded-xl shadow-sm px-4 flex items-start justify-between gap-4">
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-3">
          {page?.author && (
            <ProfileCircle
              profile={page.author}
              includeUsername={false}
              color="text-soft dark:text-cream"
            />
          )}
          <h6
            className="text-soft dark:text-cream text-md font-semibold truncate cursor-pointer hover:underline"
            onClick={() => router.push(Paths.page.createRoute(page.id))}
          >
            {page?.title || "Untitled"}
          </h6>
        </div>

        {page?.description && (
          <div className="py-2 text-sm">
            {(page?.status === "workshop" || page.needsFeedback) && (
              <span className="text-blue dark:text-cream font-medium mr-1">
                Feedback Request:
              </span>
            )}
            <span className="text-soft dark:text-cream">{page.description}</span>
          </div>
        )}
      </div>

      {canEdit && (
        <div
          onClick={() => router.push(Paths.editPage.createRoute(page.id), "forward")}
          className="btn btn-sm btn-ghost text-soft dark:text-cream hover:bg-base-bg dark:hover:bg-base-bgDark rounded-full"
        >
          ✏️
        </div>
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