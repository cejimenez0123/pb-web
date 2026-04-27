
// import React, { useEffect, useRef, useCallback, useState } from "react";
// import { useSelector } from "react-redux";
// import { ErrorBoundary } from "@sentry/react";
// import alignLeft from "../../images/editor/align-left-svgrepo-com.svg"
// import alignCenter from "../../images/editor/align-center-svgrepo-com.svg"
// import alignRight from "../../images/editor/align-right-svgrepo-com.svg"
// import numberedList from "../../images/editor/ordered-list-svgrepo-com.svg"
// import unorderedList from "../../images/editor/unordered-list-svgrepo-com.svg"
// import blockquote from "../../images/editor/block-quote-svgrepo-com.svg"
// import undo from "../../images/editor/undo-left-svgrepo-com.svg"
// import redo from "../../images/editor/undo-right-svgrepo-com.svg"
// import codeBlock from "../../images/editor/code-block-svgrepo-com.svg"
// import clearFormat from "../../images/editor/clear-format-svgrepo-com.svg"
// import imageIcon from "../../images/editor/insert-image-svgrepo-com.svg"
// import insetLink from "../../images/editor/insert-link-svgrepo-com.svg"
// // ─── Toolbar config ────────────────────────────────────────────────────────
// const FONTS = ["Default", "Georgia", "Courier New", "Arial", "Trebuchet MS"];
// const SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "32px"];

// function ToolbarButton({ title, icon, action, active, disabled }) {
//   return (
//     <div
//       type="button"
//       title={title}
//       disabled={disabled}
//       onMouseDown={(e) => {
//         e.preventDefault();
//         action();
//       }}
//       className={[
//         "flex items-center justify-center min-w-8 min-h-8 rounded-lg text-sm transition-all duration-150",
//         "hover:bg-emerald-100 dark:hover:bg-emerald-800/40",
//         active
//           ? "bg-emerald-200 text-emerald-900 dark:bg-base-surfaceDark dark:text-cream"
//           : "text-slate-600 dark:text-slate-300",
//         disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer",
//       ].join(" ")}
//     >
//       {icon}
//     </div>
//   );
// }

// function ToolbarSeparator() {
//   return (
//     <span className="w-px h-6 bg-emerald-200 dark:bg-emerald-700 mx-1 self-center" />
//   );
// }

// function ToolbarSelect({ value, options, onChange, title, className = "" }) {
//   return (
//     <select
//       title={title}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       onMouseDown={(e) => e.stopPropagation()}
//       className={[
//         "text-xs px-1 py-1 rounded-lg border border-emerald-200 dark:border-emerald-700",
//         "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200",
//         "focus:outline-none focus:ring-2 focus:ring-emerald-400",
//         "cursor-pointer",
//         className,
//       ].join(" ")}
//     >
//       {options.map((opt) => (
//         <option className={`dark:text-cream`}key={opt.value ?? opt} value={opt.value ?? opt}>
//           {opt.label ?? opt}
//         </option>
//       ))}
//     </select>
//   );
// }

// // ─── Main RichEditor ────────────────────────────────────────────────────────
// export default function RichEditor({ handleChange }) {
//   const htmlContent = useSelector((state) => state.pages.editorHtmlContent);
//   const editorRef = useRef(null);
//   const isInternalChange = useRef(false);
//   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//   const styleIcon = prefersDark?{filter:"var(--icon-filter)" }:{}
//   // Track format state
//   const [formats, setFormats] = useState({
//     bold: false,
//     italic: false,
//     underline: false,
//     strikethrough: false,
//     ordered: false,
//     unordered: false,
//     blockquote: false,
//     code: false,
//     align: "left",
//     font: "Default",
//     size: "16px",
//     link: false,
//   });

//   // ── Sync external content into editor ──
//  const hasInitialized = useRef(false);

