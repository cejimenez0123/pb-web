import React from "react"
import { useDispatch,useSelector } from "react-redux";
import { setHtmlContent } from "../../actions/PageActions";
import ReactQuill from "react-quill";
import "../../styles/Editor.css"
const fonts = ["Arial","Courier New","Georgia"]
export default function RichEditor(props){
    
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
      className="bg-green-600 rich-editor rounded-b-lg sm:w-[46rem] rounded-lg  text-white stroke-white"
      modules={modules}
      formats={formats} value={ehtmlContent} onChange={(content)=>{
          dispatch(setHtmlContent(content))
      }} />
    </div>)
}