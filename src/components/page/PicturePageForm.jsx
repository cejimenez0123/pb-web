
import {    useContext, useEffect, 
            useState } from 'react';
import { uploadPicture } from '../../actions/UserActions';
import { useDispatch, useSelector } from 'react-redux';
import checkResult from '../../core/checkResult';
import isValidUrl from '../../core/isValidUrl';
import "../../App.css"
import LinkPreview from '../LinkPreview';
import { setHtmlContent } from '../../actions/PageActions.jsx';
import getDownloadPicture from '../../domain/usecases/getDownloadPicture';
import { PageType } from '../../core/constants';
import { useLocation } from 'react-router-dom';
import EditorContext from '../../container/page/EditorContext';
import { debounce } from 'lodash';
function PicturePageForm(props){
    const dispatch = useDispatch()
    const {page,parameters,setParameters} = useContext(EditorContext)
    const [localContent,setLocalContent] = useState("")
    const ePage = useSelector(state=>state.pages.editingPage)
    const [file,setFile]=useState(null)
    const location = useLocation()
    let href =location.pathname.split("/")
    const last = href[href.length-1]
    const [errorMessage,setErrorMessage]=useState(null)
    const [image,setImage]=useState(null)
    const handleLocalContent=(e)=>{
    if(last==PageType.picture){
        setLocalContent(e.target.value)
        if(isValidUrl(e.target.value)){
            
            setImage(e.target.value)
            dispatch(setHtmlContent(e.target.value))
            let params = parameters
            params.data = e.target.value
            setParameters(params)
        }
    }else{
        setLocalContent(e.target.value)
        setImage(null)
        dispatch(setHtmlContent(e.target.value))
        let params = parameters
        params.data = e.target.value
        setParameters(params)
    }}
    useEffect(()=>{
        if(ePage){
            switch(ePage.type){
                case PageType.link:{
                    dispatch(setHtmlContent(ePage.data))
                    setLocalContent(ePage.data)
                    setImage(null)
                }
                case PageType.picture:{
                
                        if(isValidUrl(ePage.data)){
                            setImage(ePage.data)    
                            setLocalContent(ePage.data)
                        }else{
                            getDownloadPicture(ePage.data).then(url=>{
                                
                                setImage(url)
                                setLocalContent(url)
                            })
                        }
                    
                }
            }}
    
    },[ePage])
  

    const contentDiv =()=>{
       
        if(ePage){
            return checkContentTypeDiv(ePage.type)
         }else{
             return checkContentTypeDiv(last)
        }
    
    }
   
 
        const handleFileInput = (e) => {
            e.preventDefault()
            const fil = e.target.files[0];
            
            if (fil) {
              // Check file type
              if (!fil.type.startsWith('image/')) {
                setErrorMessage('Please upload a valid image file.');
                setImage(null)
                return;
              }
              setFile(fil)
        
              let params = parameters
                 params.file = fil
                 setParameters(params)
                 if(localContent.length==0){

              
              dispatch(uploadPicture(parameters)).then((result) => 
                checkResult(result,payload=>{
                    const href = payload["url"]
                    const fileName =payload.ref
                    setLocalContent(href)
                    setImage(href)
                    params.data = fileName
                    dispatch(setHtmlContent(fileName))
                    setParameters(params)
                },err=>{}))
            }
        }
            
          };
      
   

    const checkContentTypeDiv = (type)=>{
        switch(type){
            case PageType.link:{  
                if(isValidUrl(localContent)){        
                    return(
              
                    <LinkPreview url={localContent} />
                
                    )
                 }else if(localContent.length>0){
                    return (<div className={"text-emerald-800 p-4"}>
                        <p>URL is not valid</p>
                        </div>)
                 }else{
                    return null
                 }
                }

       
       case PageType.picture:{
     
            return(
                <div className='text-left'>
                        <img className="rounded-lg overflow-hidden my-4 mx-auto" src={image} alt={ePage?ePage.title:""} />
                
                </div>
            )
           
        }

}}
    const uploadBtn =()=>{
        let href = window.location.href.split("/")
        const last = href[href.length-1]
        if(last.toUpperCase()=="image".toUpperCase()){
            return( <div>  
                 <input
                className="file-input my-8 mx-auto max-w-48"
                    type="file"
                    accept="image/*"
                   onInput={handleFileInput}/>
                         
                    <div style={{ marginTop: '20px' }}>
      
                      </div>
                    </div>)
                    }}

                 
    
    return(<div className='  bg-emerald-200  flex flex-col pb-8 rounded-b-lg w-full '>
      
      <div className='p-8 mx-auto'>{uploadBtn()}</div>
      {!image? <label className='my-2 border-emerald-600 border-2 max-w-[30em] mx-auto py-4 flex pl-2 pr-3 rounded-full  bg-transparent  text-emerald-800 '>
            <h6 className='mont-medium my-auto'>URL</h6>
            <input 
            type='text'
                    value={localContent}
                    className=' text-emerald-800 text-[1.2rem] mx-1 w-[90%] my-auto bg-transparent'
                 
                    onChange={(e)=>handleLocalContent(e)}
                />
            </label>:null}
            <div className='md:w-page'>
                        {contentDiv()}
         
                        </div>
        <p>{errorMessage}</p>
        
</div>)
}
export default PicturePageForm

