import React, {  useEffect, useState } from "react"
import ReactQuill from "react-quill";
import "../../styles/Editor.css"
import { useParams } from "react-router-dom";

const fonts = ["Arial","Courier New","Georgia"]
export default function RichEditor({page,handleChange}){
      const pathParams = useParams()
  
      const [html,setHtml] = useState("")
    useEffect(()=>{
        if(page){
          setHtml(page.data)
        }
    },[page])
 
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
     
      <ReactQuill 
      className="bg-green-600   rounded-lg text-white stroke-white"
      modules={modules}
      formats={formats} value={html} onChange={(content)=>handleTextChange(content)}
        
     />
    )
}