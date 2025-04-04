import { useEffect,useState } from "react"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import { PageType } from "../../core/constants"
import LinkPreview from "../LinkPreview"
import isValidUrl from "../../core/isValidUrl"
import loadingGif from "../../images/loading.gif"
import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"
import { useLocation } from "react-router-dom"
export default function PageDataElement({page,isGrid}){
    const [image,setImage]=useState(isValidUrl(page.data)?page.data:null)
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(()=>{
        
        if(page && page.type==PageType.picture){
            if(isValidUrl(page.data)){
                setImage(page.data)
                // setLoading(false)
            }else{
                getDownloadPicture(page.data).then(url=>{
                    setImage(url)
                    // setLoading(false)
                }).catch(err=>{
                    // setLoading(false)
                
                })
            }
    
        }else{
            // setLoading(false)
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
       className={isGrid?`h-[100%]  p-2 rounded-lg  w-[100%] mx-auto overflow-hidden text-ellipsis`:`rounded-t-lg   h-[100%] w-[96vw] md:w-page bg-emerald-200 `}
        >
        <div className={`  ${isGrid?"ql-editor mt-2  text-ellipsis rounded-lg bg-emerald-100 p-4 text-emerald-800 overflow-hidden":" pb-8  w-[96vw]  md:w-page rounded-lg  ql-editor"}`}
    dangerouslySetInnerHTML={{__html:page.data}}/>
    </div>
  )   }
  case PageType.picture:{
    console.log("XSS",location.pathname)
    return(image?<div  onClick={()=>{
   
        if(location.pathname!=Paths.page.createRoute(page.id)){
        navigate(Paths.page.createRoute(page.id))}
    }} className={` ${isGrid?"  max-h-96  rounded-lg mx-auto pt-2 mb-8 w-[96%] ":"w-[96vw] rounded-t-lg overflow-hidden md:w-page "}`} >
        <div className={` ${isGrid?"h-[100%] justify-center overflow-hidden w-full rounded-lg ":""}`}>
        <img className={isGrid?"rounded-lg   ":'rounded-t-lg overflow-hidden w-[96vw] md:w-page'}
    
    src={image} alt={page.title}/>
    </div></div>:<div className='skeleton w-[100%] min-h-40'/>)
}
case PageType.link:{
    return(<div 
        className={` ${isGrid?"mx-auto mx-auto w-fit px-2":"w-[96vw] md:w-page"}`}>
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