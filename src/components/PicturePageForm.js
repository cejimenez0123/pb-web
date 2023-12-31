import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import {    FormGroup,
            Button,
            TextField } from "@mui/material"
import VisuallyHiddenInput from '../components/VisualHiddenInput';
import theme from "../theme"
import {    useEffect, 
            useState } from 'react';
import { uploadPicture } from '../actions/UserActions';
import { useDispatch } from 'react-redux';
import {  saveButtonStyle } from '../styles/styles';
import checkResult from '../core/checkResult';
import isValidUrl from '../core/isValidUrl';
import debounce from '../core/debounce';
import ErrorBoundary from '../ErrorBoundary';
import LinkPreview from './LinkPreview';


function PicturePageForm({getUrl}){
    const dispatch = useDispatch()
    const [url,setUrl]= useState("")
    useEffect(()=>{
        getUrl(url)
    },[])
    const handleChange = (text)=>{
            setUrl(text) 
            getUrl(text)
    }
    const ImgDiv =()=>{
        if(url.length>0){
            let href = window.location.href.split("/")
            const last = href[href.length-1]
            if(last.toUpperCase()=="link".toUpperCase()){
                if(isValidUrl(url)){    
                    return(
                    <ErrorBoundary>
                        <LinkPreview url={url} />
                    </ErrorBoundary>)
            }
            }else{
                return(<img src={url} alt={""} />)
        }
        }else{
            return(<img src={url} alt={""} />)
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
 
        
        <FormGroup style={{backgroundColor:theme.palette.primary.light}}className='form'>
            <TextField  
                    value={url}
                    style={{backgroundColor:"white",borderRadius:"8px",maxWidth:"100%"}}
                    label="URL"
                    placeholder="URL" 
                    onChange={(e)=>debounce(handleChange(e.target.value),20)}
                />
            {uploadBtn()}
            {ImgDiv(url)}
            
            </FormGroup>
    
    
</div>)
}
export default PicturePageForm

 // const handleSavePage =()=>{
     
    //     if(imageUrl!=null && imageUrl.length>0 && currentProfile){
    //     const params = {
    //         profileId: currentProfile.id,
    //         data:imageUrl,
    //         privacy: pageIsPrivate,
    //         approvalScore: 0,
    //         type: PageType.picture,
    //         title:pageTitle,
    //         commentable: commentable,
    //         readers:[],
    //         commenters:[],
    //         writers:[],
    //         editors:[]
    //         }
    //         dispatch(createPage(params)).then(result=>{
    //             if(result.error==null){
    //                 const {payload}= result
    //                 if(payload.error==null){
    //                     const {page}= payload
    //                     const pageParam = {page}
    //                     dispatch(setPageInView(pageParam))
    //                     navigate(`/page/${page.id}`)
    //                 }
    //             }
    //         })
    //     }
    // }
    
    {/* <Button 
                variant='outlined'
                style={{padding: "1em",
                        marginTop: "2em",
                        color:saveButtonStyle.color,backgroundColor: saveButtonStyle.backgroundColor}}
                onClick={()=>{
                    // handleSavePage()}
                    }}>Save</Button> */}