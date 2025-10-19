import "../../styles/Editor.css"
import "../../App.css"
import {useDispatch, useSelector} from "react-redux"
import { useParams,useNavigate, useLocation} from "react-router-dom"
import menu from "../../images/icons/menu.svg"
import React,{ useContext, useEffect, useLayoutEffect, useState } from "react"
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
        const pathParams = useParams()
        const dispatch = useDispatch()
        const md = useMediaQuery({ query: '(min-width:768px)'})
        const navigate = useNavigate()
        const location = useLocation()
        let href =location.pathname.split("/")
        const last = href[href.length-1]
        const [pageType,setPageType]=useState(editPage?editPage.type:last==PageType.link||last==PageType.picture?last:editPage?editPage.type:PageType.text)
      const [description,setDescription]=useState("")
        const {isSaved,setIsSaved}=useContext(Context)
       const [openHashtag,setOpenHashtag]=useState(false)
       const [openRoles,setOpenRoles]=useState(false)
       const [needsFeedback,setNeedFeedback]=useState(editPage?editPage.needsFeedback:pageInView?pageInView.needsFeedback:false)
        const [isPrivate,setIsPrivate] = useState(editPage?editPage.isPrivate:pageInView?pageInView.isPrivate:true)
        const [titleLocal,setTitleLocal]=useState(editPage?editPage.title:pageInView?pageInView.title:"")
        const [commentable,setCommentable] = useState(editPage?editPage.commentable:pageInView?pageInView.commentable:true)
        const {id }= pathParams
        const [parameters,setParameters] = useState({page:editPage?editPage:pageInView?pageInView:pathParams,title:titleLocal,
          data:editPage?editPage.data:pageInView?pageInView.data:"",
          needsFeedback:needsFeedback,
          description:editPage && editPage.description?editPage.description:pageInView && pageInView.description?pageInView.description:description
          ,
          type:pageType,
          privacy:isPrivate,
          commentable:commentable
        })
        
  

      useEffect(()=>{
        if(fetchedPage){
          if((last==PageType.picture||last==PageType.link)&&isValidUrl(htmlContent)){
              let params = parameters
              params.data = htmlContent

              params.type = last 

              setParameters(params)
             
          }   
          }else{

   
          if(last==PageType.picture||last==PageType.link){
            if(isValidUrl(htmlContent)){
             let params = parameters
              params.data= htmlContent
              params.type = last
              setParameters(params)
              createPageAction(params)
            }
     
          }}
      
    
        
      },[htmlContent])
     

   
    useLayoutEffect(()=>{
      if(currentProfile){
        fetchStory()
      }
    },[currentProfile,location.pathname])

    useLayoutEffect(()=>{
return ()=>{
  const {page}=parameters
            if(page){
             if(parameters.data &&parameters.title && parameters.data.length==0 && parameters.title.length==0){
         
              dispatch(deleteStory({page:page}))}
             }
          }
    },[])
    useEffect(()=>{
        if(last==PageType.picture&&htmlContent.length>5&&parameters.page && !parameters.page.id){
           let params = parameters
           params.data = htmlContent
          
           setParameters(params)
            createPageAction(parameters)
       
        }else if(last==PageType.link){
          let params = parameters
          params.data = htmlContent
      
          setParameters(params)
           createPageAction(parameters)
        }else{
          let params = parameters
          params.data = htmlContent.html
       
          setParameters(params)
        }
    },[htmlContent])
  const setStoryData=(story)=>{
        
             setFetchedPage(story)   
             setTitleLocal(story.title)
             setCommentable(story.commentable)
             setIsPrivate(story.isPrivate)
             
  }
    const fetchStory = ()=>{
  if(id){
      dispatch(getStory({id:id})).then(res=>{
        checkResult(res,payload=>{
        
          const {story}=payload
          dispatch(setHtmlContent(story.data))
          dispatch(setEditingPage({page:story}))
          dispatch(setPageInView({page:story}))
          setStoryData(story)
          let params = parameters
          params.page = story
          setParameters(params)
          setTitleLocal(story.title)
      },err=>{

       setSuccess(null)
      })})}
    }
  

   
      const [open, setOpen] = useState(false);

    
      const handleClose = () => {
        setOpen(false);
      };
      const handleDelete =debounce(()=>{
          dispatch(deleteStory(parameters)).then(()=>{
            navigate(Paths.myProfile())
          })
          handleClose()
      },10)
      const createPageAction = (params)=>{
        
        let pars = params
        pars.profileId = currentProfile.id
        pars.title = titleLocal
    
        pars.profileId = currentProfile.id
        pars.isPrivate = isPrivate
        pars.commentable = commentable
     
       setParameters(pars)
        dispatch(createStory(pars)).then(res=>checkResult(res,payload=>{
          const {story}=payload
          dispatch(setEditingPage({page:story}))
          navigate(Paths.editPage.createRoute(story.id))
     },err=>{

setError(err.message)
     }))
      }
        const handleClickAddToCollection=()=>{
        
          navigate(Paths.addStoryToCollection.story(id))
        }
  const handleisPrviate=debounce((truthy)=>{
 
setOpenDescription(false)
          setIsPrivate(truthy)
        
          setNeedFeedback(false)
      let params = parameters
         params.isPrivate = truthy
          setParameters(params)
      
         setFeedbackDialog(false)
        setOpenDescription(false)
  
    if(!isPrivate){
      navigate(Paths.page.createRoute(id))
   }
       
          
       
        },10)

          
        const handleTitle = (title)=>{
          setTitleLocal(title)
          let params = parameters
          params.title = title
          setParameters(params)
          
          

      }
  
   const topBar=()=>{
    return(<div className=" rounded-lg w-full  mx-auto ">
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
        {parameters.page && parameters.page.id?<li className=" pt-3 pb-2" onClick={()=>{navigate(Paths.page.createRoute(parameters.page.id))}}><a className="mx-auto text-emerald-600 my-auto">View</a></li>:null}
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
    {openHashtag?<div className="bg-emerald-50">
    <HashtagForm item={parameters.page}/>
  </div>:null}
    </div>)
   }
   useEffect(()=>{
    let params = parameters
  params.data=htmlContent
 
   params.isPrivate=isPrivate
   params.needsFeedback = needsFeedback
setParameters(params)
    dispatchUpdate(params)
   },[htmlContent,isPrivate,parameters.privacy,parameters.type,parameters,parameters.data,parameters.description,parameters.title])
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

 dispatch(updateStory(params)).then(res=>{
    checkResult(res,payload=>{
    
      if(payload.story){

setIsSaved(true)
return true 
      }
  
    },err=>{
      setError(err.message)
      return false
    })}
,100)

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
        return(
          <EditorContext.Provider value={{page:fetchedPage,parameters,setParameters}}>
          <IonContent fullscreen={true} scrollY className="ion-padding pt-8">
            <IonHeader>
              <IonButtons >
                <IonBackButton  defaultHref={Paths.myProfile()}/></IonButtons>
            <IonButtons>{topBar()}</IonButtons>
            </IonHeader>
          <div  className=" mx-auto md:p-8  "> 
     
                <div className= "mx-2 md:w-page pt-8 mb-12 mx-auto">
            
                  <ErrorBoundary>
           
          <EditorDiv  
          createPage={createPageAction}
    page={editPage}
            
              handleChange={()=>{}}/>
                </ErrorBoundary>
                </div>
                    <div>
       
<FeedbackDialog 

page={editPage}
open={feedbackDialog||openDescription} 
isFeedback={feedbackDialog}
presentingElement={presentingElement}
handleChange={setDescription} 
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


