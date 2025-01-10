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
import { debounce } from "lodash"
import ErrorBoundary from "../../ErrorBoundary"
import HashtagForm from "../../components/hashtag/HashtagForm"
import RoleForm from "../../components/role/RoleForm"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import isValidUrl from "../../core/isValidUrl"
import Context from "../../context"
import EditorDiv from "../../components/page/EditorDiv"

function EditorContainer(props){
        const currentProfile = useSelector(state=>state.users.currentProfile)
        const page = useSelector(state=>state.pages.pageInView)
        const location = useLocation()
        const [error,setError]=useState(null)
        const [success,setSuccess]=useState(null)
        const [fetchedPage,setFetchedPage]=useState(null)
        const pathParams = useParams()
        const dispatch = useDispatch()
        const md = useMediaQuery({ query: '(min-width:768px)'})
        const navigate = useNavigate()
        let href =location.pathname.split("/")
        let last = href[href.length-1]
        const [type,setType]=useState(last)
        const {isSaved,setIsSaved}=useContext(Context)
       const [openHashtag,setOpenHashtag]=useState(false)
       const [openRoles,setOpenRoles]=useState(false)
        const [privacy,setPrivacy] = useState(fetchedPage?fetchedPage.isPrivate:true)
        const [titleLocal,setTitleLocal]=useState(fetchedPage?fetchedPage.title:"")
        const [commentable,setCommentable] = useState(true)
        const htmlContent = useSelector((state)=>state.pages.editorHtmlContent)
        const {id }= pathParams
        const [imageParams,setImageParams]=useState({})
        const [image,setImage]=useState(null)
      
        useEffect(()=>{
          if(page){
            setFetchedPage(page)
          }
        },[page])
        useLayoutEffect( ()=>{
          if(fetchedPage){
       
          if(fetchedPage.type == PageType.picture && !isValidUrl(fetchedPage.data)){
              getDownloadPicture(fetchedPage.data).then(url=>{
                  setImage(url)
                 
              })
          }else{
            if( fetchedPage.type==PageType.picture && isValidUrl(fetchedPage.data)){
            
            setType(fetchedPage.type)
              setImage(fetchedPage.data)
          }
          setTitleLocal(fetchedPage.title)
        }
      }
      },[fetchedPage])
/
    useLayoutEffect(()=>{
      fetchStory()
    },[currentProfile])

    useLayoutEffect(()=>{
          const subscription = deleteStory  
          return () => {
            if(page && page.data.length==0 && page.title.length==0){
              dispatch(subscription({page:{id:id}}))
            }}
    },[])
  
    const fetchStory = ()=>{
      if(!page||(page && page.id!=id)){
      dispatch(getStory({id:id})).then(res=>{
        checkResult(res,payload=>{
          const {story}=payload
          setType(story.type)
          setTitleLocal(story.title)
          setCommentable(story.commentable)
          setPrivacy(story.privacy)
          
      },err=>{
       setError(err.message)
       setSuccess(null)
      })})
    }
    }

   
      const [open, setOpen] = useState(false);

    
      const handleClose = () => {
        setOpen(false);
      };
      const handleDelete =()=>{
          handleClose()
          if(fetchedPage){
          const params = {page:fetchedPage}
          dispatch(deleteStory(params)).then(()=>{
            navigate(Paths.myProfile())
          })
        }
      }
      const createPageAction = (params)=>{
        // let updated =params
        // updated.title=titleLocal
        // updated.profileId = currentProfile.id
        // updated.truthy
       let updated= {     
        profileId:currentProfile.id,
          data:htmlContent,
          privacy,
          type,
          title:titleLocal,
          commentable}
        dispatch(createStory(updated)).then(res=>checkResult(res,payload=>{
          const {story}=payload
          navigate(Paths.editPage.createRoute(story.id))
     },err=>{

     }))
      }
    
  
        const handleClickAddToCollection=()=>{
        
          navigate(Paths.addStoryToCollection.createRoute(id))
        }
        const handlePostPublicly=(truthy)=>{
          setPrivacy(truthy)
          if(id){
            let params = imageParams
            if(!params.file){
              params.page={id}
              params.title=titleLocal
              params.data=!fetchedPage.type==PageType.text?fetchedPage.data:htmlContent
              params.privacy=truthy
              params.commentable=commentable, 
              params.type=fetchedPage.type
            }else{
              params.page={id},
             params.data=!fetchedPage.type==PageType.text?fetchedPage.data:htmlContent
              params.title=titleLocal,
              params.privacy=truthy,
              params.commentable=commentable,  
              params.type=fetchedPage.type
            }
            dispatch(updateStory(params))
            setImageParams(params)
        }else{
          if(params.file){
            
            dispatch(uploadPicture({file:params.file})).then((result) => 
              checkResult(result,payload=>{
                const href = payload["url"]
                  setLocalContent(href)
                  const fileName =payload.ref
             
                let params = imageParams
                params.data = fileName
                params.profileId = currentProfile.id
                params.title =titleLocal
                params.privacy = privacy
                params.commentable = commentable
                params.type = PageType.picture
                createPageAction(params)
          }))
        }}
              let params = { page:fetchedPage,
              title: titleLocal,
              data: htmlContent,
              privacy:privacy,
              commentable:commentable,  
              type:fetchedPage.type
            }             
              dispatch(updateStory(params)).then(res=>{
              })
            }

          
        const handleTitle = (title)=>{
          setTitleLocal(title)
          if(id){
          debounce(()=>{
            let params = imageParams
   
            if(!params.file){
              params.page={id},
              params.title = titleLocal
              params.data=htmlContent,
              params.privacy=privacy
              params.scommentable=commentable,  
              params.type=fetchedPage.type
            }else{
              params.page={id},
              params.title = titleLocal
              params.privacy=privacy
              params.scommentable=commentable,  
              params.type=fetchedPage.type   
              setIsSaved(false)
            dispatch(updateStory(params)).then(res=>{
  setIsSaved(true)
            })}},100)()

  
}
      }

   const topBar=()=>{
    return(<div className=" rounded-lg w-full  mx-auto ">
    <div className="bg-emerald-600  text-emerald-800  bg-gradient-to-br from-emerald-100 to-emerald-400   flex flex-row sm:rounded-t-lg border border-white   ">
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
      <div tabIndex={0} role="button" ><img className="w-12 h-16  bg-emerald-600 rounded-lg mt-1 mx-auto" src={menu}/></div>
      <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box z-[1]  p-2 shadow">
        <li className="text-green-600 pt-3 pb-2 "
        onClick={handleClickAddToCollection}><a>Add to Collection</a></li>
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
    <HashtagForm/>:null}
    </div>)
   }
  

        return(
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
              <EditorDiv title={titleLocal} isPrivate={privacy} comment={commentable}
              setParams={params=>{
                setImageParams(params)
                createPageAction(params)
           
              }}/>
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
          <Button onClick={()=>handleDelete()} autoFocus>
            Agree
          </Button>
        </DialogActions>
        </div>
      </Dialog>
    </div>
      </div>
 
  )    


}

export default EditorContainer


