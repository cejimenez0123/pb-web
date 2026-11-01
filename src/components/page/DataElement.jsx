

import { useState } from "react";
import { useIonRouter } from "@ionic/react";
import { useSelector } from "react-redux";

import LinkPreview from "../LinkPreview";
import { PageType } from "../../core/constants";
import Enviroment from "../../core/Enviroment";
import Paths from "../../core/paths";
import "../../styles/Editor.css";

import AnnotatedText from "./Annotation/AnnotatedText.jsx";
import styles from "../../styles/style";

const EMPTY_COMMENTS = [];

// ─── Selection toolbar ────────────────────────────────────────────────────────

function SelectionToolbar({ position, onAnnotate, onClose }) {
  return (
    <div
      role="toolbar"
      aria-label="Text selection actions"
      className={styles.annotation.toolbar}
      style={{ top: position.top, left: position.left }}
      onPointerDown={(e) => e.preventDefault()}
    >
      <button
        type="button"
        className={styles.annotation.toolbarAction}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAnnotate();
        }}
      >
        <svg
          className="h-3.5 w-3.5 shrink-0"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M2 2h8l4 4v8H2V2zM10 2v4h4M5 9h6M5 11h4" />
        </svg>
        Comment
      </button>

      <button
        type="button"
        aria-label="Close selection toolbar"
        className={styles.annotation.toolbarClose}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      >
        <svg
          className="h-3 w-3"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M1 1l10 10M11 1L1 11" />
        </svg>
      </button>
    </div>
  );
}

// ─── Picture element ─────────────────────────────────────────────────────────

function PictureElement({ page, image, onOpen }) {
  const [imgError, setImgError] = useState(false);
  const [src, setSrc] = useState(image);

  if (imgError || !src) {
    return (
      <div className="flex h-48 w-full flex-col items-center justify-center gap-2 text-plumb-muted dark:text-plumb-darkMuted">
        <svg
          className="h-10 w-10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 15l5-5 4 4 3-3 4 4" />
          <circle cx="8.5" cy="8.5" r="1.5" />
        </svg>
        <span className="text-xs">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      id="page-data-pic"
      onClick={onOpen}
      alt={page.title || "Story image"}
      src={src}
      className="h-full w-full object-contain"
      onError={() => {
        const raw = page?.data;

        if (raw && !src.includes("imageProxy")) {
          setSrc(Enviroment.imageProxy(raw));
        } else {
          setImgError(true);
        }
      }}
    />
  );
}

// ─── DataElement ─────────────────────────────────────────────────────────────

export default function DataElement({
  page,
  isGrid,
  shortenTo = null,
  book = null,
  html = null,
  onAnnotationComment,
}) {
  const router = useIonRouter();

  const commentsRaw = useSelector(
    (s) => s.comments.byStory?.[page?.id]
  );

  const comments = commentsRaw ?? EMPTY_COMMENTS;
  const hasAnnotations = comments.some((c) => c.anchorText?.trim());

  const [showAnnotations, setShowAnnotations] = useState(true);

  if (!page) return null;

  const image =
    page.type === PageType.picture
      ? resolveImageSrc(page.data)
      : null;

  const isStoryRoute = router.routeInfo?.pathname?.includes("story");

  const openPicture = () => {
    if (router.routeInfo?.pathname !== Paths.page.createRoute(page.id)) {
      router.push(Paths.page.createRoute(page.id));
    }
  };

  switch (page.type) {
    case PageType.text:
      return (
        <>
          {hasAnnotations && isStoryRoute && (
            <div className="flex justify-end px-2 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAnnotations((value) => !value);
                }}
                aria-pressed={showAnnotations}
                className={[
                  styles.annotation.toggle,
                  showAnnotations
                    ? styles.annotation.toggleActive
                    : styles.annotation.toggleInactive,
                ].join(" ")}
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3.75L6 21V4.75Z" />
                </svg>

                {showAnnotations ? "Hide highlights" : "Show highlights"}
              </button>
            </div>
          )}
<div className="mt-2">
          <AnnotatedText
            html={html}
            page={page}
            shortenTo={shortenTo}
            onAnnotationComment={onAnnotationComment}
            showAnnotations={showAnnotations}
          />
          </div>
        </>
        
      );

    case PageType.picture:
      return (
        <PictureElement
          page={page}
          image={image}
          onOpen={openPicture}
        />
      );

    case PageType.link:
      return <LinkPreview isGrid={isGrid} url={page.data} />;

    default:
      return null;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const resolveImageSrc = (data) => {
  if (!data) return null;

  const isFirebaseUrl = data.includes(
    "firebasestorage.googleapis.com"
  );

  return isFirebaseUrl
    ? Enviroment.imageProxy(data)
    : data;
};