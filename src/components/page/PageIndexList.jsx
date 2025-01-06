import { useSelector } from "react-redux"
import PageIndexItem from "./PageIndexItem"
import InfiniteScroll from "react-infinite-scroll-component"
const PageIndexList = ()=>{
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    if(pagesInView){
    return(<InfiniteScroll
                   className="max-w-[96%] max-h-[36em] overflow-scroll mx-auto py-4 overflow-x-hidden "
                   dataLength={pagesInView.length}
                   next={()=>{}}
                   scrollThreshold={1}
                   hasMore={false}
                    endMessage={
                      <div className="p-12" >
                        <p className="text-emerald-600">fin</p>
                      </div>
                    }
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