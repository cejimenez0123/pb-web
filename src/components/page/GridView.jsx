
import InfiniteScroll from "react-infinite-scroll-component";
import DashboardItem from "./DashboardItem";
import BookDashboardItem from "../collection/BookDashboardItem";
import { useMediaQuery } from "react-responsive";
import { useEffect, useLayoutEffect,useState } from "react";
import adjustScreenSize from "../../core/adjustScreenSize";

export default function GridView({ items }) {
  const isPhone = useMediaQuery({ query: "(max-width: 768px)" });
     const isNotPhone = useMediaQuery({
        query: '(min-width:768px)'
      })
  const [page, setPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState([]);
  const [ hasMore,setHasMore]=useState(true)
  // useEffect(() => {
  //   setPage(1);
  //   setFilteredItems(items.slice(0, 10).filter(item=>item))
  //   setHasMore(filteredItems.length < items.length)
  // }, [items]);

  // useEffect(() => {
  //   const newItems = items.slice(0, page * 10).filter(item=>item);
  //   setFilteredItems(newItems);
  //   setHasMore(filteredItems.length < items.length)
  // }, [page, items]);

  const loadMore = async () => {
    setHasMore(true)
    let end = 10*page>items.length?items.length:10*page
  
    const uniqueData = items.filter(item=>item.storyIdList>0||item.data).filter(newItem =>newItem && !filteredItems.some(item => item.id === newItem.id));
    // const newData =   page==0?items.slice(0,10):items.slice(1*page,end)
     setFilteredItems(prevItems => [...prevItems, ...uniqueData]);
     setHasMore(false)
  };
  useLayoutEffect(()=>{
    let end = items.length<10?items.length:10
    items.slice(0,end)
    setFilteredItems(items)
  },[])
  const nextPage = () => {
    // setPage(prev => prev + 1);
  };
    return (
    <span>
      <InfiniteScroll
        id={"grid-view"}
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
                
                  <BookDashboardItem key={item.id} id={i} isGrid={true} book={item} />
           
              );
            }

            if (
              item.data &&
              !filteredItems.some(book =>
                book?.storyIdList?.some(storyId => storyId === item.id)
              )
            ) {
              
              return (
                
                  <DashboardItem
                  key={item.id}
                    item={item}
                    index={i}
                    isGrid={true}
                    page={item}
                  />
             
              );
            }

            return null;
          })}
        </div>
      </InfiniteScroll>
    </span>
  );
}
