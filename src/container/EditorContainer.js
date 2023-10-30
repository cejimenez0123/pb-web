import RichEditor from "../components/RichEditor"
import "../styles/Editor.css"
import "../App.css"
import {useDispatch, useSelector} from "react-redux"
import { setHtmlContent,createPage, updatePage, fetchEditingPage,deletePage } from "../actions/PageActions"
import React,{ useEffect, useState } from "react"
import history from "../history"
import { useParams,useNavigate } from "react-router-dom"
import { Button,FormControlLabel,Checkbox, TextField, FormGroup } from "@mui/material"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PageType } from "../core/constants"

import theme from "../theme"
function EditorContainer({currentProfile}){
        const pathParams = useParams()
        const dispatch = useDispatch()
        const [title,setTitle] = useState("")
        const navigate = useNavigate()
        const [privacy,setPrivacy] = useState(false)
        const [commentable,setCommentable] = useState(true)
        const editingPage = useSelector(state=>state.pages.editingPage)
       const htmlContent = useSelector((state)=>state.pages.editorHtmlContent)
        useEffect(()=>{
            const {id }= pathParams
            if(id){
                const parm = {id}
                dispatch(fetchEditingPage(parm)).then(result=>{
                  const {payload }= result
                  if(payload!=null){
                    if(payload.error==null){
                      const {page} = payload
                      setTitle(page.title)
                      setPrivacy(page.privacy)
                      dispatch(setHtmlContent(page.data))
                    }
                  }
                })
            }
        },[])
        const onSavePress = (e)=>{
          e.preventDefault();
          if(!editingPage){
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
                  history.replace(`/page/${page.id}/edit`)
                }
              }
          })
        }else{
          const params = { page: editingPage,
            title: title,
            data: htmlContent,
            privacy
          
          }
          dispatch(updatePage(params))
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
          if(editingPage){
          const params = {page:editingPage}
          dispatch(deletePage(params)).then(()=>{
            navigate("/profile/home")
          })
        }
      }
    
        const onTitleChange = (e)=>{

          setTitle(e.target.value)
        }
  
        let contentDiv = (<RichEditor initialContent={""}/>)
      
        if(currentProfile){
          if(editingPage){
              if(editingPage.type==PageType.text){
                  contentDiv = (<RichEditor initialContent={htmlContent}/>)
              }else if(editingPage.type==PageType.picture){
                
                  contentDiv = (<div className="image">
                    <img src={editingPage.data} alt={editingPage.data}/>
                    </div>)
                }else{
                  contentDiv = (<RichEditor initialContent={htmlContent}/>)
              }
          }
            
          }
        
      let deleteDiv = (<div>
        </div>) 
      if(editingPage){ 
       deleteDiv =(<Button variant="outlined"
       onClick={()=>setOpen(true)}
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
                
                <FormGroup className="form"onSubmit={(e)=>onSavePress(e)}>
                 <TextField onChange={(e)=>onTitleChange(e)} value={title} label="Title"/>
                 
                  <FormControlLabel 
                control={<Checkbox checked={privacy} onChange={(e)=>setPrivacy(e.target.checked)}/>} label="Private" />
                 
                 <FormControlLabel 
                control={<Checkbox checked={commentable} onChange={(e)=>{
                  setCommentable(e.target.checked)}}/>} label={commentable?"Commenting is on":"Commenting is off"} />
                 
            
                  <Button onClick={handleClickOpen} className="btn btn-primary">
                    Save
                    </Button>

                    {deleteDiv}
                    </FormGroup>
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