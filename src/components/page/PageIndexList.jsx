import { useSelector } from "react-redux"
import PageIndexItem from "./PageIndexItem"
import InfiniteScroll from "react-infinite-scroll-component"
const PageIndexList = ()=>{
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    if(pagesInView){
    return(<InfiniteScroll
      className="   overflow-y-scroll overlfow-x-hidden "
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
                        return <div className=" my-2"><PageIndexItem page={page} /></div>
                      })}  
                   </InfiniteScroll>)

                    }else{
                      return(<></>)
                    }
}

export default PageIndexList