// useEffect(() => {
//   const el = editorRef.current;
//   if (!el || hasInitialized.current) return; // ← only run once
//   const incoming = htmlContent || "";
//   el.innerHTML = incoming;
//   hasInitialized.current = true;
// }, [htmlContent]);

//   // ── Emit changes upward ──
//   const emitChange = useCallback(() => {
//     if (!editorRef.current) return;
//     const html = editorRef.current.innerHTML;
//     handleChange?.(html);
//   }, [handleChange]);

//   // ── Track cursor format state ──
//   const updateFormatState = useCallback(() => {
//     setFormats({
//       bold: document.queryCommandState("bold"),
//       italic: document.queryCommandState("italic"),
//       underline: document.queryCommandState("underline"),
//       strikethrough: document.queryCommandState("strikeThrough"),
//       ordered: document.queryCommandState("insertOrderedList"),
//       unordered: document.queryCommandState("insertUnorderedList"),
//       blockquote: false, // tracked manually
//       code: false,
//       align: document.queryCommandState("justifyLeft")
//         ? "left"
//         : document.queryCommandState("justifyCenter")
//         ? "center"
//         : document.queryCommandState("justifyRight")
//         ? "right"
//         : document.queryCommandState("justifyFull")
//         ? "justify"
//         : "left",
//       font: document.queryCommandValue("fontName") || "Default",
//       size: document.queryCommandValue("fontSize") || "16px",
//     });
//   }, []);

//   // ── Exec helper ──
//   const exec = useCallback(
//     (cmd, value = null) => {
//       editorRef.current?.focus();
//       document.execCommand(cmd, false, value);
//       updateFormatState();
//       emitChange();
//     },
//     [updateFormatState, emitChange]
//   );

//   // ── Link insertion ──
//   const insertLink = useCallback(() => {
//     const url = window.prompt("Enter URL:", "https://");
//     if (url) exec("createLink", url);
//   }, [exec]);

//   // ── Image insertion ──
//   const insertImage = useCallback(() => {
//     const url = window.prompt("Image URL:", "https://");
//     if (url) exec("insertImage", url);
//   }, [exec]);

//   // ── Font ──
//   const applyFont = useCallback(
//     (font) => {
//       if (font === "Default") {
//         exec("fontName", "inherit");
//       } else {
//         exec("fontName", font);
//       }
//     },
//     [exec]
//   );

//   // ── Size ──

// const applySize = useCallback((size) => {
//   editorRef.current?.focus();
//   const sel = window.getSelection();
//   if (!sel || sel.isCollapsed) return;
//   try {
//     const range = sel.getRangeAt(0);
//     const span = document.createElement("span");
//     span.style.fontSize = size;
//     range.surroundContents(span);
//     emitChange();
//   } catch (_) {
//     // Selection spans multiple elements — use execCommand fallback
//     document.execCommand("fontSize", false, "3");
//     emitChange();
//   }
// }, [emitChange]);
//   // // ── Paste: strip to plain text ──
//   const handlePaste = useCallback((e) => {
//     e.preventDefault();
//     const text = e.clipboardData.getData("text/plain");
//     document.execCommand("insertText", false, text);
//   }, []);

//   const fontOptions = FONTS.map((f) => ({ value: f, label: f }));
//   const sizeOptions = SIZES.map((s) => ({ value: s, label: s }));

//   return (
//     <ErrorBoundary>
//       <div className="rich-editor flex flex-col rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-base-bgDark shadow-sm">
//         {/* ── Toolbar ── */}
//         <div
//           className={[
//             "flex flex-wrap items-center gap-0.5 px-3 py-2",
//             "bg-white dark:bg-slate-800",
//             "border-b border-emerald-200 dark:border-emerald-700",
//             "overflow-x-auto",
//           ].join(" ")}
//           onMouseDown={(e) => e.preventDefault()}
//         >
//           {/* Font */}
//           <ToolbarSelect
//             title="Font Family"
//             value={formats.font}
//             options={fontOptions}
//             onChange={applyFont}
//             className="w-28 hidden sm:block"
//           />
//           {/* Size */}
//           <ToolbarSelect
//             title="Font Size"
//             value={formats.size}
//             options={sizeOptions}
//             onChange={applySize}
//             className="w-20 hidden sm:block"
//           />
//           <ToolbarSeparator />

