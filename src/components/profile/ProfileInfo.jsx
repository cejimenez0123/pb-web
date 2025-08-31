import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import { useState,useEffect, useRef, useContext } from "react"
import "../../App.css"

import { useMediaQuery } from "react-responsive"
import clear from "../../images/icons/clear.svg"
import {

    IonButton,
  
    IonImg,
 
  } from '@ionic/react';
import { useParams } from "react-router-dom"
import Dialog from "../Dialog"
import FollowerCard from "./FollowerCard"
import isValidUrl from "../../core/isValidUrl"
import ReferralForm from "../auth/ReferralForm"
import DeviceCheck from "../DeviceCheck"
import Context from "../../context"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { setDialog } from "../../actions/UserActions"

const ProfileInfo = ({profile})=>{
    const [pictureUrl,setPictureUrl]=useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s")
    const dialog = useSelector(state=>state.users.dialog)
    const {isNative}=useContext(Context)
    const dispatch = useDispatch()
    const handleDialogOpen=()=>{
        let dia = {...dialog}
        dia.isOpen = true
        dia.title = "Referral"
        dia.text = <ReferralForm onClose={()=>dispatch(setDialog({open:false}))}/>
        dia.onClose=()=>{
            dispatch(setDialog({open:false}))
        }
        dispatch(setDialog(dia))

    }
    useEffect( ()=>{

        if(profile && !isValidUrl(profile.profilePic)){
            getDownloadPicture(profile.profilePic).then(url=>{
               
                setPictureUrl(url)
            })
        }else if(profile&&isValidUrl(profile.profilePic)){
          
            setPictureUrl(profile.profilePic)
        }
        
        
    },[profile])
    const openFollowersDialog = () => {
        let dia = {};
        dia.isOpen = true;
        dia.disagreeText = "Close";
        dia.title = "Followers";
        dia.text = (
          <div className="card min-h-[20em] min-w-[30em] p-6 rounded-lg">
            <div className="mx-4">
              <img
                onClick={() => {
                  // also close dialog from X icon in top right
                  dispatch(setDialog({ isOpen: false }));
                }}
                src={clear}
                alt="close"
                className="cursor-pointer"
              />
            </div>
            {profile?.followers ? <FollowerCard followers={profile.followers} /> : null}
          </div>
        );
        dia.onClose = () => {
          dispatch(setDialog({ isOpen: false }));
        };
        // No agree button for this one, so we leave dia.agree null
        dia.agreeText = null;
        dia.agree = null;
      
        dispatch(setDialog(dia));
      };
 const closeFollowersDialog=()=>{
    let dia = {...dialog}
    dia.isOpen=false
    dispatch(setDialog(dia))
 }
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
            onClick={()=>openFollowersDialog()}
            className="text-center open-sans-bold ">
                <h5 className="text-[1rem]">Followers</h5>
                <h6 className="text-[1.2rem]">{profile.followers.length}</h6>
            </div>:null}
        </div>

<div className='w-[10em] h-[3em] mx-auto flex'>
{!isNative?<h6 onClick={()=>handleDialogOpen()}className='my-auto mx-auto text-sm  mont-medium text-emerald-800'>Refer Someone?</h6>
                            :   <IonButton id="open-modal" expand="block">
                            Refer Someone?
        </IonButton>}</div>
          
                            
                            </div>  )
                            
      
}

export default ProfileInfo