
import React, { useEffect, useRef, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
const alignLeft =(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M3,21V19H21v2H3Zm0-4V15H15v2H3Zm0-4V11H21v2H3ZM3,9V7H15V9H3ZM3,5V3H21V5H3Z"/></svg>)
const alignCenter =(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M3,21V19H21v2H3Zm4-4V15H17v2H7ZM3,13V11H21v2H3ZM7,9V7H17V9H7ZM3,5V3H21V5H3Z"/></svg>)
const alignRight =(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M3,5V3H21V5H3ZM9,9V7H21V9H9ZM3,13V11H21v2H3Zm6,4V15H21v2H9ZM3,21V19H21v2H3Z"/></svg>)
const numberedList =(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M3,22V20.5H5.5V19.75H4v-1.5H5.5V17.5H3V16H6q0.43,0 0.71,0.29T7,17v1q0,0.43-0.29,0.71T6,19q0.43,0 0.71,0.29T7,20v1q0,0.43-0.29,0.71T6,22H3Zm0-7V12.25q0-0.43 0.29-0.71T4,11.25H5.5V10.5H3V9H6Q6.43,9 6.71,9.29T7,10v1.75q0,0.42-0.29,0.71T6,12.75H4.5V13.5H7V15H3ZM4.5,8V3.5H3V2H6V8H4.5ZM9,19V17H21v2H9Zm0-6V11H21v2H9ZM9,7V5H21V7H9Z"/></svg>)
const unorderedList=(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M9,19V17H21v2H9Zm0-6V11H21v2H9ZM9,7V5H21V7H9ZM5,20q-0.83,0-1.41-0.59T3,18t0.59-1.41T5,16t1.41,0.59Q7,17.18 7,18T6.41,19.41T5,20Zm0-6q-0.83,0-1.41-0.59T3,12t0.59-1.41T5,10t1.41,0.59Q7,11.18 7,12T6.41,13.41T5,14ZM3.59,7.41Q3,6.82 3,6T3.59,4.59T5,4T6.41,4.59Q7,5.18 7,6T6.41,7.41T5,8T3.59,7.41Z"/></svg>)
const blockquoteIcon =(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M5.7,18L8,14q-1.65,0-2.82-1.18T4,10T5.18,7.18T8,6t2.83,1.18T12,10q0,0.57-0.14,1.06T11.45,12L8,18H5.7Zm9,0L17,14q-1.65,0-2.82-1.18T13,10t1.18-2.82T17,6t2.83,1.18T21,10q0,0.57-0.14,1.06T20.45,12L17,18H14.7ZM9.06,11.06Q9.5,10.63 9.5,10T9.06,8.94T8,8.5T6.94,8.94T6.5,10t0.44,1.06T8,11.5t1.06-0.44Zm9,0Q18.5,10.63 18.5,10T18.06,8.94T17,8.5T15.94,8.94T15.5,10t0.44,1.06T17,11.5t1.06-0.44ZM17,10ZM8,10Z"/></svg>)
const  undo = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M7,19V17h7.1q1.57,0 2.74-1T18,13.5T16.84,11T14.1,10H7.8l2.6,2.6L9,14L4,9L9,4l1.4,1.4L7.8,8h6.3q2.43,0 4.16,1.57T20,13.5t-1.74,3.93Q16.53,19 14.1,19H7Z"/></svg>)
const redo =(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M9.9,19q-2.42,0-4.16-1.57T4,13.5T5.74,9.57T9.9,8h6.3L13.6,5.4L15,4l5,5l-5,5l-1.4-1.4L16.2,10H9.9q-1.57,0-2.74,1T6,13.5T7.16,16T9.9,17H17v2H9.9Z"/></svg>)
// import redo from "../../images/editor/undo-right-svgrepo-com.svg"
// import codeBlock from "../../images/editor/code-block-svgrepo-com.svg"
const codeBlock = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M9.6,15.6L11,14.18L8.83,12L11,9.82L9.6,8.4L6,12l3.6,3.6Zm4.8,0L18,12L14.4,8.4L13,9.82L15.18,12L13,14.18l1.4,1.43ZM5,21q-0.83,0-1.41-0.59T3,19V5Q3,4.17 3.59,3.59T5,3H19q0.83,0 1.41,0.59T21,5V19q0,0.82-0.59,1.41T19,21H5Zm0-2H19V5H5V19ZM5,5V19V5Z"/></svg>)
// import clearFormat from "../../images/editor/clear-format-svgrepo-com.svg"
const clearFormat =(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M13.2,10.35L10.88,8.02L7.85,5H20V8H14.2l-1,2.35ZM19.8,22.6l-8.3-8.3L9.5,19H6.23L9.2,12L1.4,4.2L2.8,2.8L21.2,21.2l-1.4,1.4Z"/></svg>)
const imageIcon =(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M5,21q-0.83,0-1.41-0.59T3,19V5Q3,4.17 3.59,3.59T5,3H19q0.83,0 1.41,0.59T21,5V19q0,0.82-0.59,1.41T19,21H5Zm0-2H19V5H5V19Zm1-2H18l-3.75-5l-3,4L9,13L6,17ZM5,19V5V19Z"/></svg>)
const insetLink =(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M11,17H7q-2.07,0-3.54-1.46T2,12Q2,9.92 3.46,8.46T7,7h4V9H7Q5.75,9 4.88,9.88T4,12t0.88,2.13T7,15h4v2ZM8,13V11h8v2H8Zm5,4V15h4q1.25,0 2.13-0.88T20,12T19.13,9.88T17,9H13V7h4q2.07,0 3.54,1.46T22,12t-1.46,3.54T17,17H13Z"/></svg>)
import Enviroment from "../../core/Enviroment";

const FONTS = ["Default", "Georgia", "Courier New", "Arial"];
const SIZES = [ "16px", "18px", "20px", "24px", "32px","36px",];
const DEFAULT_FONT = "Trebuchet MS";
const iconStyle = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? { filter: "invert(100%)"}
    : {};

// ─── Icon ──────────────────────────────────────────────────────────────────
function Icon({ src }) {
  return src
  // <img src={src} className="max-w-4 max-h-4 block" style={iconStyle()} />;
}

function ToolbarButton({ title, icon, action, active, disabled }) {
  return (
    <div
      title={title}
      onMouseDown={(e) => { e.preventDefault(); if (!disabled) action(); }}
      className={[
        "flex items-center justify-center min-w-8 min-h-8 rounded-lg text-sm transition-all duration-150",
        active
          ? ""
          : "",
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
 
        "text-xs px-1 py-1 rounded-lg border border-1 dark:bg-transparent ",
        // "bg-plumb-surface  text-text-primary",
        // "focus:outline-none focus:ring-2 focus:ring-soft cursor-pointer",
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
      size:  document.queryCommandValue("fontSize") || "18px",
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
const savedRange = useRef(null);

useEffect(() => {
  const handler = () => {
    const sel = window.getSelection();
    if (
      sel && sel.rangeCount > 0 && !sel.isCollapsed &&
      editorRef.current?.contains(sel.anchorNode)
    ) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };
  document.addEventListener("selectionchange", handler);
  return () => document.removeEventListener("selectionchange", handler);
}, []);

const restoreSelection = useCallback(() => {
  const sel = window.getSelection();
  if (savedRange.current) {
    sel.removeAllRanges();
    sel.addRange(savedRange.current);
  }
}, []);

// useEffect(() => {
//   const handler = () => {
//     const sel = window.getSelection();
//     if (
//       sel && sel.rangeCount > 0 && !sel.isCollapsed &&
//       editorRef.current?.contains(sel.anchorNode)
//     ) {
//       savedRange.current = sel.getRangeAt(0).cloneRange();
//     }
//   };
//   document.addEventListener("selectionchange", handler);
//   return () => document.removeEventListener("selectionchange", handler);
// }, []);
// const applyFont = useCallback((font) => {
//   editorRef.current?.focus();
//   restoreSelection();
//   document.execCommand("fontName", false, font === "Default" ? "inherit" : font);
//   updateFormatState();
//   emitChange();
// }, [restoreSelection, updateFormatState, emitChange]);
const applyFont = useCallback((font) => {
  editorRef.current?.focus();
  restoreSelection();

  const fontFamily =
    font === "Default"
      ? DEFAULT_FONT
      : font;

  document.execCommand("fontName", false, fontFamily);

  updateFormatState();
  emitChange();
}, [restoreSelection, updateFormatState, emitChange]);
const applySize = useCallback((px) => {
  const el = editorRef.current;
  if (!el) return;
  el.focus();
  restoreSelection();

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;

  document.execCommand("styleWithCSS", false, false);
  document.execCommand("fontSize", false, "7");          // browser handles multi-node split
  el.querySelectorAll('font[size="7"]').forEach((font) => {
    font.removeAttribute("size");
    font.style.fontSize = px;                            // 7 → your real px
  });

  updateFormatState();
  emitChange();
}, [restoreSelection, updateFormatState, emitChange]);

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
          <ToolbarSelect title="Font Family" value={formats.font} options={fontOptions} onChange={applyFont} className="w-28" />
          <ToolbarSelect title="Font Size"   value={formats.size} options={sizeOptions} onChange={applySize} className="w-20 " />
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
          className="
  rich-editor__body
  bg-cream
  text-text-primary
  dark:bg-plumb-surface Dark
  dark:text-cream
  min-h-[220px]
  px-5
  py-4
  focus:outline-none
  prose
  prose-sm
  sm:prose-base
  max-w-none
" style={{
  fontWeight:"600",
  fontFamily: "Arial, sans-serif",
fontSize: "18px",
letterSpacing: "0.135em",
lineHeight: 1.65,
}}
        />
      </div>
    </ErrorBoundary>
  );
}