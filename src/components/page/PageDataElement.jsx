import { useContext, useEffect,useState } from "react"
import { PageType } from "../../core/constants"
import LinkPreview from "../LinkPreview"
import isValidUrl from "../../core/isValidUrl"
import loadingGif from "../../images/loading.gif"
import Paths from "../../core/paths"
import Context from "../../context"
import { IonImg, useIonRouter } from '@ionic/react';
import Enviroment from "../../core/Enviroment"
import truncate from "html-truncate"
import { Capacitor } from "@capacitor/core"
export default function PageDataElement({page,isGrid,book=null}){
    const [image,setImage]=useState(isValidUrl(page.data)?page.data:null)
    const {isHorizPhone}=useContext(Context)
   const router = useIonRouter()
    const location = router.routeInfo.pathname
   
    useEffect(()=>{
        
        if(page && page.type==PageType.picture){
            if(isValidUrl(page.data)){
                setImage(page.data)
            }else{
             
                setImage(Enviroment.imageProxy(page.data))
            
            }
    
        }
    },[page])

 function Element({page}){   
switch(page.type){
    case PageType.text:{
let t=page.data
    return( 

   <div

        className={`ql-editor page-data  p-4`} dangerouslySetInnerHTML={{__html:truncate(t, 400,{})}}/>


  ) }
  case PageType.picture:{
  
    return(image?
    <IonImg
      style={{maxWidth:"94vw",width:"100%"}}
    className="object-contain max-w-[94vw] sm:max-w-[45em] "
   
    onClick={()=>{
   
   if(location!=Paths.page.createRoute(page.id)){
  router.push(Paths.page.createRoute(page.id))}

}} 
alt={page.title}
    src={image}/>
    
    :
    <div className={`skeleton w-page-mobile`}/>)
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
    return(<div        id="page-data-skeleton "className={`skeleton w-[100%] h-[100%] min-h-[20em] max-w-[45em]`}>
  
</div>)
}
}
if(!page){
    return(
    <IonImg src={loadingGif}/>
) 
}

return (<Element page={page}/>)
}