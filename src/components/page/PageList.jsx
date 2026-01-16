import { useSelector } from "react-redux"
import DashboardItem from "./DashboardItem"
import { useContext } from "react"
import Context from "../../context"
import { IonInfiniteScroll, IonItem, IonList } from "@ionic/react"


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
 
  
  
        return(
                 
<IonInfiniteScroll  threshold="200px">
     {pagesInView.map((page,i)=>{
          
            
    
                const id = `${page.id}_${i}`
                return(
<div key={id}>
                    <DashboardItem  key={page.id} item={page} index={i} forFeedback={forFeedback} isGrid={isGrid} page={page}/>
            </div> )
          
})}
</IonInfiniteScroll>
            
       
      )

        
}
export default PageList