import { useSelector } from "react-redux"
import { useMediaQuery } from "react-responsive"
import InfiniteScroll from "react-infinite-scroll-component"
import uuidv4 from "../../core/uuidv4"
import DashboardItem from "./DashboardItem"
import ErrorBoundary from "../../ErrorBoundary"
const PageList = ({items,isGrid,fetchContentItems})=>{

    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const isNotPhone = useMediaQuery({
        query: '(min-width: 768px)'
      })
    if(pagesInView!=null&&pagesInView.length>0){
        return(<div 
        ><ErrorBoundary>
           <InfiniteScroll
        dataLength={pagesInView.length}
        next={()=>{}}
        scrollThreshold={1}
        hasMore={false}
        className={isGrid?"":"w-fit"}

        endMessage={<div className="min-h-36 w-full">
            <h1 className="mx-auto my-auto text-emerald-600 py-2  text-center mx-auto w-12">Fin</h1>
        </div>}
        >

<div className={`max-w-screen ${isGrid && isNotPhone ? 'flex flex-wrap' : ''}`}>

          {pagesInView.map(page=>{
            if(page){
                const id = `${page.id}_${uuidv4()}`
                return(<div  key={id}

  className={`${isGrid && isNotPhone && index % 2 === 0 ? 'gap-0 shrink-0' : ""}`}
>
                    <DashboardItem isGrid={isGrid} key={page.id} page={page}/>
                </div>)
            }else{
                return null
            }
            })}
            </div>
        </InfiniteScroll> </ErrorBoundary></div>)
    }
    if(pagesInView&& pagesInView.length==0){
        return(<div>No current content</div>)
    }
    return(<div>
       <h1 className="lora-medium"> Error</h1>
    </div>)
}
export default PageList