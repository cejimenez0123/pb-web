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
export default function PageDataElement({page,isGrid,book=null}){
    const [image,setImage]=useState(isValidUrl(page.data)?page.data:null)
    const navigate = useNavigate()
    const location = useLocation()
        const isPhone =  useMediaQuery({
    query: '(max-width: 768px)'
  })
  const isHorizPhone =  useMediaQuery({
    query: '(min-width: 768px)'
  })
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
<span className={`overflow-hidden ${isGrid?isPhone?`max-h-grid-mobile-content `:`max-h-[16rem]`:isHorizPhone?`max-h-page-content`:`max-h-[100%]`}`}>
        <div 
        onClick={()=>{
                    navigate(Paths.page.createRoute(page.id))
                }}
        className={` ql-editor p-1 text-ellipsis ${adjustScreenSize(isGrid,true,"","","","")} rounded-lg lulmo overflow-hidden border-emerald-200 border-b-4    
        ${isGrid?isPhone?" min-h-24  rounded-lg mx-auto w-grid-mobile-content ":"  p-1 mx-auto rounded-lg bg-emerald-100 w-grid-content ":`${isHorizPhone? ` pb-8 w-page-content p-2 overflow-y-hidden max-auto mx-auto my-1  rounded-lg  overflow-hidden `:`  w-page-mobile-content max-h-grid-mobile-content overflow-y-hidden pb-2 top-0`} ${book?`mx-2`:""}  `}`}
    dangerouslySetInnerHTML={{__html:page.data}}/>
 </span> 
  ) }
  case PageType.picture:{
  
    return(image?
    <img  onClick={()=>{
   
   if(location.pathname!=Paths.page.createRoute(page.id)){
   navigate(Paths.page.createRoute(page.id))}

}} className={`rounded-lg ${ isGrid?isPhone?"w-grid-mobile-content ":" w-grid-content overflow-hidden  ":isHorizPhone?`w-page`:`w-page-mobile`}`}
    
    src={image} alt={page.title}/>
    
    :
    <div className='skeleton w-[100%] min-h-40'/>)
}
case PageType.link:{
    return(<div 
        className={isGrid?isPhone?`w-grid-mobile-content`:`w-grid-content `:isHorizPhone?`w-page-content`:`w-page-mobile-content`}>
    
        <LinkPreview
            isGrid={isGrid}
            url={page.data}
        />
        </div>)
}
default:
    return(<div className='skeleton min-h-24'>
   <img src={loadingGif}/>
</div>)
}
}
}