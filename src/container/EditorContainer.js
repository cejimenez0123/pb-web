import RichEditor from "../components/RichEditor"
import "../styles/Editor.css"
import "../App.css"
import {useDispatch, useSelector} from "react-redux"
import { setHtmlContent,createPage, updatePage,saveRolesForPage, fetchEditingPage,deletePage, clearEditingPage, setPagesToBeAdded, setEditingPage } from "../actions/PageActions"
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
import Paths from "../core/paths"
import MediaQuery from "react-responsive"
import { border } from "@mui/system"
import { checkmarkStyle } from "../styles/styles"
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
    const saveNewPage=()=>{ const params ={
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
        checkResult(result,payload=>{
            const {page} = payload
            setPageInfo(page)
          },err=>{
            console.error(err.message)
          }
        )})
  }
        const onSavePress = (onEnd)=>{
          if(!ePage){
            saveNewPage()
            onEnd()
        }else{
        
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
              let params ={page:page,
                readers,
                commenters,
                editors,
                writers}
              dispatch(saveRolesForPage(params))
              .then(result=>checkResult(result,payload=>{
                  const {page}=payload
                  dispatch(setEditingPage({page}))
                  setPageInfo(page)
                  onEnd()
                  window.alert("Saved")

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
              <MediaQuery maxWidth={"1000px"}>
              <div id="post-button-row">
                  <Button
                  onClick={()=>onSavePress(()=>{
                    setPrivacy(false)
                    navigate(Paths.page(ePage.id))
                  })}
                  style={{backgroundColor:theme.palette.secondary.main,
                          color:theme.palette.primary.contrastText,
                          width: "20em",
                          padding:"2em",
                          marginRight:'2em'
                        }
                }
                  >Post</Button>
                </div>
                </MediaQuery>
              </div>
             
              <div className="right-side-bar">
                
                <FormGroup className="form" >
                 <TextField onChange={(e)=>setTitle(e.target.value.trimEnd().trimStart())} value={title} label="Title"/>
                 
                  <FormControlLabel 
                control={<Checkbox style={checkmarkStyle} checked={!privacy} onChange={(e)=>setPrivacy(!e.target.checked)}/>} label={!privacy?"Public":"Draft"} />
                 
                 <FormControlLabel 
                control={<Checkbox style={checkmarkStyle}checked={commentable} onChange={(e)=>{
                  setCommentable(e.target.checked)}}/>} label={commentable?"Commenting is on":"Commenting is off"} />
                 
            
                  <Button style={{backgroundColor:theme.palette.secondary.main,
                                  color:theme.palette.secondary.contrastText}}
                          onClick={(e)=>onSavePress(()=>{
                 
            history.replace(`/page/${ePage.id}/edit`)
                  })} className="">
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
                    <MediaQuery minWidth={"1000px"}>
              <div id="post-button-row">
                  <Button
                  onClick={()=>onSavePress(()=>{
                    navigate(Paths.page(ePage.id))
                  })}
                  style={{backgroundColor:theme.palette.secondary.main,
                          color:theme.palette.primary.contrastText,
                          width: "20em",
                          padding:"2em",
                          marginRight:'2em'
                        }
                }
                  >Post</Button>
                </div>
                </MediaQuery>
      
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