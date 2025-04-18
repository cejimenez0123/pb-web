
import InfiniteScroll from "react-infinite-scroll-component";
import DashboardItem from "./DashboardItem";
import BookDashboardItem from "../collection/BookDashboardItem";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";

export default function GridView({ items }) {
  const isPhone = useMediaQuery({ query: "(max-width: 768px)" });
     const isNotPhone = useMediaQuery({
        query: '(min-width:768px)'
      })
  const [page, setPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState([]);
  const [ hasMore,setHasMore]=useState(true)
  useEffect(() => {
    setPage(1);
    setFilteredItems(items.slice(0, 10).filter(item=>item))
    setHasMore(filteredItems.length < items.length)
  }, [items]);

  useEffect(() => {
    const newItems = items.slice(0, page * 10).filter(item=>item);
    setFilteredItems(newItems);
    setHasMore(filteredItems.length < items.length)
  }, [page, items]);


  const nextPage = () => {
    setPage(prev => prev + 1);
  };

  return (
    <span>
      <InfiniteScroll
        className={isNotPhone?"":""}
        dataLength={filteredItems.length}
        next={nextPage}
        scrollThreshold={1}
        hasMore={hasMore}
        endMessage={
          <div>
            <p>That it for now, join to post your own work</p>
          </div>
        }
      >
       
        <div className={isNotPhone?"grid-container":" grid grid-cols-2 gap-[0.4em] mx-1"}>
          {filteredItems.map((item, i) => {
            const id = `${item.id}_${i}`;

            if (item.storyIdList?.length > 0 && !item.data) {
              return (
                <div className={isNotPhone?"grid-item rounded-lg oveflow-hidden ":" h-[24em] rounded-lg overflow-hidden max-w-full"} key={id}>
                  <BookDashboardItem isGrid={true} book={item} />
                </div>
              );
            }

            if (
              item.data &&
              !filteredItems.some(book =>
                book?.storyIdList?.some(storyId => storyId === item.id)
              )
            ) {
              return (
                <div className={isNotPhone?"grid-item   rounded-lg oveflow-hidden":" rounded-b-lg overflow-hidden max-w-full"} key={id}>
                  <DashboardItem
                    item={item}
                    index={i}
                    isGrid={true}
                    page={item}
                  />
                </div>
              );
            }

            return null;
          })}
        </div>
      </InfiniteScroll>
    </span>
  );
}

