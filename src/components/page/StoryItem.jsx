import { IonImg, IonLoading, useIonRouter } from "@ionic/react";
import LinkPreview from "../LinkPreview";
import Paths from "../../core/paths";
import isValidUrl from "../../core/isValidUrl";
import Enviroment from "../../core/Enviroment";
import { useContext, useEffect, useState } from "react";
import Context from "../../context";
import { PageType } from "../../core/constants";
// ── Card Layout ─────────────────────────────
const CARD =
  "bg-softBlue dark:bg-transparent border-softBlue border-1 border shadow-sm hover:shadow-md max-h-56 rounded-xl transition-shadow duration-200 cursor-pointer";

const CARD_INNER = "p-4 flex flex-col h-full";

// ── Vertical Rhythm ─────────────────────────
const STACK_SM = "space-y-2";
const STACK_MD = "space-y-3";

// ── Content Blocks ──────────────────────────
const TITLE =
  "text-base dark:text-cream dark:text-border-soft font-semibold text-emerald-800 truncate";

const MEDIA =
  "w-full h-44 object-cover rounded-lg";

const TEXT =
  "text-sm text-gray-800   dark:text-cream  line-clamp-5 break-words";

const DESCRIPTION =
  "text-sm text-soft dark:text-border-soft line-clamp-3 break-words";

// ── Width Behavior (important for HomeEmbed)
const CARD_WIDTH =
  "w-[100%]"; // ❗ remove min/max width constraints
function StoryItem({ page, isGrid = true, html = null }) {
  const { isHorizPhone } = useContext(Context);
  const router = useIonRouter();

  const initialImage =
    page?.type === PageType.picture
      ? isValidUrl(page.data)
        ? page.data
        : Enviroment.imageProxy(page.data)
      : null;

  const [image, setImage] = useState(initialImage);

  useEffect(() => {
    if (page?.type === PageType.picture) {
      setImage(isValidUrl(page.data) ? page.data : Enviroment.imageProxy(page.data));
    }
  }, [page]);

  if (!page) return <IonLoading
  isOpen={!page}
  message={"Loading your space..."}
  spinner="crescent"
/>

  const handleClick = () => {
    const target = Paths.page.createRoute(page.id);
    if (router.routeInfo.pathname !== target) router.push(target, "forward");
  };

  const renderContent = () => {
    switch (page.type) {
      case PageType.text:
        return (
          <div
            className="text-gray-800 dark:text-cream text-sm line-clamp-5 break-words"
            dangerouslySetInnerHTML={{ __html: html ?? page.data }}
          />
        );

      case PageType.picture:
        return image ? (
          <IonImg
            className="w-full h-48 object-cover rounded-lg cursor-pointer"
            src={image}
            alt={page.title}
            onClick={handleClick}
          />
        ) : (
          <div className="skeleton w-full h-24 rounded-lg" />
        );

      case PageType.link:
        return <LinkPreview url={page.data} isGrid={isGrid} />;

      default:
        return (
          <div className="skeleton w-full h-24 rounded-lg flex items-center justify-center">
         <IonLoading
  isOpen={loading}
  message={"Loading your space..."}
  spinner="crescent"
/>
          </div>
        );
    }
  };


//   );
return (
  // <div className="px-4 ">
  <div className={`${CARD} ${CARD_WIDTH}`} onClick={handleClick}>
    <div className={`${CARD_INNER} ${STACK_MD}`}>
      
      {/* Title */}
      <h2 className={TITLE}>
        {page.title || "Untitled"}
      </h2>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className={STACK_SM}>{renderContent()}</div>
      </div>

      {/* Description */}
      {page.description && (
        <p className={DESCRIPTION}>
          {page.description}
        </p>
      )}
    </div>
  </div>
  // </div>
);
}

export default StoryItem;