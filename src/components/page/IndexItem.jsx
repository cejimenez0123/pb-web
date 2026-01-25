import { useContext, useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {  setHtmlContent, setPageInView,setEditingPage } from "../../actions/PageActions.jsx";
import {  RoleType } from "../../core/constants";
import addBox from "../../images/icons/add_circle.svg"
import edit from "../../images/icons/edit.svg"
import Paths from "../../core/paths";
import { initGA,sendGAEvent } from "../../core/ga4.js";
import { setCollectionInView } from "../../actions/CollectionActions";
import Enviroment from "../../core/Enviroment.js";
import Context from "../../context.jsx";
import { IonImg, IonText, useIonRouter } from "@ionic/react";
import { useSelector } from "react-redux";
export default function IndexItem({item,handleFeedback,type}) {
  let collectionStr ="collection"
    const [canUserAdd,setCanUserAdd]=useState(false)
    useLayoutEffect(()=>{
      initGA()
    },[])
    const {currentProfile} =useSelector(state=>state.users)
     const dispatch = useDispatch()
    const router = useIonRouter()
    const [canUserEdit,setCanUserEdit]=useState(false)
    useLayoutEffect(()=>{
      soCanUserEdit()
      soCanUserAdd()
    },[currentProfile])
    const copyShareLink=()=>{
      if(item && item.storyIdList){
        sendGAEvent("Copy Share Link",`Share Link Collection:${item?.title}`)
   
      navigator.clipboard.writeText(Enviroment.domain+Paths.collection.createRoute(item.id))
                              .then(() => {
                      
                                  alert('Text copied to clipboard');
                                })

      }else{
        sendGAEvent("Copy Share Link",`Share Link Story:${item?.title}`)

      navigator.clipboard.writeText(Enviroment.domain+Paths.page.createRoute(item.id))
                              .then(() => {
                      
                                  alert('Text copied to clipboard');
                                })
  }}
    const handleEditClick = (comp)=>{
 
      if(type=="collection"){
        router.push(Paths.editCollection.createRoute(comp.id))
      }else{
         dispatch(setHtmlContent({html:comp.data}))
        dispatch(setEditingPage({page:comp}))
        dispatch(setPageInView({page:comp}))
        router.push(Paths.editPage.createRoute(comp.id))
      }  
    }

    const handleNavigate=()=>{
      // console.log(item)
    if(type!="story"){
              dispatch(setCollectionInView({collection:item}))
              router.push(Paths.collection.createRoute(item.id))
        }else{
           
              dispatch(setPageInView({page:item}))
              router.push(Paths.page.createRoute(item.id))
        }

    }


   const soCanUserAdd=()=>{
    let arr=[RoleType.editor,RoleType.writer]
    let found = item && item.roles?item.roles.find(role=>currentProfile && role.profileId==currentProfile.id):null
    if(currentProfile && item){
      if(currentProfile.id==item.authorId){
        setCanUserAdd(true)
        return
      }
      if(currentProfile.id==item.profileId){
        setCanUserAdd(true)
        return
      }
      if(found && arr.includes(found.role)){
        setCanUserAdd(true)
        return
      }
    }
    setCanUserAdd(false)
   }
const soCanUserEdit = () => {
  // 1. Guard clause: if we don't have the data, they can't edit.
  if (!currentProfile || !item) {
    setCanUserEdit(false);
    return;
  }

  
  const isOwner = currentProfile.id === item.authorId || currentProfile.id === item.profileId;


  const hasEditorRole = item.roles?.some(
    (role) => role.profileId === currentProfile.id && role.role === RoleType.editor
  );

  setCanUserEdit(isOwner || hasEditorRole);

};

    const handleAddToClick = ()=>{
       if(type!="story"){
      router.push(Paths.addToCollection.createRoute(item.id))
      }else{
      router.push(Paths.addStoryToCollection.story(item.id))
      }
    }

   let updated= formatDate(item.updated)
   
const handleAddToLibrary=()=>{
  router.push(Paths.addStoryToCollection.collection(item.id))
}

    return(
  <div className="w-[100%]  overflow-visible ">
                <div   className="border-3  my-2   px-8 flex flex-row justify-between  mx-auto shadow-sm  rounded-full  min-h-[6rem] w-full  py-[1.4em] border-blueSea border-opacity-[40%]">
                
         <div onClick={handleNavigate} className=" h-fit my-auto md:w-[30em]  max-w-[100vw] text-nowrap text-ellipsis  ">
              
              
                   {item?.title && item?.title?.length>0? 
                     <span className={`    my-auto`}>
                   <h6  
         className={`text-[0.9rem] md:text-[1.3rem ] md:w-[20em]  max-w-[50vw] text-left  no-underline text-ellipsis     whitespace-nowrap    `}>
       {item?.title.length>20?item?.title.substring(0,20)+"...":item?.title}</h6>         {updated}</span>:
 <span className={`  whitespace-nowrap max-w-[45vw]  no-underline text-ellipsis my-auto`}>
                   <h6   className={`text-[0.9rem] text-left lg:text-[1rem] text-ellipsis   
                   whitespace-nowrap no-underline  my-auto`}
                   >Untitled</h6>         {updated}</span>}
                   

</div>

           
              { canUserEdit?(
       
       <div className="dropdown  absolute my-auto relative w-fit z-40 dropdown-left">
  <div  tabIndex={0} role="button" className=" m-1 p-2 rounded-full w-[4rem]  border-2 hover:bg-emerald-600 border border-soft h-[4rem]  "> <IonImg className="  my-auto mx-auto  " style={{width:"3rem", height:"3rem"}} src={edit}/></div>
  <ul tabIndex={0} className="dropdown-content menu bg-emerald-50 rounded-box z-10 w-52 p-2 shadow">
  <li className="" onClick={
        ()=>handleEditClick(item)}><a className=" ">Edit</a></li>
       {type!="collection"?<li className=" " onClick={handleFeedback}><a className=" "><IonText>Get Feedback</IonText></a></li>:null}
       {canUserAdd?<li className=" no-underline" onClick={handleAddToClick}><a className="no-underline "><IonText>{item && item.storyIdList!=null?`Add items to ${item?.title}`:"Add to Collection" }</IonText></a></li>:null}
         </ul>
  </div>
       
  )
  : !canUserEdit?(
  
   <div className="dropdown my-auto relative w-fit dropdown-left">
   <div tabIndex={0} role="button" className=" m-1 p-2 rounded-full bg-emerald-800 "> <IonImg classname="my-auto mx-auto  " src={addBox}/></div>
   <ul tabIndex={0} className="dropdown-content menu bg-emerald-50 rounded-box  w-52 p-2 shadow">
  {!item.isPrivate && type==collectionStr&&
        <li className="no-underline "  onClick={handleAddToLibrary}><a className="no-underline"> Add Collection to Library</a></li>}
       
        {canUserAdd&&
        <li className="no-underline"  onClick={handleAddToClick}><a className="no-underline ">{item && item.storyIdList!=null?`Add items to ${item?.title}`:"Add to Collection" }</a></li>}
         {/* {updated} */}
         <li  onClick={copyShareLink}><a className=" no-underline" >Share</a></li>
         </ul>
  
       
  
      </div>
  )
   :null} 
        

</div>
               
</div>        
               )
           
    
    }
    
  function formatDate(dateString){
    const date = new Date(dateString);

// Get the month, day, and year
const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const day = String(date.getDate()).padStart(2, '0');
const year = date.getFullYear();

// Format the date as mm/dd/yyyy
const formattedDate = `${month}/${day}/${year}`;
return formattedDate
  }
  