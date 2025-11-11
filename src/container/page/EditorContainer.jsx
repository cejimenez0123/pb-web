import "../../styles/Editor.css"
import "../../App.css"
import {useDispatch, useSelector} from "react-redux"
import { useParams,useNavigate, useLocation} from "react-router-dom"
import menu from "../../images/icons/menu.svg"
import { useContext, useEffect, useLayoutEffect, useState,useRef } from "react"
import checkResult from "../../core/checkResult"
import { useMediaQuery } from "react-responsive"
import { PageType } from "../../core/constants"
import Paths from "../../core/paths"
import {createStory, deleteStory, getStory, updateStory } from "../../actions/StoryActions"
import ErrorBoundary from "../../ErrorBoundary"
import HashtagForm from "../../components/hashtag/HashtagForm"
import RoleForm from "../../components/role/RoleForm"
import isValidUrl from "../../core/isValidUrl"
import Context from "../../context"
import EditorDiv from "../../components/page/EditorDiv"
import {  setEditingPage, setHtmlContent, setPageInView,   } from "../../actions/PageActions.jsx"
import { debounce } from "lodash"
import EditorContext from "./EditorContext"
import FeedbackDialog from "../../components/page/FeedbackDialog"
import { IonBackButton, IonButtons, IonContent, IonHeader } from "@ionic/react"
import { setDialog } from "../../actions/UserActions.jsx"


