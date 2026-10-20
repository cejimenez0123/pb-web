import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

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
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {comment.anchorText && (
        <blockquote
          className="border-l-2 border-emerald-400 pl-2 text-xs text-slate-500 dark:text-slate-400 italic truncate cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors"
          onClick={() => {
            const mark = document.querySelector(`[data-comment-id="${comment.id}"]`);
            if (!mark) return;
            mark.scrollIntoView({ behavior: "smooth", block: "center" });
            mark.classList.add("annotation-mark--pulse");
            setTimeout(() => mark.classList.remove("annotation-mark--pulse"), 1500);
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
              <p className="text-xs text-slate-600 dark:text-slate-300">{r.content}</p>
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
            placeholder="Write a reply..."
            className="w-full text-xs p-2 rounded-lg border border-emerald-200 dark:border-emerald-600 bg-emerald-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowReply(false)} className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              Cancel
            </button>
            <button onClick={submitReply} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-full transition">
              Reply
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowReply(true)} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline text-left">
          + Reply
        </button>
      )}
    </div>
  );
}
export default CommentPopover;