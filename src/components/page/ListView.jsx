import { useContext, useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import DashboardItem from "./DashboardItem";
import BookDashboardItem from "../collection/BookDashboardItem";
import Context from "../../context";
import adjustScreenSize from "../../core/adjustScreenSize";
import sortItems from "../../core/sortItems";
import { IonItem, IonList, IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/react";

const ListView = ({ items = [], isGrid, forFeedback, getMore = () => {} }) => {
  const [page, setPage] = useState(1);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 10;

  const { pathname } = useLocation();

  // Memoized sorted items
  const sortedItems = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) return [];

    const validItems = items.filter(Boolean);

    if (pathname.includes("discovery") || pathname.includes("collection")) {
      return validItems;
    }

    const books = validItems.filter((item) => Array.isArray(item?.storyIdList) && item.storyIdList.length > 0);
    const others = validItems.filter((item) => Array.isArray(item?.data) && item.data.length > 0);

    return sortItems(others, books) || [];
  }, [items, pathname]);

  // Initialize displayed items when sortedItems changes
  useEffect(() => {
    setDisplayedItems(sortedItems.slice(0, itemsPerPage));
    setHasMore(sortedItems.length > itemsPerPage);
    setPage(2);
  }, [sortedItems]);

  // Load more items for infinite scroll
  const loadMore = (ev) => {
    const startIndex = (page - 1) * itemsPerPage;
    const nextItems = sortedItems.slice(startIndex, startIndex + itemsPerPage);

    if (nextItems.length > 0) {
      setDisplayedItems((prev) => [...prev, ...nextItems]);
      setPage((prev) => prev + 1);
    } else {
      setHasMore(false);
    }

    ev?.target?.complete?.();
  };

  // Memoized size class

  return (
    <div className="flex flex-col">
      <IonList>
        {displayedItems.map((item, i) => {
          if (!item) return null;

          return (
            <IonItem key={item.id || i}>
              {item?.purpose ? (
                <BookDashboardItem isGrid={isGrid} book={item} />
              ) : (
                <DashboardItem isGrid={isGrid} page={item} forFeedback={forFeedback} />
              )}
            </IonItem>
          );
        })}
      </IonList>

      {hasMore && (
        <IonInfiniteScroll onIonInfinite={loadMore} className="flex flex-col" threshold="100px">
          <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading more..." />
        </IonInfiniteScroll>
      )}
    </div>
  );
};

export default ListView;

// import { useContext, useEffect, useState } from "react";
// import DashboardItem from "./DashboardItem";
// import BookDashboardItem from "../collection/BookDashboardItem";
// import Context from "../../context";
// import adjustScreenSize from "../../core/adjustScreenSize";
// import sortItems from "../../core/sortItems";
// import { IonItem, IonList, IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/react";

// const ListView = ({ items = [], isGrid, forFeedback, getMore = () => {} }) => {
//   const [page, setPage] = useState(1);
//   const [displayedItems, setDisplayedItems] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const itemsPerPage = 10;

//   const pathName = location.pathname;
// useEffect(() => {
//   if (!Array.isArray(items) || items.length === 0) return;

//   const validItems = items.filter(Boolean);
//   let sortedItems = [];

//   if (pathName.includes("discovery") || pathName.includes("collection")) {
//     sortedItems = validItems;
//   } else {
//     const books = validItems.filter((item) => Array.isArray(item?.storyIdList) && item.storyIdList.length > 0);
//     const others = validItems.filter((item) => Array.isArray(item?.data) && item.data.length > 0);
//     sortedItems = sortItems(others, books);
//   }
//   setDisplayedItems(sortedItems.slice(0, itemsPerPage));
//   setHasMore(sortedItems.length > itemsPerPage);
//   setPage(2);
// }, [items, pathName]);

//   // useEffect(() => {
//   //   if (!items.length) return;

//   //   let sortedItems = [];
//   //   if (pathName.includes("discovery") || pathName.includes("collection")) {
//   //     sortedItems = [...items];
//   //   } else {
//   //     const booksWithContent = items.filter(item=>item).filter(
//   //       (item) => item?.storyIdList?.length > 0
//   //     );
//   //     const otherItemsWithContent = items.filter(item=>item).filter(
//   //       (item) => item?.data?.length > 0
//   //     );
//   //     sortedItems = sortItems(otherItemsWithContent, booksWithContent);
//   //   }

//   //   setDisplayedItems(sortedItems.slice(0, itemsPerPage));
//   //   setHasMore(sortedItems.length > itemsPerPage);
//   //   setPage(2);
//   // }, [items]);
// const loadMore = async (ev) => {
//   if (!items || items.length === 0) {
//     ev.target.complete();
//     return;
//   }

//   const startIndex = (page - 1) * itemsPerPage;
//   const nextItems = items.slice(startIndex, startIndex + itemsPerPage);

//   if (nextItems.length > 0) {
//     setDisplayedItems((prev) => [...prev, ...nextItems]);
//     setPage((prev) => prev + 1);
//   } else {
//     setHasMore(false);
//   }

//   ev.target.complete();
// };
// useEffect(() => {
//   console.log("ListView items received:", items);
//   console.log("Displayed items:", displayedItems);
// }, [items, displayedItems]);


//   // const loadMore = async (ev) => {
//   //   const startIndex = (page - 1) * itemsPerPage;
//   //   const nextItems = items.slice(startIndex, startIndex + itemsPerPage);

//   //   if (nextItems.length > 0) {
//   //     setDisplayedItems((prev) => [...prev, ...nextItems]);
//   //     setPage((prev) => prev + 1);
//   //   }

//   //   if (nextItems.length < itemsPerPage) {
//   //     setHasMore(false);
//   //   }

//   //   ev.target.complete();
//   // };

//   const sizeOuter = adjustScreenSize(
//     isGrid,
//     false,
//     "rounded-lg shadow-md grid-item relative",
//     "overflow-clip justify-between flex",
//     "mt-2 mx-auto overflow-hidden",
//     "mt-2",
//     ""
//   );

//   return (
//     <div className="flex flex-col">
//       <IonList>
//       {displayedItems.map((item, i) => {
//   if (!item) return null;
//   return (
//     <IonItem key={i}>
//       {item?.purpose ? (
//         <BookDashboardItem key={i} isGrid={isGrid} book={item} />
//       ) : (
//         <DashboardItem key={i} isGrid={isGrid} page={item} forFeedback={false} />
//       )}
//     </IonItem>
//   );
// })}

//       </IonList>
      

//       {hasMore && (
//         <IonInfiniteScroll onIonInfinite={loadMore} className="flex flex-col"threshold="100px">
//           <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading more..." />
//         </IonInfiniteScroll>
//       )
//       }
//    </div>
//   );
// };

// export default ListView;
