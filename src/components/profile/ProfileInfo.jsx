import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import { useState,useEffect } from "react"
const ProfileInfo = ({profile})=>{
    const [pictureUrl,setPictureUrl]=useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s")
    
    useEffect( ()=>{

        if(!profile.profilePic.includes("http")){
            getDownloadPicture(profile.profilePic).then(url=>{
               
                setPictureUrl(url)
            })
        }else{
            setPictureUrl(profile.profilePic)
        }
        
        
    },[])
    return (                           
    <div className='flex-row   mx-auto   flex  '>
        <div className="max-w-[8em] max-h-[8em] sm:max-w-24 sm:max-h-24 mr-6 rounded-full overflow-hidden">
    <img className={"object-fit "}src={pictureUrl}/>
    </div>

        <div className='text-left sm:mx-3 mb-2 h-48 flex flex-col '>
        <h5 className='text-xl mb-3  mt-2 lora-bold  text-emerald-900 font-bold'>{profile.username}</h5>
       <div className='w-[100%] max-w-[20em] text-left '>
        <h6 className='sm:max-h-48  sm:w-60 text-[0.8rem] sm:text-[0.8rem]  text-emerald-900 '>
            {profile.selfStatement}</h6></div> 
  
        </div></div>)
}

export default ProfileInfo