
import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import DashboardItem from "./DashboardItem";
import BookDashboardItem from "../collection/BookDashboardItem";
import Context from "../../context";
import adjustScreenSize from "../../core/adjustScreenSize";
import sortItems from "../../core/sortItems";

const ListView = ({ items, isGrid, forFeedback, getMore = () => {} }) => {
  const { isPhone } = useContext(Context);
  const [page, setPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadedItems, setLoadedItems] = useState([]);
  const [contentfulBooks, setContentfulBooks] = useState([]);
  const [contentfulOtherItems, setContentfulOtherItems] = useState([]);
  const pathName = location.pathname
  const itemsPerPage = 10;

  useEffect(() => {
   if(pathName.includes("discovery")||pathName.includes("collection")){
    
    setFilteredItems([...items])
   }else{
    const booksWithContent = items.filter(item=>item).filter(
      (item) => item && item.storyIdList && item.storyIdList.length > 0
    );
    const otherItemsWithContent = items.filter(item=>item).filter(
      (item) => item && item.data.length>0
    );
    let list = sortItems(otherItemsWithContent,booksWithContent)
    const initialItems = [...list.slice(0, itemsPerPage), ...otherItemsWithContent.slice(0, itemsPerPage)].slice(0, itemsPerPage);
    setFilteredItems(initialItems);
    setHasMore(booksWithContent.length + otherItemsWithContent.length > itemsPerPage);
    setPage(2); // Start loading from the second page
  }}, [items, itemsPerPage]);

  const loadMore = async () => {
    if (!hasMore) return;

    const startIndex = (page - 1) * itemsPerPage;
    const nextBooks = contentfulBooks.slice(startIndex, startIndex + itemsPerPage);
    const nextOtherItems = contentfulOtherItems.slice(startIndex, startIndex + itemsPerPage);
    const nextItems = [...nextBooks, ...nextOtherItems]

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
  let sizeOuter = adjustScreenSize(isGrid,false,"   rounded-lg  shadow-md grid-item relative  "," overflow-clip justify-between flex ","mt-2  mx-auto overflow-hidden"," mt-2 ","  ") 

  if(!filteredItems){
    <InfiniteScroll

    className={`mx-auto ${isPhone ? " 97vw " : " 47em "}`}
    dataLength={3}
    next={loadMore}
    hasMore={hasMore}
    loader={<h4 className="text-center my-4">Loading...</h4>}
    scrollThreshold={0.8}>
        {[1,2,3].map(skeleton=>{
          return (<div  className={"skeleton "+sizeOuter}/>)
        })}
    </InfiniteScroll>
  }
  return (
    <InfiniteScroll
      id={"list-view"}
      className={`mx-auto ${isPhone ? " 97vw " : " 47em "}`}
      dataLength={filteredItems.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<h4 className="text-center my-4">Loading...</h4>}
      scrollThreshold={0.8}
    >
      {filteredItems.map((item, i) => {
        return item && item.purpose ? (
          <span key={ i}>
          <BookDashboardItem key={ i} isGrid={isGrid} book={item} />
          </span>
        ) : (
          <span key={i}>
          <DashboardItem
            key={i}
            isGrid={isGrid}
            page={item}
            forFeedback={false}
          />
          </span>
        );
      })}
    </InfiniteScroll>
  );
};

export default ListView;