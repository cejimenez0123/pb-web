// import { useSelector } from "react-redux"
// import DashboardItem from "./DashboardItem"
// import { useContext } from "react"
// import Context from "../../context"
// import { IonInfiniteScroll, IonItem, IonList } from "@ionic/react"
import { IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/react";
import DashboardItem from "./DashboardItem";
import { useContext } from "react";
import Context from "../../context";

const PageList = ({ items = [], forFeedback, getMore = () => {}, hasMore = true, isGrid }) => {
  const { isPhone } = useContext(Context);
  const pagesInView = items.filter(Boolean);

  return (
    <div>
      {pagesInView.map((page, i) => (
        <DashboardItem
          key={page.id}
          item={page}
          index={i}
          forFeedback={forFeedback}
          isGrid={isGrid}
          page={page}
        />
      ))}

      <IonInfiniteScroll
        threshold="200px"
        disabled={!hasMore}
        onIonInfinite={async (e) => {
          await getMore();
          e.target.complete();
        }}
      >
        <IonInfiniteScrollContent
          loadingSpinner="bubbles"
          loadingText="Loading more..."
        />
      </IonInfiniteScroll>
    </div>
  );
};

export default PageList;


// const PageList = ({items,forFeedback,getMore=()=>{},hasMore,isGrid,fetchContentItems})=>{
//     let more=true
//  const {isPhone}=useContext(Context)
//     if(!hasMore){
//   more=false
//     }else{
//         more=hasMore
//     }
//    let stories = items??useSelector(state=>state.pages.pagesInView)
//     const pagesInView = stories.filter(story=>story)
 
  
  
//         return(
                 
// <IonList  >
//      {pagesInView.map((page,i)=>{
          
            
    
//                 const id = `${page.id}_${i}`
//                 return(
// <div key={id}>
//                     <DashboardItem  key={page.id} item={page} index={i} forFeedback={forFeedback} isGrid={isGrid} page={page}/>
//             </div> )
          
// })}
// </IonList>
            
       
//       )

        
// }
// export default PageList