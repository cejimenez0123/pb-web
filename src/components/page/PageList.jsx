import { useSelector } from "react-redux"
import { useMediaQuery } from "react-responsive"
import InfiniteScroll from "react-infinite-scroll-component"
import DashboardItem from "./DashboardItem"
import Enviroment from "../../core/Enviroment"
import loadingGif from "../../images/loading.gif"
import { useContext } from "react"
import Context from "../../context"
import { IonItem, IonList } from "@ionic/react"


const PageList = ({items,forFeedback,getMore=()=>{},hasMore,isGrid,fetchContentItems})=>{
    let more=true
 const {isPhone}=useContext(Context)
    if(!hasMore){
  more=false
    }else{
        more=hasMore
    }
   let stories = items??useSelector(state=>state.pages.pagesInView)
    const pagesInView = stories.filter(story=>story)
 
  
  
        return(<div 
          className="w-[98vw] mx-auto flex"
        >
                 
<IonList className="no scroll">
     {pagesInView.map((page,i)=>{
          
            
    
                const id = `${page.id}_${i}`
                return(<IonItem key={id}
  className={`${isGrid && !isPhone && index % 2 === 0 ? 'gap-0 shrink-0' : ""}`}
>
                    <DashboardItem  key={page.id} item={page} index={i} forFeedback={forFeedback} isGrid={isGrid} page={page}/>
                </IonItem>)
          
})}
</IonList>
            </div>
       
      )

        
}
export default PageList