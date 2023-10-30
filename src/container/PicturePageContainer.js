

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { FormGroup, Button,FormControlLabel,TextField, Checkbox } from "@mui/material"
import VisuallyHiddenInput from '../components/VisualHiddenInput';
import { useSelector } from 'react-redux';
import theme from "../theme"
import { useState } from 'react';
import { uploadPicture } from '../actions/UserActions';
import { useDispatch } from 'react-redux';
import { PageType } from '../core/constants';
import { createPage,setPageInView } from '../actions/PageActions';
import { useNavigate } from 'react-router-dom';
function PicturePageContainer(props){
    const dispatch = useDispatch()
    const [imageUrl,setImageUrl]= useState("")
    const [pageTitle,setPageTitle] = useState("")
    const [pageIsPrivate,setPageIsPrivate] = useState(false)
    const [commentable,setCommentable] = useState(true)
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    let imgDiv =(<div>

    </div>)
    if(imageUrl.length>0){
        imgDiv=(<img src={imageUrl} alt={pageTitle} />)
    }
    const handleSavePage =()=>{
     
        if(imageUrl!=null && imageUrl.length>0 && currentProfile){
        const params = {
            profileId: currentProfile.id,
            data:imageUrl,
            privacy: pageIsPrivate,
            approvalScore: 0,
            type: PageType.picture,
            title:pageTitle,
            commentable: commentable,
            readers:[],
            commenters:[],
            writers:[],
            editors:[]
            }
            dispatch(createPage(params)).then(result=>{
                if(result.error==null){
                    const {payload}= result
                    if(payload.error==null){
                        const {page}= payload
                        const pageParam = {page}
                        dispatch(setPageInView(pageParam))
                        navigate(`/page/${page.id}`)
                    }
                }
            })
        }
    }
    return(<div className='upload-picture'>
 
        
        <FormGroup className='form'>
            <TextField  
                    style={{backgroundColor:"white"}}
                    label="Page Title"
                    placeholder="Title" 
                    onChange={(e)=>setPageTitle(e.target.value)}/>
            <FormControlLabel  
                control={<Checkbox checked={pageIsPrivate} onChange={(e)=>{
                    setPageIsPrivate(e.target.checked)
                }}/>} label={pageIsPrivate?"Private":"Public"}
                   value={pageIsPrivate}/>  
                   <FormControlLabel 
                control={<Checkbox checked={commentable} onChange={(e)=>{
                    setCommentable(e.target.checked)
                }}/>} label={commentable?"Commenting is Open":"Commenting is Closed"}
                   value={pageIsPrivate}/>    
                        <Button 
                      
                            style={{backgroundColor:theme.palette.primary.main,margin: "2em"}}
                        
                    
                        component="label" variant="contained" startIcon={<CloudUploadIcon  />}>
           
            Upload Picture
            <VisuallyHiddenInput type="file"  name ='picture'
                onInput={(e)=>{
                    const files = Array.from(e.target.files)
                    const params = { file: files[0]
                    }
                    dispatch(uploadPicture(params)).then((result) => { 
                        if(result.error==null){
                            const { payload } = result
                            if(payload.error == null){
                                const {url } = payload
                                setImageUrl(url)
                            }
                        }
                    })
                    
                }
            }/>

            </Button>
            {imgDiv}
            <Button 
                variant='outlined'
                style={{padding: "1em",
                        marginTop: "2em",
                        color:theme.palette.primary.contrastText,backgroundColor: theme.palette.primary.main}}
                onClick={()=>{
                    handleSavePage()}}>Save</Button>
            </FormGroup>
    
    
</div>)
}
export default PicturePageContainer