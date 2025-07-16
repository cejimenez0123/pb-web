import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import { useState,useEffect, useRef } from "react"
import "../../App.css"

import { useMediaQuery } from "react-responsive"
import clear from "../../images/icons/clear.svg"
import {
    IonButtons,
    IonButton,
    IonModal,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonPage,
    IonImg,
 
    IonItem,
    IonInput,
  } from '@ionic/react';
import { useParams } from "react-router-dom"
import { Dialog } from "@mui/material"
import FollowerCard from "./FollowerCard"
import isValidUrl from "../../core/isValidUrl"
import ReferralForm from "../auth/ReferralForm"
import DeviceCheck from "../DeviceCheck"

const ProfileInfo = ({profile})=>{
    const [pictureUrl,setPictureUrl]=useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s")
    const [followersDialog,setFollowersDialog]=useState(false)
    const [openReferral,setOpenReferral]=useState(false)
    const {id}=useParams()
    const isNative = DeviceCheck()
    const isPhone =  useMediaQuery({
        query: '(max-width: 600px)'
      })
      const modal = useRef(null)
      const input = useRef(null)
    useEffect( ()=>{

        if(profile && !isValidUrl(profile.profilePic)){
            getDownloadPicture(profile.profilePic).then(url=>{
               
                setPictureUrl(url)
            })
        }else if(profile&&isValidUrl(profile.profilePic)){
          
            setPictureUrl(profile.profilePic)
        }
        
        
    },[])
    useEffect(()=>{
        setFollowersDialog(false)
    },{id})
    if(!profile){
        return <div className="skeleton h-[100%] w-24"/>
    }
    return (  
        <div className="flex h-[100%] flex-col justify-between">                       
    <div className='flex-row    mx-auto   flex  '>
        <div className="max-w-[8em] max-h-[8em] sm:max-w-24 sm:max-h-24 mr-6 rounded-full overflow-hidden">
    <IonImg className={"object-fit "}
    src={pictureUrl}/>
   
    </div>

        <div className='text-left sm:mx-3 mb-2 h-48 flex flex-col '>
        <h5 className='text-xl mb-3  mt-2 lora-bold  text-emerald-900 font-bold'>{profile.username}</h5>
       <div className='w-[100%] w-[15em]  md:max-w-[20em] text-left '>
        <h6 className='sm:max-h-48  sm:w-60 text-[0.8rem] sm:text-[0.8rem]  text-emerald-900 '>
            {profile.selfStatement}</h6></div> 
          
        </div>
        </div>
        <div className="text-emerald-800 flex flex-row justify-start px-4">
            {profile.followers && profile.followers.length>0?<div  
            onClick={()=>setFollowersDialog(true)}
            className="text-center open-sans-bold ">
                <h5 className="text-[1rem]">Followers</h5>
                <h6 className="text-[1.2rem]">{profile.followers.length}</h6>
            </div>:null}
        </div>
        <Dialog 
        
        open={followersDialog}
        onClose={()=>{
    setFollowersDialog(false)
}}>
    <div className="card  min-h-[20em] min-w-[30em] py-6 rounded-lg">
       <div className="mx-4">
        <img  onClick={()=>{setFollowersDialog(false)}}src={clear}/>
       </div>
      {profile&&profile.followers?  <FollowerCard followers={profile.followers}/>:null}
    </div>
</Dialog>
<div className='w-[10em] h-[3em] mx-auto flex'>
{!isNative?<h6 onClick={()=>setOpenReferral(true)}className='my-auto mx-auto text-sm  mont-medium text-emerald-800'>Refer Someone?</h6>
                            :   <IonButton id="open-modal" expand="block">
                            Refer Someone?
        </IonButton>}</div>
                         
                          
                            {isNative?<><IonModal ref={modal} trigger="open-modal" >
                            <IonHeader>
            <IonToolbar>
           <IonButtons slot="start">
                 <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
              </IonButtons>
              <IonTitle>Referral</IonTitle>
              <IonButtons slot="end">
              <IonButton strong={true} onClick={() => confirm()}>
                   Confirm
               </IonButton>
             </IonButtons>
          </IonToolbar>
         </IonHeader>
         <IonContent className="ion-padding">
                  <ReferralForm onClose={()=>{
    setOpenReferral(false)
  }}/>
          </IonContent>
                                </IonModal></>:<Dialog  
                                              
      open={openReferral}
      onClose={()=>setOpenReferral(false)}
      ><ReferralForm onClose={()=>setOpenReferral(false)}/>
 </Dialog>}
                            
                            </div>  )
//                               {isNative?<><IonModal ref={modal} trigger="open-modal" 
                                
//                                 >
//           <IonHeader>
//             <IonToolbar>
//               <IonButtons slot="start">
//                 <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
//               </IonButtons>
//               <IonTitle>Referral</IonTitle>
//               <IonButtons slot="end">
//                 <IonButton strong={true} onClick={() => confirm()}>
//                   Confirm
//                 </IonButton>
//               </IonButtons>
//             </IonToolbar>
//           </IonHeader>
//           <IonContent className="ion-padding">
//           <ReferralForm onClose={()=>{
//     setOpenReferral(false)
//   }}/>
//           </IonContent>
//         </IonModal></>:
//                             <Dialog
      
//       fullScreen={isPhone}
//       open={openReferral}
//       onClose={()=>setOpenReferral(false)}>
 
//       </Dialog>}
      
}

export default ProfileInfo