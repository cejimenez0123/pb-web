
import React, { useEffect, useRef, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { ErrorBoundary } from "@sentry/react";
import alignLeft from "../../images/editor/align-left-svgrepo-com.svg"
import alignCenter from "../../images/editor/align-center-svgrepo-com.svg"
import alignRight from "../../images/editor/align-right-svgrepo-com.svg"
import numberedList from "../../images/editor/ordered-list-svgrepo-com.svg"
import unorderedList from "../../images/editor/unordered-list-svgrepo-com.svg"
// ─── Toolbar config ────────────────────────────────────────────────────────
const FONTS = ["Default", "Georgia", "Courier New", "Arial", "Trebuchet MS"];
const SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "32px"];

function ToolbarButton({ title, icon, action, active, disabled }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        action();
      }}
      className={[
        "flex items-center justify-center w-8 h-8 rounded-lg text-sm transition-all duration-150",
        "hover:bg-emerald-100 dark:hover:bg-emerald-800/40",
        active
          ? "bg-emerald-200 text-emerald-900 dark:bg-emerald-700 dark:text-emerald-100"
          : "text-slate-600 dark:text-slate-300",
        disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {icon}
    </button>
  );
}

function ToolbarSeparator() {
  return (
    <span className="w-px h-6 bg-emerald-200 dark:bg-emerald-700 mx-1 self-center" />
  );
}

function ToolbarSelect({ value, options, onChange, title, className = "" }) {
  return (
    <select
      title={title}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onMouseDown={(e) => e.stopPropagation()}
      className={[
        "text-xs px-1 py-1 rounded-lg border border-emerald-200 dark:border-emerald-700",
        "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200",
        "focus:outline-none focus:ring-2 focus:ring-emerald-400",
        "cursor-pointer",
        className,
      ].join(" ")}
    >
      {options.map((opt) => (
        <option className={`text-soft`}key={opt.value ?? opt} value={opt.value ?? opt}>
          {opt.label ?? opt}
        </option>
      ))}
    </select>
  );
}

// ─── Main RichEditor ────────────────────────────────────────────────────────
export default function RichEditor({ handleChange }) {
  const htmlContent = useSelector((state) => state.pages.editorHtmlContent);
  const editorRef = useRef(null);
  const isInternalChange = useRef(false);

  // Track format state
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    ordered: false,
    unordered: false,
    blockquote: false,
    code: false,
    align: "left",
    font: "Default",
    size: "16px",
    link: false,
  });

  // ── Sync external content into editor ──
 const hasInitialized = useRef(false);

useEffect(() => {
  const el = editorRef.current;
  if (!el || hasInitialized.current) return; // ← only run once
  const incoming = htmlContent || "";
  el.innerHTML = incoming;
  hasInitialized.current = true;
}, [htmlContent]);

  // ── Emit changes upward ──
  const emitChange = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    handleChange?.(html);
  }, [handleChange]);

  // ── Track cursor format state ──
  const updateFormatState = useCallback(() => {
    setFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikethrough: document.queryCommandState("strikeThrough"),
      ordered: document.queryCommandState("insertOrderedList"),
      unordered: document.queryCommandState("insertUnorderedList"),
      blockquote: false, // tracked manually
      code: false,
      align: document.queryCommandValue("justifyLeft")
        ? "left"
        : document.queryCommandValue("justifyCenter")
        ? "center"
        : document.queryCommandValue("justifyRight")
        ? "right"
        : document.queryCommandValue("justifyFull")
        ? "justify"
        : "left",
      font: document.queryCommandValue("fontName") || "Default",
      size: document.queryCommandValue("fontSize") || "16px",
    });
  }, []);

  // ── Exec helper ──
  const exec = useCallback(
    (cmd, value = null) => {
      editorRef.current?.focus();
      document.execCommand(cmd, false, value);
      updateFormatState();
      emitChange();
    },
    [updateFormatState, emitChange]
  );

  // ── Link insertion ──
  const insertLink = useCallback(() => {
    const url = window.prompt("Enter URL:", "https://");
    if (url) exec("createLink", url);
  }, [exec]);

  // ── Image insertion ──
  const insertImage = useCallback(() => {
    const url = window.prompt("Image URL:", "https://");
    if (url) exec("insertImage", url);
  }, [exec]);

  // ── Font ──
  const applyFont = useCallback(
    (font) => {
      if (font === "Default") {
        exec("fontName", "inherit");
      } else {
        exec("fontName", font);
      }
    },
    [exec]
  );

  // ── Size ──
  // const applySize = useCallback(
  //   (size) => {
  //     // execCommand fontSize only takes 1-7; we use a span workaround
  //     editorRef.current?.focus();
  //     const sel = window.getSelection();
  //     if (!sel || sel.isCollapsed) return;
  //     const range = sel.getRangeAt(0);
  //     const span = document.createElement("span");
  //     span.style.fontSize = size;
  //     range.surroundContents(span);
  //     emitChange();
  //   },
  //   [emitChange]
  // );
