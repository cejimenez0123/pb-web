import { IonImg, useIonRouter } from "@ionic/react";
import LinkPreview from "../LinkPreview";
import Paths from "../../core/paths";
import isValidUrl from "../../core/isValidUrl";
import Enviroment from "../../core/Enviroment";
import { useContext, useEffect, useState } from "react";
import Context from "../../context";
import { PageType } from "../../core/constants";


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

  if (!page) return <IonImg src={loadingGif} className="w-full h-48 rounded-lg" />;

  const handleClick = () => {
    const target = Paths.page.createRoute(page.id);
    if (router.routeInfo.pathname !== target) router.push(target, "forward");
  };

  const renderContent = () => {
    switch (page.type) {
      case PageType.text:
        return (
          <div
            className="text-gray-800 text-sm line-clamp-5 break-words"
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
          <div className="skeleton w-full h-48 rounded-lg" />
        );

      case PageType.link:
        return <LinkPreview url={page.data} isGrid={isGrid} />;

      default:
        return (
          <div className="skeleton w-full h-48 rounded-lg flex items-center justify-center">
            <IonImg src={loadingGif} />
          </div>
        );
    }
  };

  return (
    <div
      className="bg-softBlue shadow-md mx-4 rounded-xl p-4 flex flex-col cursor-pointer hover:shadow-xl transition-shadow duration-200 min-w-[18rem] max-w-[22rem]"
      onClick={handleClick}
    >
      <h2 className="text-lg font-semibold text-emerald-800 mb-2 truncate">
        {page.title || "Untitled"}
      </h2>

      <div className="flex-1 mb-2 overflow-hidden">{renderContent()}</div>

      {page.description && (
        <p className="text-sm text-gray-600 line-clamp-3 break-words">
          {page.description}
        </p>
      )}
    </div>
  );
}

export default StoryItem;