import { useEffect, useLayoutEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { fetchNotifcations } from "../../actions/ProfileActions"
import { useSelector } from "react-redux"
import NotificationItem from "../../components/profile/NotificationItem"
import usePersistentNotifications from "../../domain/usecases/usePersistentNotifications"
import Enviroment from "../../core/Enviroment"
import { useLocation, useNavigate } from "react-router-dom"
import { IonList,IonItem, IonContent } from "@ionic/react"
export default function NotificationContainer({currentProfile}){
    const dispatch = useDispatch()
     const payload = usePersistentNotifications(()=>dispatch(fetchNotifcations({profile:currentProfile})))
    const items = useSelector(state=>state.users.notifications??[])
     var today= new Date();
 
    let oneDayOld = today.setDate(today.getDate() - 1)
    let lastNotified =  oneDayOld
    useEffect(()=>{
        dispatch(fetchNotifcations({profile:currentProfile}))
    },[])
    // const [items,setItems]=useState([])
    // const fetchIt =()=>{
            // if(payload){
            //     let seen = []
            //     const{collections, comments,following,followers}=payload
            //     let newFollowers = followers?followers.map(follow=>{return{type:"follower",item:follow}}):[]
            //     let newComs = comments?comments.map(com=>{return{type:"comment",item:com}}):[]
            //     let newFollowContent = following?following.map(fol=>{
                    
            //        return fol.following.stories.map(story=>{
            //             return {type:"story",item:story,profile:fol.following}
            //         })
            //     }).flat():[]
            //     let newCols = collections? collections.filter(item=>item.storyIdList!=0).map(col=>{
                 
            //         let storyList = col.storyIdList
            //        let latest=storyList.sort((a,b)=>{
            //             return b.created>a.created 
            //         })[0].story
            //         return {type:"collection",item:latest,collection:col}
            //     }):[]
            //     let list = [...newComs,...newFollowContent,...newCols,...newFollowers].filter(item => {
                    
            //         let found = seen.find(i=>i.item.id==item.item.id)
                   
            //         if (!found) {
            //           seen.push(item);
            //           return true;
            //         }
            //         return false;
            //       })
            //     let sorted = seen.sort((a,b)=>{
            //         return b.item.created>a.item.created 
            //     })
            //     const index = sorted.findIndex(item => {
            //         const today = new Date();
            //         const yesterday = new Date(today);
            //         yesterday.setDate(today.getDate() - 1);
                  
            //         return new Date(item.item.created) < yesterday
            //     });
            
            //     const before = sorted.slice(0, index);
            //     const after = sorted.slice(index); 
            //     const newItemArray = [Enviroment.blankPage]; 
            //     const newArray = before.concat(newItemArray, after);
            //     setItems(newArray)
           
               
        
        
         
    // }}
  
    // useLayoutEffect(()=>{
      
    //     fetchIt(payload)
    // },[navigate])

    return(<IonContent fullscreen className="flex flex-col justify-center md:py-8">
        <div  className=" w-[96vw] border-b-2 border-emerald-600 mx-auto md:w-page">
<h1 className="lora-bold text-xl text-emerald-800  mb-4 mt-8 text-opacity-70">Today</h1>
<IonList>
{[...items].map((item,i)=>{
    return(<IonItem key={i}>
      <NotificationItem item={item} lastNotified={lastNotified}/>
        </IonItem>)
})}
</IonList>
</div>
    </IonContent>)

}
