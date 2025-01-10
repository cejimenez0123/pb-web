
import {    useEffect, 
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

function PicturePageForm({createPage}){
    const dispatch = useDispatch()
    const htmlContent = useSelector(state=>state.pages.editorHtmlContent)
    const [localContent,setLocalContent] = useState("")
    const ePage = useSelector(state=>state.pages.pageInView)
    const [file,setFile]=useState(null)
    const [errorMessage,setErrorMessage]=useState(null)
    const [image,setImage]=useState(null)
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
  

        }else{
            if(isValidUrl(htmlContent)){
                setLocalContent(htmlContent)
            }

        }
    },[])

    const contentDiv =()=>{
        let href = window.location.href.split("/")
        const last = href[href.length-1]
        if(ePage){
            return checkContentTypeDiv(ePage.type)
         }else{
             return checkContentTypeDiv(last)
        }
    
    }
   

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
              const params = {file:file}
              dispatch(uploadPicture(params)).then((result) => 
                checkResult(result,payload=>{
                    const href = payload["url"]
                    const fileName =payload.ref
                    dispatch(setHtmlContent(fileName))
                    setLocalContent(href)
                 
                    let path = window.location.href.split("/")
                    const last = path[path.length-1]
                    createPage({file,data:fileName,type:last})
                },err=>{}))
            }
            
          };
        const savePage = ()=>{
        const params = {file:file}
          dispatch(uploadPicture(params)).then((result) => 
            checkResult(result,payload=>{
                const href = payload["url"]
                setLocalContent(href)
                const fileName =payload.ref
                dispatch(setHtmlContent(fileName))
                let path = window.location.href.split("/")
                const last = path[path.length-1]
                createPage({data:fileName,type:last})},err=>{}))
            }


    const checkContentTypeDiv = (type)=>{
        switch(type.toLowerCase()){
            case "link".toLowerCase():{  
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
       case "image".toLowerCase():{
            return(
                <div className='text-left'>
                    <div onClick={()=>{
                       savePage()
                    }}  className='bg-emerald-600 rounded-full text-xl w-[8em] h-[4em] flex'><h6 className='my-auto mx-auto'>Save</h6></div>
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
 
        

        <label className='my-2 border-emerald-800 border-1 p-2 rounded-lg  text-emerald-800 '>
            URL
            <input 
            type='text'
                    value={localContent}
                    className='w-[65vw] sm:w-[25em] text-emerald-800 input bg-transparent'
                 
                    onChange={(e)=>{
                        setLocalContent(e.target.value)
                        dispatch(setHtmlContent(e.target.value))}}
                />
            </label>
            {uploadBtn()}
        <p>{errorMessage}</p>
            {contentDiv()}
           
      
            
    
</div>)
}
export default PicturePageForm

