import RichEditor from "../components/RichEditor"
import "../styles/Editor.css"
import "../App.css"
import {connect,useDispatch, useSelector} from "react-redux"
import { setHtmlContent,createPage } from "../actions/PageActions"
import { useEffect, useState } from "react"


function EditorContainer({currentProfile}){
        const dispatch = useDispatch()
        const [title,setTitle] = useState("")
        const [privacy,setPrivacy] = useState(false)
       const htmlContent = useSelector((state)=>state.pages.editorHtmlContent)
 
        const onSavePress = (e)=>{
          e.preventDefault();
          console.log(`onSavePress ${htmlContent}`)
          const params ={
            profileId: currentProfile.id,
            data: htmlContent,
            title: title,
            privacy: privacy,
            approvalScore:0,
            type: 'html/text'
          }
          dispatch(createPage(params))
        }
      
        const onTitleChange = (e)=>{

          setTitle(e.target.value)
        }
        const onPrivacyChange = (e)=>{
          setPrivacy(e.target.value)
        }
        const richEditor = ()=>{
        if(!!currentProfile){
          return(<RichEditor/>)
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
                  <button onSubmit={(e)=>onSavePress(e)} className="btn btn-primary">
                    Save
                    </button>
                  <label>
                    Title:
                    <input onChange={(e)=>onTitleChange(e)} type="text" name="name" />
                    </label>
                  <label>Private
                    <input onChange={(e)=>onPrivacyChange(e)} type="checkbox" name="private"/>
           
                  </label>
   
        </form>
              </div>
          </div>
        )
        
}

export default EditorContainer