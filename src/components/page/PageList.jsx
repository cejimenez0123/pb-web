import { useSelector } from "react-redux"
import { useMediaQuery } from "react-responsive"
import InfiniteScroll from "react-infinite-scroll-component"
import DashboardItem from "./DashboardItem"
import Enviroment from "../../core/Enviroment"
import loadingGif from "../../images/loading.gif"


const PageList = ({items,forFeedback,getMore=()=>{},hasMore,isGrid,fetchContentItems})=>{
    let more=true
 
    if(!hasMore){
  more=false
    }else{
        more=hasMore
    }
   let stories = items??useSelector(state=>state.pages.pagesInView)
    const pagesInView = stories
    const isPhone =  useMediaQuery({
        query: '(max-width: 700px)'
      })

  
  
        return(<div 
        >
                  <InfiniteScroll
        dataLength={pagesInView.length?pagesInView.length:0}
        next={getMore}
        scrollThreshold={1}
        hasMore={more}
        loader={<div className=" flex ">
            <img className="mx-auto my-auto w-[4em] h-[4em] " src={loadingGif}/>
        </div>}
        className={isGrid?"":" mx-auto w-[96vw] md:w-page h-page w-fit"}

        endMessage={<div className="min-h-72 flex w-full">
            <h2 className="mx-auto my-auto text-xl  text-emerald-600 py-2 lora-medium  text-center mx-auto w-12">Sharing you work!<br/> Encourages others to share!<br/>This is what we have now!<br/>Check in later</h2>
        </div>}
        >
<div className={` ${isGrid && !isPhone ? 'flex flex-wrap' : ''}`}>


          {pagesInView.length?pagesInView.map((page,i)=>{
            if(page==Enviroment.blankPage&&i==0){
                return(<div key={i}className="mx-auto text-emerald-800 text-xl py-12 lora-medium text-center">
                   <p> Refer your local friends for local feedback</p> <p>or</p><p> refer others so there's more to read</p>
                   <h5 className="mx-auto text-emerald-800 text-2xl py-12 lora-bold text-center">Recommendations</h5>
                   
                    </div>)
            }
            if(page==Enviroment.blankPage){
                return <div key={i} className="text-center">
<h5 className="mx-auto text-emerald-800 text-xl py-12 lora-bold text-center">Recommendations</h5>
                   
                 </div>

            }else{
            
            if(page){
                const id = `${page.id}_${i}`
                return(<div  key={id}

  className={`${isGrid && !isPhone && index % 2 === 0 ? 'gap-0 shrink-0' : ""}`}
>
                    <DashboardItem  forFeedback={forFeedback} isGrid={isGrid} key={page.id} page={page}/>
                </div>)
            }else{
                return null
            }
            }}):null}
            </div>
        </InfiniteScroll> 

        </div>)

        
}
export default PageList