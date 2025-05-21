import "../../styles/Editor.css"
import "../../App.css"
import {useDispatch, useSelector} from "react-redux"
import { useParams,useNavigate, useLocation} from "react-router-dom"
import menu from "../../images/icons/menu.svg"
import React,{ useContext, useEffect, useLayoutEffect, useState } from "react"
import {  Button,} from "@mui/material"
import checkResult from "../../core/checkResult"
import { useMediaQuery } from "react-responsive"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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


function EditorContainer(props){
        const {currentProfile}=useContext(Context)
        const [feedbackDialog,setFeedbackDialog]=useState(false)
        const {setError,setSuccess}=useContext(Context)
  
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
          type:editPage?editPage.type:pageInView?pageInView.type:last,
          privacy:isPrivate,
          commentable:commentable
        })
        
  

      useEffect(()=>{
        if(!fetchedPage){
          if((last==PageType.picture||last==PageType.link)&&isValidUrl(htmlContent)){
              let params = parameters
              params.data = htmlContent

              params.type = last 
              setParameters(params)
          }   
          }

   
          if(last==PageType.picture||last==PageType.link){
            if(isValidUrl(htmlContent)&&currentProfile){
             let params = parameters
              params.data= htmlContent
              setParameters(parameters)
              createPageAction(params)
            }
     
          }
          let params = parameters
          params.data =htmlContent
    setParameters(params)
        
      },[htmlContent])
     
      // const dispatchContent=(content)=>{
      //       let params = parameters
      //       params.data = content
      //       console.log("Content",content)
      //       setParameters(params)
      //       dispatch(setHtmlContent({html:content}))
      // }
   
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
           params.type = PageType.picture
           setParameters(params)
           if(currentProfile){
            createPageAction(parameters)
           }
        }else{
          let params = parameters
          params.data = htmlContent.html
          params.type = PageType.text
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
        const handlePostPublicly=debounce((truthy)=>{
  
          let params = parameters
          params.description = description
          setNeedFeedback(false)
          setIsPrivate(truthy)
          params.isPrivate = truthy
          params.needsFeedback = false
       
          setParameters(params)
      
         setFeedbackDialog(false)
    setOpenDescription(false)
  
    if(!truthy){
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
  handlePostPublicly(true)
  }}>Make Private</li>}
  {!isPrivate?<li className="text-emerald-600 pt-3 pb-2 " onClick={()=>{
       setFeedbackDialog(false) 
 setOpenDescription(true)
  }}>Edit Description</li>:null}
        <li className="text-emerald-600 pt-3 pb-2 " onClick={()=>setOpenHashtag(!openHashtag)}> {openHashtag?"Close":"Add"} Hashtag</li>
        {fetchedPage?<li className="text-emerald-600 pt-3 pb-2" onClick={()=>setOpenRoles(!openRoles)}>Share</li>:null}
        <li className="text-emerald-600 pt-3 pb-2" onClick={()=>setOpen(true)}>Delete</li>
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
    dispatchUpdate(parameters)
   },[htmlContent,parameters.data,parameters.description,parameters.title])
   const handleFeedback=()=>{
   
    let params = parameters
       params.description = feedback
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
const dispatchUpdate =debounce((content)=>{
  setIsSaved(false)
  
  let params = parameters

 dispatch(updateStory(params)).then(res=>{
    checkResult(res,payload=>{
      console.log(JSON.stringify(payload))
      if(payload.story){

setIsSaved(true)
return true 
      }
  
    },err=>{
      setError(err.message)
      return false
    })}
,10)

})
        return(
          <EditorContext.Provider value={{page:fetchedPage,parameters,setParameters}}>
          <div  className=" mx-auto md:p-8  "> 
     
                <div className= "mx-2 md:w-page pt-8 mb-12 mx-auto">
                {topBar()}
                  <ErrorBoundary>
           
          <EditorDiv  
          createPage={createPageAction}
    
            
              handleChange={()=>{}}/>
                </ErrorBoundary>
                </div>
                    <div>
                    <Dialog
                    fullScreen={!md}
        open={openRoles}
        onClose={()=>{
          setOpenRoles(false)
        }}
        className=""
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
          <div>
            <RoleForm item={fetchedPage}
            onClose={()=>{
              setOpenRoles(false)
            }}/>
          </div>
      
  
      </Dialog>
<FeedbackDialog 

page={editPage}
open={feedbackDialog||openDescription} 
isFeedback={feedbackDialog}

handleChange={setDescription} 
handleFeedback={handleFeedback}
handlePostPublic={()=>handlePostPublicly(false)}
handleClose={()=>{
    setIsPrivate(true)
    setOpenDescription(false)
    setFeedbackDialog(false)
}} />

      <Dialog

      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      open={open}>
        <div className="rounded-lg">
        <DialogTitle id="alert-dialog-title">
          {"Deleting?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this page?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleDelete}>
            Agree
          </Button>
        </DialogActions>
        </div>
      </Dialog>
    </div>
      </div>
      </EditorContext.Provider>
  )    


}

export default EditorContainer


