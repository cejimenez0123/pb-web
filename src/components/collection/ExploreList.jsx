
// import { BookListItem } from "../BookListItem";
// import { useSelector, useDispatch } from "react-redux";
// import { useEffect, useState } from "react";
// import {
//   getRecommendedCollections,
//   getRecommendedCollectionsProfile,
// } from "../../actions/CollectionActions";
// import SectionHeader from "../SectionHeader";
// const SECTION_GAP = "mt-4";  // applied to each section's root div
// const SECTION_HEADING = "text-xl lora-medium";          // text style only
// const SECTION_HEADER_ROW = "flex items-center justify-between py-4"; // r
// const WRAP = "w-[100%]  mx-auto ";
// export default function ExploreList({ label="Explore",collection }) {
//   const items = useSelector((state) => state.books.recommendedCols);
//   const { currentProfile } = useSelector((state) => state.users);

//   const [isLoading, setIsLoading] = useState(true);
//   const [isVisible, setIsVisible] = useState(false);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     let mounted = true;

//     async function load() {
//       setIsLoading(true);
//       setIsVisible(false);

//       if (currentProfile) {
//         await dispatch(getRecommendedCollectionsProfile());
//       } else if (collection && collection.id) {
//         await dispatch(getRecommendedCollections({ colId: collection?.id }));
//       }

//       if (!mounted) return;

//       // small delay = smoother transition (feels native)
//       setTimeout(() => {
//         setIsLoading(false);
//         setIsVisible(true);
//       }, 120);
//     }

//     load();

//     return () => {
//       mounted = false;
//     };
//   }, [collection]);

//   return (
//     <div>
//     <div className={`${WRAP} ${SECTION_GAP}`}>
//       <div>
//   <div className={SECTION_HEADER_ROW}>
  
//       <SectionHeader title={label}/>
// </div>
//       <div className="relative">
//         {/* 🔹 Skeleton (slides OUT) */}
//         <div
//           className={`
//             absolute inset-0 transition-all duration-300 ease-out
//             ${isLoading ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 pointer-events-none"}
//           `}
//         >
//           <div className="flex min-h-[14rem] flex-row overflow-x-auto space-x-4 no-scrollbar  animate-pulse">
//             {[...Array(4)].map((_, i) => (
//               <div
//                 key={i}
//                 className="min-w-[12rem] h-[12rem] bg-base-bg rounded-xl shadow-md flex flex-col justify-between p-3"
//               >
//                 <div className="h-4 w-3/4 bg-emerald-100 rounded" />
//                 <div className="space-y-2 mt-4">
//                   <div className="h-3 w-full bg-gray-200 rounded" />
//                   <div className="h-3 w-5/6 bg-gray-200 rounded" />
//                 </div>
//                 <div className="h-3 w-1/2 bg-gray-200 rounded mt-4" />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* 🔹 Content (slides IN) */}
//         <div
//           className={`
//             transition-all duration-300 ease-out
//             ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}
//           `}
//         >
//           {!isLoading && items?.length > 0 && (
//             <div className="flex min-h-[14rem] flex-row overflow-x-auto space-x-4 no-scrollbar ">
//               {items.map((item, i) => (
//                 <BookListItem key={item.id + i} book={item} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//     </div>
//     </div>
//   );
// }
import { BookListItem } from "../BookListItem";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  getRecommendedCollections,
  getRecommendedCollectionsProfile,
} from "../../actions/CollectionActions";
import SectionHeader from "../SectionHeader";

const SECTION_GAP = "mt-4";
const SECTION_HEADER_ROW = "flex items-center justify-between py-4";
const WRAP = "w-[100%] mx-auto";

export default function ExploreList({ label = "Explore", collection }) {
  const items = useSelector((state) => state.books.recommendedCols);
  const { currentProfile } = useSelector((state) => state.users);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoading(true);
      setIsVisible(false);
      if (currentProfile) {
        await dispatch(getRecommendedCollectionsProfile());
      } else if (collection && collection.id) {
        await dispatch(getRecommendedCollections({ colId: collection?.id }));
      }
      if (!mounted) return;
      setTimeout(() => {
        setIsLoading(false);
        setIsVisible(true);
      }, 120);
    }
    load();
    return () => { mounted = false; };
  }, [collection]);

  return (
    <div>
      <div className={`${WRAP} ${SECTION_GAP}`}>
        <div>
          <div className={SECTION_HEADER_ROW}>
            <SectionHeader title={label} />
          </div>

          <div className="relative min-h-[14rem]">

            {/* Skeleton — in flow while loading, absolute only on exit */}
            <div
              className={`
                transition-all duration-300 ease-out
                ${isLoading
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-6 pointer-events-none absolute inset-0"}
              `}
            >
              <div className="flex min-h-[14rem] flex-row overflow-x-auto space-x-4 no-scrollbar animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[12rem] h-[12rem] bg-base-soft rounded-xl flex flex-col justify-between p-3 flex-shrink-0"
                  >
                    <div className="h-4 w-3/4 bg-base-bg rounded" />
                    <div className="space-y-2 mt-4">
                      <div className="h-3 w-full bg-base-bg rounded" />
                      <div className="h-3 w-5/6 bg-base-bg rounded" />
                    </div>
                    <div className="h-3 w-1/2 bg-base-bg rounded mt-4" />
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div
              className={`
                transition-all duration-300 ease-out
                ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}
              `}
            >
              {!isLoading && items?.length > 0 && (
                <div className="flex min-h-[14rem] flex-row overflow-x-auto space-x-4 no-scrollbar">
                  {items.map((item, i) => (
                    <BookListItem key={item.id + i} book={item} />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}