//           {/* Bold */}
//           <ToolbarButton
//             title="Bold (⌘B)"
//             active={formats.bold}
//             action={() => exec("bold")}
//             icon={<span className="font-bold text-sm">B</span>}
//           />
//           {/* Italic */}
//           <ToolbarButton
//             title="Italic (⌘I)"
//             active={formats.italic}
//             action={() => exec("italic")}
//             icon={<span className="italic text-sm font-serif">I</span>}
//           />
//           {/* Underline */}
//           <ToolbarButton
//             title="Underline (⌘U)"
//             active={formats.underline}
//             action={() => exec("underline")}
//             icon={<span className="underline  dark:text-cream  dark:text-cream text-sm">U</span>}
//           />
//           {/* Strikethrough */}
//           <ToolbarButton
//             title="Strikethrough"
//             active={formats.strikethrough}
//             action={() => exec("strikeThrough")}
//             icon={<span className="line-through dark:text-cream  dark:text-cream  text-sm">S</span>}
//           />
//           <ToolbarSeparator />

//           {/* Align Left */}
//           <ToolbarButton
//             title="Align Left"
//             active={formats.align === "left"}
//             action={() => exec("justifyLeft")}
//             icon={
//               <img  style={styleIcon} className={"max-w-4  max-h-4"}
//               src={alignLeft}/>
             
//             }
//           />
//           {/* Align Center */}
//           <ToolbarButton
//             title="Align Center"
//             active={formats.align === "center"}
//             action={() => exec("justifyCenter")}
//             icon={
//            <img  style={styleIcon} className={"max-w-4 max-h-4"}src={alignCenter}/>
             
//             }
//           />
//           {/* Align Right */}
//           <ToolbarButton
//             title="Align Right"
//             active={formats.align === "right"}
//             action={() => exec("justifyRight")}
//             icon={
//              <img  style={styleIcon} className={"max-w-4  max-h-4"}src={alignRight}/>
             
//             }
//           />
//           <ToolbarSeparator />

//           {/* Ordered List */}
//           <ToolbarButton
//             title="Numbered List"
//             active={formats.ordered}
//             action={() => exec("insertOrderedList")}
//             icon={
//          <img  style={styleIcon} className="max-w-4  max-h-4" src={numberedList}/>
//             }
//           />
//           {/* Unordered List */}
//           <ToolbarButton
//             title="Bullet List"
//             active={formats.unordered}
//             action={() => exec("insertUnorderedList")}
//             icon={
//           <img src={unorderedList}
//            style={styleIcon}
//           className="max-w-4  max-h-4" />
//             }
//           />
//           <ToolbarSeparator />

//           {/* Blockquote */}
//           <ToolbarButton
//             title="Blockquote"
//             active={formats.blockquote}
//             action={() => exec("formatBlock", "blockquote")}
//             icon={
//               <img 
//                style={styleIcon}
//               className={"max-w-4 max-h-4"}src={blockquote}/>
//             }
//           />
//           {/* Code Block */}
//           <ToolbarButton
//             title="Code Block"
//             action={() => exec("formatBlock", "pre")}
//             icon={
//               <img 
//                style={styleIcon}
//               className={"max-w-4 max-h-4"}src={codeBlock}/>
//             }
//           />
//           <ToolbarSeparator />

//           {/* Link */}
//           <ToolbarButton
//             title="Insert Link"
//             action={insertLink}
//             icon={
//                <img className={"max-w-4  max-h-4"}
//                 style={styleIcon}
//                src={insetLink}/>
//             }
//           />
//           {/* Image */}
//           <ToolbarButton
//             title="Insert Image"
//             action={insertImage}
//             icon={
//            <img className={"max-w-4 max-h-4"}
//             style={styleIcon}
//            src={imageIcon}/>
//             }
//           />
//           <ToolbarSeparator />

