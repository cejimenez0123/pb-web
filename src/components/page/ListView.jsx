
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
   
    const booksWithContent = items.filter(item=>item).filter(
      (item) => item.purpose && item.storyIdList && item.storyIdList.length > 0
    );
    const otherItemsWithContent = items.filter(item=>item).filter(
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