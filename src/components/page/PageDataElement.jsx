
// import { useEffect, useState } from "react";
// import { PageType } from "../../core/constants";
// import LinkPreview from "../LinkPreview";
// import isValidUrl from "../../core/isValidUrl";
// import Paths from "../../core/paths";
// import { useIonRouter } from '@ionic/react';
// import Enviroment from "../../core/Enviroment";
// import truncate from "html-truncate";

// export default function PageDataElement({
//   page,
//   isGrid,
//   compact,
//   truncateNumber = 350,
// }) {
//   const [image, setImage] = useState(isValidUrl(page?.data) ? page.data : null);
//   const router = useIonRouter();
//   const location = router.routeInfo.pathname;

//   useEffect(() => {
//     if (page?.type === PageType.picture) {
//       setImage(
//         isValidUrl(page.data)
//           ? page.data
//           : Enviroment.imageProxy(page.data)
//       );
//     }
//   }, [page]);

//   if (!page) return null;

//   switch (page.type) {

//     case PageType.text: {
//       const truncated = truncate(page.data || "", truncateNumber, {});
//       if (!truncated) return null;
//       return (
//         <div className="w-full h-[100%] px-4 py-2 overflow-hidden">
//           <div
//             className="text-[14px] editor-content leading-6 text-soft dark:text-cream overflow-hidden"
//             dangerouslySetInnerHTML={{ __html: truncated }}
//           />
//         </div>
//       );
//     }

//     case PageType.picture: {
//       if (!image) return null;
//       return (
//         <div className="w-full h-[100%]">
//           <img
//             className="w-full h-full object-cover transition active:scale-[0.98]"
//             style={{ WebkitTapHighlightColor: "transparent" }}
//             alt={page.title}
//             src={image}
//             onClick={() => {
//               if (location !== Paths.page.createRoute(page.id)) {
//                 router.push(Paths.page.createRoute(page.id));
//               }
//             }}
//           />
//         </div>
//       );
//     }

//     case PageType.link: {
//       if (!page.data) return null;
//       return (
//         <div className="w-full h-[100%] overflow-hidden">
//           <LinkPreview isGrid={isGrid} url={page.data} compact={compact} />
//         </div>
//       );
//     }

//     default:
//       return null;
//   }
// }
import { useEffect, useState } from "react";
import { PageType } from "../../core/constants";
import LinkPreview from "../LinkPreview";
import isValidUrl from "../../core/isValidUrl";
import Paths from "../../core/paths";
import { useIonRouter } from "@ionic/react";
import Enviroment from "../../core/Enviroment";
import truncate from "html-truncate";

export default function PageDataElement({ page, isGrid, compact, truncateNumber = 350 }) {
  const [image, setImage] = useState(isValidUrl(page?.data) ? page.data : null);
  const router   = useIonRouter();
  const location = router.routeInfo.pathname;

  useEffect(() => {
    if (page?.type === PageType.picture) {
      setImage(isValidUrl(page.data) ? page.data : Enviroment.imageProxy(page.data));
    }
  }, [page]);

  if (!page) return null;

  switch (page.type) {
    case PageType.text: {
      const truncated = truncate(page.data || "", truncateNumber, {});
      if (!truncated) return null;
      return (
        <div className="w-full h-[100%] px-4 py-2 overflow-hidden">
          <div
            className="text-[14px] editor-content leading-6 text-soft dark:text-cream overflow-hidden"
            dangerouslySetInnerHTML={{ __html: truncated }}
          />
        </div>
      );
    }

    case PageType.picture: {
      if (!image) return null;
      return (
        <div className="w-full h-[100%]">
          <img
            className="w-full h-full object-cover transition active:scale-[0.98]"
            style={{ WebkitTapHighlightColor: "transparent" }}
            alt={page.title}
            src={image}
            onClick={() => {
              if (location !== Paths.page.createRoute(page.id)) {
                router.push(Paths.page.createRoute(page.id));
              }
            }}
          />
        </div>
      );
    }

    case PageType.link: {
      if (!page.data) return null;
      return (
        <div className="w-full h-[100%] overflow-hidden">
          <LinkPreview isGrid={isGrid} url={page.data} compact={compact} />
        </div>
      );
    }

    default:
      return null;
  }
}