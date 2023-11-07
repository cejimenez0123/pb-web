import RichEditor from "../components/RichEditor"
import "../styles/Editor.css"
import "../App.css"
import {useDispatch, useSelector} from "react-redux"
import { setHtmlContent,createPage, updatePage,saveRolesForPage, fetchEditingPage,deletePage, clearEditingPage, setPagesToBeAdded } from "../actions/PageActions"
import React,{ useEffect, useState } from "react"
import history from "../history"
import { useParams,useNavigate } from "react-router-dom"
import { Button,FormControlLabel,Checkbox, TextField, FormGroup, MenuItem,IconButton} from "@mui/material"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PageType } from "../core/constants"
import { MenuButton,Menu } from "@mui/joy"
import theme from "../theme"
import checkResult from "../core/checkResult"
import RoleList from "../components/RoleList"
import { Add, Visibility } from "@mui/icons-material"
import { Dropdown } from "react-bootstrap"
import { RoleType } from "../core/constants"
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
                dispatch(fetchEditingPage(parm)).then(result=>{
                  const {payload }= result
                  if(payload!=null){
                    if(payload.error==null){
                      const {page} = payload
                      setEPage(page)
                      setTitle(page.title)
                      setPrivacy(page.privacy)
                      setCommentable(page.commentable)
                      dispatch(setHtmlContent(page.data))
                    }
                  }
                })
            }else if(ePage!=null && ePage.id==id){
              setTitle(ePage.title)
              setPrivacy(ePage.privacy)
              setCommentable(ePage.commentable)
              dispatch(setHtmlContent(ePage.data))
            }else{ 
              dispatch(setHtmlContent(""))
            }
        },[editingPage])
        const onSavePress = (e)=>{
          e.preventDefault();
          if(!ePage){
          const params ={
            profileId: currentProfile.id,
            data: htmlContent,
            title: title,
            privacy: privacy,
            approvalScore:0,
            commentable: commentable,
            readers:[],
            commenters:[],
            editors:[],
            writers:[],
            type: 'html/text'
          }
          dispatch(createPage(params)).then((result)=>{
              if(result.error==null){
                const {payload } = result
                if(payload.error==null){
                  const {page} = payload
                  setEPage(page)
                  window.alert("Saved")
                  history.replace(`/page/${page.id}/edit`)
                }
              }
          })
        }else{
          const params = { page: editingPage,
            title: title,
            data: htmlContent,
            privacy:privacy,
            commentable:commentable,
          
          }
          dispatch(updatePage(params)).then(result=>{
            checkResult(result,(payload)=>{
              window.alert("Saved")
              const readers = newRoles.filter(role => role.role == RoleType.reader).map(role=>role.profile.userId)
              const commenters = newRoles.filter(role => role.role == RoleType.commenter).map(role=>role.profile.userId)
              const editors = newRoles.filter(role => role.role == RoleType.editor).map(role=>role.profile.userId)
              const writers = newRoles.filter(role => role.role == RoleType.writer).map(role=>role.profile.userId)
             let params ={page:editingPage,
                readers,
                commenters,
                editors,
                writers}
              dispatch(saveRolesForPage(params)).then(result=>checkResult(result,payload=>{

                  const {page}=payload
                  setEPage(page)
                  window.alert("Successfully updated Roles")

              },err=>{
                  window.alert("Error updating roles")
              }))
            },(err)=>{
                window.alert("Error updating pages")
            })
          })
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
    
    
  
        let contentDiv = (<RichEditor initialContent={""}/>)
      
        if(currentProfile){
          if(ePage){
              if(ePage.type==PageType.text){
                  contentDiv = (<RichEditor initialContent={htmlContent}/>)
              }else if(ePage.type==PageType.picture){
                
                  contentDiv = (<div className="image">
                    <img src={ePage.data} alt={ePage.data}/>
                    </div>)
                }else{
                  contentDiv = (<RichEditor initialContent={htmlContent}/>)
              }
          }
            
          }
      const [anchorEl,setAnchorEl]=useState(null)
      const addBtn = ()=>{
        return editingPage?
                <Dropdown>
                  <IconButton
                    onClick={(e)=>setAnchorEl(e.currentTarget)}
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}>
                <Add/>
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
          <div id="EditorContainer">
            <div >
            <div id="editor">
                
                {contentDiv}
              </div>
              </div>
             
              <div className="right-side-bar">
                
                <FormGroup className="form" >
                 <TextField onChange={(e)=>setTitle(e.target.value.trimEnd())} value={title} label="Title"/>
                 
                  <FormControlLabel 
                control={<Checkbox checked={privacy} onChange={(e)=>setPrivacy(e.target.checked)}/>} label={privacy?"Private":"Public"} />
                 
                 <FormControlLabel 
                control={<Checkbox checked={commentable} onChange={(e)=>{
                  setCommentable(e.target.checked)}}/>} label={commentable?"Commenting is on":"Commenting is off"} />
                 
            
                  <Button onClick={(e)=>onSavePress(e)} className="btn btn-primary">
                    Save
                    </Button>
                    <div className="button-row">
                   {addBtn()}
                  {editingPage?<IconButton onClick={()=>{navigate(`/page/${editingPage.id}`)}}><Visibility/></IconButton>:(<div></div>)}
                 
                    </div>
                    {deleteDiv}
                    </FormGroup>
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