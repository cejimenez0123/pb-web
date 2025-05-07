import { useContext, useEffect,useState } from "react"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import { PageType } from "../../core/constants"
import LinkPreview from "../LinkPreview"
import isValidUrl from "../../core/isValidUrl"
import loadingGif from "../../images/loading.gif"
import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"
import { useLocation } from "react-router-dom"
import adjustScreenSize from "../../core/adjustScreenSize"
import Context from "../../context"
export default function PageDataElement({page,isGrid,book=null}){
    const [image,setImage]=useState(isValidUrl(page.data)?page.data:null)
    const {isPhone,isHorizPhone}=useContext(Context)
    const navigate = useNavigate()
    const location = useLocation()
    const size = adjustScreenSize(isGrid,true," overflow-hidden  "," h-[100%]  rounded-lg  "," "," py-2 rounded-lg "," ")
    const conSize = adjustScreenSize(isGrid,true," overflow-hidden ","h-[100%] overflow-hidden "," overflow-hidden ",""," ")
   
    useEffect(()=>{
        
        if(page && page.type==PageType.picture){
            if(isValidUrl(page.data)){
                setImage(page.data)
        
            }else{
                getDownloadPicture(page.data).then(url=>{
                    setImage(url)
             
                }).catch(err=>{
                console.log(err)
                
                })
            }
    
        }
    },[page])

 function Element({page}){   
switch(page.type){
    case PageType.text:{

    return( 

        <div 
        id="page-data-text"
        onClick={()=>{
                    navigate(Paths.page.createRoute(page.id))
                }}
        
        className={`  ql-editor 

        ${book?`mx-2`:""}  `}
   
   dangerouslySetInnerHTML={{__html:page.data}}/>

  ) }
  case PageType.picture:{
  
    return(image?
    <img        id="page-data-pic"
    className={`${isGrid?isPhone?"w-grid-mobile-content":"w-grid-content":isHorizPhone?"w-page-content":"w-page-mobile-content "} rounded-lg overflow-clip`}
    onClick={()=>{
   
   if(location.pathname!=Paths.page.createRoute(page.id)){
   navigate(Paths.page.createRoute(page.id))}

}} 
    
    src={image} alt={page.title}/>
    
    :
    <div className={`skeleton ${size}`}/>)
}
case PageType.link:{
    return(
    
        <LinkPreview
        id="page-data-link"
            isGrid={isGrid}
            url={page.data}
        />
       )
}
default:
    return(<div        id="page-data-skeleton "className={`skeleton ${size}`}>
   <img src={loadingGif}/>
</div>)
}
}
if(!page){
    return(
    <img src={loadingGif}/>
) 
}

return (<span className={conSize}><Element page={page}/></span>)
}