//           {/* Undo */}
//           <ToolbarButton
//             title="Undo (⌘Z)"
//             action={() => exec("undo")}
//             icon={
//             <img className={"max-w-4  max-h-4"}
//              style={styleIcon}
//              src={undo}/>
//             }
//           />
//           {/* Redo */}
//           <ToolbarButton
//             title="Redo (⌘⇧Z)"
//             action={() => exec("redo")}
//             icon={
//              <img  style={styleIcon}
//              className={"max-w-4 max-h-4"}src={redo}/>
//             }
//           />
//           {/* Clear */}
//           <ToolbarButton
//             title="Clear Formatting"
//             action={() => exec("removeFormat")}
//             icon={
//              <img  style={styleIcon} className={"max-w-4  max-h-4"}src={clearFormat}/>
//             }
//           />
//         </div>

//         {/* ── Editable area ── */}
//         <div
//           ref={editorRef}
//           contentEditable
//           suppressContentEditableWarning
//           spellCheck
//           onInput={emitChange}
//           onKeyUp={updateFormatState}
//           onMouseUp={updateFormatState}
//           onPaste={handlePaste}
//           className={[
//             "rich-editor__body",
//             "min-h-[220px] dark:text-cream px-5 py-4",
//             "text-sky-900 dark:text-cream",
//             "bg-emerald-50 dark:text-cream dark:bg-base-surfaceDark",
//             "focus:outline-none",
//             "prose prose-sm sm:prose-base max-w-none",
//             // Prose overrides for our palette
//             "prose-headings:text-sky-800 dark:prose-headings:text-sky-200",
//             "prose-a:text-emerald-700 dark:prose-a:text-emerald-400",
//             "prose-blockquote:border-emerald-400 prose-blockquote:text-sky-700",
//             "prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:text-emerald-800 dark:prose-code:text-emerald-300",
//             "prose-pre:bg-slate-100 dark:prose-pre:bg-slate-800",
//           ].join(" ")}
//           style={{ WebkitUserSelect: "text", userSelect: "text" }}
//         />
//       </div>
//     </ErrorBoundary>
//   );
// }
import React, { useEffect, useRef, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { ErrorBoundary } from "@sentry/react";
import alignLeft from "../../images/editor/align-left-svgrepo-com.svg"
import alignCenter from "../../images/editor/align-center-svgrepo-com.svg"
import alignRight from "../../images/editor/align-right-svgrepo-com.svg"
import numberedList from "../../images/editor/ordered-list-svgrepo-com.svg"
import unorderedList from "../../images/editor/unordered-list-svgrepo-com.svg"
import blockquoteIcon from "../../images/editor/block-quote-svgrepo-com.svg"
import undo from "../../images/editor/undo-left-svgrepo-com.svg"
import redo from "../../images/editor/undo-right-svgrepo-com.svg"
import codeBlock from "../../images/editor/code-block-svgrepo-com.svg"
import clearFormat from "../../images/editor/clear-format-svgrepo-com.svg"
import imageIcon from "../../images/editor/insert-image-svgrepo-com.svg"
import insetLink from "../../images/editor/insert-link-svgrepo-com.svg"
import Enviroment from "../../core/Enviroment";

const FONTS = ["Default", "Georgia", "Courier New", "Arial", "Trebuchet MS"];
const SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "32px"];

const iconStyle = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? { filter: "invert(100%)"}
    : {};

// ─── Icon ──────────────────────────────────────────────────────────────────
function Icon({ src }) {
  return <img src={src} className="max-w-4 max-h-4 block" style={iconStyle()} />;
}

