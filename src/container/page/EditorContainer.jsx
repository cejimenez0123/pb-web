import RichEditor from "../../components/RichEditor"
import "../../styles/Editor.css"
import "../../App.css"
import {useDispatch, useSelector} from "react-redux"
import debounce from "../../core/debounce"
import {  setHtmlContent,
        
          updatePage,
          saveRolesForPage, 
          fetchEditingPage,
          deletePage, 
          setPagesToBeAdded, 
          setEditingPage,
          createStory ,
          setPageInView } from "../../actions/PageActions"
import React,{ useEffect, useState } from "react"
import history from "../../history"
import {  useParams,
          useNavigate } from "react-router-dom"
import {  Button,
          FormControlLabel,
          Checkbox, 
          TextField, 
         
          FormGroup, 
          MenuItem,
          IconButton} from "@mui/material"

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PageType } from "../../core/constants"
import {Menu } from "@mui/joy"
import theme from "../../theme"
import checkResult from "../../core/checkResult"
import RoleList from "../../components/RoleList"
import { Add, Visibility } from "@mui/icons-material"
import { Dropdown } from "react-bootstrap"
import { RoleType } from "../../core/constants"
import Paths from "../../core/paths"
import PicturePageForm from "../../components/PicturePageForm"
import { checkmarkStyle } from '../../styles/styles'
import LinkPreview from "../../components/LinkPreview"
import HashtagTextfield from "../../components/HashtagTextfield"
function EditorContainer({currentProfile}){
        const pathParams = useParams()
        const dispatch = useDispatch()
        const [title,setTitle] = useState("")
        const navigate = useNavigate()
        const [privacy,setPrivacy] = useState(false)
        const [commentable,setCommentable] = useState(true)
        const [newRoles,setNewRoles]=useState([])
        const [ePage,setEPage]=useState(null)
        const editingPage = useSelector(state=>state.pages.editingPage)
        const htmlContent = useSelector((state)=>state.pages.editorHtmlContent)

        useEffect(()=>{
            const {id }= pathParams
        
            if(id && ePage==null){
                const parm = {id:id}
                dispatch(fetchEditingPage(parm)).then(result=>checkResult(result,payload=>{
                  const {page} = payload
                  setPageInfo(page)
                },err=>{

                }))
              
            }else if(ePage!=null && ePage.id==id){
             setPageInfo(ePage)
            }else{ 
              dispatch(setHtmlContent(""))
            }
        },[])

    const setPageInfo =(page)=>{
      setEPage(page)
      dispatch(setEditingPage({page}))
      setTitle(page.title)
      setPrivacy(page.privacy)
      setCommentable(page.commentable)
      dispatch(setHtmlContent(page.data))
    }
    const saveNewPage=(onEnd)=>{ 
      let href = window.location.href.split("/")
      let type = href[href.length-1]
      if(type=="link"){
        type = PageType.link
      }else if(type=="text"){
        type = PageType.text
      }else if(type=="image"){
        type = PageType.image
      }else{
        type = PageType.text
      }
        const params ={
            profileId:currentProfile.id,
            data:htmlContent,
            privacy:privacy,
            type:type,
            title:title,
            commentable:commentable}
       
    dispatch(createStory(params)).then((result)=>{
        checkResult(result,payload=>{
            const {page} = payload
          
            setPageInfo(page)
            if(onEnd){
              onEnd(page)
            }
          },err=>{
            console.error(err.message)
          }
        )})
  }
  const updatePageContent = (onEnd)=>{
    
    let params = { page: ePage,
    title: title,
    data: htmlContent,
    privacy:privacy,
    commentable:commentable,
  
  }
  if(ePage.type === PageType.picture){
    params = { page: ePage,
      title: title,
      data: editingPage.data,
      privacy:privacy,
      commentable:commentable,
    
    }
  }
  dispatch(updatePage(params)).then(result=>{
    checkResult(result,(payload)=>{
      const {page}=payload
      const readers = newRoles.filter(role => role.role == RoleType.reader).map(role=>role.profile.userId)
      const commenters = newRoles.filter(role => role.role == RoleType.commenter).map(role=>role.profile.userId)
      const editors = newRoles.filter(role => role.role == RoleType.editor).map(role=>role.profile.userId)
      const writers = newRoles.filter(role => role.role == RoleType.writer).map(role=>role.profile.userId)
      let params ={
        page:page,
        readers,
        commenters,
        editors,
        writers
      }
      dispatch(saveRolesForPage(params))
      .then(result=>checkResult(result,payload=>{
          const {page}=payload
          dispatch(setEditingPage({page}))
          setPageInfo(page)
          window.alert("Saved")
          if(onEnd){
          onEnd(page)
        }
        

      },err=>{
          window.alert("Error updating roles")
      }))
    },(err)=>{
        window.alert("Error updating pages")
    })
  })
}
    const onSavePress = (onEnd)=>{
          if(ePage==null){
            saveNewPage(onEnd)
          }else{
            updatePageContent(onEnd)
          }
    }
      const [open, setOpen] = useState(false);

      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
      const handleDelete =()=>{
          handleClose()
          if(ePage){
          const params = {page:ePage}
          dispatch(deletePage(params)).then(()=>{
            navigate("/profile/home")
          })
        }
      }
    
    
  
        
    
      const contentDiv = ()=>{
        if(currentProfile){
          if(ePage){
              if(ePage.type===PageType.text){
                  return (<div id="editor"><RichEditor initialContent={htmlContent}/></div>)
              }else if(ePage.type===PageType.picture){
                
                  return (<div  className="image">

                    <img src={htmlContent} alt={ePage.data}/>
                    </div>)
              }else if(ePage.type === PageType.link){
                  return(
                      <PicturePageForm />
                  )
              }else{
                  return (<div id="editor"><RichEditor initialContent={htmlContent}/></div>)}
            }else{

              
            let href = window.location.href.split("/")
            let last = href[href.length-1]
            if(last.toUpperCase()=="image".toUpperCase()||last.toUpperCase()=="link".toUpperCase()){
              return (<PicturePageForm />)
            }else{
              return(<div id="editor"><RichEditor initialContent={""}/></div>)
            }
          }
            
          }
        }
      const [anchorEl,setAnchorEl]=useState(null)
      const addBtn = ()=>{
        return editingPage?
                <Dropdown>
                  <IconButton
                    onClick={(e)=>setAnchorEl(e.currentTarget)}
                  >  <Add/>
                  </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                >
              <MenuItem onClick={()=>{
                dispatch(setPagesToBeAdded({pageList:[ePage]}))
                navigate("/book/new")
              
              }}>
                Add to Book
                </MenuItem>
              <MenuItem onClick={()=>{
                dispatch(setPagesToBeAdded({pageList:[ePage]}))
                navigate(`/library/new`)
              }
              }> 
              Add to Library
          </MenuItem>
      
       
  

</Menu>
</Dropdown> 
            :<div></div>
          }
const createForm = ()=>(<FormGroup  style={{marginBottom:"2em"}}
      className="create-form" >
<TextField 
onChange={(e)=>setTitle(e.target.value)}  
value={title} 
label="Title"/>
<FormControlLabel 
control={<Checkbox 
style={checkmarkStyle}
checked={!privacy} 
onChange={(e)=>setPrivacy(!e.target.checked)}
/>} label={!privacy?"Public":"Draft"} />

<FormControlLabel 
control={<Checkbox style={checkmarkStyle}checked={commentable} onChange={(e)=>{
setCommentable(e.target.checked)}}/>} label={commentable?"Commenting is on":"Commenting is off"} />


<Button style={{backgroundColor:theme.palette.secondary.main,
            color:theme.palette.secondary.contrastText}}
    onClick={(e)=>onSavePress((page)=>{

history.replace(`/page/${ePage.id}/edit`)
})} className="">
Save
</Button>
<div className="button-row">
{addBtn()}
{editingPage?<IconButton onClick={()=>{
dispatch(setPageInView({page:editingPage}))
navigate(Paths.page.createRoute(editingPage.id))
}}><Visibility/></IconButton>:(<div></div>)}

</div>

<div id="post-button-row">
<Button
onClick={()=>debounce(onSavePress((page)=>{
setPrivacy(false)
dispatch(setPageInView({page:page}))
navigate(Paths.page.createRoute(page.id))
}),10)}
style={{backgroundColor:theme.palette.secondary.main,
    color:theme.palette.primary.contrastText,
    width: "100%",
    marginTop: "2em",
    padding:"2em",
    
  }
}
>Post</Button>
</div>
{deleteDiv}
</FormGroup>)
      let deleteDiv = (<div>
        </div>) 
      if(editingPage){ 
       deleteDiv =(<Button variant="outlined"
       onClick={handleClickOpen}
        style={{
          marginTop: "4em",
          width: "10em",
          color: theme.palette.error.contrastText,
          backgroundColor:theme.palette.error.dark}}>
          Delete
      </Button>)
      }
   
        return(
          <div className="two-panel"> 
              <div className="left-bar" >   
                {contentDiv()}
                <div style={{height:"100%"}}>

                </div>
              </div>
              <div className="right-bar">
               {createForm()} 
               
                    {ePage?<RoleList
                                item={ePage} 
                                type={"page"} 
                                getRoles={roles=>{
                                  setNewRoles(roles)
                                      }
                                    } />
                                :(<div></div>)}
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
    </div>
  )     
}

export default EditorContainer