import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CommentPopover from "./CommentPopover";
import { truncate } from "lodash";
import styles from "../../../styles/style";
const EMPTY_COMMENTS = [];
function AnnotatedText({ html, page, shortenTo,onAnnotationComment, showAnnotations }) {
  const dispatch = useDispatch();
  const currentProfile = useSelector((s) => s.users.currentProfile);
  const commentsRaw = useSelector((s) => s.comments.byStory?.[page?.id]);
  const comments = commentsRaw ?? EMPTY_COMMENTS;

  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const capturedTextRef = useRef("");
  const isProcessingRef = useRef(false);
  const [activeComment, setActiveComment] = useState(null);
  const [toolbar, setToolbar] = useState(null);
const annotatedHtml = useMemo(() => {
  let source = html ?? `<div>${page?.data ?? ""}</div>`;

  if (!showAnnotations) return source;

  comments
    .filter((c) => c.anchorText?.trim())
    .forEach((c) => {
      const escaped = c.anchorText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      source = source.replace(
        new RegExp(`(?![^<]*>)(${escaped})`),
        `<mark class="annotation-mark" data-comment-id="${c.id}" style="background:#a7f3d0cc;border-radius:2px;cursor:pointer;position:relative;">$1<span style="position:absolute;top:-4px;right:-4px;width:8px;height:8px;border-radius:50%;background:#10b981;display:inline-block;pointer-events:none;"></span></mark>`
      );
    });

  return source;
}, [html, page?.data, comments, showAnnotations]);

const renderedHtml = shortenTo
  ? truncate(annotatedHtml, 800, {})
  : annotatedHtml;

  // ── Show toolbar above selection ────────────────────────────────────────
  const showToolbar = useCallback(() => {
    if (isProcessingRef.current) return;

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setToolbar(null);
      return;
    }

    const text = sel.toString().trim();
    capturedTextRef.current = text;

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

  // ── selectionchange — 600ms debounce lets user drag handles freely ──────
  useEffect(() => {
    const handler = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(showToolbar, 600);
    };
    document.addEventListener("selectionchange", handler);
    return () => {
      document.removeEventListener("selectionchange", handler);
      clearTimeout(timerRef.current);
    };
  }, [showToolbar]);

  // ── Toolbar confirm ─────────────────────────────────────────────────────
  const handleAnnotateConfirm = useCallback(() => {
    if (isProcessingRef.current) return;
    const text = capturedTextRef.current;
    if (!text) return;

    isProcessingRef.current = true;
    capturedTextRef.current = "";
    setToolbar(null);
    window.getSelection()?.removeAllRanges();

    setTimeout(() => {
      onAnnotationComment?.(text);
      setTimeout(() => { isProcessingRef.current = false; }, 500);
    }, 300);
  }, [onAnnotationComment]);

  // ── Click existing mark → open popover ─────────────────────────────────
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
      className={styles.page.contentContainer}
      
      onClick={handleClick}
      style={{ WebkitUserSelect: "text", userSelect: "text" }}
    >
      {toolbar && (
        <SelectionToolbar
          position={{ top: toolbar.top, left: toolbar.left }}
          onAnnotate={handleAnnotateConfirm}
          onClose={() => {
            capturedTextRef.current = "";
            setToolbar(null);
            window.getSelection()?.removeAllRanges();
          }}
        />
      )}
<div
className={styles.page.content}
  // className="ql-editor prose prose-sm max-w-none text-sky-900 dark:text-sky-100"
  style={{ WebkitUserSelect: "text", userSelect: "text" }}
  dangerouslySetInnerHTML={{ __html: renderedHtml }}
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
export default AnnotatedText;