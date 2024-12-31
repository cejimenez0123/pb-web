import React, { useLayoutEffect, useState } from "react"
import { useDispatch,useSelector } from "react-redux";
import { setHtmlContent, setPageInView } from "../../actions/PageActions";
import ReactQuill from "react-quill";
import "../../styles/Editor.css"
import { debounce, set } from "lodash";
import { updateStory } from "../../actions/StoryActions";
import { useParams } from "react-router-dom";
const fonts = ["Arial","Courier New","Georgia"]
export default function RichEditor({title,privacy,commentable,setIsSaved}){
    const pageInView = useSelector(state=>state.pages.editingPage)
    const ehtmlContent = useSelector(state=>state.pages.editorHtmlContent)
    const [html,setHtml] = useState([])
    const param = useParams()
    const dispatch = useDispatch()
  
    const modules = {
      toolbar: [
        [{ 'font': []}],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'size': []}],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
    };
    useLayoutEffect(()=>{
     
      setHtml(pageInView.data)

    },[pageInView])
    const formats = [
      'header',
      'font',
      'size',
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'code-block',
      'list',
      'bullet',
      'link',
      'image',
      'video',
      'align',
    ];
    const handleTextChange=(content)=>{
      dispatch(setHtmlContent(content))
      setHtml(content)
      debounce(()=>{
        let params = { page:param,
          title: title,
          data: content,
          privacy:privacy,
          commentable:commentable,  
          type:"html"
        }
          setIsSaved(false)
          dispatch(updateStory(params)).then(res=>{
            setIsSaved(true)
          })
      }
      
      ,1000)()

    
    }
    return( <div>
     
      <ReactQuill 
      className="bg-green-600 rich-editor sm:w-[46rem] rounded-lg  text-white stroke-white"
      modules={modules}
      formats={formats} value={html} onChange={(content)=>handleTextChange(content)}
        
     />
    </div>)
}