import RichEditor from "../../components/page/RichEditor"
import "../../styles/Editor.css"
import "../../App.css"
import {useDispatch, useSelector} from "react-redux"
import {  setHtmlContent,
      
       
          deletePage, 
          setEditingPage,
          setPageInView} from "../../actions/PageActions"
import {createStory} from "../../actions/StoryActions"
import React,{ useEffect, useState } from "react"
import {  useParams,
          useNavigate } from "react-router-dom"
import {  Button,} from "@mui/material"

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PageType } from "../../core/constants"
import Paths from "../../core/paths"
import PicturePageForm from "../../components/PicturePageForm"
import { checkmarkStyle } from '../../styles/styles'
import { updateStory } from "../../actions/StoryActions"
import LinkPreview from "../../components/LinkPreview"
import HashtagTextfield from "../../components/HashtagTextfield"
function EditorContainer({currentProfile}){
        const pageInView = useSelector(state=>state.pages.pageInView)
        const pathParams = useParams()
        const dispatch = useDispatch()
        
        const [title,setTitle] = useState(pageInView?pageInView.title:"")
        const navigate = useNavigate()
        const [isSaved,setIsSaved]=useState(true)
  
        const [privacy,setPrivacy] = useState(pageInView?pageInView.isPrivate:true)

        const [commentable,setCommentable] = useState(pageInView?pageInView.commentable:true)

        const htmlContent = useSelector((state)=>state.pages.editorHtmlContent)
        const {id }= pathParams
      
  
        
    const setPageInfo =(page)=>{
      dispatch(setEditingPage({page}))
      setTitle(page.title)
      setPrivacy(page.privacy)
      setCommentable(page.commentable)
      dispatch(setHtmlContent(page.data))
    }
  useEffect(()=>{
    let params = { page:{id},
      title: title,
      data: htmlContent,
      privacy:privacy,
      commentable:commentable,  
      type:"html"
    }
      setIsSaved(false)
      dispatch(updateStory(params)).then(res=>{
        setIsSaved(true)
      })
    },[htmlContent,title])
      const [open, setOpen] = useState(false);

      const handleClickOpen = () => {
        setOpen(true);
      };
    
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
    
    
  
     
  useEffect(() => {
    // Check if the form is dirty
 
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    
  }, [isSaved]);   
  const handleBeforeUnload = (e) => {
    e.preventDefault();
    e.returnValue = ''; // This is required for Chrome

    if(htmlContent.length<0 && title.length<0){
      let result = confirm("Story Will Be deleted")
      if(result){
        dispatch(deletePage(pathParams))
      }
    }
  };
      const contentDiv = ()=>{
        if(currentProfile){
          if(pageInView){
              if(pageInView.type===PageType.text){
                  return (<div id=""><RichEditor  initialContent={htmlContent}/></div>)
              }else if(pageInView.type===PageType.picture){
                
                  return (<div  className="image">

                    <img src={htmlContent} alt={pageInView.data}/>
                    </div>)
              }else if(pageInView.type === PageType.link){
                  return(
                      <PicturePageForm />
                  )
              }else{
                  return (<div id=""><RichEditor initialContent={htmlContent}/></div>)}
            }else{

              
            let href = window.location.href.split("/")
            let last = href[href.length-1]
            if(last.toUpperCase()=="image".toUpperCase()||last.toUpperCase()=="link".toUpperCase()){
              return (<PicturePageForm />)
            }else{
              return(<div id=""><RichEditor initialContent={""}/></div>)
            }
          }
            
          }
        }
      const [anchorEl,setAnchorEl]=useState(null)



        const handleClickAddToCollection=()=>{
        
          navigate(Paths.addStoryToCollection.createRoute(id))
        }
        const handlePostPublicly=()=>{
          
        }
        const handleTitle = (e)=>{
          setTitle(e.target.value)
        }
        return(
          <div className="sm:max-w-[45rem] mx-auto"> 
                <div className=" rounded-lg sm:my-4 mx-auto ">
                  <div className="bg-green-600 sm:rounded-t-lg border border-white  flex flex-row  text-left">
                    <div style={{borderRight:"1px solid white" }}
                    className=" flex flex-row ">
                    <input type="text " className="input py-2 text-3xl mt-2 bg-green-600 text-white font-bold" onChange={handleTitle}placeholder="Untitled"/>
                    {isSaved?<p className=" mx-2 mt-2 text-white">Saved</p>:
                    <p className=" mx-2 mt-2 text-white">Draft</p>}
                    </div>
                    <div className="justify-between p-1 w-full">
                      <button className=" mb-1 bg-emerald-800 text-white "
                      onClick={handleClickAddToCollection}>Add to Collection</button>
                      <button className=" text-white bg-emerald-800 ">Post Public</button>
                    </div>
                  </div>
                {contentDiv()}
                </div>
              

             
           
           
{/*                
                    {pageInView?<RoleList
                                item={pageInView} 
                                type={"page"} 
                                getRoles={roles=>{
                                  setNewRoles(roles)
                                      }
                                    } />
                                :(<div></div>)} */}
                    <div>
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