// ─── ToolbarButton ─────────────────────────────────────────────────────────
// function ToolbarButton({ title, icon, action, active, disabled }) {
//   return (
//     <div
//       title={title}
//       onMouseDown={(e) => { e.preventDefault(); if (!disabled) action(); }}
//       className={[
//         "flex items-center justify-center min-w-8 min-h-8 rounded-lg text-sm transition-all duration-150",
//         active ? "bg-base-soft text-cream" : "text-text-primary hover:bg-base-surface",
//         disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer",
//       ].join(" ")}
//     >
//       {icon}
//     </div>
//   );
// }
function ToolbarButton({ title, icon, action, active, disabled }) {
  return (
    <div
      title={title}
      onMouseDown={(e) => { e.preventDefault(); if (!disabled) action(); }}
      className={[
        "flex items-center justify-center min-w-8 min-h-8 rounded-lg text-sm transition-all duration-150",
        active
          ? "bg-base-soft text-cream"
          : "text-text-primary dark:text-text-dark hover:bg-base-surface dark:hover:bg-base-surfaceDark",
        disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {icon}
    </div>
  );
}

function ToolbarSeparator() {
  return <span className="w-px h-6 bg-border-default mx-1 self-center" />;
}

function ToolbarSelect({ value, options, onChange, title, className = "" }) {
  return (
    <select
      title={title}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onMouseDown={(e) => e.stopPropagation()}
      className={[
        "text-xs px-1 py-1 rounded-lg border border-border-default",
        "bg-base-surface text-text-primary",
        "focus:outline-none focus:ring-2 focus:ring-soft cursor-pointer",
        className,
      ].join(" ")}
    >
      {options.map((opt) => (
        <option key={opt.value ?? opt} value={opt.value ?? opt}>
          {opt.label ?? opt}
        </option>
      ))}
    </select>
  );
}
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
// ─── Wrap selection in a block element ────────────────────────────────────
// Fixes: execCommand("formatBlock") silently fails on plain contentEditable divs
function wrapSelectionInBlock(tag, styles = {}) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0);

  // Walk up to find if we're already inside this block tag — if so, unwrap
  let ancestor = range.commonAncestorContainer;
  if (ancestor.nodeType === Node.TEXT_NODE) ancestor = ancestor.parentNode;
  while (ancestor && ancestor.contentEditable !== "true") {
    if (ancestor.tagName === tag.toUpperCase()) {
      // Unwrap: move children out then remove the wrapper
      const parent = ancestor.parentNode;
      while (ancestor.firstChild) parent.insertBefore(ancestor.firstChild, ancestor);
      parent.removeChild(ancestor);
      return;
    }
    ancestor = ancestor.parentNode;
  }

  // Wrap selection in the block element
  const fragment = range.extractContents();
  const block = document.createElement(tag);
  Object.assign(block.style, styles);
  block.appendChild(fragment);
  range.insertNode(block);

  // Restore selection inside new block
  const newRange = document.createRange();
  newRange.selectNodeContents(block);
  sel.removeAllRanges();
  sel.addRange(newRange);
}

// ─── Wrap selection in inline span ────────────────────────────────────────
// Fixes: surroundContents throws when selection crosses element boundaries
function wrapSelectionInline(styles = {}) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return false;
  try {
    const range = sel.getRangeAt(0);
    const fragment = range.extractContents();
    const span = document.createElement("span");
    Object.assign(span.style, styles);
    span.appendChild(fragment);
    range.insertNode(span);
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    sel.removeAllRanges();
    sel.addRange(newRange);
    return true;
  } catch (_) {
    return false;
  }
}

