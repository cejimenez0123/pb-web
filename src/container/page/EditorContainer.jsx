import RichEditor from "../../components/page/RichEditor"
import "../../styles/Editor.css"
import "../../App.css"
import {useDispatch, useSelector} from "react-redux"
import { useParams,useNavigate } from "react-router-dom"
import menu from "../../images/icons/menu.svg"
import {   setEditingPage, setHtmlContent, setPageInView,
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
import { deleteStory, getStory, updateStory } from "../../actions/StoryActions"
import { debounce } from "lodash"
import ErrorBoundary from "../../ErrorBoundary"
import HashtagForm from "../../components/hashtag/HashtagForm"
import RoleForm from "../../components/role/RoleForm"
function EditorContainer(props){
        const pageInView = useSelector(state=>state.pages.editingPage)
        const fetchedPage = useSelector(state=>state.pages.pageInView)
        const pathParams = useParams()
        const dispatch = useDispatch()
        const pending = useSelector(state=>state.pages.loading)
        const md = useMediaQuery({ query: '(min-width:768px)'})
        const [title,setTitle] = useState("")
        const navigate = useNavigate()
        const [isSaved,setIsSaved]=useState(true)
       const [openHashtag,setOpenHashtag]=useState(false)
       const [openRoles,setOpenRoles]=useState(false)
        const [privacy,setPrivacy] = useState(true)
        const [titleLocal,setTitleLocal]=useState("")
        const [commentable,setCommentable] = useState(true)

        const htmlContent = useSelector((state)=>state.pages.editorHtmlContent)
        const {id }= pathParams
 const setPageInfo =(page)=>{
      // dispatch(setEditingPage({page}))
      if(page){
      setTitle(page.title)
      setTitleLocal(page.title)
      setPrivacy(page.privacy)
      setCommentable(page.commentable)
      dispatch(setHtmlContent(page.data))
      }
    }
    useLayoutEffect(()=>{
      dispatch(getStory(pathParams)).then(res=>{
        checkResult(res,payload=>{
          if(pageInView){
            setPageInfo(pageInView)
             }else{
               if(fetchedPage){
                 dispatch(setEditingPage({page:fetchedPage}))
                 setPageInfo(fetchedPage)
               }
        }
      })
     
      },err=>{})
    },[])
  useLayoutEffect(()=>{
   
  },[])
    useLayoutEffect(()=>{ 
      if(htmlContent.length<=0 && title.length<=0){
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
          if(pageInView){
          const params = {page:pageInView}
          dispatch(deleteStory(params)).then(()=>{
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
        const handlePostPublicly=(truthy)=>{
          let params = { page:{id},
          title: titleLocal,
          data: htmlContent,
          privacy:truthy,
          commentable:commentable,  
          type:"html"
        }
        setPrivacy(truthy)
          setIsSaved(false)
          dispatch(updateStory(params)).then(res=>{
            setIsSaved(true)
          })
        }
        useEffect(()=>{
          debounce(()=>{

            
            let params = { page:{id},
            title: titleLocal,
            data: htmlContent,
            privacy:privacy,
            commentable:commentable,  
            type:"html"
          }
            setIsSaved(false)
            dispatch(updateStory(params)).then(res=>{
              setIsSaved(true)
            })
          },1000)()
        },[titleLocal])

        return(
          <div className="max-w-[100vw] sm:max-w-[45rem] mx-auto"> 
       <div className="sm:p-4">
                <div className=" rounded-lg   mx-auto ">
                  <div className="bg-emerald-600  text-emerald-800  bg-gradient-to-br from-emerald-100 to-emerald-400  sm:w-[46rem] flex flex-row sm:rounded-t-lg border border-white   ">
                      <div 
                    className=" flex-1 text-left border-white border-r-2  "
                    >
                     
                      {isSaved?<h6 className=" text-left p-1 mx-1 text-sm  ">Saved</h6>:
                    <h6 className="text-left mx-1 p-1 text-sm">Draft</h6>}
                    <input type="text " className="p-2  text-emerald-8 w-full text-xl  bg-transparent font-bold" value={titleLocal} onChange={(e)=>setTitleLocal(e.target.value)}placeholder="Untitled"/>

                    </div>

                    <div className="w-fit">  
                    {
                    <div className="dropdown dropdown-bottom dropdown-end">
                    <div tabIndex={0} role="button" ><img className="w-12 h-16  bg-emerald-600 rounded-lg mt-1 mx-auto" src={menu}/></div>
                    <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box z-[1] w-60 p-2 shadow">
                      <li className="text-green-600"
                      onClick={handleClickAddToCollection}><a>Add to Collection</a></li>
           {privacy?<li onClick={()=>handlePostPublicly(false)} className="text-green-600 py-2">Post Public</li>:<li  onClick={()=>handlePostPublicly(true)}className="text-green-600 py-2">Make Private</li>}
                      <li className="text-green-600 py-2" onClick={()=>setOpenHashtag(!openHashtag)}> {openHashtag?"Close":"Add"} Hashtag</li>
                      <li className="text-green-600 py-2" onClick={()=>setOpenRoles(!openRoles)}>Share</li>
                      <li className="text-green-600 py-2" onClick={()=>handleDelete()}>Delete</li>
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