const applySize = useCallback((size) => {
  editorRef.current?.focus();
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) return;
  try {
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontSize = size;
    range.surroundContents(span);
    emitChange();
  } catch (_) {
    // Selection spans multiple elements — use execCommand fallback
    document.execCommand("fontSize", false, "3");
    emitChange();
  }
}, [emitChange]);
  // // ── Paste: strip to plain text ──
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }, []);

  const fontOptions = FONTS.map((f) => ({ value: f, label: f }));
  const sizeOptions = SIZES.map((s) => ({ value: s, label: s }));

  return (
    <ErrorBoundary>
      <div className="rich-editor flex flex-col rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-slate-900 shadow-sm">
        {/* ── Toolbar ── */}
        <div
          className={[
            "flex flex-wrap items-center gap-0.5 px-3 py-2",
            "bg-white dark:bg-slate-800",
            "border-b border-emerald-200 dark:border-emerald-700",
            "overflow-x-auto",
          ].join(" ")}
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Font */}
          <ToolbarSelect
            title="Font Family"
            value={formats.font}
            options={fontOptions}
            onChange={applyFont}
            className="w-28 hidden sm:block"
          />
          {/* Size */}
          <ToolbarSelect
            title="Font Size"
            value={formats.size}
            options={sizeOptions}
            onChange={applySize}
            className="w-20 hidden sm:block"
          />
          <ToolbarSeparator />

          {/* Bold */}
          <ToolbarButton
            title="Bold (⌘B)"
            active={formats.bold}
            action={() => exec("bold")}
            icon={<span className="font-bold text-sm">B</span>}
          />
          {/* Italic */}
          <ToolbarButton
            title="Italic (⌘I)"
            active={formats.italic}
            action={() => exec("italic")}
            icon={<span className="italic text-sm font-serif">I</span>}
          />
          {/* Underline */}
          <ToolbarButton
            title="Underline (⌘U)"
            active={formats.underline}
            action={() => exec("underline")}
            icon={<span className="underline text-soft text-sm">U</span>}
          />
          {/* Strikethrough */}
          <ToolbarButton
            title="Strikethrough"
            active={formats.strikethrough}
            action={() => exec("strikeThrough")}
            icon={<span className="line-through text-soft text-sm">S</span>}
          />
          <ToolbarSeparator />

          {/* Align Left */}
          <ToolbarButton
            title="Align Left"
            active={formats.align === "left"}
            action={() => exec("justifyLeft")}
            icon={
              <img className={"max-w-4 max-h-4"}src={alignLeft}/>
             
            }
          />
          {/* Align Center */}
          <ToolbarButton
            title="Align Center"
            active={formats.align === "center"}
            action={() => exec("justifyCenter")}
            icon={
           <img className={"max-w-4 max-h-4"}src={alignCenter}/>
             
            }
          />
          {/* Align Right */}
          <ToolbarButton
            title="Align Right"
            active={formats.align === "right"}
            action={() => exec("justifyRight")}
            icon={
             <img className={"max-w-4 max-h-4"}src={alignRight}/>
             
            }
          />
          <ToolbarSeparator />

          {/* Ordered List */}
          <ToolbarButton
            title="Numbered List"
            active={formats.ordered}
            action={() => exec("insertOrderedList")}
            icon={
         <img className="max-w-4 max-h-4" src={numberedList}/>
            }
          />
          {/* Unordered List */}
          <ToolbarButton
            title="Bullet List"
            active={formats.unordered}
            action={() => exec("insertUnorderedList")}
            icon={
          <img src={unorderedList} className="max-w-4 max-h-4" />
            }
          />
          <ToolbarSeparator />

          {/* Blockquote */}
          <ToolbarButton
            title="Blockquote"
            active={formats.blockquote}
            action={() => exec("formatBlock", "blockquote")}
            icon={
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
                <path d="M3 3h3l-2 4h2v4H2V7l1-4zm6 0h3l-2 4h2v4H8V7l1-4z" />
              </svg>
            }
          />
          {/* Code Block */}
          <ToolbarButton
            title="Code Block"
            action={() => exec("formatBlock", "pre")}
            icon={
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
                <path d="M5.5 3.5L1 8l4.5 4.5 1-1L3 8l3.5-3.5-1-1zm5 0l-1 1L13 8l-3.5 3.5 1 1L15 8 10.5 3.5z" />
              </svg>
            }
          />
          <ToolbarSeparator />

          {/* Link */}
          <ToolbarButton
            title="Insert Link"
            action={insertLink}
            icon={
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
                <path d="M6.5 11.5l-1 1a3 3 0 01-4.24-4.24l3-3a3 3 0 014.1.12l-1.05 1.05a1.5 1.5 0 00-1.99-.05L3 8.62a1.5 1.5 0 002.12 2.12l1-.99 1.38 1.38v-.63zM9.5 4.5l1-1a3 3 0 014.24 4.24l-3 3a3 3 0 01-4.1-.12l1.05-1.05a1.5 1.5 0 001.99.05l2.32-2.32a1.5 1.5 0 00-2.12-2.12l-1 .99-1.38-1.38v.71z" />
              </svg>
            }
          />
          {/* Image */}
          <ToolbarButton
            title="Insert Image"
            action={insertImage}
            icon={
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
                <rect x="1" y="2" width="14" height="12" rx="2" fillOpacity=".15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <circle cx="5" cy="6" r="1.5" />
                <path d="M1 11l4-4 3 3 2-2 5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
              </svg>
            }
          />
          <ToolbarSeparator />

          {/* Undo */}
          <ToolbarButton
            title="Undo (⌘Z)"
            action={() => exec("undo")}
            icon={
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7H9a4 4 0 010 8H6" strokeLinecap="round"/>
                <path d="M3 7l3-3M3 7l3 3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          {/* Redo */}
          <ToolbarButton
            title="Redo (⌘⇧Z)"
            action={() => exec("redo")}
            icon={
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 7H7a4 4 0 000 8h3" strokeLinecap="round"/>
                <path d="M13 7l-3-3M13 7l-3 3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          {/* Clear */}
          <ToolbarButton
            title="Clear Formatting"
            action={() => exec("removeFormat")}
            icon={
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
                <path d="M3 2h8l2 4-5 8H6L4 10l6-1-3-5H3V2zm9.5 10l1.5 1.5-1.5 1.5-1.5-1.5 1.5-1.5z"/>
              </svg>
            }
          />
        </div>

        {/* ── Editable area ── */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          spellCheck
          onInput={emitChange}
          onKeyUp={updateFormatState}
          onMouseUp={updateFormatState}
          onPaste={handlePaste}
          className={[
            "rich-editor__body",
            "min-h-[220px] px-5 py-4",
            "text-sky-900 dark:text-sky-100",
            "bg-emerald-50 dark:bg-slate-900",
            "focus:outline-none",
            "prose prose-sm sm:prose-base max-w-none",
            // Prose overrides for our palette
            "prose-headings:text-sky-800 dark:prose-headings:text-sky-200",
            "prose-a:text-emerald-700 dark:prose-a:text-emerald-400",
            "prose-blockquote:border-emerald-400 prose-blockquote:text-sky-700",
            "prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:text-emerald-800 dark:prose-code:text-emerald-300",
            "prose-pre:bg-slate-100 dark:prose-pre:bg-slate-800",
          ].join(" ")}
          style={{ WebkitUserSelect: "text", userSelect: "text" }}
        />
      </div>
    </ErrorBoundary>
  );
}