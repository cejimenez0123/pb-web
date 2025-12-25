import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import DashboardItem from "./DashboardItem";
import BookDashboardItem from "../collection/BookDashboardItem";
import sortItems from "../../core/sortItems";
import { IonItem, IonList, IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/react";

const ListView = ({ items = [], isGrid, forFeedback, getMore = () => {} }) => {
  const [page, setPage] = useState(1);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 5;

  const { pathname } = useLocation();

  // Memoized sorted items
  const sortedItems =location.pathname.includes("home")?items: useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) return [];

    const validItems = items.filter(Boolean);

    if (pathname.includes("discovery") || pathname.includes("collection")) {
      return validItems;
    }

    const books = validItems.filter((item) => Array.isArray(item?.storyIdList) && item.storyIdList.length > 0);
    const others = validItems.filter((item) => Array.isArray(item?.data) && item.data.length > 0);

    return sortItems(others, books) || [];
  }, [items, pathname]);
// console.log("items",items)
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
    <div className="flex flex-col max-w-[98vw] w-[50em]">
      <IonList>
       <div className="flex flex-col max-w-[98vw] overflow-clip">
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
        </div>
      </IonList>

      {hasMore && (

        <IonInfiniteScroll onIonInfinite={loadMore} className="flex flex-col items-center ion-padding" threshold="50px">
          <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading more..." />
        </IonInfiniteScroll>
      )}
    </div>
  );
};

export default ListView;
