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
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import isValidUrl from "../../core/isValidUrl"
import Context from "../../context"
import EditorDiv from "../../components/page/EditorDiv"
import {  setEditingPage, setHtmlContent, setPageInView,   } from "../../actions/PageActions"
import { debounce } from "lodash"
import EditorContext from "./EditorContext"
import { LastPageSharp } from "@mui/icons-material"

function EditorContainer(props){
    
        const currentProfile = useSelector(state=>state.users.currentProfile)

        const [error,setError]=useState(null)
        const [success,setSuccess]=useState(null)
        const [fetchedPage,setFetchedPage]=useState(null)
        const editPage = useSelector(state=>state.pages.editingPage)
        const pageInView = useSelector(state=>state.pages.pageInView)
        const htmlContent = useSelector(state=>state.pages.editorHtmlContent)
        const pathParams = useParams()
        const dispatch = useDispatch()
        const md = useMediaQuery({ query: '(min-width:768px)'})
        const navigate = useNavigate()
        const location = useLocation()
        let href =location.pathname.split("/")
        const last = href[href.length-1]
        const {isSaved,setIsSaved}=useContext(Context)
       const [openHashtag,setOpenHashtag]=useState(false)
       const [openRoles,setOpenRoles]=useState(false)
        const [privacy,setPrivacy] = useState(editPage?editPage.isPrivate:pageInView?pageInView.isPrivate:true)
        const [titleLocal,setTitleLocal]=useState(editPage?editPage.title:pageInView?pageInView.title:"")
        const [commentable,setCommentable] = useState(editPage?editPage.commentable:pageInView?pageInView.commentable:true)
        const [image,setImage]=useState(null)
        const {id }= pathParams
        const [parameters,setParameters] = useState({page:editPage?editPage:pageInView?pageInView:pathParams,title:titleLocal,
          data:editPage?editPage.data:pageInView?pageInView.data:"",privacy:privacy,commentable:commentable
        })
        
   
      const handleUpdate=debounce((params)=>{
        setIsSaved(false) 
       dispatch(updateStory(params)).then(res=>{
          checkResult(res,payload=>{
            if(payload.story){
    setFetchedPage(payload.story)
    setIsSaved(true)
            }
        
          },err=>{
            setError(err.message)
          })}

      )},40)
      useEffect(()=>{
        if(!fetchedPage){
          if((last==PageType.picture||last==PageType.link)&&isValidUrl(htmlContent)){
              let params = parameters
              params.data = 
              params.type = last 
              setParameters(params)
            
        if(parameters.page && parameters.page.id){
            handleUpdate(parameters)
        }else{
      
          createPageAction(parameters)
        }
          }
        }
      },[parameters.data])
     
      const dispatchContent=(content)=>{
            let params = parameters
            params.data = content
            setParameters(params)
            handleUpdate(params)

      }
    useEffect(()=>{
      if(fetchedPage){
        handleUpdate(parameters)
      }
    },[parameters.data,parameters.title,parameters.privacy,parameters.commentable])
    useLayoutEffect(()=>{
      if(currentProfile){
        fetchStory()
      }
    },[currentProfile,location.pathname])

    useLayoutEffect(()=>{
return ()=>{
  const {page}=parameters
            if(page){
             if(parameters.data && parameters.data.length==0 && parameters.title.length==0){
         
              dispatch(deleteStory({page:page}))}
             }else{
              handleUpdate(parameters)
             }
          }
    },[location.pathname])
    useEffect(()=>{
        if(last==PageType.picture&&htmlContent.length>5&&parameters.page && !parameters.page.id){
           let params = parameters
           params.data = htmlContent
           params.type = PageType.picture
           setParameters(params)
            createPageAction(parameters)
        }
    },[htmlContent])
  const setStoryData=(story)=>{
             setFetchedPage(story)
         
             setTitleLocal(story.title)
             setCommentable(story.commentable)
             setPrivacy(story.privacy)
            if(story.type == story.picture && !isValidUrl(story.data)){
                getDownloadPicture(story.data).then(url=>{
                    setImage(url)
                   
                })
            }else if( story.type==PageType.picture && isValidUrl(story.data)){
              
             
             setImage(story.data)
            
          }}
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
        
      },err=>{

       setSuccess(null)
      })})}
    }
    useEffect(()=>{
fetchStory()
    },[])

   
      const [open, setOpen] = useState(false);

    
      const handleClose = () => {
        setOpen(false);
      };
      const handleDelete =debounce(()=>{
        console.log(parameters)
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
        pars.privacy = privacy
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
        
          navigate(Paths.addStoryToCollection.createRoute(id))
        }
        const handlePostPublicly=debounce((truthy)=>{
    
          let params = parameters
          params.privacy = truthy
          setParameters(params)
         setPrivacy(truthy)
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
      <input type="text " className="p-2  text-emerald-8  text-xl  bg-transparent font-bold" value={titleLocal} onChange={(e)=>handleTitle(e.target.value)}
      
      placeholder="Untitled"/>

      </div>

      <div className="">  
      
      <div className="dropdown dropdown-bottom dropdown-end">
      <div tabIndex={0} role="button" ><img className="w-36 h-16  bg-emerald-600 rounded-lg mt-1 mx-auto" src={menu}/></div>
      <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box z-[1]  p-2 shadow">
        <li className="text-green-600 pt-3 pb-2 "
        onClick={handleClickAddToCollection}><a>Add to Collection</a></li>
        <li onClick={()=>{navigate(Paths.workshop.createRoute(parameters.page.id))}} className="text-green-600 pt-3 pb-2 "><a>Get Feedback</a></li>
{privacy?<li onClick={()=>handlePostPublicly(false)} 
className="text-green-600 pt-3 pb-2 ">Post Public</li>:<li className="text-green-600 pt-3 pb-2 " onClick={()=>handlePostPublicly(true)}>Make Private</li>}
        <li className="text-green-600 pt-3 pb-2 " onClick={()=>setOpenHashtag(!openHashtag)}> {openHashtag?"Close":"Add"} Hashtag</li>
        {fetchedPage?<li className="text-green-600 pt-3 pb-2 " onClick={()=>setOpenRoles(!openRoles)}>Share</li>:null}
        <li className="text-green-600 pt-3 pb-2" onClick={()=>setOpen(true)}>Delete</li>
      </ul>
    </div>
      
  </div>
  <div>
    
  </div>
    </div>

    {openHashtag?
    <HashtagForm item={parameters.page}/>:null}
    </div>)
   }
        return(
          <EditorContext.Provider value={{page:fetchedPage,parameters,setParameters}}>
          <div  className=" mx-auto md:p-8  "> 
            {error || success? <div role="alert" className={`alert    ${success?"alert-success":"alert-warning"} animate-fade-out`}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 shrink-0 stroke-current"
    fill="none"
    viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>{error?error:success}</span>
</div>:null}
       <div className= "mx-2 lg:w-[40em] pt-8 mb-12 mx-auto">
                {topBar()}
                  <ErrorBoundary>
           
          <EditorDiv  
          createPage={createPageAction}
        //  parameters={parameters}
            
              handleChange={(content)=>dispatchContent(content)}/>
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
            <RoleForm book={fetchedPage}
            onClose={()=>{
              setOpenRoles(false)
            }}/>
          </div>
      
  
      </Dialog>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
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


