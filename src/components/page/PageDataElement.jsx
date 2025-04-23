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

        <div 
        onClick={()=>{
                    navigate(Paths.page.createRoute(page.id))
                }}
        className={` ql-editor p-1 text-ellipsis  rounded-lg border-emerald-200 border-b-4    
        ${isGrid?isPhone?" min-h-24  rounded-lg mx-auto w-grid-mobile-content max-h-grid-mobile-content ":"lulmo mt-2 rounded-lg bg-emerald-100 w-grid-content h-grid-content mx-auto  p-4 text-emerald-800 overflow-hidden ":`${isHorizPhone? ` pb-8 w-page-content h-page-content p-2 overflow-clip max-auto mx-auto my-1  rounded-lg  overflow-hidden `:`  w-page-mobile-content overflow-hidden max-h-page-mobile-content pb-2 top-0`} ${book?`mx-2`:""}  `}`}
    dangerouslySetInnerHTML={{__html:page.data}}/>

  )   }
  case PageType.picture:{
  
    return(image?<div  onClick={()=>{
   
        if(location.pathname!=Paths.page.createRoute(page.id)){
        navigate(Paths.page.createRoute(page.id))}

    }} className={` ${isGrid?isPhone?"h-grid-mobile-content w-grid-mobile-content":"  h-grid rounded-lg mx-auto pt-2 mb-8 w-grid  ":isHorizPhone?`w-page-content h-page-content`:`w-page-mobile-content h-page-content rounded-t-lg"`}`} >
        <div className={` ${isGrid?isPhone?"justify-center overflow-hidden max-h-[18em] w-full rounded-lg":"justify-center overflow-hidden max-h-[30em] w-full rounded-lg ":""}`}>
        <img className={`rounded-lg ${ isGrid?isPhone?"w-grid-mobile-content":" w-grid-cotent overflow-hidden  ":isHorizPhone?`w-page`:`w-page-mobile`}`}
    
    src={image} alt={page.title}/>
    </div></div>:<div className='skeleton w-[100%] min-h-40'/>)
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