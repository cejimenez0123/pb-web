import { useSelector } from "react-redux"
import { useMediaQuery } from "react-responsive"
import InfiniteScroll from "react-infinite-scroll-component"
import uuidv4 from "../../core/uuidv4"
import DashboardItem from "./DashboardItem"
import ErrorBoundary from "../../ErrorBoundary"
import Enviroment from "../../core/Enviroment"
import loadingGif from "../../images/loading.gif"
import { useEffect, useState } from "react"

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

    if(pagesInView.length>0&&pagesInView[0]==Enviroment.blankPage){

    }
  
        return(<div 
        >
             <ErrorBoundary fallback={<div>Error</div>}>
           <InfiniteScroll
        dataLength={pagesInView.length}
        next={getMore}
        scrollThreshold={1}
        hasMore={more}
        loader={<div className=" flex p-12">
            <img className="mx-auto my-auto max-h-24 max-w-24" src={loadingGif}/>
        </div>}
        className={isGrid?"":"w-fit"}

        endMessage={<div className="md:min-h-page w-full">
            <h1 className="mx-auto my-auto text-emerald-600 py-2 lora-medium  text-center mx-auto w-12">Fin</h1>
        </div>}
        >
<div className={`max-w-[96vw] mx-auto ${isGrid && isNotPhone ? 'flex flex-wrap' : ''}`}>


          {pagesInView.map((page,i)=>{
            if(page==Enviroment.blankPage&&i==0){
                return(<div className="mx-auto text-emerald-800 text-xl py-12 lora-medium text-center">
                   <p> Refer your local friends for local feedback</p> <p>or</p><p> refer others so there's more to read</p>
                   <h5 className="mx-auto text-emerald-800 text-2xl py-12 lora-bold text-center">Recommendations</h5>
                   
                    </div>)
            }
            if(page==Enviroment.blankPage){
                return <div className="text-center">
<h5 className="mx-auto text-emerald-800 text-xl py-12 lora-bold text-center">Recommendations</h5>
                   
                 </div>

            }else{
            
            if(page){
                const id = `${page.id}_${i}`
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
        </InfiniteScroll> 
        </ErrorBoundary>
        </div>)

    

}
export default PageList