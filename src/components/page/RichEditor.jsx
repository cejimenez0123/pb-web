import React, { useEffect, useLayoutEffect, useState } from "react"
import { useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "../../styles/Editor.css"
import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import { setHtmlContent } from "../../actions/PageActions";

const fonts = ["Arial","Courier New","Georgia"]
export default function RichEditor({handleChange}){

    
      const page = useSelector(state=>state.pages.pageInView)
      const [html,setHtml] = useState(page.data)
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

    const handleTextChange=(content)=>{
        setHtml(content)
        handleChange(content)
    }

  
    return( <div className=" ">
     
      <ReactQuill 
      className="bg-green-600  overflow-scroll rounded-lg text-white stroke-white"
      modules={modules}
      formats={formats} value={html} onChange={(content)=>handleTextChange(content)}
        
     />
    </div>)
}