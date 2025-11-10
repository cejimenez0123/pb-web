import { useState,useEffect, useRef, useContext } from "react"
import "../../App.css"
import clear from "../../images/icons/clear.svg"
import {
    IonButton,
    IonImg,
    IonText,
  } from '@ionic/react';
import FollowerCard from "./FollowerCard"
import isValidUrl from "../../core/isValidUrl"
import ReferralForm from "../auth/ReferralForm"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { setDialog } from "../../actions/UserActions"
import Enviroment from "../../core/Enviroment"
import { Capacitor } from "@capacitor/core";
import settings from "../../images/icons/settings.svg"
import { useNavigate } from "react-router-dom";
const ProfileInfo = ({profile})=>{
    const [pictureUrl,setPictureUrl]=useState(Enviroment.blankProfile)
        const dialog = useSelector(state=>state.users.dialog)
        const navigate = useNavigate()
    const isNative = Capacitor.isNativePlatform()
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
     useEffect(() => {
    let isMounted = true;
    async function fetchImage() {

            if(isValidUrl(profile.profilePic)){
                setPictureUrl(profile.profilePic)
         
            }else{
             const src = Enviroment.imageProxy(profile.profilePic)

                    setPictureUrl(src)
            }
              
            }


    fetchImage();
    return () => (isMounted = false);
  }, [profile]);
    const openFollowersDialog = () => {
        let dia = {};
        dia.isOpen = true;
        dia.disagreeText = "Close";
        dia.title = "Followers";
        dia.text = (
          <div className="card min-h-[20em] min-w-[30em] p-6 rounded-lg">
            <div className="mx-4">
              <IonImg
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
    const ProfilePic = ({url})=>    <div className="max-w-[8em] max-h-[8em] sm:max-w-24 sm:max-h-24 mr-6 rounded-full overflow-hidden">
    <IonImg className={"object-fit "}
    src={url}/>
   
    </div>
    return (  
        <div className="flex  h-[15em]  max-w-[20em] flex-col  ">                       
    <div className='flex-row  mb-4  mx-auto justify-between w-[90%]  flex  '>
          <div className="flex flex-row ">
    <ProfilePic url={pictureUrl}/>
     <IonText className='text-xl mb-3   text-emerald-900 font-bold'>{profile.username}</IonText>
</div>    
<IonImg  onClick={()=> navigate("/profile/edit")} className="bg-soft rounded-full  p-1  max-h-7 mb-4 w-8 mx-2" src={settings}/> 
     </div>
     <div>
       <div className='w-[100%] w-[15em]  md:max-w-[20em] text-left '>
        <h6 className='sm:max-h-48  mb-4 sm:w-60 text-[0.8rem] sm:text-[0.8rem]  text-emerald-900 '>
            {profile.selfStatement}</h6></div> 
          
        </div>
   
        <div className="text-emerald-800 flex flex-row justify-start px-4">
            {profile.followers && profile.followers.length>0?<div  
            onClick={()=>openFollowersDialog()}
            className="text-center flex-col flex ">
                <IonText className="text-[1rem]">Followers</IonText>
                <IonText className="text-[1.2rem]">{profile.followers.length}</IonText>
            </div>:null}
        {/* </div> */}

{/* <div className='w-[10em] h-[3em] mx-auto flex'> */}
<h6 onClick={()=>handleDialogOpen()}className='my-auto mx-auto text-sm mb-4  text-emerald-800'>Refer Someone?</h6></div>
                            
                            </div>  )
                            
      
}

export default ProfileInfo