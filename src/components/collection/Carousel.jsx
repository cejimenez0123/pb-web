// import { useContext, useEffect, useRef } from "react";
// import "../../Dashboard.css";
// import PageDataElement from "../page/PageDataElement";
// import { sendGAEvent } from "../../core/ga4";
// import Context from "../../context";
// import React from "react";
// import { register } from "swiper/element/bundle";

// // import { useEffect, useRef } from "react";

// // register();

// // export default function Carousel({ book, isGrid }) {
// //   const { isPhone, isHorizPhone } = useContext(Context);
// //   const swiperElRef = useRef(null);

// //   useEffect(() => {
// //     const swiperEl = swiperElRef.current;
// //     if (!swiperEl) return;

// //     const onProgress = (e) => {
// //       const [swiper, progress] = e.detail;
      
// //     };

// //     swiperEl.addEventListener("swiperprogress", onProgress);

// //     return () => {
// //       swiperEl.removeEventListener("swiperprogress", onProgress);
// //     };
// //   }, []);

// //   const description = (story) => {
// //     if (!story.description) return null;

// //     return (
// //       <div className="md:pt-4 p-1">
// //         {story.needsFeedback ? (
// //           <label className="text-emerald-800">Feedback Request:</label>
// //         ) : null}

// //         <h6
// //           className={`overflow-hidden ${
// //             isGrid
// //               ? isPhone
// //                 ? "max-h-20 m-1 p-1 w-grid-mobile-content text-white"
// //                 : isHorizPhone
// //                 ? "w-page-mobile-content text-white"
// //                 : "w-page-content text-emerald-700 text-white"
// //               : isHorizPhone
// //               ? "text-emerald-800"
// //               : ""
// //           }`}
// //         >
// //           {story.description}
// //         </h6>
// //       </div>
// //     );
// //   };
// //   if(!book || book &&(!book.storyIdList ||book.storyIdList.length==0)){
// //     return
// //   }
// //   return (
// //     <swiper-container
// //       ref={swiperElRef}
// //       slides-per-view="1"
// //       pagination="true"
    
// //     >
// //       {book.storyIdList?.map((stc) => {
// //         if (!stc?.story) return null;

// //         return (
// //           <swiper-slide className="w-[100%]" key={stc.id}>
// //             <div
// //               onTouchStartCapture={() => {
// //                 sendGAEvent(
// //                   "Opened Page from Book",
// //                   `Saw ${JSON.stringify({
// //                     id: stc.story.id,
// //                     title: stc.story?.title,
// //                   })} in book ${JSON.stringify({
// //                     id: book.id,
// //                     title: book?.title,
// //                   })}`,
// //                   "",
// //                   0,
// //                   false
// //                 );
// //               }}
// //               className="flex-col w-[100%] flex "
// //               id={stc.id}
// //             >
// //               <h5 className="min-h-10 pt-3 w-[100%] px-4 text-emerald-800 top-0 no-underline text-ellipsis whitespace-nowrap overflow-hidden text-left">
// //                 {stc.story?.title}
// //               </h5>

// //               {!isPhone && description(stc.story)}
// //               {/* <div className="max-h-[29.9rem]"> */}
             
// //                 <PageDataElement isGrid={isGrid} page={stc.story} />
// //        {/* </div> */}
// //             </div>
// //           </swiper-slide>
// //         );
// //       })}
// //     </swiper-container>
// //   );
// // }

// export default function Carousel({ book }) {
//   const swiperElRef = useRef(null);

//   useEffect(() => {
//   const swiperEl = swiperElRef.current;
//   if (!swiperEl) return;

//   Object.assign(swiperEl, {
//     slidesPerView: 1.05,
//     spaceBetween: 10,
//   });

//   // wait for element upgrade
//   requestAnimationFrame(() => {
//     swiperEl?.initialize?.();
//   });
// }, []);


