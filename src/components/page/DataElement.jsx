import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { useIonRouter } from "@ionic/react";
import LinkPreview from "../LinkPreview";
import Context from "../../context";
import { PageType } from "../../core/constants";
import Enviroment from "../../core/Enviroment";
import Paths from "../../core/paths";
import { useSelector, useDispatch } from "react-redux";
import { createComment } from "../../actions/PageActions.jsx";
import "../../styles/Editor.css"
// ─── Inline comment popover ───────────────────────────────────────────────────
function CommentPopover({ comment, position, onClose, onReply }) {
  const currentProfile = useSelector((s) => s.users.currentProfile);
  const [reply, setReply] = useState("");
  const [showReply, setShowReply] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("pointerdown", handler, { capture: true });
    return () =>
      document.removeEventListener("pointerdown", handler, { capture: true });
  }, [onClose]);

  const submitReply = () => {
    if (!reply.trim() || !currentProfile) return;
    onReply({ text: reply, parentId: comment.id });
    setReply("");
    setShowReply(false);
  };

  return (
    <div
      ref={ref}
      className={[
        "comment-popover absolute z-50 w-72 rounded-2xl shadow-2xl",
        "bg-white dark:bg-slate-800",
        "border border-emerald-200 dark:border-emerald-700",
        "p-4 flex flex-col gap-3",
      ].join(" ")}
      style={{
        top: position.top,
        left: Math.min(position.left, window.innerWidth - 300),
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            {comment.profile?.username?.[0]?.toUpperCase() ?? "?"}
          </div>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {comment.profile?.username ?? "Anonymous"}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M3.5 3.5l9 9M12.5 3.5l-9 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

  
{comment.anchorText && (
  <blockquote
    className="border-l-2 border-emerald-400 pl-2 text-xs text-slate-500 dark:text-slate-400 italic truncate cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors"
    onClick={() => {
      const mark = document.querySelector(
        `[data-comment-id="${comment.id}"]`
      );
      if (!mark) return;

      // Scroll to the mark
      mark.scrollIntoView({ behavior: "smooth", block: "center" });

      // Pulse highlight animation
      mark.classList.add("annotation-mark--pulse");
      setTimeout(() => mark.classList.remove("annotation-mark--pulse"), 1500);

      // Close the popover so the user can see the text
      onClose();
    }}
  >
    ↑ "{comment.anchorText}"
  </blockquote>
)}
      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
        {comment.content}
      </p>

      {comment.children?.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-emerald-100 dark:border-emerald-700/50 pt-2">
          {comment.children.map((r) => (
            <div key={r.id} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-800 flex items-center justify-center text-[10px] font-semibold text-sky-700 dark:text-sky-300 flex-shrink-0">
                {r.profile?.username?.[0]?.toUpperCase() ?? "?"}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {r.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {showReply ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={2}
            placeholder="Write a reply…"
            className="w-full text-xs p-2 rounded-lg border border-emerald-200 dark:border-emerald-600 bg-emerald-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowReply(false)}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={submitReply}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-full transition"
            >
              Reply
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowReply(true)}
          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline text-left"
        >
          + Reply
        </button>
      )}
    </div>
  );
}

// ─── Selection toolbar ────────────────────────────────────────────────────────
// function SelectionToolbar({ position, onAnnotate, onClose }) {
//   return (
//     <div
//       className={[
//         "absolute z-50 flex items-center gap-1 px-2 py-1.5 rounded-xl shadow-xl",
//         "bg-slate-800 dark:bg-slate-700",
//         "animate-in fade-in zoom-in-95 duration-100",
//       ].join(" ")}
//       style={{ top: position.top, left: position.left }}
//       onPointerDown={(e) => e.preventDefault()}
//     >
//       <span
//         className="absolute -bottom-1.5 left-4 w-3 h-3 bg-slate-800 dark:bg-slate-700 rotate-45"
//         style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
//       />
//       <button
//         className="flex items-center gap-1.5 text-xs text-soft font-medium px-2 py-1 rounded-lg hover:bg-white/10 transition"
//         onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onAnnotate(); }}
//       >
        
//         Comment
//       </button>
//       <button
//         className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
//         onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
//       >
//         <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
//           <path d="M1 1l10 10M11 1L1 11" />
//         </svg>
//       </button>
//     </div>
//   );
// }
// ── Module level — stable reference ──────────────────────────────────────────
const EMPTY_COMMENTS = [];

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
        className="flex items-center gap-1.5 text-xs text-soft font-medium px-2 py-1 rounded-lg transition"
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAnnotate();
        }}
      >
        {/* <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          <path d="M2 2h8l4 4v8H2V2zM10 2v4h4M5 9h6M5 11h4" />
        </svg> */}
        Comment
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

// ─── AnnotatedText ────────────────────────────────────────────────────────────
function AnnotatedText({ html, page, onAnnotationComment }) {
  const dispatch = useDispatch();
  const currentProfile = useSelector((s) => s.users.currentProfile);
  const commentsRaw = useSelector((s) => s.comments.byStory?.[page?.id]);
  const comments = commentsRaw ?? EMPTY_COMMENTS;

  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const capturedTextRef = useRef("");
  const isProcessingRef = useRef(false);
  const [activeComment, setActiveComment] = useState(null);
  const [toolbar, setToolbar] = useState(null); // { top, left, text }

  // ── Inject <mark> tags ──────────────────────────────────────────────────
  const annotatedHtml = useCallback(() => {
    let source = html ?? `<div>${page?.data ?? ""}</div>`;
    comments
      .filter((c) => c.anchorText?.trim())
      .forEach((c) => {
        const escaped = c.anchorText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        source = source.replace(
          new RegExp(`(?![^<]*>)(${escaped})`),
          `<mark class="annotation-mark" data-comment-id="${c.id}" ` +
          `style="background:#a7f3d0cc;border-radius:2px;cursor:pointer;position:relative;">` +
          `$1<span style="position:absolute;top:-4px;right:-4px;width:8px;height:8px;` +
          `border-radius:50%;background:#10b981;display:inline-block;pointer-events:none;"></span></mark>`
        );
      });
    return source;
  }, [html, page?.data, comments]);

  // ── Show toolbar above selection ────────────────────────────────────────
// const showToolbar = useCallback(() => {
//   const sel = window.getSelection();
//   if (!sel || sel.isCollapsed || !sel.toString().trim()) {
//     setToolbar(null);
//     return;
//   }

//   const text = sel.toString().trim();
//   capturedTextRef.current = text;

//   const range = sel.getRangeAt(0);
//   const rect = range.getBoundingClientRect();
//   const containerRect = containerRef.current?.getBoundingClientRect();
//   if (!containerRect || rect.width === 0) return;

//   const top  = rect.top - containerRect.top - 48;
//   const left = Math.min(
//     Math.max(rect.left - containerRect.left, 0),
//     containerRect.width - 140
//   );

//   setToolbar({ top, left, text });
// }, []);
const showToolbar = useCallback(() => {
  if (isProcessingRef.current) return; // ← guard

  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.toString().trim()) {
    setToolbar(null);
    return;
  }

  const text = sel.toString().trim();
  capturedTextRef.current = text; 
  if (isProcessingRef.current) return;  // ← add this
  
 

  const range = sel.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const containerRect = containerRef.current?.getBoundingClientRect();
  if (!containerRect || rect.width === 0) return;

  const top  = rect.top - containerRect.top - 48;
  const left = Math.min(
    Math.max(rect.left - containerRect.left, 0),
    containerRect.width - 140
  );

  setToolbar({ top, left, text });
}, []);
  // ── selectionchange — longer debounce lets user drag handles freely ─────
  useEffect(() => {
    const handler = () => {
      clearTimeout(timerRef.current);
      // 600ms gives mobile users time to drag selection handles
      timerRef.current = setTimeout(showToolbar, 600);
    };
    document.addEventListener("selectionchange", handler);
    return () => {
      document.removeEventListener("selectionchange", handler);
      clearTimeout(timerRef.current);
    };
  }, [showToolbar]);
const handleAnnotateConfirm = useCallback(() => {
  if (isProcessingRef.current) return;
  const text = capturedTextRef.current;
  if (!text) return;

  isProcessingRef.current = true;
  capturedTextRef.current = "";
  setToolbar(null);
  window.getSelection()?.removeAllRanges();

  // 300ms delay — lets selectionchange and pointerdown events settle
  // before the dialog opens, preventing immediate close
  setTimeout(() => {
    onAnnotationComment?.(text);
    setTimeout(() => { isProcessingRef.current = false; }, 500);
  }, 300);
}, [onAnnotationComment]);




  const handleClick = useCallback((e) => {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) return;

    const mark = e.target.closest(".annotation-mark");
    if (!mark) return;

    const id = mark.dataset.commentId;
    const comment = comments.find((c) => c.id === id);
    if (!comment) return;

    const rect = mark.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    setToolbar(null);
    setActiveComment({
      comment,
      position: {
        top:  rect.bottom - containerRect.top + 8,
        left: Math.min(rect.left - containerRect.left, containerRect.width - 288),
      },
    });
  }, [comments]);

  // ── Reply from popover ──────────────────────────────────────────────────
  const handleReply = useCallback(({ text, parentId }) => {
    
    if (!currentProfile) return;
    console.log("PARENTID",parentId)
    dispatch(createComment({
      profile:         currentProfile,
      text,
      storyId:         page.id,
      parentCommentId: parentId,
      anchorText:      "",
    })).then(() => setActiveComment(null));
  }, [currentProfile, dispatch, page?.id]);

  return (
    <div
      ref={containerRef}
      className="relative annotation-container"
      onClick={handleClick}
      style={{ WebkitUserSelect: "text", userSelect: "text" }}
    >
      {toolbar && (
        <SelectionToolbar
          position={{ top: toolbar.top, left: toolbar.left }}
          onAnnotate={handleAnnotateConfirm}
        onClose={() => {
  capturedTextRef.current = "";  // ← clear ref too
  setToolbar(null);
  window.getSelection()?.removeAllRanges();
}}
        />
      )}

      <div
        className="ql-editor prose prose-sm max-w-none text-sky-900 dark:text-sky-100"
        style={{ WebkitUserSelect: "text", userSelect: "text" }}
        dangerouslySetInnerHTML={{ __html: annotatedHtml() }}
      />

      {activeComment && (
        <CommentPopover
          comment={activeComment.comment}
          position={activeComment.position}
          onClose={() => setActiveComment(null)}
          onReply={handleReply}
        />
      )}
    </div>
  );
}


function DataElement({ page, isGrid, book = null, html = null, onAnnotationComment }) {
  const initialImage =
    page?.type === PageType.picture ? resolveImageSrc(page?.data) : null;

  const router = useIonRouter();

  function Element({ page, image }) {
    switch (page.type) {
      case PageType.text:
        return (
          <AnnotatedText
            html={html}
            page={page}
            onAnnotationComment={onAnnotationComment}
          />
        );
      case PageType.picture:
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