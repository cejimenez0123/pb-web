
import { useMemo } from "react";
import truncate from "html-truncate";
import styles from "../../styles/style";

const DEFAULT_PREVIEW_LENGTH = 300;

function StoryPreview({ html, page, shortenTo = DEFAULT_PREVIEW_LENGTH }) {
  const previewHtml = useMemo(() => {
    const source = html ?? page?.data ?? "";

    if (typeof source !== "string") return "";

    const limit = Number(shortenTo);

    if (!Number.isFinite(limit) || limit <= 0) {
      return source;
    }

    // html-truncate preserves HTML structure while limiting text length.
    return truncate(source, Math.floor(limit), {
      ellipsis: "…",
    });
  }, [html, page?.data, shortenTo]);

  return (
    <div className={styles.page.contentContainer}>
      <div
        className={styles.page.content}
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
    </div>
  );
}

export default StoryPreview;
