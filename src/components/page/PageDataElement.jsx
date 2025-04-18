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
export default function PageDataElement({page,isGrid}){
    const [image,setImage]=useState(isValidUrl(page.data)?page.data:null)
    const navigate = useNavigate()
    const location = useLocation()
        const isPhone =  useMediaQuery({
    query: '(max-width: 768px)'
  })
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
    
        }
    },[page])
    if(page){
    
switch(page.type){
    case PageType.text:{

    return( 
<span className={isGrid?"px-1":""}>
        <div 
        onClick={()=>{
                    navigate(Paths.page.createRoute(page.id))
                }}
        className={` ql-editor text-ellipsis  rounded-lg  ${isPhone?" top-0":""} ${isGrid?isPhone?"max-h-24 mx-auto w-grid-mobile-content ":" mt-2 min-h-[28em] rounded-lg bg-emerald-100 w-grid-content  p-4 text-emerald-800 overflow-hidden ":" pb-8  w-[96vw]  sm:w-page rounded-lg"}`}
    dangerouslySetInnerHTML={{__html:page.data}}/>
  </span>
  )   }
  case PageType.picture:{
  
    return(image?<div  onClick={()=>{
   
        if(location.pathname!=Paths.page.createRoute(page.id)){
        navigate(Paths.page.createRoute(page.id))}
    }} className={` ${isGrid?isPhone?"max-h-[18em]":"  max-h-96  rounded-lg mx-auto pt-2 mb-8 w-[96%] ":"w-[96vw] rounded-t-lg overflow-hidden md:w-page "}`} >
        <div className={` ${isGrid?isPhone?"justify-center overflow-hidden max-h-[18em] w-full rounded-lg":"justify-center overflow-hidden max-h-[26.2em] w-full rounded-lg ":""}`}>
        <img className={`rounded-lg ${ isGrid?isPhone?"":" overflow-hidden  ":``}  w-[96vw] md:w-page`}
    
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