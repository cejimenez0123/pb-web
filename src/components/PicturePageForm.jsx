import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import {    FormGroup,
            Button,
            TextField } from "@mui/material"
import VisuallyHiddenInput from './VisualHiddenInput';
import theme from "../theme"
import {    useEffect, 
            useState } from 'react';
import { uploadPicture } from '../actions/UserActions';
import { useDispatch, useSelector } from 'react-redux';
import {  saveButtonStyle } from '../styles/styles';
import checkResult from '../core/checkResult';
import isValidUrl from '../core/isValidUrl';
import debounce from '../core/debounce';
import ErrorBoundary from '../ErrorBoundary';
import "../App.css"
import LinkPreview from './LinkPreview';
import { setHtmlContent } from '../actions/PageActions';

function PicturePageForm(){
    const dispatch = useDispatch()
    const htmlContent = useSelector(state=>state.pages.editorHtmlContent)
    const ePage = useSelector(state=>state.pages.editingPage)
    const [url,setUrl]= useState("")
    useEffect(()=>{
        setUrl(htmlContent)
    },[])
    const handleChange = (text)=>{
            dispatch(setHtmlContent(text))

    }
    const contentDiv =()=>{

            let href = window.location.href.split("/")
            const last = href[href.length-1]
        if(ePage==null){
       
            return checkContentTypeDiv(last)
    }else{
        return checkContentTypeDiv(ePage.type)
    }
    
    }
    const checkContentTypeDiv = (type)=>{
        if(type.toUpperCase()=="link".toUpperCase()){  
           if(isValidUrl(htmlContent)){        
                return(
                    <LinkPreview url={htmlContent} />
                )
            }else{
                return (<div><p>URL is not valid</p></div>)
            }
        }else{
            return(
                <img src={htmlContent} alt={""} />
            )
        }
    }
    const uploadBtn =()=>{
        let href = window.location.href.split("/")
        const last = href[href.length-1]
        if(last.toUpperCase()=="image".toUpperCase()){
            return(<div>
            <Button 
            style={{backgroundColor:saveButtonStyle.backgroundColor,
                    marginTop: "2em"
                }}
            component="label" variant="contained" 
            startIcon={<CloudUploadIcon  />}
        >
Upload Picture
<VisuallyHiddenInput type="file"  name ='picture'
onInput={(e)=>{
    const files = Array.from(e.target.files)
    const params = { file: files[0]
    }
    dispatch(uploadPicture(params)).then((result) => 
        checkResult(result,payload=>{
            const href = payload["url"]
           
            handleChange(href)
    },err=>{

    })
    )
}}            
/>
</Button>
</div>
)
    }else{
        return(<div></div>)
    }
}
    
   
    
    return(<div className='upload-picture'>
 
        
        {/* <FormGroup > */}
            <TextField  
                    value={htmlContent}
                    className='url'
                    label="URL"
                    placeholder="URL" 
                    onChange={(e)=>debounce(handleChange(e.target.value),20)}
                />
            {uploadBtn()}
        
            {contentDiv()}
           
            {/* </FormGroup> */}
            
    
</div>)
}
export default PicturePageForm

