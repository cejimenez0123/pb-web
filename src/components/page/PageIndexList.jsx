import { useSelector } from "react-redux"
import PageIndexItem from "./PageIndexItem"
import InfiniteScroll from "react-infinite-scroll-component"
const PageIndexList = ()=>{
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    if(pagesInView){
    return(<InfiniteScroll
                   className="w-screen overflow-x-hidden sm:max-w-[42rem]"
                   dataLength={pagesInView.length}
                   next={()=>{}}
                   scrollThreshold={1}
                   hasMore={false}
                  
                  >
                      {pagesInView.map(page=>{
                        return <PageIndexItem page={page} />
                      })}  
                   </InfiniteScroll>)

                    }else{
                      return(<></>)
                    }
}

export default PageIndexList