// ─── Main RichEditor ────────────────────────────────────────────────────────
export default function RichEditor({ handleChange }) {
  const htmlContent = useSelector((state) => state.pages.editorHtmlContent);
  const editorRef = useRef(null);
  const hasInitialized = useRef(false);

  const [formats, setFormats] = useState({
    bold: false, italic: false, underline: false, strikethrough: false,
    ordered: false, unordered: false, blockquote: false, code: false,
    align: "none", font: "Default", size: "16px",
  });

  useEffect(() => {
    const el = editorRef.current;
    if (!el || hasInitialized.current) return;
    el.innerHTML = htmlContent || "";
    hasInitialized.current = true;
  }, [htmlContent]);

  const emitChange = useCallback(() => {
    handleChange?.(editorRef.current?.innerHTML ?? "");
  }, [handleChange]);

  // ── Detect if cursor is inside a given tag ──────────────────────────────
  const isInsideTag = useCallback((tag) => {
    const sel = window.getSelection();
    let node = sel?.anchorNode;
    while (node && node !== editorRef.current) {
      if (node.tagName === tag) return true;
      node = node.parentNode;
    }
    return false;
  }, []);

  const updateFormatState = useCallback(() => {
    const isCenter = document.queryCommandState("justifyCenter");
    const isRight  = document.queryCommandState("justifyRight");
    const isFull   = document.queryCommandState("justifyFull");
    const isLeft   = document.queryCommandState("justifyLeft");

    setFormats({
      bold:          document.queryCommandState("bold"),
      italic:        document.queryCommandState("italic"),
      underline:     document.queryCommandState("underline"),
      strikethrough: document.queryCommandState("strikeThrough"),
      ordered:       document.queryCommandState("insertOrderedList"),
      unordered:     document.queryCommandState("insertUnorderedList"),
      blockquote:    isInsideTag("BLOCKQUOTE"),
      code:          isInsideTag("PRE") || isInsideTag("CODE"),
      align: isCenter ? "center" : isRight ? "right" : isFull ? "justify" : isLeft ? "left" : "none",
      font:  document.queryCommandValue("fontName") || "Default",
      size:  document.queryCommandValue("fontSize") || "16px",
    });
  }, [isInsideTag]);

  const exec = useCallback((cmd, value = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    updateFormatState();
    emitChange();
  }, [updateFormatState, emitChange]);

  // ── Blockquote: manual DOM wrap/unwrap ───────────────────────────────────
  const toggleBlockquote = useCallback(() => {
    editorRef.current?.focus();
    wrapSelectionInBlock("blockquote", {
      borderLeft: "3px solid #40906f",
      paddingLeft: "1rem",
      margin: "0.5rem 0",
      color: "var(--text-sub)",
      fontStyle: "italic",
    });
    updateFormatState();
    emitChange();
  }, [updateFormatState, emitChange]);

  // ── Code block: manual DOM wrap/unwrap ──────────────────────────────────
  const toggleCodeBlock = useCallback(() => {
    editorRef.current?.focus();
    wrapSelectionInBlock("pre", {
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "6px",
      padding: "0.75rem 1rem",
      fontFamily: "Courier New, monospace",
      fontSize: "0.875rem",
      overflowX: "auto",
      whiteSpace: "pre",
    });
    updateFormatState();
    emitChange();
  }, [updateFormatState, emitChange]);

  // ── Font size: inline span wrap ─────────────────────────────────────────
  const applySize = useCallback((size) => {
    editorRef.current?.focus();
    if (!wrapSelectionInline({ fontSize: size })) {
      // Nothing selected — just set for next typed character
      document.execCommand("fontSize", false, "3");
    }
    emitChange();
  }, [emitChange]);

  const applyFont = useCallback((font) => {
    exec("fontName", font === "Default" ? "inherit" : font);
  }, [exec]);

  const insertLink = useCallback(() => {
    const url = window.prompt("Enter URL:", "https://");
    if (url) exec("createLink", url);
  }, [exec]);

  const insertImage = useCallback(() => {
    const url = window.prompt("Image URL:", "https://");
    if (url) exec("insertImage", url);
  }, [exec]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
  }, []);

  const fontOptions = FONTS.map((f) => ({ value: f, label: f }));
  const sizeOptions = SIZES.map((s) => ({ value: s, label: s }));

  return (
    <ErrorBoundary>
      <div
        className="rich-editor flex flex-col rounded-2xl overflow-hidden shadow-sm"
        style={{ border: "1px solid var(--border)", background: "var(--bg-surface)" }}
      >
        {/* ── Toolbar ── */}
        <div
          className="flex flex-wrap items-center gap-0.5 px-3 py-2 overflow-x-auto"
          style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <ToolbarSelect title="Font Family" value={formats.font} options={fontOptions} onChange={applyFont} className="w-28 hidden sm:block" />
          <ToolbarSelect title="Font Size"   value={formats.size} options={sizeOptions} onChange={applySize} className="w-20 hidden sm:block" />
          <ToolbarSeparator />

          <ToolbarButton title="Bold (⌘B)"      active={formats.bold}          action={() => exec("bold")}          icon={<span className="font-bold text-sm"        style={{ color: "var(--text-primary)" }}>B</span>} />
          <ToolbarButton title="Italic (⌘I)"    active={formats.italic}        action={() => exec("italic")}        icon={<span className="italic font-serif text-sm" style={{ color: "var(--text-primary)" }}>I</span>} />
          <ToolbarButton title="Underline (⌘U)" active={formats.underline}     action={() => exec("underline")}     icon={<span className="underline text-sm"         style={{ color: "var(--text-primary)" }}>U</span>} />
          <ToolbarButton title="Strikethrough"  active={formats.strikethrough}  action={() => exec("strikeThrough")} icon={<span className="line-through text-sm"      style={{ color: "var(--text-primary)" }}>S</span>} />
          <ToolbarSeparator />

          <ToolbarButton title="Align Left"   active={formats.align === "left"}   action={() => exec("justifyLeft")}   icon={<Icon src={alignLeft} />} />
          <ToolbarButton title="Align Center" active={formats.align === "center"} action={() => exec("justifyCenter")} icon={<Icon src={alignCenter} />} />
          <ToolbarButton title="Align Right"  active={formats.align === "right"}  action={() => exec("justifyRight")}  icon={<Icon src={alignRight} />} />
          <ToolbarSeparator />

          <ToolbarButton title="Numbered List" active={formats.ordered}   action={() => exec("insertOrderedList")}   icon={<Icon src={numberedList} />} />
          <ToolbarButton title="Bullet List"   active={formats.unordered} action={() => exec("insertUnorderedList")} icon={<Icon src={unorderedList} />} />
          <ToolbarSeparator />

          <ToolbarButton title="Blockquote" active={formats.blockquote} action={toggleBlockquote} icon={<Icon src={blockquoteIcon} />} />
          <ToolbarButton title="Code Block" active={formats.code}       action={toggleCodeBlock}  icon={<Icon src={codeBlock} />} />
          <ToolbarSeparator />

          <ToolbarButton title="Insert Link"  action={insertLink}  icon={<Icon src={insetLink} />} />
          <ToolbarButton title="Insert Image" action={insertImage} icon={<Icon src={imageIcon} />} />
          <ToolbarSeparator />

          <ToolbarButton title="Undo (⌘Z)"       action={() => exec("undo")}         icon={<Icon src={undo} />} />
          <ToolbarButton title="Redo (⌘⇧Z)"      action={() => exec("redo")}         icon={<Icon src={redo} />} />
          <ToolbarButton title="Clear Formatting" action={() => exec("removeFormat")} icon={<Icon src={clearFormat} />} />
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
          className="rich-editor__body min-h-[220px] px-5 py-4 focus:outline-none prose prose-sm sm:prose-base max-w-none"
          style={{
            color: prefersDark?Enviroment.palette.cream:Enviroment.palette.soft,
            background:prefersDark?Enviroment.palette.base.surfaceDark:Enviroment.palette.base.background,
            WebkitUserSelect: "text",
            userSelect: "text",
          }}
        />
      </div>
    </ErrorBoundary>
  );
}