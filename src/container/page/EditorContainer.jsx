import RichEditor from "../../components/page/RichEditor"
import "../../styles/Editor.css"
import "../../App.css"
import {useDispatch, useSelector} from "react-redux"
import { useParams,useNavigate, useLocation } from "react-router-dom"
import menu from "../../images/icons/menu.svg"
import React,{ useEffect, useLayoutEffect, useState } from "react"
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
import { fetchPage } from "../../actions/PageActions"

function EditorContainer(props){
  const location = useLocation()
        const currentProfile = useSelector(state=>state.users.currentProfile)
        const fetchedPage = useSelector(state=>state.pages.pageInView)
        const pathParams = useParams()
        const dispatch = useDispatch()
        const md = useMediaQuery({ query: '(min-width:768px)'})
        const navigate = useNavigate()
        const [isSaved,setIsSaved]=useState(true)
       const [openHashtag,setOpenHashtag]=useState(false)
       const [openRoles,setOpenRoles]=useState(false)
        const [privacy,setPrivacy] = useState(true)
        const [titleLocal,setTitleLocal]=useState(fetchedPage?fetchedPage.title:"")
        const [commentable,setCommentable] = useState(true)
        const htmlContent = useSelector((state)=>state.pages.editorHtmlContent)
        const {id }= pathParams
        const [downloadUrl,setDownloadUrl]=useState("")
    
        useLayoutEffect( ()=>{
          if(fetchedPage){

       
          if(fetchedPage.type == PageType.picture && !isValidUrl(fetchedPage.data)){
              getDownloadPicture(fetchedPage.data).then(url=>{
                  console.log(url)
                  setDownloadUrl(url)
              })
          }else{
            if( fetchedPage.type==PageType.picture && isValidUrl(fetchedPage.data))
              setDownloadUrl(fetchedPage.data)
          }
        }
          
      },[])
 const setPageInfo =(page)=>{
  if(page){
  
      setTitleLocal(page.title)
      setPrivacy(page.privacy)
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
        params.privacy = true
        params.commentable = true

  
         dispatch(createStory(params)).then(res=>checkResult(res,payload=>{
              const {story}=payload
              navigate(Paths.editPage.createRoute(story.id))
         },err=>{

         }))
      
      }
      const ContentDiv = ({page})=>{
          if(page){
              if(page.type===PageType.text){
                  return (<div >
                    <RichEditor title={titleLocal}
                                privacy={privacy} 
                                commentable={commentable} 
                                setIsSaved={setIsSaved} 
                                initContent={page.data}/>
                                </div>)
              }else if(page.type===PageType.picture){
                
                  return (<div  className="mx-auto  bg-emerald-200 rounded-b-lg w-full p-8">

                    <img  className="rounded-lg my-4 mx-auto"
                    src={downloadUrl} alt={page.title}/>
                    </div>)
              }else if(page.type === PageType.link){
                  return(
                     <LinkPreview url={page.data}/>
                  )
              }else{
                  return (<div className=""><RichEditor initContent={page.data}/></div>)}
            }else{

              
            let href = window.location.href.split("/")
            let last = href[href.length-1]
            if(last.toUpperCase()=="image".toUpperCase()||last.toUpperCase()=="link".toUpperCase()){
              return (<PicturePageForm createPage={(params)=>{
              handlePageForm(params)
              }}/>)
            }else{
              return(<div id=""><RichEditor setIsSaved={setIsSaved} initContent={""}/></div>)
            }
          
            
          }
          
        }
  
        const handleClickAddToCollection=()=>{
        
          navigate(Paths.addStoryToCollection.createRoute(id))
        }
        const handlePostPublicly=(truthy)=>{
          switch(fetchedPage.type){
            case PageType.text:{
              let params = { page:fetchedPage,
              title: titleLocal,
              data: htmlContent,
              privacy:truthy,
              commentable:commentable,  
              type:fetchedPage.type
            }
              setIsSaved(false)
              dispatch(updateStory(params)).then(res=>{

                setPrivacy(truthy)
                setIsSaved(true)
              })
            }
            case PageType.link:{
              let params = { page:fetchedPage,
              title: titleLocal,
              data: fetchedPage.data,
              privacy:truthy,
              commentable:commentable,  
              type:fetchedPage.type
            }
           
              setIsSaved(false)
              dispatch(updateStory(params)).then(res=>{
                setPrivacy(truthy)
                setIsSaved(true)
              })
            }
            }
          }
        const handleTitle = (title)=>{
          setTitleLocal(title)
          debounce(()=>{

   
                    let params = { page:{id},
            title: title,
            data: htmlContent,
            privacy:privacy,
            commentable:commentable,  
            type:fetchedPage.type
          }
            setIsSaved(false)
            dispatch(updateStory(params)).then(res=>{
              setIsSaved(true)
            })
          },100)()
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
              <ContentDiv page={fetchedPage}/>
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


