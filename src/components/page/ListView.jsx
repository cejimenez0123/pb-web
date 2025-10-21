import { useContext, useEffect, useState } from "react";
import DashboardItem from "./DashboardItem";
import BookDashboardItem from "../collection/BookDashboardItem";
import Context from "../../context";
import adjustScreenSize from "../../core/adjustScreenSize";
import sortItems from "../../core/sortItems";
import { IonItem, IonList, IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/react";

const ListView = ({ items = [], isGrid, forFeedback, getMore = () => {} }) => {
  const { isPhone } = useContext(Context);
  const [page, setPage] = useState(1);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 10;

  const pathName = location.pathname;

  useEffect(() => {
    if (!items.length) return;

    let sortedItems = [];

    if (pathName.includes("discovery") || pathName.includes("collection")) {
      sortedItems = [...items];
    } else {
      const booksWithContent = items.filter(
        (item) => item?.storyIdList?.length > 0
      );
      const otherItemsWithContent = items.filter(
        (item) => item?.data?.length > 0
      );
      sortedItems = sortItems(otherItemsWithContent, booksWithContent);
    }

    setDisplayedItems(sortedItems.slice(0, itemsPerPage));
    setHasMore(sortedItems.length > itemsPerPage);
    setPage(2);
  }, [items]);

  const loadMore = async (ev) => {
    const startIndex = (page - 1) * itemsPerPage;
    const nextItems = items.slice(startIndex, startIndex + itemsPerPage);

    if (nextItems.length > 0) {
      setDisplayedItems((prev) => [...prev, ...nextItems]);
      setPage((prev) => prev + 1);
    }

    if (nextItems.length < itemsPerPage) {
      setHasMore(false);
    }

    ev.target.complete();
  };

  const sizeOuter = adjustScreenSize(
    isGrid,
    false,
    "rounded-lg shadow-md grid-item relative",
    "overflow-clip justify-between flex",
    "mt-2 mx-auto overflow-hidden",
    "mt-2",
    ""
  );

  return (
    <>
      <IonList>
        {displayedItems.map((item, i) => (
          <IonItem key={i}>
            {item?.purpose ? (
              <BookDashboardItem key={i} isGrid={isGrid} book={item} />
            ) : (
              <DashboardItem key={i} isGrid={isGrid} page={item} forFeedback={false} />
            )}
          </IonItem>
        ))}
      </IonList>

      {hasMore && (
        <IonInfiniteScroll onIonInfinite={loadMore} threshold="100px">
          <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading more..." />
        </IonInfiniteScroll>
      )}
    </>
  );
};

export default ListView;

// import { useContext, useEffect, useState } from "react";
// import DashboardItem from "./DashboardItem";
// import BookDashboardItem from "../collection/BookDashboardItem";
// import Context from "../../context";
// import adjustScreenSize from "../../core/adjustScreenSize";
// import sortItems from "../../core/sortItems";
// import { IonItem,IonList} from "@ionic/react";

// const ListView = ({ items, isGrid, forFeedback, getMore = () => {} }) => {
//   const { isPhone } = useContext(Context);
//   const [page, setPage] = useState(1);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [loadedItems, setLoadedItems] = useState([]);
//   const [contentfulBooks, setContentfulBooks] = useState([]);
//   const [contentfulOtherItems, setContentfulOtherItems] = useState([]);
//   const pathName = location.pathname
//   const itemsPerPage = 10;

//   useEffect(() => {
//    if(pathName.includes("discovery")||pathName.includes("collection")){
    
//     setFilteredItems([...items])
//    }else{
//     const booksWithContent = items.filter(item=>item).filter(
//       (item) => item && item.storyIdList && item.storyIdList.length > 0
//     );
//     const otherItemsWithContent = items.filter(item=>item).filter(
//       (item) => item && item.data.length>0
//     );
//     let list = sortItems(otherItemsWithContent,booksWithContent)
//     const initialItems = [...list.slice(0, itemsPerPage), ...otherItemsWithContent.slice(0, itemsPerPage)].slice(0, itemsPerPage);
//     setFilteredItems(initialItems);
//     setHasMore(booksWithContent.length + otherItemsWithContent.length > itemsPerPage);
//     setPage(2); // Start loading from the second page
//   }}, [items, itemsPerPage]);

//   const loadMore = async () => {
//     if (!hasMore) return;

//     const startIndex = (page - 1) * itemsPerPage;
//     const nextBooks = contentfulBooks.slice(startIndex, startIndex + itemsPerPage);
//     const nextOtherItems = contentfulOtherItems.slice(startIndex, startIndex + itemsPerPage);
//     const nextItems = [...nextBooks, ...nextOtherItems]

//     const newUniqueItems = nextItems.filter(
//       (newItem) => !loadedItems.includes(newItem.id || Math.random())
//     );

//     if (newUniqueItems.length > 0) {
//       setFilteredItems((prevItems) => [...prevItems, ...newUniqueItems]);
//       setLoadedItems((prevLoadedItems) => [
//         ...prevLoadedItems,
//         ...newUniqueItems.map((item) => item.id || Math.random()),
//       ]);
//     }

//     if (filteredItems.length + newUniqueItems.length >= contentfulBooks.length + contentfulOtherItems.length) {
//       setHasMore(false);
//     }

//     setPage((prevPage) => prevPage + 1);
//   };
//   let sizeOuter = adjustScreenSize(isGrid,false,"   rounded-lg  shadow-md grid-item relative  "," overflow-clip justify-between flex ","mt-2  mx-auto overflow-hidden"," mt-2 ","  ") 

//   // if(!filteredItems){
//     return(<><IonList>
//       {filteredItems.map((item, i) => {
//         return item && item.purpose ? (<IonItem key={i}>
     
//           <BookDashboardItem key={ i} isGrid={isGrid} book={item} />
//          </IonItem>
//         ) : (<IonItem key={i}>
      
//           <DashboardItem
//             key={i}
//             isGrid={isGrid}
//             page={item}
//             forFeedback={false}
//           />
//          </IonItem>
//         );
//       })}
//       </IonList>
//       </>)  
// };

// export default ListView;