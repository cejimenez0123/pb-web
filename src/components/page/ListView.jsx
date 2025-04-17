import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import DashboardItem from "./DashboardItem";
import GridView from "./GridView";
import BookDashboardItem from "../collection/BookDashboardItem";
const ListView = ({ items, isGrid }) => {
    
  const [page, setPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  // Reset when items change
  useEffect(() => {
    setPage(1);
    setFilteredItems(items.slice(0, 10));
    setHasMore(items.length > 10);
  }, [items]);

  useEffect(() => {
    const newItems = items.filter(i=>i).slice(0, page * 10);
    setFilteredItems(newItems);
    setHasMore(newItems.length < items.length);
  }, [page, items]);

  const nextPage = () => {
    setPage(prev => prev + 1);
  };

  if (!items || !items.length) return null;

  if (isGrid) {
    return <GridView viewItems={filteredItems} />;
  }
    

            return(
          
               <InfiniteScroll
               className="mx-auto w-page"
            dataLength={filteredItems.length}
            next={nextPage}
                    hasMore={hasMore}
                    loader={<h4 className="text-center my-4">Loading...</h4>}
                    scrollThreshold={0.9}
                >
 
                {filteredItems.filter(page=>page).map((item,i)=>{
    
    

                      if (item && item.storyIdList?.length > 0) {
                        return (
                          <div
                            key={item.id}
                            className="m-1 w-[96vw] md:w-page shadow-md rounded-lg h-fit"
                          >
                            <BookDashboardItem isGrid={isGrid} book={item} />
                          </div>
                        );
                      }
if (
                item.data &&
                !filteredItems.some(
                  book =>
                    book?.storyIdList?.some(stc => stc.storyId === item.id)
                )
              ) {
                    return(<div 
                        className={isGrid?"grid-item  ":"m-1 w-[96vw] md:w-page shadow-md rounded-lg h-fit "}
                        key={item.id}
                    >               
                        <DashboardItem isGrid={isGrid} key={item.id} page={item}/>
                    </div>)
                }
            return null
        })}
            
            </InfiniteScroll>)
        }
    // }
    // }
export default ListView;
