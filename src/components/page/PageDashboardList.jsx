import { useSelector } from "react-redux"
import { useMediaQuery } from "react-responsive"
import InfiniteScroll from "react-infinite-scroll-component"
import uuidv4 from "../../core/uuidv4"
import DashboardItem from "./DashboardItem"
const PageList = ({isGrid,fetchContentItems})=>{
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const isNotPhone = useMediaQuery({
        query: '(min-width: 768px)'
      })
    if(pagesInView!=null){
        return(<div 
        >
           <InfiniteScroll
        dataLength={pagesInView.length}
        next={fetchContentItems}
        scrollThreshold={1}
        hasMore={false}
        className="w-[42rem]"
        style={isGrid?{overflow:"unset"}:{display:"flex",flexDirections:"row"}}
        >

           <div className={"max-w-[100vw] "+(isGrid && isNotPhone?'grid grid-cols-2 lg:gap-4':"")}>
          {pagesInView.map(page=>{
                const id = `${page.id}_${uuidv4()}`
                return(<div id={id}>
                    <DashboardItem isGrid={isGrid} key={page.id} page={page}/>
                </div>)
            })}
            </div>
        </InfiniteScroll> </div>)
    }
}
export default PageList