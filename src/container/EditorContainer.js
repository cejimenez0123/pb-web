import RichEditor from "../components/RichEditor"
import "../styles/Editor.css"
import "../App.css"
import {connect,useDispatch, useSelector} from "react-redux"
import { setHtmlContent,createPage, updatePage,editingPage, fetchEditingPage } from "../actions/PageActions"
import { useEffect, useState } from "react"
import history from "../history"
import { useParams } from "react-router-dom"
import { Button } from "@mui/material"

function EditorContainer({currentProfile}){
        const pathParams = useParams()
        const dispatch = useDispatch()
        const [title,setTitle] = useState("")
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
      
        const onTitleChange = (e)=>{

          setTitle(e.target.value)
        }
        const onPrivacyChange = (e)=>{
          setPrivacy(e.target.value)
        }
        
        const richEditor = ()=>{
        if(!!currentProfile){
          let content = null
          if(editingPage){
            content = editingPage.data
          }
          return(<RichEditor initialContent={content}/>)
        }else{
          return(<div>Loading</div>)
        }}
        return(
          <div id="EditorContainer" className="container-row">
            <div className="left-side-bar">
              </div>
                <div id="editor">
                
                  {richEditor()}
                </div>
              <div className="right-side-bar">
                <form onSubmit={(e)=>onSavePress(e)}>
                  <Button onSubmit={(e)=>onSavePress(e)} className="btn btn-primary">
                    Save
                    </Button>
                  <label>
                    Title:
                    <input onChange={(e)=>onTitleChange(e)} value={title} type="text" name="name" />
                    </label>
                  <label>Private
                    <input onChange={(e)=>onPrivacyChange(e)} type="checkbox" checked={privacy} name="private"/>
           
                  </label>
                  <label>{commentable?"Commenting is on":"Commenting is off"}
                    <input onChange={(e)=>{
                      setCommentable(e.target.checked);
                    }} type="checkbox" checked={commentable} name="commentable"/>
           
                  </label>
   
        </form>
              </div>
          </div>
        )
        
}

export default EditorContainer