function EditorContainer({presentingElement}){
        const {currentProfile}=useContext(Context)
        const [feedbackDialog,setFeedbackDialog]=useState(false)
        const {setError,setSuccess}=useContext(Context)
        const dialog = useSelector(state=>state.users.dialog)
        const [fetchedPage,setFetchedPage]=useState(null)
        const editPage = useSelector(state=>state.pages.editingPage)
        const pageInView = useSelector(state=>state.pages.pageInView)
        const htmlContent = useSelector(state=>state.pages.editorHtmlContent)
        const [openDescription,setOpenDescription]=useState(false)
        const dispatch = useDispatch()
        const md = useMediaQuery({ query: '(min-width:800px)'})
        const navigate = useNavigate()
        const location = useLocation()
        let href =location.pathname.split("/")
        const last = href[href.length-1]
       const id = href[href.length-2]
      const [description,setDescription]=useState("")
        const {isSaved,setIsSaved}=useContext(Context)
       const [openHashtag,setOpenHashtag]=useState(false)
       const [openRoles,setOpenRoles]=useState(false)
       const [needsFeedback,setNeedFeedback]=useState(false)
        const [isPrivate,setIsPrivate] = useState(true)
        const [titleLocal,setTitleLocal]=useState("")
        const [commentable,setCommentable] = useState(true)
  
        const [parameters,setParameters] = useState(editPage?{page:editPage,title:titleLocal,
          data:editPage.data,
          needsFeedback:needsFeedback,
          description:editPage && editPage.description?editPage.description:pageInView && pageInView.description?pageInView.description:description
          ,
          type:id=="link"||id=="image"?id:editPage.type??PageType.text,
         
          privacy:isPrivate,
          commentable:commentable
        }:{type:id})
        
  


// inside your component
const hasInitialized = useRef(false);

useEffect(() => {
  // skip on initial load
  if (!hasInitialized.current) {
    hasInitialized.current = true;
    return;
  }

  let params = { ...parameters };
  params.data = htmlContent.html??"";
  if(last!="edit"){params.type=last

  };
 if(last=="edit"){
   params.id = id;
 }

  params.isPrivate = isPrivate;
  params.description = description;
  params.needsFeedback = needsFeedback;
  console.log(htmlContent)
  params.data = htmlContent.html
  setParameters(params);
  last=="edit"?dispatchUpdate(params):createPageAction(params);

}, [htmlContent, isPrivate, description, needsFeedback]);

      useEffect(()=>{
        
        if(fetchedPage&&currentProfile){
          if((last==PageType.picture||last==PageType.link)&&isValidUrl(htmlContent)){
              let params = parameters
              params.data = htmlContent.html

              params.type = last 
              params.profileId = currentProfile.id
              setParameters(params)
             
          } }  
      
      
    
        
      },[])
               const handleBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(Paths.discovery());
    }
  };

   useEffect(()=>{
    last=="edit" && fetchStory()
   },[])
 const setStoryData=(story)=>{
        
             setFetchedPage(story)   
             setTitleLocal(story.title)
             setCommentable(story.commentable)
             setIsPrivate(story.isPrivate)
             
  }
 
    const fetchStory = ()=>{
  // if(id){
  
  try{
  if(last=="edit"){
      dispatch(getStory({id:id})).then(res=>{
        checkResult(res,payload=>{
     
          const {story}=payload

          dispatch(setHtmlContent({html:story.data}))
          dispatch(setEditingPage({page:story}))
          dispatch(setPageInView({page:story}))
          setStoryData(story)
          let params = parameters
          params.page = story
          params.isPrivate = story.privacy
          params.data = story.data
          setParameters(params)
          setTitleLocal(story.title)
      },err=>{

       setSuccess(null)
      })})
    }else{
       dispatch(getStory({id:id})).then(res=>{
        checkResult(res,payload=>{
     
          const {story}=payload

          dispatch(setHtmlContent({html:story.data}))
                 dispatch(setEditingPage({page:story}))
                        dispatch(setPageInView({page:story}))
          setStoryData(story)
          let params = parameters
          params.page = story
          params.isPrivate = story.privacy
          params.data = story.data
          setParameters(params)
          setTitleLocal(story.title)
      },err=>{

       setSuccess(null)
      })})
    }
    }catch(err){
      setError(err.message)
    }
    
    }
  

   
      const [open, setOpen] = useState(false);

    
      const handleClose = () => {
        setOpen(false);
      };
      const handleDelete =debounce(()=>{
          dispatch(deleteStory(parameters)).then(()=>{
            navigate(Paths.myProfile)
          })
          handleClose()
      },10)
      const createPageAction = (params)=>{
           let pars = params??parameters??{}
        pars.profileId = currentProfile.id
        pars.description = description
        pars.title = titleLocal
        pars.isPrivate = isPrivate
        pars.type = last=="edit"?editPage.type??PageType.text:last
        pars.commentable = commentable
        pars.data = htmlContent.html
   setParameters({...parameters,...pars})
      if(!editPage){
 
        dispatch(createStory(parameters)).then(res=>checkResult(res,payload=>{
          const {story}=payload
          navigate(Paths.page.createRoute(story.id))
       
     },err=>{

setError(err.message)
     }))
    }else{
      dispatchUpdate(parameters)
    }
      }
        const handleClickAddToCollection=()=>{
        
          navigate(Paths.addStoryToCollection.story(id))
        }
  const handleisPrviate=debounce((truthy)=>{
 
          setOpenDescription(false)
          setIsPrivate(truthy)
          setNeedFeedback(false)
          setParameters({...parameters,isPrivate:truthy})
          setFeedbackDialog(false)
          setOpenDescription(false)
          dispatchUpdate(parameters)
       
          
       
        },10)

          
      const handleTitle = (title)=>{
          setTitleLocal(title)
          let params = parameters
          params.title = title
          setParameters(params)
          dispatchUpdate(parameters)
      }
  
   const topBar=()=>{
    return(<div className=" rounded-lg  w-[100%] sm:max-w-[50em] mx-auto ">
    <div className=" text-emerald-800  bg-gradient-to-br from-emerald-100 to-emerald-400   flex flex-row sm:rounded-t-lg border border-white   ">
        <div 
      className=" flex-1 text-left border-white border-r-2  "
      >
       
        {isSaved?<h6 className=" text-left p-1 mx-1 text-sm  ">Saved</h6>:
      <h6 className="text-left mx-1 p-1 text-sm">Draft</h6>}
      <input type="text " 
      className="p-2  w-[90%]  text-emerald-8  text-xl  bg-transparent font-bold"
       value={titleLocal} onChange={(e)=>handleTitle(e.target.value)}
      
      placeholder="Untitled"/>

      </div>

      <div className="  h-[100%] ">  
      
      <div className="dropdown dropdown-bottom   dropdown-end">
      <div tabIndex={0} role="button" ><img className="min-w-16 min-h-[4rem]   bg-emerald-600 rounded-lg mt-1 mx-auto" src={menu}/></div>
      <ul tabIndex={0} className="dropdown-content text-center menu bg-white rounded-box z-[1] shadow">
        <li className="text-emerald-600 pt-3 pb-2 "
        onClick={handleClickAddToCollection}><a className="text-emerald-600 text-center">Add to Collection</a></li>
        <li onClick={()=>{
        setOpenDescription(false)
          setFeedbackDialog(true)
        }} className="text-emerald-600 pt-3 pb-2 "><a className="text-emerald-600 text-center">Get Feedback</a></li>
        {id?<li className=" pt-3 pb-2" onClick={()=>{navigate(Paths.page.createRoute(id))}}><a className="mx-auto text-emerald-600 my-auto">View</a></li>:null}
{isPrivate?<li onClick={()=>{
    setFeedbackDialog(false) 
    setOpenDescription(true)} }
className="text-emerald-600 pt-3 pb-2 ">Publish Publicly</li>:
<li className="text-emerald-600 pt-3 pb-2 " onClick={()=>{

  handleisPrviate(true)
  }}>Make Private</li>}
  {!isPrivate?<li className="text-emerald-600 pt-3 pb-2 " onClick={()=>{
       setFeedbackDialog(false) 
 setOpenDescription(true)
  }}>Edit Description</li>:null}
        <li className="text-emerald-600 pt-3 pb-2 " onClick={()=>setOpenHashtag(!openHashtag)}> {openHashtag?"Close":"Add"} Hashtag</li>
        {fetchedPage?<li className="text-emerald-600 pt-3 pb-2" onClick={()=>{
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
  //  useEffect(()=>{
  //   dispatchUpdate(parameters)
  //  },parameters)
   useEffect(()=>{
    let params = parameters
    console.log
  params.data=htmlContent.html
    params.id = id
   params.isPrivate=isPrivate
   params.description = description
   params.needsFeedback = needsFeedback
setParameters(params)
    
   },[htmlContent.html])
   const handleFeedback=()=>{

      let params = parameters
       params.description = description
       params.needsFeedback = true
       setParameters(params)
       if(params.page.id){
        navigate(Paths.workshop.createRoute(params.page.id))
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
const dispatchUpdate =debounce((params)=>{
  setIsSaved(false) 
 
 dispatch(updateStory({...params,type:last=="edit"?editPage.type??PageType.text:last,data:htmlContent.html,description})).then(res=>{
    checkResult(res,payload=>{
    
      if(payload.story){

setIsSaved(true)
return true 
      }
  
    },err=>{
      setError(err.message)
      return false
    })}
,300)

})
const openRoleFormDialog = (fetchedPage) => {
  const dia = {...dialog};
  dia.isOpen = true;
  dia.fullScreen = !md; // replicate your fullscreen condition from the prop
  dia.title = "Manage Roles"; // optionally add a title
  dia.text = <div>
      <RoleForm
        item={fetchedPage}
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
const handleSetDescription=(e)=>{

  setDescription(e)
  dispatchUpdate({...parameters,description:e})
}
        return(
          <EditorContext.Provider value={{page:fetchedPage,parameters,setParameters}}>
          <IonContent fullscreen={true} className="ion-padding"  >
            <IonHeader className=" ion-padding py-8 ">
              <IonButtons className="ion-padding" >
                <div className="pt-4 pl-4">
                <IonBackButton  defaultHref={Paths.myProfile} onClick={handleBack}/></div></IonButtons>

            <IonButtons>{topBar()}</IonButtons>
            </IonHeader>
          <div  className=" mx-auto md:p-8  "> 
     
                <div className= "mx-2 md:w-page pt-8 mb-12 mx-auto">
            
                  <ErrorBoundary>
           
          <EditorDiv  
          createPageAction={createPageAction}
    page={editPage}
            
              handleChange={(content)=>{
                dispatch(setHtmlContent({html:content}))
              }}/>
                </ErrorBoundary>
                </div>
                    <div>
       
<FeedbackDialog 

page={editPage}
open={feedbackDialog||openDescription} 
isFeedback={feedbackDialog}
presentingElement={presentingElement}
handleChange={handleSetDescription} 
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



