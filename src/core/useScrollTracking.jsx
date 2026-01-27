import { useEffect, useRef } from "react";
import { sendGAEvent } from "./ga4";
import { useIonRouter } from "@ionic/react";

const DEFAULT_THRESHOLDS = [25, 50, 75, 100];

const useScrollTracking = (params={
  contentType:"page",      // "story" | "calendar" | "collection"
  contentId:null,          // storyId, collectionId, etc.
  authorId:null,           // optional (stories)
  enableCompletion: false,  // ONLY true for stories
  completionEvent:null,    // e.g. "story_read_complete"
  thresholds:DEFAULT_THRESHOLDS,
}) => {
  const firedThresholds = useRef(new Set());
  const completionFired = useRef(false);
  const { routeInfo } = useIonRouter();
  let {
  contentType,      // "story" | "calendar" | "collection"
  contentId,          // storyId, collectionId, etc.
  authorId,         // optional (stories)
  enableCompletion,  // ONLY true for stories
  completionEvent, 
  thresholds  // e.g. "story_read_complete"
  } = params
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (!docHeight) return;

      const scrollPercent = Math.round(
        ((scrollTop + windowHeight) / docHeight) * 100
      );

      thresholds.forEach((threshold) => {
        if (
          scrollPercent >= threshold &&
          !firedThresholds.current.has(threshold)
        ) {
          firedThresholds.current.add(threshold);

          sendGAEvent("scroll_depth", {
            percent_scrolled: threshold,
            content_type: contentType,
            content_id: contentId,
            path: routeInfo.pathname,
          });
        }
      });

      // Completion event (opt-in only)
      if (
        enableCompletion &&
        completionEvent &&
        scrollPercent >= 100 &&
        !completionFired.current
      ) {
        completionFired.current = true;

        sendGAEvent(completionEvent, {
          content_type: contentType,
          content_id: contentId,
          author_id: authorId,
          path: routeInfo.pathname,
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    contentType,
    contentId,
    authorId,
    enableCompletion,
    completionEvent,
    thresholds,
    routeInfo.pathname,
  ]);
};

export default useScrollTracking;
