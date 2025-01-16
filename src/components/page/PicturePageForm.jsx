
import {    useContext, useEffect, 
            useState } from 'react';
import { uploadPicture } from '../../actions/UserActions';
import { useDispatch, useSelector } from 'react-redux';
import checkResult from '../../core/checkResult';
import isValidUrl from '../../core/isValidUrl';
import "../../App.css"
import LinkPreview from '../LinkPreview';
import { setHtmlContent } from '../../actions/PageActions';
import getDownloadPicture from '../../domain/usecases/getDownloadPicture';
import { PageType } from '../../core/constants';
import { useLocation } from 'react-router-dom';
import EditorContext from '../../container/page/EditorContext';
import { debounce } from 'lodash';
function PicturePageForm({createPage}){
    const dispatch = useDispatch()
    const {parameters,setParameters}=useContext(EditorContext)
    const htmlContent = useSelector(state=>state.pages.editorHtmlContent)
    const [localContent,setLocalContent] = useState("")
    const ePage = useSelector(state=>state.pages.editingPage)
    const [file,setFile]=useState(null)
    const location = useLocation()
    let href =location.pathname.split("/")
    const last = href[href.length-1]
    const [errorMessage,setErrorMessage]=useState(null)
    const [image,setImage]=useState(null)
    const handleLocalContent=debounce((e)=>{
        dispatch(setHtmlContent(e.target.value))
        let params = parameters
        params.data = e.target.value
        setParameters(params)
    },10)
    useEffect(()=>{
        if(ePage){
            switch(ePage.type){
                case PageType.link:{
                    dispatch(setHtmlContent(ePage.data))
                    setLocalContent(ePage.data)
                }
                case PageType.picture:{
                    if(isValidUrl(ePage.data)){
                        setImage(ePage.data)
                    }else{
                    getDownloadPicture(ePage.data).then(url=>{
                        setImage(url)
                    })}
                }}}
    
    },[])
    useEffect(()=>{
        if(ePage && ePage.type=="image"){
            if(!isValidUrl(ePage.data)){
                getDownloadPicture(ePage.data).then(url=>{
                    setImage(url)
                })
              
            }
        }
    },[])

    const contentDiv =()=>{
       
        if(ePage){
            return checkContentTypeDiv(ePage.type)
         }else{
             return checkContentTypeDiv(last)
        }
    
    }
   
    useEffect(()=>{
       let bounce = debounce(()=>dispatch(setHtmlContent(localContent)),10)
       return bounce()
    },[localContent])
        const handleFileInput = (e) => {
            const file = e.target.files[0];
            
            if (file) {
              // Check file type
              if (!file.type.startsWith('image/')) {
                setErrorMessage('Please upload a valid image file.');
                setImage(null)
                return;
              }
              setFile(file)
              setErrorMessage('');
              setImage(URL.createObjectURL(file));
              let params = parameters
                 params.file = file
                 setParameters(params)
              dispatch(uploadPicture(parameters)).then((result) => 
                checkResult(result,payload=>{
                    const href = payload["url"]
                    const fileName =payload.ref
            
                    setLocalContent(href)
                    params.data = fileName
                    setParameters(params)
                },err=>{}))
            }
            
          };
          useEffect(()=>{
            if(parameters.file){
                dispatch(uploadPicture(parameters)).then((result) => 
                  checkResult(result,payload=>{
                      const href = payload["url"]
                      setLocalContent(href)
                      const fileName =payload.ref
                      let params = parameters
                      params.data = fileName
                      setParameters(params)
                      dispatch(setHtmlContent(fileName))
                  }
                      ,err=>{}
                  
                  
                  ))
                  }else{
                      let params = parameters
                      params.data = htmlContent
                      setParameters(parameters)
                  }
          },[localContent])
        const savePage = ()=>{
            if(parameters.file){
          dispatch(uploadPicture(parameters)).then((result) => 
            checkResult(result,payload=>{
                const href = payload["url"]
                setLocalContent(href)
                const fileName =payload.ref
                let params = parameters
                params.data = fileName
                setParameters(params)
                dispatch(setHtmlContent(fileName))
            }
                ,err=>{}
            
            
            ))
            }else{
                let params = parameters
                params.data = htmlContent
                setParameters(parameters)
            }}


    const checkContentTypeDiv = (type)=>{
        switch(type){
            case PageType.link:{  
                if(isValidUrl(localContent)){        
                    return(
                    <LinkPreview url={localContent} />
                    )
                 }else{
                    return (<div className={"text-emerald-800 p-4"}>
                        <p>URL is not valid</p>
                        </div>)
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


    
    return(<div className='mx-auto  bg-emerald-200 rounded-b-lg w-full p-8'>
      {uploadBtn()}
       {!image? <label className='my-2 border-emerald-800 border-1 p-2 rounded-lg  text-emerald-800 '>
            URL
            <input 
            type='text'
                    value={localContent}
                    className='max-w-[65vw] lg:w-[25em] text-emerald-800 input bg-transparent'
                 
                    onChange={(e)=>{
                        setLocalContent(e.target.value)
                      handleLocalContent(e)}}
                />
            </label>:null}
            {contentDiv()}
         
       
        <p>{errorMessage}</p>
        
</div>)
}
export default PicturePageForm

