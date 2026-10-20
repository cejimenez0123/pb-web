
import { useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useIonRouter } from "@ionic/react";
import LinkPreview from "../LinkPreview";
import Context from "../../context";
import { PageType } from "../../core/constants";
import Enviroment from "../../core/Enviroment";
import Paths from "../../core/paths";
import { useSelector, useDispatch } from "react-redux";
import { createComment } from "../../actions/PageActions.jsx";
import "../../styles/Editor.css";
import truncate from "html-truncate";
import AnnotatedText from "./Annotation/AnnotatedText.jsx";

// ── Module level — stable reference ──────────────────────────────────────────

// ─── Inline comment popover ───────────────────────────────────────────────────
// function CommentPopover({ comment, position, onClose, onReply }) {
//   const currentProfile = useSelector((s) => s.users.currentProfile);
//   const [reply, setReply] = useState("");
//   const [showReply, setShowReply] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const handler = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) onClose();
//     };
//     document.addEventListener("pointerdown", handler, { capture: true });
//     return () =>
//       document.removeEventListener("pointerdown", handler, { capture: true });
//   }, [onClose]);

//   const submitReply = () => {
//     if (!reply.trim() || !currentProfile) return;
//     onReply({ text: reply, parentId: comment.id });
//     setReply("");
//     setShowReply(false);
//   };

//   return (
//     <div
//       ref={ref}
//       className={[
//         "comment-popover absolute z-50 w-72 rounded-2xl shadow-2xl",
//         "bg-white dark:bg-slate-800",
//         "border border-emerald-200 dark:border-emerald-700",
//         "p-4 flex flex-col gap-3",
//       ].join(" ")}
//       style={{
//         top: position.top,
//         left: Math.min(position.left, window.innerWidth - 300),
//       }}
//     >
//       <div className="flex items-start justify-between gap-2">
//         <div className="flex items-center gap-2">
//           <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-xs font-semibold text-emerald-700 dark:text-emerald-300">
//             {comment.profile?.username?.[0]?.toUpperCase() ?? "?"}
//           </div>
//           <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
//             {comment.profile?.username ?? "Anonymous"}
//           </span>
//         </div>
//         <button
//           onClick={onClose}
//           className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
//         >
//           <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
//             <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//           </svg>
//         </button>
//       </div>

//       {comment.anchorText && (
//         <blockquote
//           className="border-l-2 border-emerald-400 pl-2 text-xs text-slate-500 dark:text-slate-400 italic truncate cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors"
//           onClick={() => {
//             const mark = document.querySelector(`[data-comment-id="${comment.id}"]`);
//             if (!mark) return;
//             mark.scrollIntoView({ behavior: "smooth", block: "center" });
//             mark.classList.add("annotation-mark--pulse");
//             setTimeout(() => mark.classList.remove("annotation-mark--pulse"), 1500);
//             onClose();
//           }}
//         >
//           ↑ "{comment.anchorText}"
//         </blockquote>
//       )}

//       <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
//         {comment.content}
//       </p>

//       {comment.children?.length > 0 && (
//         <div className="flex flex-col gap-2 border-t border-emerald-100 dark:border-emerald-700/50 pt-2">
//           {comment.children.map((r) => (
//             <div key={r.id} className="flex items-start gap-2">
//               <div className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-800 flex items-center justify-center text-[10px] font-semibold text-sky-700 dark:text-sky-300 flex-shrink-0">
//                 {r.profile?.username?.[0]?.toUpperCase() ?? "?"}
//               </div>
//               <p className="text-xs text-slate-600 dark:text-slate-300">{r.content}</p>
//             </div>
//           ))}
//         </div>
//       )}

//       {showReply ? (
//         <div className="flex flex-col gap-2">
//           <textarea
//             value={reply}
//             onChange={(e) => setReply(e.target.value)}
//             rows={2}
//             placeholder="Write a reply..."
//             className="w-full text-xs p-2 rounded-lg border border-emerald-200 dark:border-emerald-600 bg-emerald-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
//           />
//           <div className="flex justify-end gap-2">
//             <button onClick={() => setShowReply(false)} className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
//               Cancel
//             </button>
//             <button onClick={submitReply} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-full transition">
//               Reply
//             </button>
//           </div>
//         </div>
//       ) : (
//         <button onClick={() => setShowReply(true)} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline text-left">
//           + Reply
//         </button>
//       )}
//     </div>
//   );
// }

