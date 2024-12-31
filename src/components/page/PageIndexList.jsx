import { useSelector } from "react-redux"
import PageIndexItem from "./PageIndexItem"
import InfiniteScroll from "react-infinite-scroll-component"
const PageIndexList = ()=>{
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    if(pagesInView){
    return(<InfiniteScroll
                   className="w-screen overflow-x-hidden "
                   dataLength={pagesInView.length}
                   next={()=>{}}
                   scrollThreshold={1}
                   hasMore={false}
                    endMessage={
                      <div>
                        <p>No Content</p>
                      </div>
                    }
                  >
                      {pagesInView.map(page=>{
                        return <div className="rounded-lg border-3 mx-2 my-2 border-emerald-200 "><PageIndexItem page={page} /></div>
                      })}  
                   </InfiniteScroll>)

                    }else{
                      return(<></>)
                    }
}

export default PageIndexList