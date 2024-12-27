import RichEditor from "../../components/page/RichEditor"
import "../../styles/Editor.css"
import "../../App.css"
import {useDispatch, useSelector} from "react-redux"
import { useParams,useNavigate } from "react-router-dom"
import menu from "../../images/icons/menu.svg"
import {  setHtmlContent,
      
       
          deletePage, 
          setEditingPage,
          } from "../../actions/PageActions"
import React,{ useEffect, useLayoutEffect, useState } from "react"
import {  Button,} from "@mui/material"
import { useMediaQuery } from "react-responsive"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PageType } from "../../core/constants"
import Paths from "../../core/paths"
import PicturePageForm from "../../components/PicturePageForm"
import { getStory, updateStory } from "../../actions/StoryActions"
import { debounce } from "lodash"
import ErrorBoundary from "../../ErrorBoundary"
import HashtagForm from "../../components/hashtag/HashtagForm"
import RoleForm from "../../components/role/RoleForm"
function EditorContainer(props){
        const pageInView = useSelector(state=>state.pages.pageInView)
       
        const pathParams = useParams()
        const dispatch = useDispatch()

        const md = useMediaQuery({ query: '(min-width:768px)'})
        const [title,setTitle] = useState("")
        const navigate = useNavigate()
        const [isSaved,setIsSaved]=useState(true)
       const [openHashtag,setOpenHashtag]=useState(false)
       const [openRoles,setOpenRoles]=useState(false)
        const [privacy,setPrivacy] = useState(true)

        const [commentable,setCommentable] = useState(true)

        const htmlContent = useSelector((state)=>state.pages.editorHtmlContent)
        const {id }= pathParams
 const setPageInfo =(page)=>{
      dispatch(setEditingPage({page}))
      setTitle(page.title)
      setPrivacy(page.privacy)
      setCommentable(page.commentable)
      dispatch(setHtmlContent(page.data))
    }
useLayoutEffect(()=>{
  if(pageInView){
    setPageInfo(pageInView)
  }else{
    dispatch(getStory(pathParams))
  }

},[pageInView])
    useLayoutEffect(()=>{ 
      if(htmlContent.length<0 && title.length<0){
        let result =window.confirm("Story Will Be deleted")
        if(result){
          dispatch(deletePage(pathParams))
        }
      }
    },[])

   
      const [open, setOpen] = useState(false);

    
      const handleClose = () => {
        setOpen(false);
      };
      const handleDelete =()=>{
          handleClose()
          if(pageInView){
          const params = {page:pageInView}
          dispatch(deletePage(params)).then(()=>{
            navigate("/profile/home")
          })
        }
      }
    
    
  
     
  
 
      const contentDiv = ()=>{
          if(pageInView){
              if(pageInView.type===PageType.text){
                  return (<div id="max-w-[100vw]">
                    <RichEditor title={title}
                                privacy={privacy} 
                                commentable={commentable} 
                                setIsSaved={setIsSaved} 
                                initialContent={pageInView.data}/>
                                </div>)
              }else if(pageInView.type===PageType.picture){
                
                  return (<div  className="image">

                    <img src={htmlContent} alt={pageInView.data}/>
                    </div>)
              }else if(pageInView.type === PageType.link){
                  return(
                      <PicturePageForm />
                  )
              }else{
                  return (<div className="max-w-[100vw]"><RichEditor initialContent={htmlContent}/></div>)}
            }else{

              
            let href = window.location.href.split("/")
            let last = href[href.length-1]
            if(last.toUpperCase()=="image".toUpperCase()||last.toUpperCase()=="link".toUpperCase()){
              return (<PicturePageForm />)
            }else{
              return(<div id=""><RichEditor setIsSaved={setIsSaved} initialContent={""}/></div>)
            }
          
            
          }
        }
  
        const handleClickAddToCollection=()=>{
        
          navigate(Paths.addStoryToCollection.createRoute(id))
        }
        const handlePostPublicly=()=>{
          
        }
        const handleTitle = (e)=>{
         setTitle(e.target.value)
         debounce(()=>{

       
          let params = { page:{id},
          title: e.target.value,
          data: htmlContent,
          privacy:privacy,
          commentable:commentable,  
          type:"html"
        }
          setIsSaved(false)
          dispatch(updateStory(params)).then(res=>{
            setIsSaved(true)
          })
        },1)()
        }
        return(
          <div className="max-w-[100vw] sm:max-w-[45rem] mx-auto"> 
       <div>
                <div className=" rounded-lg sm:my-4  mx-auto ">
                  <div className="bg-green-600  flex flex-row sm:rounded-t-lg border border-white   ">
                      <div 
                    className=" flex-1 text-left border-white border-r-2  "
                    >
                     
                      {isSaved?<h6 className=" text-left mx-1 text-sm text-white ">Saved</h6>:
                    <h6 className="text-left mx-1 text-sm text-white">Draft</h6>}
                    <input type="text " className="bg-transparent p-2  bg-green-600 w-full text-xl font-bold" value={title} onChange={(e)=>handleTitle(e)}placeholder="Untitled"/>

                    </div>

                    <div className="w-fit">  
                    {
                    <div className="dropdown dropdown-bottom dropdown-end">
                    <div tabIndex={0} role="button" ><img className="w-12 h-12  rounded-lg mt-1 mx-auto" src={menu}/></div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-60 p-2 shadow">
                      <li className="text-green-600"
                      onClick={handleClickAddToCollection}><a>Add to Collection</a></li>
                      <li className="text-green-600"> Post Public</li>
                      <li className="text-green-600" onClick={()=>setOpenHashtag(!openHashtag)}> {openHashtag?"Close":"Add"} Hashtag</li>
                      <li className="text-green-600" onClick={()=>setOpenRoles(!openRoles)}>Share</li>
                    </ul>
                  </div>}
                    
                </div>
                <div>
                  
                </div>
                  </div>
                  {openHashtag?
                  <HashtagForm/>:null}
                  </div>
                  <ErrorBoundary>
                {contentDiv()}
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
            <RoleForm book={pageInView}
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
      </Dialog>
    </div>
      </div>
 
  )     
}

export default EditorContainer


