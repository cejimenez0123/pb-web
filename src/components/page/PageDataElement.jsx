
import { PageType } from "../../core/constants";
import LinkPreview from "../LinkPreview";
import PictureElement from "./PictureElement";
import truncate from "html-truncate";

export default function PageDataElement({
  page,
  isGrid,
  compact,
  truncateNumber = 350,
}) {
  if (!page) return null;

  switch (page.type) {
    case PageType.text: {
      const truncated = truncate(page.data || "", truncateNumber, {});

      if (!truncated) return null;

      return (
        <div className="w-full h-[100%] px-4 py-2 overflow-hidden">
          <div
            className="text-base editor-content leading-6 text-plumb-ink dark:text-plumb-surface overflow-hidden"
            dangerouslySetInnerHTML={{ __html: truncated }}
          />
        </div>
      );
    }

    case PageType.picture:
      return (
        <div className="w-full h-[100%]">
          <PictureElement page={page} />
        </div>
      );

    case PageType.link:
      if (!page.data) return null;

      return (
        <div className="w-full h-[100%] text-plumb-ink dark:text-plumb-surface overflow-hidden">
          <LinkPreview
            isGrid={isGrid}
            url={page.data}
            compact={compact}
          />
        </div>
      );

    default:
      return null;
  }
}
