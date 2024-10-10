import React,{useState,createRef,useEffect, createElement} from "react"
import { useDispatch,useSelector } from "react-redux";
import 'react-quill/dist/quill.snow.css';
import { setHtmlContent } from "../actions/PageActions";
import 'react-quill/dist/quill.snow.css';
import theme from "../theme";
import ReactQuill from "react-quill";
const fonts = ["Arial","Courier New","Georgia"]
export default function RichEditor(props){
    // const editorRef = createRef(null)
    // const editingPage = useSelector(state=>state.pages.editingPage)
    const ehtmlContent = useSelector(state=>state.pages.editorHtmlContent)
  
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
    return( <div>
     
      <ReactQuill 
      className="bg-dark text-white stroke-white"
      modules={modules}
      formats={formats} value={ehtmlContent} onChange={(content)=>{
          dispatch(setHtmlContent(content))
      }} />
    </div>)
}