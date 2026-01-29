import { useState,useEffect, } from "react"
import "../../App.css"
import clear from "../../images/icons/clear.svg"
import {
    IonImg,
    IonText,
  } from '@ionic/react';
import FollowerCard from "./FollowerCard"
import isValidUrl from "../../core/isValidUrl"
import ReferralForm from "../auth/ReferralForm"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import {  setDialog } from "../../actions/UserActions"
import Enviroment from "../../core/Enviroment"
import { useDialog } from "../../domain/usecases/useDialog";
const ProfileInfo = ({profile})=>{
    const [pictureUrl,setPictureUrl]=useState(Enviroment.blankProfile)
        const dialog = useSelector(state=>state.users.dialog)
   const {openDialog,closeDialog}=useDialog()

    const dispatch = useDispatch()
    const handleDialogOpen=()=>{
  //        dispatch(setDialog({
  //   isOpen: false,
  //   text: null,
  //   title: null,
  //   agree: null,
  //   agreeText: null,
  //   disagreeText: null,
  // }));
  //       let dia = {...dialog}
  //       dia.isOpen = true
  //       dia.title = null
  openDialog({text: <ReferralForm onClose={()=>  closeDialog()}/>,breakpoint:1})
        // dia.text = <ReferralForm onClose={()=>  dispatch(setDialog({
  

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
        //  dispatch(setDialog({isOpen:false}))


        dia.isOpen = true;
        dia.disagreeText = "Close";
        dia.title = "Followers";
        dia.text = (
          <div className="card min-h-[20em] min-w-[30em] p-6 rounded-lg">
            <div className="mx-4">
              <IonImg
                onClick={() => {
              closeDialog()}}
              />
            </div>
             <FollowerCard followers={profile.followers} />
          </div>
        );
        dia.onClose = () => {
          dispatch(setDialog({ isOpen: false }));
        };
        // No agree button for this one, so we leave dia.agree null
        dia.agreeText = null;
        dia.agree = null;
      openDialog(dia)
        // dispatch(setDialog(dia));
      };
 const closeFollowersDialog=()=>{
    let dia = {...dialog}
    dia.isOpen=false
    dispatch(setDialog(dia))
 }
 console.log("Follwoers",profile.followers)
    if(!profile){
        return <div className="skeleton h-[100%] w-24"/>
    }
    const ProfilePic = ({url})=>    <div className="max-w-[8em] max-h-[8em] sm:max-w-24 sm:max-h-24 mx-auto rounded-full overflow-hidden">
    <IonImg className={"object-fit "}
    src={url}/>
   
    </div>
    return (  
      
        <div className="flex  h-[15em]   w-[100vw] sm:w-[100%] flex-col   ">                       
    <div className='flex-row   mx-auto sm:mx-0 justify-between  sm:justify-start flex   '>
          <div className="flex ml-1 flex-col ">
    <ProfilePic url={pictureUrl}/>
 <IonText className='text-xl pt-4 mx-auto text-emerald-900 font-bold'>{profile.username.toLowerCase()}</IonText> 

</div>   
   </div>
   
     <div>
       <div className='w-[100%] text-left '>
        <h6 className='sm:max-h-48 md:max-w-60  my-4 sm:w-60  text-[1em] text-center sm:text-left '>
            {profile.selfStatement}</h6></div> 
          
        </div>
   
       <div className="w-[100%] mt-2  min-w-[20em] px-2 items-baseline flex justify-between flex-row ">
        {/* <div className="text-emerald-800 flex flex-row  "> */}
            <div  
            onClick={()=>openFollowersDialog()}
            className="text-center flex-col flex ">
                <IonText className="text-[1rem]  ">Followers</IonText>
                <IonText className="text-[1rem] ">{profile.followers?.length}</IonText>
            </div>
<div className="flex "> 
<h6 onClick={()=>handleDialogOpen()}className='  text-[1rem] '>Refer Someone?</h6>
    
</div>
</div>
           {/* </div>                  */}
                            </div>  )
                            
      
}

export default ProfileInfo