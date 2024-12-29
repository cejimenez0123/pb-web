import { useSelector } from "react-redux"
import { useMediaQuery } from "react-responsive"
import InfiniteScroll from "react-infinite-scroll-component"
import uuidv4 from "../../core/uuidv4"
import DashboardItem from "./DashboardItem"
const PageList = ({items,isGrid,fetchContentItems})=>{

    const pagesInView = items?items:useSelector(state=>state.pages.pagesInView)
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
        className="w-fit"
        style={isGrid?{overflow:"unset"}:{display:"flex",flexDirection:"column"}}
        endMessage={<div className="min-h-36 w-full">
            <h1 className="mx-auto my-auto text-emerald-600 py-4  text-center mx-auto w-12">Fin</h1>
        </div>}
        >

           <div className={"max-w-[100vw] sm:w-[40rem] md:w-[50rem] mx-auto  "+(isGrid && isNotPhone?'grid grid-cols-2 lg:gap-4':"")}>
          {pagesInView.map(page=>{
                const id = `${page.id}_${uuidv4()}`
                return(<div id={id} className="mb-2">
                    <DashboardItem isGrid={isGrid} key={page.id} page={page}/>
                </div>)
            })}
            </div>
        </InfiniteScroll> </div>)
    }
    return(<div>
        Loading..
    </div>)
}
export default PageList