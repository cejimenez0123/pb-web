// import { useContext, useEffect, useLayoutEffect, useState } from "react";
// import InfiniteScroll from "react-infinite-scroll-component";
// import DashboardItem from "./DashboardItem";
// import { useMediaQuery } from "react-responsive";
// import BookDashboardItem from "../collection/BookDashboardItem";
// import { uniq } from "lodash";
// import Context from "../../context";
// const ListView = ({ items, isGrid, forFeedback,getMore=()=>{} }) => {
//   const {isPhone,isHorizPhone}=useContext(Context)
//   const [page, setPage] = useState(1);
//   const [filteredItems, setFilteredItems] = useState(items);
//   const [hasMore, setHasMore] = useState(true);

  
//   const loadMore = async () => {
//     setHasMore(true)
//     let end = 10*page>items.length?items.length:10*page
  
//     const uniqueData = items.filter(item=>{return item.storyIdList && !item.storyIdList==0||item.data.length>0})
//     .filter(newItem =>newItem && !filteredItems.some(item => item.id === newItem.id));
    
//      setFilteredItems(prevItems => [...prevItems, ...uniqueData]);
//      setHasMore(false)
//   };
//   useLayoutEffect(()=>{
//     let end = items.length<10?items.length:10
//     items.slice(0,end)
//     setFilteredItems(items)
//   },[])
//   useEffect(() => {
//    loadMore()
//   }, [page]);
//   return(
//                <InfiniteScroll
//              id={"list-view"}  
//              className={`mx-auto ${isPhone?" w-page-mobile ":" w-page "}`}
//             dataLength={filteredItems.length
//             }
            
//             next={()=>{
//               setPage(i=>i+1)
//             }}
//                     hasMore={hasMore}
//                     loader={<h4 className="text-center my-4">Loading...</h4>}
//                     scrollThreshold={0.6}
//                 >
 
//                 {filteredItems.map((item,i)=>{
    
//  return item && item.purpose?<BookDashboardItem        key={ i} isGrid={isGrid} book={item} />
//                       :<DashboardItem    key={ i}  isGrid={isGrid}  page={item} forFeedback={false}/>
      
//                 })
        
//         }
            
//             </InfiniteScroll>)
//         }
//     // }
//     // }
// export default ListView;
import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import DashboardItem from "./DashboardItem";
import BookDashboardItem from "../collection/BookDashboardItem";
import Context from "../../context";

const ListView = ({ items, isGrid, forFeedback, getMore = () => {} }) => {
  const { isPhone } = useContext(Context);
  const [page, setPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadedItems, setLoadedItems] = useState([]);
  const [contentfulBooks, setContentfulBooks] = useState([]);
  const [contentfulOtherItems, setContentfulOtherItems] = useState([]);

  const itemsPerPage = 10;

  useEffect(() => {
    // Separate books with content from other items
    const booksWithContent = items.filter(
      (item) => item.purpose && item.storyIdList && item.storyIdList.length > 0
    );
    const otherItemsWithContent = items.filter(
      (item) => item.data 
    );

    setContentfulBooks(booksWithContent);
    setContentfulOtherItems(otherItemsWithContent);

    // Initialize filteredItems with the first page of combined contentful data
    const initialItems = [...booksWithContent.slice(0, itemsPerPage), ...otherItemsWithContent.slice(0, itemsPerPage)].slice(0, itemsPerPage);
    setFilteredItems(initialItems);
    setLoadedItems(initialItems.map(item => item.id || Math.random())); // Use a fallback for items without IDs
    setHasMore(booksWithContent.length + otherItemsWithContent.length > itemsPerPage);
    setPage(2); // Start loading from the second page
  }, [items, itemsPerPage]);

  const loadMore = async () => {
    if (!hasMore) return;

    const startIndex = (page - 1) * itemsPerPage;
    const nextBooks = contentfulBooks.slice(startIndex, startIndex + itemsPerPage);
    const nextOtherItems = contentfulOtherItems.slice(startIndex, startIndex + itemsPerPage);
    const nextItems = [...nextBooks, ...nextOtherItems].sort((a, b) => (a.priority || 0) > (b.priority || 0));;

    const newUniqueItems = nextItems.filter(
      (newItem) => !loadedItems.includes(newItem.id || Math.random())
    );

    if (newUniqueItems.length > 0) {
      setFilteredItems((prevItems) => [...prevItems, ...newUniqueItems]);
      setLoadedItems((prevLoadedItems) => [
        ...prevLoadedItems,
        ...newUniqueItems.map((item) => item.id || Math.random()),
      ]);
    }

    if (filteredItems.length + newUniqueItems.length >= contentfulBooks.length + contentfulOtherItems.length) {
      setHasMore(false);
    }

    setPage((prevPage) => prevPage + 1);
  };

  return (
    <InfiniteScroll
      id={"list-view"}
      className={`mx-auto ${isPhone ? " w-page-mobile " : " w-page "}`}
      dataLength={filteredItems.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<h4 className="text-center my-4">Loading...</h4>}
      scrollThreshold={0.8}
    >
      {filteredItems.map((item, i) => {
        return item && item.purpose ? (
          <BookDashboardItem key={item.id || i} isGrid={isGrid} book={item} />
        ) : (
          <DashboardItem
            key={item.id || i}
            isGrid={isGrid}
            page={item}
            forFeedback={false}
          />
        );
      })}
    </InfiniteScroll>
  );
};

export default ListView;