import { useLayoutEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { fetchNotifcations } from "../../actions/ProfileActions"
import { useSelector } from "react-redux"
import checkResult from "../../core/checkResult"
import InfiniteScroll from "react-infinite-scroll-component"

import loadingGif from "../../images/loading.gif"
import ProfileCircle from "../../components/profile/ProfileCircle"
import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"
import usePersistentNotifications from "../../domain/usecases/usePersistentNotifications"
import Enviroment from "../../core/Enviroment"


export default function NotificationContainer(props){
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const payload = usePersistentNotifications( dispatch(fetchNotifcations({profile:currentProfile})))
    var today= new Date();
   
    let oneDayOld = today.setDate(today.getDate() - 1)
    let lastNotified =  oneDayOld
    const navigate = useNavigate()

    const [items,setItems]=useState([])

    const fetchIt =()=>{
       
       
            if(payload){
                let seen = []
                const{collections, comments,following}=payload
                let newComs = comments.map(com=>{return{type:"comment",item:com}})
                let newFollowContent = following.map(fol=>{
                    
                   return fol.following.stories.map(story=>{
                        return {type:"story",item:story,profile:fol.following}
                    })
                }).flat()
                let newCols = collections.filter(item=>item.storyIdList!=0).map(col=>{
                 
                    let storyList = col.storyIdList
                   let latest=storyList.sort((a,b)=>{
                        return b.created>a.created 
                    })[0].story
                    return {type:"collection",item:latest,collection:col}
                })
                let list = [...newComs,...newFollowContent,...newCols].filter(item => {
                    
                    let found = seen.find(i=>i.item.id==item.item.id)
                   
                    if (!found) {
                      seen.push(item);
                      return true;
                    }
                    return false;
                  })
                let sorted = seen.sort((a,b)=>{
                    return b.item.created>a.item.created 
                })
                const index = sorted.findIndex(item => {
                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(today.getDate() - 1);
                  
                    return new Date(item.item.created) < yesterday
                });
                console.log("inde",index)
                const before = sorted.slice(0, index);
                const after = sorted.slice(index); 
                const newItemArray = [Enviroment.blankPage]; 
                const newArray = before.concat(newItemArray, after);
                setItems(newArray)
           
               
        
        
         
    }}
   
    useLayoutEffect(()=>{
      
 fetchIt(payload)
    },[currentProfile])

    return(<div className="flex flex-col justify-center md:py-8">
        <div  className=" w-[96vw] border-b-2 border-emerald-600 mx-auto md:w-page">
<h1 className="lora-bold text-xl text-emerald-800  mb-4 mt-8 text-opacity-70">Today</h1>
<InfiniteScroll
 className=" w-[96vw] border-b-2 border-emerald-600 mx-auto md:w-page"
 dataLength={items.length}
 next={()=>{}}
 hasMore={false}
 loader={<p><img src={loadingGif}/></p>}
 endMessage={<div className=" flex p-12"><p className="text-emerald-800 lora-medium mx-auto my-auto">That's it for now</p></div>}
>
<div className="w-[96vw] mx-auto md:w-page">
{items.map(item=>{
    if(item==Enviroment.blankPage){
        return<div><p className="lora-medium text-emerald-800 text-opacity-60">Older than today</p></div>
    }
    switch(item.type){

        case "collection":{
           
        const collection = item.collection
        
            return(<div onClick={()=>navigate(Paths.collection.createRoute(collection.id))}className="border-emerald-600 border-t-2 md:my-2  min-h-[8rem] max-h-[10rem] border-opacity-60 md:border-2 md:rounded-full p-2">
            <div className="md:px-12" ><span    className="flex justify-between flex-row ">
        
            <ProfileCircle profile={collection.profile}/>
            <h4 className="text-emerald-700 mx-4 my-2 text-[0.7rem] open-sans-medium">Published to {collection.title}</h4>
 
            <h4 className="my-auto">{getTimePast(collection.created)}</h4>
            </span>
            <h5 className="open-sans-medium
             my-2 text-[0.8rem] px-2 text-emerald-800">{latest.title}</h5>
            </div></div>)
        }
        case "story":{
            const story = item.item
            return(<div onClick={()=>navigate(Paths.page.createRoute(story.id))}className="border-emerald-600 border-t-2 md:my-2  min-h-[8rem] max-h-[10rem]   border-opacity-60 md:border-2 md:rounded-full p-2">
            <div className="md:px-12" ><span    className="flex justify-between flex-row ">
        
            <ProfileCircle profile={item.profile}/>
            <h4 className="text-emerald-700 mx-4 my-2 text-[0.7rem] open-sans-medium">{lastNotified<new Date(story.created)?"New Story":null}</h4>
 
            <h4 className="my-auto">{getTimePast(story.created)}</h4>
            </span>
            <h5 className="open-sans-medium my-2 text-[0.8rem] px-2 text-emerald-800">{story.title}</h5>
            </div></div>)
        }
        case "comment":{
            const comment = item.item
        
            return(<div onClick={()=>navigate(Paths.page.createRoute(comment.story.id))}
            className="border-emerald-600 min-h-[8rem] max-h-[10rem] border-t-2 md:my-2  border-opacity-60 md:border-2 md:rounded-full p-4">
            <div className="px-6" ><span    className="flex flex-row justify-between"><span
            className="flex flex-row ">
            <ProfileCircle profile={comment.profile}/>
            <h4 className="text-emerald-700 mx-4 my-2 text-[0.7rem] md:max-w-[12em] text-nowrap text-ellipsis my-auto open-sans-medium">Commented on {comment.story.title}</h4></span>
            <h4 className="my-auto">{getTimePast(comment.created)}</h4>
            </span>
            <h5 className="open-sans-medium my-2 px-2 text-[0.8rem] text-emerald-800">{comment.content}</h5>
            </div></div>)
        }
    }

})}
</div>
</InfiniteScroll>
</div>
    </div>)

}

function getTimePast(created){
    const then = new Date(created); // Replace with your past time
    const now = new Date();
    
    const diffMs = now - then; // Difference in milliseconds
    const diffSec = Math.floor(diffMs / 1000); // Convert to seconds
    const diffMin = Math.floor(diffSec / 60); // Convert to minutes
    const diffHours = Math.floor(diffMin / 60); // Convert to hours
    const diffDays = Math.floor(diffHours / 24); // Convert to days
    
    // console.log(`Difference: ${diffDays} days, ${diffHours % 24} hours, ${diffMin % 60} minutes, ${diffSec % 60} seconds`);
               
    
    let time = `${diffMin} mins ago`
   if(diffHours>24) {
        time = `${diffDays} days ago`
    }else if(diffMin>59){
        time = `${diffHours} hours ago`
      
    }else{
        time = `${diffMin} mins ago`
    }
    return time
            
}