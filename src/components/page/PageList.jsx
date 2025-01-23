import { useSelector } from "react-redux"
import { useMediaQuery } from "react-responsive"
import InfiniteScroll from "react-infinite-scroll-component"
import uuidv4 from "../../core/uuidv4"
import DashboardItem from "./DashboardItem"
import ErrorBoundary from "../../ErrorBoundary"
import Enviroment from "../../core/Enviroment"
const PageList = ({forFeedback,getMore=()=>{},hasMore,isGrid,fetchContentItems})=>{
    let more=true
    if(!hasMore){
  more=false
    }else{
        more=hasMore
    }
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const isNotPhone = useMediaQuery({
        query: '(min-width: 768px)'
      })
    if(pagesInView!=null){
        return(<div 
        ><ErrorBoundary>
           <InfiniteScroll
        dataLength={pagesInView.length}
        next={getMore}
        scrollThreshold={1}
        hasMore={more}
        className={isGrid?"":"w-fit"}

        endMessage={<div className="md:min-h-page w-full">
            <h1 className="mx-auto my-auto text-emerald-600 py-2  text-center mx-auto w-12">Fin</h1>
        </div>}
        >
<div className={`max-w-[96vw] mx-auto ${isGrid && isNotPhone ? 'flex flex-wrap' : ''}`}>


          {pagesInView.map(page=>{
            if(page==Enviroment.blankPage){
                return <div className="text-center">
<h5 className="mx-auto text-emerald-800 text-xl py-12 lora-medium text-center">Recommendations</h5>
                    </div>

            }else{
            
            if(page){
                const id = `${page.id}_${uuidv4()}`
                return(<div  key={id}

  className={`${isGrid && isNotPhone && index % 2 === 0 ? 'gap-0 shrink-0' : ""}`}
>
                    <DashboardItem forFeedback={forFeedback} isGrid={isGrid} key={page.id} page={page}/>
                </div>)
            }else{
                return null
            }
            }})}
            </div>
        </InfiniteScroll> </ErrorBoundary></div>)
    }
    
    return(<div>
       <h1 className="lora-medium"> Error</h1>
    </div>)
}
export default PageList