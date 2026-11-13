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

export default SelectionToolbar