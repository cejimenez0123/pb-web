import { useEffect,useState } from "react"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import { PageType } from "../../core/constants"
import LinkPreview from "../LinkPreview"
import isValidUrl from "../../core/isValidUrl"
import loadingGif from "../../images/loading.gif"
import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"
import { useLocation } from "react-router-dom"
import { useMediaQuery } from "react-responsive"
import adjustScreenSize from "../../core/adjustScreenSize"
import { size } from "lodash"
export default function PageDataElement({page,isGrid,book=null}){
    const [image,setImage]=useState(isValidUrl(page.data)?page.data:null)
    const navigate = useNavigate()
    const location = useLocation()
   
  let sizeInner = adjustScreenSize(isGrid,true,"rounded-lg overflow-clip"," rounded-lg overflow-clip ","","","","","")
    useEffect(()=>{
        
        if(page && page.type==PageType.picture){
            if(isValidUrl(page.data)){
                setImage(page.data)
        
            }else{
                getDownloadPicture(page.data).then(url=>{
                    setImage(url)
             
                }).catch(err=>{
                
                
                })
            }
    
        }
    },[page])
    if(page){
    
switch(page.type){
    case PageType.text:{

    return( 

        <div 
        onClick={()=>{
                    navigate(Paths.page.createRoute(page.id))
                }}
        
        className={` ql-editor 
       
        ${book?`mx-2`:""}  `}
   
   dangerouslySetInnerHTML={{__html:page.data}}/>

  ) }
  case PageType.picture:{
  
    return(image?
    <img  onClick={()=>{
   
   if(location.pathname!=Paths.page.createRoute(page.id)){
   navigate(Paths.page.createRoute(page.id))}

}} className={`rounded-lg `}
    
    src={image} alt={page.title}/>
    
    :
    <div className={`skeleton ${sizeInner}`}/>)
}
case PageType.link:{
    return(
    
        <LinkPreview
            isGrid={isGrid}
            url={page.data}
        />
       )
}
default:
    return(<div className={`skeleton ${sizeInner}`}>
   <img src={loadingGif}/>
</div>)
}
}
}