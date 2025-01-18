import { useEffect,useState } from "react"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import { PageType } from "../../core/constants"
import LinkPreview from "../LinkPreview"
import isValidUrl from "../../core/isValidUrl"
export default function PageDataElement({page,isGrid}){
    const [image,setImage]=useState(page.data)
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

       className={`  ${isGrid?"h-60 isGrid p-2 rounded-lg w-[96%] mx-auto overflow-hidden text-ellipsis":"rounded-t-lg pt-12"} bg-emerald-200 `}
        >
        <div className={` w-[100%]  text-emerald-800 px-4   text-[0.8rem] ${isGrid?"isGrid mt-2 rounded-lg overflow-hidden":" pb-8  rounded-t-lg pt-12 ql-editor"}`}
    dangerouslySetInnerHTML={{__html:page.data}}></div>
    </div>
  )   }
  case PageType.picture:{

    return(image?<div className={` ${isGrid?"   max-w-[100%] max-h-96 overflow-hidden rounded-lg mx-auto pt-2 w-[96%]":"w-[100%] "}`} >
        <div className={` ${isGrid?"h-[100%] justify-center overflow-hidden w-full rounded-lg ":""}`}>
        <img className={isGrid?"rounded-lg   ":'rounded-t-lg'}
    
    src={image} alt={page.title}/>
    </div></div>:<div className='skeleton w-[100%] min-h-40'/>)
}
case PageType.link:{
    return(<div 
        className={`w-[100%] ${isGrid?"mx-auto mx-auto w-fit px-2":""}`}>
        <LinkPreview
        isGrid={isGrid}
                url={page.data}
        />
        </div>)
}
default:
    return(<div className='skeleton'>
    Loading...
</div>)
}
}
}