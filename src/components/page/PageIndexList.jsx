import { useSelector } from "react-redux"
import PageIndexItem from "./PageIndexItem"
import InfiniteScroll from "react-infinite-scroll-component"
const PageIndexList = ()=>{
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    if(pagesInView){
    return(<InfiniteScroll
      className=" max-w-[94vw] md:w-[42em] max-h-[36em] py-2 overflow-y-scroll overlfow-x-hidden mx-auto"
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
                        return <div className="sm:mx-4 my-2"><PageIndexItem page={page} /></div>
                      })}  
                   </InfiniteScroll>)

                    }else{
                      return(<></>)
                    }
}

export default PageIndexList