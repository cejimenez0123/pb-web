import "../../styles/Editor.css"
import "../../App.css"
import {useDispatch, useSelector} from "react-redux"
import menu from "../../images/icons/menu.svg"
import { useContext, useEffect, useState,useRef } from "react"
import checkResult from "../../core/checkResult"
import { useMediaQuery } from "react-responsive"
import { PageType } from "../../core/constants"
import Paths from "../../core/paths"
import {createStory, deleteStory, getStory, updateStory } from "../../actions/StoryActions"
import ErrorBoundary from "../../ErrorBoundary"

import HashtagForm from "../../components/hashtag/HashtagForm"
import RoleForm from "../../components/role/RoleForm"
import Context from "../../context"
import EditorDiv from "../../components/page/EditorDiv"
import {  setEditingPage, setHtmlContent, setPageInView,   } from "../../actions/PageActions.jsx"
import debounce from "../../core/debounce.js"
import EditorContext from "./EditorContext"
import FeedbackDialog from "../../components/page/FeedbackDialog"
import { IonBackButton, IonButtons, IonContent, IonHeader, useIonRouter } from "@ionic/react"
import { setDialog } from "../../actions/UserActions.jsx"
import { useParams } from "react-router"


function EditorContainer({presentingElement}){
        const currentProfile=useSelector(state=>state.users.currentProfile)
        const [feedbackDialog,setFeedbackDialog]=useState(false)
        const {setError,setSuccess}=useContext(Context)
        const dialog = useSelector(state=>state.users.dialog)
        const editPage = useSelector(state=>state.pages.editingPage)
        const [pending,setPending]=useState(false)
        const htmlContent = useSelector(state=>state.pages.editorHtmlContent)
        const [openDescription,setOpenDescription]=useState(false)
        const dispatch = useDispatch()
        const md = useMediaQuery({ query: '(min-width:800px)'})
        const router = useIonRouter()
        const {id,type}= useParams()
        const notText= type!=PageType.link&&type!=PageType.picture
        const [openHashtag,setOpenHashtag]=useState(false)
        const {isSaved,setIsSaved}=useContext(Context)
        const [parameters,setParameters] = useState({isPrivate:true,data:"",title:"",needsFeedback:false,description:"",commentable:true,profile:currentProfile,profileId:currentProfile?currentProfile.id:""})
    
const hasInitialized = useRef(false);


      useEffect(()=>{
          if (!hasInitialized.current) {
    hasInitialized.current = true;
    return;
  }

      },[])
               const handleBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.push(-1);
    } else {
      router.push(Paths.discovery());
    }
  };
  
  const setStory=(story)=>{
    

          dispatch(setHtmlContent({html:story.data}))
          dispatch(setEditingPage({page:story}))
          dispatch(setPageInView({page:story}))

          handleSet("commentable",story.commentable)
          handleSet("page",story)
          handleSet("isPrivate",story.isPrivate)
          handleSet("data",story.data)
          handleSet("title",story.title)
          handleSet("type",story.type)
           setPending(false)
     
  }
   useEffect(()=>{
  notText && fetchStory()
    
   },[currentProfile])

   const handleChange = (key, value) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
  };
    const handleSet = (key, value) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
  };
  useEffect(()=>{

  if(currentProfile && currentProfile.id &&notText){
    setIsSaved(false)
   return debounce(()=>{
      dispatch(updateStory({...parameters,profileId:currentProfile.id,id:editPage.id})).then(res=>checkResult(res,payload=>{
 
        setIsSaved(true)
  
      },err=>{
        setError(err.message)
      }))
  },100)
  }

  },[parameters.title,parameters.data,parameters.isPrivate,parameters.needsFeedback,parameters.description,parameters.commentable])
    const fetchStory = ()=>{
      setPending(true)
  try{
if(id){
       dispatch(getStory({id:id})).then(res=>{
        checkResult(res,payload=>{
     
          const {story}=payload
        setStory(story)
       setPending(false)
},err=>{
  setError(err.message)
  setPending(false)
})})}
}catch(er){
  window.alert(er.message)
}}

    
  
    useEffect(()=>{
      
  if(type==PageType.text){
    createPageAction()
  }
    },[])

      const handleDelete =debounce(()=>{
          dispatch(deleteStory(parameters)).then(()=>{
            router.push(Paths.myProfile)
          })
      
      },10)
      const createPageAction = ()=>{
        
      if(currentProfile && currentProfile.id && type){
       
        dispatch(createStory({...parameters,type,profile:currentProfile,profileId:currentProfile.id})).then(res=>checkResult(res,payload=>{
          const {story}=payload
          dispatch(setEditingPage({page:story}))
          setStory(story)
          router.push(Paths.editPage.createRoute(story.id))
          
       
     },err=>{

setError(err.message)
     }))
    }
      }
    const handleClickAddToCollection=()=>{
          router.push(Paths.addStoryToCollection.story(id))
        }
  const handleisPrviate=debounce((truthy)=>{
          setOpenDescription(false)
          handleChange("needsFeedback",false)
          handleChange("isPrivate",truthy)
          setFeedbackDialog(false)
          setOpenDescription(false)
        },10)


   const topBar=()=>{
    return(<div className=" rounded-lg  w-[100%] h-fit sm:max-w-[50em] mx-auto ">
    <div className=" text-emerald-800  bg-gradient-to-br from-emerald-100 to-emerald-400   flex flex-row sm:rounded-t-lg border border-white   ">
        <div 
      className=" flex-1 text-left border-white border-r-2  "
      >
       
        {isSaved?<h6 className=" text-left p-1 mx-1 text-sm  ">Saved</h6>:
      <h6 className="text-left mx-1 p-1 text-sm">Draft</h6>}
      <input type="text " 
      className="p-2  w-[90%]  text-emerald-8  text-[1rem]  bg-transparent font-bold"
       value={parameters.title} onChange={(e)=>handleChange("title",e.target.value)}
      
      placeholder="Untitled"/>

      </div>

      <div className=" ">  
      
      <div className="dropdown dropdown-bottom   dropdown-end">
      <div tabIndex={0} role="button" ><img className="min-w-16 min-h-[5rem]   bg-emerald-600 rounded-lg mt-1 mx-auto" src={menu}/></div>
      <ul tabIndex={0} className="dropdown-content text-center menu bg-white rounded-box z-[1] shadow">
        <li className="text-emerald-600 pt-3 pb-2 "
        onClick={handleClickAddToCollection}><a className="text-emerald-600 text-center">Add to Collection</a></li>
        <li onClick={()=>{
        setOpenDescription(false)
          setFeedbackDialog(true)
        }} className="text-emerald-600 pt-3 pb-2 "><a className="text-emerald-600 text-center">Get Feedback</a></li>
        {editPage?<li className=" pt-3 pb-2" onClick={()=>{router.push(Paths.page.createRoute(editPage.id))}}><a className="mx-auto text-emerald-600 my-auto">View</a></li>:null}
{!(editPage&&editPage.id)?null:parameters.isPrivate?<li onClick={()=>{
    setFeedbackDialog(false) 
    setOpenDescription(true)} }
className="text-emerald-600 pt-3 pb-2 ">Publish Publicly</li>:
<li className="text-emerald-600 pt-3 pb-2 " onClick={()=>{

  handleChange("isPrivate",true)
  }}>Make Private</li>}
  {!parameters.isPrivate?<li className="text-emerald-600 pt-3 pb-2 " onClick={()=>{
       setFeedbackDialog(false) 
 setOpenDescription(true)
  }}>Edit Description</li>:null}
        <li className="text-emerald-600 pt-3 pb-2 " onClick={()=>setOpenHashtag(!openHashtag)}> {openHashtag?"Close":"Add"} Hashtag</li>
        {editPage?<li className="text-emerald-600 pt-3 pb-2" onClick={()=>{
          openRoleFormDialog(parameters.page);setOpenRoles(!openRoles)}}>Manage Access</li>:null}
        <li className="text-emerald-600 pt-3 pb-2" onClick={openConfirmDeleteDialog}>Delete</li>
      </ul>
    </div>
      
  </div>
  <div>
    
  </div>

  
    </div>
    {openHashtag?<div className="bg-emerald-50 w-full">
    <HashtagForm item={parameters.page}/>
  </div>:null}
    </div>)
   }


   const handleFeedback=()=>{

       if(id){
        router.push(Paths.workshop.createRoute(id))
       }

      

   }
   setTimeout(()=>{

    setError(null)
  setSuccess(null)
  
 
},4001)
const openConfirmDeleteDialog = () => {
  let dia = {};
  dia.isOpen = true;
  dia.title = "Are you sure you want to delete this page?";
  dia.text = ""; // No additional text
  dia.onClose = () => {
    dispatch(setDialog({ isOpen: false }));
  };
  dia.agreeText = "Delete";
  dia.agree = () => {
    handleDelete();
    dispatch(setDialog({ isOpen: false }));
  };
  dia.disagreeText = "Close";
  dia.disagree = () => {
    dispatch(setDialog({ isOpen: false }));
  };

  dispatch(setDialog(dia));
};

