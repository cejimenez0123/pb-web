import { useContext, useEffect,useState } from "react"
import { PageType } from "../../core/constants"
import LinkPreview from "../LinkPreview"
import isValidUrl from "../../core/isValidUrl"
import loadingGif from "../../images/loading.gif"
import Paths from "../../core/paths"
import Context from "../../context"
import { IonImg, useIonRouter } from '@ionic/react';
import Enviroment from "../../core/Enviroment"
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

    return( 

   <div 
        
        className={`ql-editor page-data `} dangerouslySetInnerHTML={{__html:page.data}}/>
     
  
  ) }
  case PageType.picture:{
  
    return(image?!isHorizPhone?<img  id="page-data-pic"  

        className=""
        onClick={()=>{
   
        if(location!=Paths.page.createRoute(page.id)){
       router.push(Paths.page.createRoute(page.id))}
     
     }} 
     alt={page.title} src={image}
    />:
    <IonImg        id="page-data-pic"
    className="w-full h-full object-contain sm:w-[50em]"

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
    return(<div        id="page-data-skeleton "className={`skeleton w-page-mobile`}>
   <IonImg src={loadingGif}/>
</div>)
}
}
if(!page){
    return(
    <IonImg src={loadingGif}/>
) 
}

return (<div className="max-h-[30rem] overflow-clip sm:max-h-[50rem]"><Element page={page}/></div>)
}