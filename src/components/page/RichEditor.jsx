import React, {  useEffect, useLayoutEffect, useState } from "react"
import ReactQuill from "react-quill";
import "../../styles/Editor.css"
import { useSelector } from "react-redux";
import { ErrorBoundary } from "@sentry/react";

const fonts = ["Arial","Courier New","Georgia"]
export default function RichEditor({ initContent,handleChange}){

    
      const htmlContent = useSelector(state=>state.pages.editorHtmlContent)
      const [html,setHtml] = useState(htmlContent.html??"")

    useEffect(()=>{
       
          setHtml(htmlContent.html??"")
      
    },[])
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

  
    return( 
      <ErrorBoundary>
      <ReactQuill 
      className=" rounded-lg text-white stroke-white"
      modules={modules}
      formats={formats} value={html} onChange={(content)=>handleTextChange(content)}
        
     />
     </ErrorBoundary>
    )
}