const openRoleFormDialog = () => {
  const dia = {...dialog};
  dia.isOpen = true;
  dia.fullScreen = !md; // replicate your fullscreen condition from the prop
  dia.title = "Manage Roles"; // optionally add a title
  dia.text = <div>
      <RoleForm
        item={editPage}
        onClose={() => {
          dispatch(setDialog({ isOpen: false }));
        }}
      />
    </div>
  
  dia.onClose = () => {
    dispatch(setDialog({ isOpen: false }));
  };

  dia.agreeText = null;
  dia.agree = null;

  dispatch(setDialog(dia));
};
   

        return(
          <EditorContext.Provider value={{page:editPage,parameters,setParameters}}>
          <IonContent fullscreen={true} className="ion-padding"  >
            <IonHeader className=" ion-padding py-8 ">
              <IonButtons className="ion-padding" >
                <div className="pt-4"  onClick={handleBack}>
                <IonBackButton  defaultHref={Paths.myProfile} /></div></IonButtons>

            <IonButtons>{pending? <div className="skeleton rounded-lg  w-[100%] h-fit sm:max-w-[50em] mx-auto "/>: topBar()}</IonButtons>
            </IonHeader>
          <div  className=" mx-auto md:p-8  "> 
     
                <div className= "mx-2 md:w-page pt-8 mb-12 mx-auto">
            
                  <ErrorBoundary>

         {pending?<div className="skeleton mx-auto bg-slate-100 max-w-[96vw] mx-auto md:w-page h-page"/>: <EditorDiv
    html={htmlContent.html}
    page={editPage}
            
              handleChange={(key,value)=>{
            
          
                handleChange("data",value)
              }}/>}
                </ErrorBoundary>
                </div>
                    <div>
       
<FeedbackDialog 

page={editPage}
open={feedbackDialog||openDescription} 
isFeedback={feedbackDialog}
presentingElement={presentingElement}
handleChange={e=>handleChange("description",e)} 
handleFeedback={handleFeedback}
handlePostPublic={()=>{
  handleisPrviate(false)}}
handleClose={()=>{

  
    setOpenDescription(false)
    setFeedbackDialog(false)
}} />


      
    </div>
      </div>
      </IonContent>
      </EditorContext.Provider>
  )    


}

export default EditorContainer



