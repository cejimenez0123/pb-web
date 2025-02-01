import { useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {  setHtmlContent, setPageInView } from "../../actions/PageActions";
import {  RoleType } from "../../core/constants";
import {useNavigate} from 'react-router-dom'
import addBox from "../../images/icons/add_circle.svg"
import edit from "../../images/icons/edit.svg"
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import Paths from "../../core/paths";
import ReactGA from "react-ga4"
import { setEditingPage } from '../../actions/PageActions'
import { setCollectionInView } from "../../actions/CollectionActions";
function IndexItem({item,handleFeedback}) {
    const isPhone =  useMediaQuery({
        query: '(max-width: 600px)'
      })
    const [canUserAdd,setCanUserAdd]=useState(false)
    const [showPreview,setShowPreview] = useState(false)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [canUserEdit,setCanUserEdit]=useState(false)
    useLayoutEffect(()=>{
      soCanUserEdit()
      soCanUserAdd()
    },[])
    const copyShareLink=()=>{
      if(item && item.storyIdList){
        ReactGA.event({
          category: "Page View",
          action: "Copy Collection Share Link",
          label: item.title, 
          value: item.id,
          nonInteraction: false
        });
      navigator.clipboard.writeText(`https://plumbum.app`+Paths.collection.createRoute(item.id))
                              .then(() => {
                                  // Successfully copied to clipboard
                                  alert('Text copied to clipboard');
                                })

      }else{
      ReactGA.event({
          category: "Page View",
          action: "Copy Story Share Link",
          label: item.title, 
          value: item.id,
          nonInteraction: false
        });
      navigator.clipboard.writeText(`https://plumbum.app`+Paths.page.createRoute(item.id))
                              .then(() => {
                                  // Successfully copied to clipboard
                                  alert('Text copied to clipboard');
                                })
  }}
    const handleEditClick = ()=>{
       
      if(item && item.storyIdList){
        navigate(Paths.editCollection.createRoute(item.id))
      }else if(item){
        dispatch(setHtmlContent(item.data))
        dispatch(setEditingPage({page:item}))
        dispatch(setPageInView({page:item}))
        navigate(Paths.editPage.createRoute(item.id))
      }  
    }

    const handleNavigate=()=>{
      console.log(item)
        if(item &&item.storyIdList){
              dispatch(setCollectionInView({collection:item}))
              navigate(Paths.collection.createRoute(item.id))
        }else{
           
              dispatch(setPageInView({page:item}))
              navigate(Paths.page.createRoute(item.id))
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
   const soCanUserEdit=()=>{
      let found = item && item.roles?item.roles.find(role=>currentProfile && role.profileId==currentProfile.id):null
      if(currentProfile && item){
        if(currentProfile.id==item.authorId){
          setCanUserEdit(true)
          return
        }
        if(currentProfile.id==item.profileId){
          setCanUserEdit(true)
          return
        }
        if(found && found.role == RoleType.editor){
          setCanUserEdit(true)
          return
        }
      }
      setCanUserEdit(false)
   }

    const handleAddToClick = ()=>{
      if(item && item.storyIdList){
       navigate(Paths.addStoryToCollection.collection(item.id))
      }else{
       navigate(Paths.addStoryToCollection.story(item.id))
      }
    }

   
   


    return(
  
                <div className="border-3  my-2   px-8 flex flex-row justify-between  mx-auto shadow-sm  rounded-full w-[96%] min-h-[6rem] w-full  py-[1.4em] border-emerald-300">
                
         <div className=" h-fit my-auto md:w-[30em]  text-ellipsis overflow-hidden ">
              
              
                   {item.title && item.title.length>0? 
                     <span className={`   text-emerald-700 my-auto`}>
                   <h6   onClick={handleNavigate}
         className={`text-[0.9rem] md:text-[1.3rem ] md:w-[20em]   text-left  no-underline text-ellipsis     whitespace-nowrap    `}>
       {item.title}</h6></span>:
 <span className={`  whitespace-nowrap max-w-[45vw]  text-emerald-700 no-underline text-ellipsis my-auto`}>
                   <h6  onClick={handleNavigate}  className={`text-[0.9rem] text-left lg:text-[1rem] text-ellipsis   
                   whitespace-nowrap text-emerald-700 no-underline  my-auto`}
                   >Untitled</h6></span>}
                   

</div>

           
              { canUserEdit?(
       
       <div className="dropdown  my-auto w-fit dropdown-left">
  <div  tabIndex={0} role="button" className=" m-1 p-2 rounded-full bg-emerald-800 "> <img className="  my-auto mx-auto  " src={edit}/></div>
  <ul tabIndex={0} className="dropdown-content menu bg-emerald-50 rounded-box z-10 w-52 p-2 shadow">
  <li className="" onClick={
        handleEditClick}><a className="text-green-600 ">Edit</a></li>
       {!item.storyIdList?<li className="text-green-600 " onClick={handleFeedback}>Get Feedback</li>:null}
       {canUserAdd?<li className="text-green-600 no-underline" onClick={handleAddToClick}><a className="no-underline text-green-600">{item && item.storyIdList!=null?`Add items to ${item.title}`:"Add to Collection" }</a></li>:null}
  </ul>
  </div>
       
  )
  : canUserAdd&&!canUserEdit?(
  
   <div className="dropdown my-auto w-fit dropdown-left">
   <div tabIndex={0} role="button" className=" m-1 p-2 rounded-full bg-emerald-800 "> <img classname="my-auto mx-auto  " src={addBox}/></div>
   <ul tabIndex={0} className="dropdown-content menu bg-emerald-50 rounded-box z-10  w-52 p-2 shadow">
  
         <li className="no-underline text-emerald-600"  onClick={handleAddToClick}><a className="no-underline text-green-600">{item && item.storyIdList!=null?`Add items to ${item.title}`:"Add to Collection" }</a></li>
         <li  onClick={copyShareLink}><a className="text-emerald-600 no-underline" >Share</a></li>
         </ul>
  
       
  
      </div>
  ) :null}  
        

</div>
               
                
               )
           
    
    }
    
  
    export default IndexItem