//   if (!book?.storyIdList?.length) return null;
// return
//   return (
//     <div className="w-full overflow-hidden">
//      <swiper-container
//   ref={swiperElRef}
//   init="false"

//         className="w-full"
//       >
//         {book.storyIdList.map((stc) => {
//           if (!stc?.story) return null;

//           return (
//             <swiper-slide key={stc.id} className="!w-auto overflow-hidden">
//               <div
//                 className="
//                   w-full
//                   h-full
//                   rounded-xl
//                   overflow-hidden
//                   bg-white
//                   border border-[#bae6fe]/40
//                   shadow-sm
//                 "
//               >
//                 <div className="flex flex-col h-full">
                  
//                   {/* Title */}
//                   <h5 className="px-3 pt-2 text-sm font-semibold text-[#003b44] truncate">
//                     {stc.story.title || "Untitled"}
//                   </h5>

//                   {/* Purpose */}
//                   {stc.story.description && (
//                     <p className="px-3 pt-1 text-xs text-[#003b44]/70 line-clamp-2">
//                       {stc.story.description}
//                     </p>
//                   )}

//                   {/* Media (critical fix) */}
//                   <div className="flex-1 min-h-0">
//                     <PageDataElement page={stc.story} />
//                   </div>
//                 </div>
//               </div>
//             </swiper-slide>
//           );
//         })}
//       </swiper-container>

//       <style>
//         {`
//           swiper-container::part(pagination) {
//             bottom: 6px;
//           }

//           swiper-container::part(bullet) {
//             background: #0097b2;
//             opacity: 0.3;
//           }

//           swiper-container::part(bullet-active) {
//             opacity: 1;
//           }
//         `}
//       </style>
//     </div>
//   );
// }

import { useEffect, useRef } from "react";
import "../../Dashboard.css";
import PageDataElement from "../page/PageDataElement";
import { register } from "swiper/element/bundle";

register();

export default function Carousel({ book }) {
  const swiperElRef = useRef(null);

  useEffect(() => {
    const swiperEl = swiperElRef.current;
    if (!swiperEl) return;

    // Set Swiper props directly
    Object.assign(swiperEl, {
      slidesPerView: 1.05,      // peek next slide
      spaceBetween: 10,
      centeredSlides: false,
      resistanceRatio: 0.85,
      speed: 280,
      pagination: {
        clickable: true,
        dynamicBullets: true,
      },
      touchStartPreventDefault: false, // important for iOS + Ionic
      simulateTouch: true,             // ensure swipe works on touch devices
    });

    // ✅ auto-initialize after assigning props
    swiperEl.initialize?.();
  }, []);

  if (!book?.storyIdList?.length) return null;

  return (
    <div className="w-full overflow-hidden">
      <swiper-container ref={swiperElRef} className="w-full">
        {book.storyIdList.map((stc) => {
          if (!stc?.story) return null;

          return (
            <swiper-slide key={stc.id} className="!w-auto">
              <div className="w-full h-full rounded-xl overflow-hidden bg-white border border-[#bae6fe]/40 shadow-sm">
                <div className="flex flex-col h-full">
                  {/* Title */}
                  <h5 className="px-3 pt-2 text-sm font-semibold text-[#003b44] truncate">
                    {stc.story.title || "Untitled"}
                  </h5>

                  {/* Purpose */}
                  {stc.story.description && (
                    <p className="px-3 pt-1 text-xs text-[#003b44]/70 line-clamp-2">
                      {stc.story.description}
                    </p>
                  )}

                  {/* Media */}
                  <div className="flex-1 min-h-0">
                    <PageDataElement page={stc.story} />
                  </div>
                </div>
              </div>
            </swiper-slide>
          );
        })}
      </swiper-container>

      <style>
        {`
          swiper-container::part(pagination) {
            bottom: 6px;
          }

          swiper-container::part(bullet) {
            background: #0097b2;
            opacity: 0.3;
          }

          swiper-container::part(bullet-active) {
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
}