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

        <div 
        onClick={()=>{
                    navigate(Paths.page.createRoute(page.id))
                }}
        className={` ql-editor text-ellipsis  rounded-lg border-emerald-200 border-b-4    ${isGrid?isPhone?" min-h-24 max-h-[18em] rounded-lg mx-auto w-grid-mobile-content ":"lulmo mt-2 max-h-[30rem] rounded-lg bg-emerald-100 w-grid-content mx-auto  p-4 text-emerald-800 overflow-hidden ":`${isPhone?`  w-[96vw] pb-2 top-0`: ` pb-8 max-h-[34rem] p-2 overflow-clip max-auto mx-auto my-1 w-page-content rounded-lg  overflow-hidden `} ${book?`mx-2`:""}  `}`}
    dangerouslySetInnerHTML={{__html:page.data}}/>

  )   }
  case PageType.picture:{
  
    return(image?<div  onClick={()=>{
   
        if(location.pathname!=Paths.page.createRoute(page.id)){
        navigate(Paths.page.createRoute(page.id))}
    }} className={` ${isGrid?isPhone?"max-h-[18em]":"  max-h-[38em]  rounded-lg mx-auto pt-2 mb-8 w-[96%] ":isPhone?"w-[96vw] rounded-t-lg":"w-[96vw] rounded-t-lg overflow-hidden md:w-page-content"}`} >
        <div className={` ${isGrid?isPhone?"justify-center overflow-hidden max-h-[18em] w-full rounded-lg":"justify-center overflow-hidden max-h-[30em] w-full rounded-lg ":""}`}>
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