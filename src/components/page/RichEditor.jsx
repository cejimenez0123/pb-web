import React, { useEffect, useLayoutEffect, useState } from "react"
import { useDispatch,useSelector } from "react-redux";
import { setEditingPage, setHtmlContent, setPageInView } from "../../actions/PageActions";
import ReactQuill from "react-quill";
import "../../styles/Editor.css"
import { debounce, set } from "lodash";
import { updateStory } from "../../actions/StoryActions";
import { useParams } from "react-router-dom";
const fonts = ["Arial","Courier New","Georgia"]
export default function RichEditor({title,privacy,commentable,setIsSaved}){
    const pageInView = useSelector(state=>state.pages.editingPage)
    const fetchedPage = useSelector(state=>state.pages.pageInView)
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
    const setPageInfo = (page)=>{
      dispatch(setHtmlContent(page.data))
      setHtml(page.data)
    }
    useLayoutEffect(()=>{
      if(pageInView){
     setPageInfo(pageInView)
      }else{
        if(fetchedPage){
          dispatch(setEditingPage({page:fetchedPage}))
          setPageInfo(fetchedPage)
        }
      }
    },[])
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
        
          dispatch(updateStory(params)).then(res=>{
        
          })
      }
      
      ,1000)()

    
    }
    return( <div>
     
      <ReactQuill 
      className="bg-green-600 max-w-screen rich-editor sm:w-[46rem] rounded-lg  text-white stroke-white"
      modules={modules}
      formats={formats} value={html} onChange={(content)=>handleTextChange(content)}
        
     />
    </div>)
}