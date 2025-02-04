import { useEffect,useState } from "react"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import { PageType } from "../../core/constants"
import LinkPreview from "../LinkPreview"
import isValidUrl from "../../core/isValidUrl"
import loadingGif from "../../images/loading.gif"
export default function PageDataElement({page,isGrid}){
    const [image,setImage]=useState(isValidUrl(page.data)?page.data:null)
    const [loading,setLoading]=useState(true)
    useEffect(()=>{
        
        if(page && page.type==PageType.picture){
            if(isValidUrl(page.data)){
                setImage(page.data)
                setLoading(false)
            }else{
                getDownloadPicture(page.data).then(url=>{
                    setImage(url)
                    setLoading(false)
                }).catch(err=>{
                    setLoading(false)
                
                })
            }
    
        }else{
            setLoading(false)
        }
    },[page])
    if(page){
    
switch(page.type){
    case PageType.text:{

    return( 
        <div 

       className={isGrid?`h-60 isGrid p-2 rounded-lg w-[96%] mx-auto overflow-hidden text-ellipsis`:`rounded-t-lg  w-[96vw] md:w-page bg-emerald-200 `}
        >
        <div className={`  ${isGrid?"ql-editor mt-2 min-h-40 text-ellipsis rounded-lg bg-emerald-100 p-4 text-emerald-800 overflow-hidden":" pb-8  w-[96vw] md:w-page rounded-lg  ql-editor"}`}
    dangerouslySetInnerHTML={{__html:page.data}}/>
    </div>
  )   }
  case PageType.picture:{

    return(image?<div className={` ${isGrid?"   max-w-[100%] max-h-96 overflow-hidden rounded-lg mx-auto pt-2 w-[96%]":"w-[96vw] rounded-t-lg overflow-hidden md:w-page "}`} >
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