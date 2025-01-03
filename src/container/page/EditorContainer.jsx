import RichEditor from "../../components/page/RichEditor"
import "../../styles/Editor.css"
import "../../App.css"
import {useDispatch, useSelector} from "react-redux"
import { useParams,useNavigate, useLocation } from "react-router-dom"
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
import PicturePageForm from "../../components/page/PicturePageForm"
import {createStory, deleteStory, getStory, updateStory } from "../../actions/StoryActions"
import { debounce } from "lodash"
import ErrorBoundary from "../../ErrorBoundary"
import HashtagForm from "../../components/hashtag/HashtagForm"
import RoleForm from "../../components/role/RoleForm"
import LinkPreview from "../../components/LinkPreview"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import isValidUrl from "../../core/isValidUrl"
import Context from "../../context"
import EditorDiv from "../../components/page/EditorDiv"

function EditorContainer(props){
        const currentProfile = useSelector(state=>state.users.currentProfile)
        const page = useSelector(state=>state.pages.pageInView)
        const [fetchedPage,setFetchedPage]=useState(null)
       
        const pathParams = useParams()
        const dispatch = useDispatch()
        const md = useMediaQuery({ query: '(min-width:768px)'})
        const navigate = useNavigate()
        const {isSaved}=useContext(Context)
       const [openHashtag,setOpenHashtag]=useState(false)
       const [openRoles,setOpenRoles]=useState(false)
        const [privacy,setPrivacy] = useState(fetchedPage?fetchedPage.isPrivate:true)
        const [titleLocal,setTitleLocal]=useState(fetchedPage?fetchedPage.title:"")
        const [commentable,setCommentable] = useState(true)
        const htmlContent = useSelector((state)=>state.pages.editorHtmlContent)
        const {id }= pathParams
        const [image,setImage]=useState(null)
        const [imageParams,setImageParams]=useState({})
        useEffect(()=>{
          if(fetchedPage==null || (fetchedPage && fetchedPage.id != pathParams.id)){
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
            if( fetchedPage.type==PageType.picture && isValidUrl(fetchedPage.data))
             setImage(fetchedPage.data)
          }
          
        }
          
      },[fetchedPage])
 const setPageInfo =(page)=>{
  if(page){
    
      setTitleLocal(page.title)
      setPrivacy(page.isPrivate)
      setCommentable(page.commentable)
  }

    }
    useLayoutEffect(()=>{
        fetchStory()

    },[])
    const fetchStory = ()=>{
      if(id){ 
      dispatch(getStory(pathParams)).then(res=>{
        checkResult(res,payload=>{
          if(payload.story){
            setFetchedPage(payload.story)
            setPageInfo(payload.story)
          
             }
        
          
      },err=>{})})
    }
    }
    useLayoutEffect(()=>{ 
      if(fetchedPage && fetchedPage.title.length<=0 && fetchedPage.data.length<=0){
        let result =window.confirm("Story Will Be deleted")
        if(result){
          dispatch(deleteStory(pathParams))
        }
      }
    },[])

   
      const [open, setOpen] = useState(false);

    
      const handleClose = () => {
        setOpen(false);
      };
      const handleDelete =()=>{
          handleClose()
          if(fetchedPage){
          const params = {page:fetchedPage}
          dispatch(deleteStory(params)).then(()=>{
            navigate("/profile/home")
          })
        }
      }
    
    
  
     
  
      const handlePageForm=(params)=>{
        
        params.profileId = currentProfile.id
        params.title =titleLocal
        params.privacy = privacy
        params.commentable = commentable

  createPageAction(params)
        
      
      }
      const createPageAction = (params)=>{
        dispatch(createStory(params)).then(res=>checkResult(res,payload=>{
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
            
                
          
            dispatch(updateStory(params)).then(res=>{
              
            })
       

        }else{

          if(imageParams.file){
            
            dispatch(uploadPicture({file:imageParams.file})).then((result) => 
              checkResult(result,payload=>{
                const href = payload["url"]
              
                  setLocalContent(href)
                  const fileName =payload.ref
                  // dispatch(setHtmlContent(fileName))
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
            }
                 
         
            dispatch(updateStory(params)).then(res=>{
           
            })
          },100)()

        }else{

          if(imageParams.file){
            
            dispatch(uploadPicture({file:imageParams.file})).then((result) => 
              checkResult(result,payload=>{
                const href = payload["url"]
              
                  setLocalContent(href)
                  const fileName =payload.ref
                  // dispatch(setHtmlContent(fileName))
                let params = imageParams
                params.data = fileName
               
                params.profileId = currentProfile.id
                params.title =titleLocal
                params.privacy = true
                params.commentable = commentable
                params.type = PageType.picture
                createPageAction(params)
                  
          
         
        }))
        }}
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
          <div className=" mx-auto md:p-8  "> 
       <div className= "max-w-[100vw] w-[40em] pt-8 mb-12 mx-auto">
                {topBar()}
                  <ErrorBoundary>
              <EditorDiv title={titleLocal} isPrivate={privacy} comment={commentable}/>
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