// ─── Selection toolbar ────────────────────────────────────────────────────────
function SelectionToolbar({ position, onAnnotate, onClose }) {
  return (
    <div
      className={[
        "absolute z-50 flex items-center gap-1 px-2 py-1.5 rounded-xl shadow-xl",
        "bg-slate-800 dark:bg-slate-700",
      ].join(" ")}
      style={{ top: position.top, left: position.left }}
      onPointerDown={(e) => e.preventDefault()}
    >
      <span
        className="absolute -bottom-1.5 left-4 w-3 h-3 bg-slate-800 dark:bg-slate-700 rotate-45"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
      />
      <button
        className="flex items-center gap-1.5 text-xs text-white font-medium px-2 py-1 rounded-lg hover:bg-white/10 transition"
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAnnotate();
        }}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          <path d="M2 2h8l4 4v8H2V2zM10 2v4h4M5 9h6M5 11h4" />
        </svg>
        <p className="text-slate-400">Comment</p>
      </button>
      <button
        className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      >
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M1 1l10 10M11 1L1 11" />
        </svg>
      </button>
    </div>
  );
}


const EMPTY_COMMENTS = [];
// ─── DataElement ──────────────────────────────────────────────────────────────
function DataElement({ page, isGrid,shortenTo=null, book = null, html = null, onAnnotationComment }) {
  const initialImage =
    page?.type === PageType.picture ? resolveImageSrc(page?.data) : null;
  const router = useIonRouter();
  const commentsRaw = useSelector((s) => s.comments.byStory?.[page?.id]);
  const comments = commentsRaw ?? EMPTY_COMMENTS;
  const hasAnnotations = comments.some((c) => c.anchorText?.trim());
  const [showAnnotations, setShowAnnotations] = useState(true);

  function Element({ page, image }) {
    
    switch (page.type) {
      case PageType.text:
        return (
          <>
       
            {hasAnnotations && (
              <div className="flex justify-end px-2 pt-2 ">
             { router.routeInfo.pathname.includes("story") && <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAnnotations((v) => !v);
                  }}
                  className={[
                    "text-xs px-3 py-1 rounded-full border transition-colors",
                    showAnnotations
                      ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-900/40 dark:border-emerald-700 dark:text-emerald-300"
                      : "bg-slate-100 border-slate-300 text-slate-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400",
                  ].join(" ")}
                >
                  {showAnnotations ? "🔖 Hide highlights" : "🔖 Show highlights"}
                </button>}
              </div>
            )}
            <AnnotatedText
              html={html}
              page={page}
              shortenTo={shortenTo}
              onAnnotationComment={onAnnotationComment}
              showAnnotations={showAnnotations}
            />
          </>
        );
        case PageType.picture: {
  const [imgError, setImgError] = useState(false);
  const [src, setSrc] = useState(image);

  if (imgError) return (
    <div className="w-full h-48 flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 15l5-5 4 4 3-3 4 4"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
      </svg>
      <span className="text-xs">Image unavailable</span>
    </div>
  );

  return (
    <img
      id="page-data-pic"
      onClick={() => {
        if (router.routeInfo.pathname !== Paths.page.createRoute(page.id)) {
          router.push(Paths.page.createRoute(page.id));
        }
      }}
      alt={page.title}
      src={src}
      className="w-full h-full object-contain"
      onError={() => {
        const raw = page?.data;
        if (raw && !src.includes("imageProxy")) {
          setSrc(Enviroment.imageProxy(raw)); // retry via proxy
        } else {
          setImgError(true);
        }
      }}
    />
  );
}
// case PageType.picture:
  return (
    <img
      id="page-data-pic"
      onClick={() => {
        if (router.routeInfo.pathname !== Paths.page.createRoute(page.id)) {
          router.push(Paths.page.createRoute(page.id));
        }
      }}
      alt={page.title}
      src={image}
      className="w-full h-full object-contain"
      onError={(e) => {
        e.target.onerror = null; // prevent infinite loop
        e.target.style.display = "none";
        e.target.insertAdjacentHTML(
          "afterend",
          `<div class="w-full h-48 flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
            <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 15l5-5 4 4 3-3 4 4"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
            </svg>
            <span class="text-xs">Image unavailable</span>
          </div>`
        );
      }}
    />
  );


      case PageType.link:
        return <LinkPreview isGrid={isGrid} url={page.data} />;

      default:
        return null;
    }
  }

  if (!page) return null;
  return <Element page={page} image={initialImage} />;
}

export default DataElement;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const resolveImageSrc = (data) => {
  if (!data) return null;
  const isFirebaseUrl = data.includes("firebasestorage.googleapis.com");
  return isFirebaseUrl ? Enviroment.imageProxy(data) : data;
};