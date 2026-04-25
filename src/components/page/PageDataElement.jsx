// import { useEffect, useState } from "react";
// import { PageType } from "../../core/constants";
// import LinkPreview from "../LinkPreview";
// import isValidUrl from "../../core/isValidUrl";
// import loadingGif from "../../images/loading.gif";
// import Paths from "../../core/paths";
// import { IonImg, useIonRouter } from '@ionic/react';
// import Enviroment from "../../core/Enviroment";
// import truncate from "html-truncate";

// export default function PageDataElement({
//   page,
//   isGrid,
//   // size = "lg",
//   compact,
//   truncateNumber = 350
// }) {
//   const [image, setImage] = useState(isValidUrl(page?.data) ? page.data : null);
//   const router = useIonRouter();
//   const location = router.routeInfo.pathname;

//   useEffect(() => {
//     if (page && page.type === PageType.picture) {
//       if (isValidUrl(page.data)) {
//         setImage(page.data);
//       } else {
//         setImage(Enviroment.imageProxy(page.data));
//       }
//     }
//   }, [page]);

//   function Element({ page }) {
//     switch (page.type) {

//       // ✍️ TEXT
//       case PageType.text: {
//         const t = page.data;
//         return (
//           <div className="w-[100%] px-4">
//             <div
//               className="text-[15px] w-[100%]  max-h-[30em] leading-7 text-soft dark:text-button-primary-text space-y-3"
//               dangerouslySetInnerHTML={{
//                 __html: truncate(t, truncateNumber, {})
//               }}
//             />
//           </div>
//         );
//       }

//       // 🖼 IMAGE
//       case PageType.picture: {
//         return image ? (
//           <div className=" w-[100%]">
//             <img
//               className="rounded-xl w-[100%] object-cover  sm:max-w-[47em] border border-[#bae6fe]/40 transition active:scale-[0.98]"
//               alt={page.title}
//               src={image}
//               onClick={() => {
//                 if (location !== Paths.page.createRoute(page.id)) {
//                   router.push(Paths.page.createRoute(page.id));
//                 }
//               }}
//             />
//           </div>
//         ) : (
//           <div className="px-4">
//             <div className="animate-pulse rounded-xl bg-[#bae6fe]/40 h-[200px] w-full" />
//           </div>
//         );
//       }

//       // 🔗 LINK
//       case PageType.link: {
//         return (
//           <div className="">
//             <div className="rounded-xl w-[100%] border border-[#bae6fe]/40 overflow-hidden">
//               <LinkPreview isGrid={isGrid}  url={page.data} />
//             </div>
//           </div>
//         );
//       }

//       // ⛔ DEFAULT
//       default:
//         return (
//           <div className="px-4">
//             <div className="animate-pulse rounded-xl bg-[#bae6fe]/40 h-[200px] w-full" />
//           </div>
//         );
//     }
//   }



//   return <Element page={page} />;
// }
import { useEffect, useState } from "react";
import { PageType } from "../../core/constants";
import LinkPreview from "../LinkPreview";
import isValidUrl from "../../core/isValidUrl";
import Paths from "../../core/paths";
import { useIonRouter } from '@ionic/react';
import Enviroment from "../../core/Enviroment";
import truncate from "html-truncate";

export default function PageDataElement({
  page,
  isGrid,
  compact,
  truncateNumber = 350,
}) {
  const [image, setImage] = useState(isValidUrl(page?.data) ? page.data : null);
  const router = useIonRouter();
  const location = router.routeInfo.pathname;

  useEffect(() => {
    if (page?.type === PageType.picture) {
      setImage(
        isValidUrl(page.data)
          ? page.data
          : Enviroment.imageProxy(page.data)
      );
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
            className="text-[14px] leading-6 text-soft dark:text-cream overflow-hidden"
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