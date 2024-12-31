import RichEditor from "../../components/page/RichEditor"
import "../../styles/Editor.css"
import "../../App.css"
import {useDispatch, useSelector} from "react-redux"
import { useParams,useNavigate } from "react-router-dom"
import menu from "../../images/icons/menu.svg"
import {    fetchPage, 
          } from "../../actions/PageActions"
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
import PicturePageForm from "../../components/PicturePageForm"
import { deleteStory, getStory, updateStory } from "../../actions/StoryActions"
import { debounce } from "lodash"
import ErrorBoundary from "../../ErrorBoundary"
import HashtagForm from "../../components/hashtag/HashtagForm"
import RoleForm from "../../components/role/RoleForm"
import LinkPreview from "../../components/LinkPreview"
function EditorContainer(props){
        const pageInView = useSelector(state=>state.pages.editingPage)
        const fetchedPage = useSelector(state=>state.pages.pageInView)
        const pathParams = useParams()
        const dispatch = useDispatch()
        const pending = useSelector(state=>state.pages.loading)
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
       
      dispatch(getStory(pathParams)).then(res=>{
        checkResult(res,payload=>{
         
          if(payload.story){
            setPageInfo(payload.story)
          
             }
        
     
      },err=>{})})
    }
    useLayoutEffect(()=>{ 
      if(pageInView && pageInView.length<=0 && pageInView.length<=0){
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
          if(fetchedPage){
              if(fetchedPage.type===PageType.text){
                  return (<div >
                    <RichEditor title={titleLocal}
                                privacy={privacy} 
                                commentable={commentable} 
                                setIsSaved={setIsSaved} 
                                initContent={fetchedPage.data}/>
                                </div>)
              }else if(fetchedPage.type===PageType.picture){
                
                  return (<div  className="image">

                    <img src={htmlContent} alt={fetchedPage.title}/>
                    </div>)
              }else if(fetchedPage.type === PageType.link){
                  return(
                     <LinkPreview url={fetchedPage.data}/>
                  )
              }else{
                  return (<div className=""><RichEditor initContent={fetchedPage.data}/></div>)}
            }else{

              
            let href = window.location.href.split("/")
            let last = href[href.length-1]
            if(last.toUpperCase()=="image".toUpperCase()||last.toUpperCase()=="link".toUpperCase()){
              return (<PicturePageForm />)
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
            case fetchPage.type == PageType.text:{
              let params = { page:{id},
              title: titleLocal,
              data: htmlContent,
              privacy:truthy,
              commentable:commentable,  
              type:fetchedPage.type
            }
            setPrivacy(truthy)
              setIsSaved(false)
              dispatch(updateStory(params)).then(res=>{
                setIsSaved(true)
              })
            }
            case PageType.link:{
              let params = { page:{id},
              title: titleLocal,
              data: fetchedPage.data,
              privacy:truthy,
              commentable:commentable,  
              type:fetchedPage.type
            }
            setPrivacy(truthy)
              setIsSaved(false)
              dispatch(updateStory(params)).then(res=>{
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
            type:"html"
          }
            setIsSaved(false)
            dispatch(updateStory(params)).then(res=>{
              setIsSaved(true)
            })
          },100)()
        }

   
if(fetchedPage){
        return(
          <div className=" mx-auto  "> 
       <div className= "max-w-[100vw] w-[40em] mt-t mb-12 mx-auto">
                <div className=" rounded-lg w-full  mx-auto ">
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
                    {
                    <div className="dropdown dropdown-bottom dropdown-end">
                    <div tabIndex={0} role="button" ><img className="w-12 h-16  bg-emerald-600 rounded-lg mt-1 mx-auto" src={menu}/></div>
                    <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box z-[1]  p-2 shadow">
                      <li className="text-green-600"
                      onClick={handleClickAddToCollection}><a>Add to Collection</a></li>
           {privacy?<li onClick={()=>handlePostPublicly(false)} className="text-green-600 py-2">Post Public</li>:<li  onClick={()=>handlePostPublicly(true)}className="text-green-600 py-2">Make Private</li>}
                      <li className="text-green-600 py-2" onClick={()=>setOpenHashtag(!openHashtag)}> {openHashtag?"Close":"Add"} Hashtag</li>
                      <li className="text-green-600 py-2" onClick={()=>setOpenRoles(!openRoles)}>Share</li>
                      <li className="text-green-600 py-2" onClick={()=>setOpen(true)}>Delete</li>
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

}

export default EditorContainer


