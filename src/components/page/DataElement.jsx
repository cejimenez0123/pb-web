import { useContext, useEffect, useState } from "react"

import isValidUrl from "../../core/isValidUrl"
import { IonImg, useIonRouter } from "@ionic/react"
import LinkPreview from "../LinkPreview"
import Context from "../../context"
import { PageType } from "../../core/constants"
import loadingGif from "../../images/loading.gif"
import Enviroment from "../../core/Enviroment"
function DataElement({page,isGrid,book=null,html=null}){

const initialImage = page?.type === PageType.picture
  ? (isValidUrl(page.data) ? page.data : Enviroment.imageProxy(page.data))
  : null;

const [image, setImage] = useState(initialImage);
    const {isHorizPhone}=useContext(Context)
 const router = useIonRouter()
  
   
    useEffect(()=>{
        
        if(page && page.type==PageType.picture){
            if(isValidUrl(page.data)){
                setImage(page.data)
            }else{
             
                setImage(Enviroment.imageProxy(page.data))
            
            }
    
        }
    },[page])
console.log(html)
 function Element({page}){   
switch(page.type){
    case PageType.text:{

    return( 

   <div 
        
        className={`ql-editor `} dangerouslySetInnerHTML={{__html:html??page.data}}/>
     
  
  ) }
  case PageType.picture:{
  
    return(image?!isHorizPhone?<img  id="page-data-pic"  

        className=""
        onClick={()=>{
   
        if(router.routeInfo.pathname!=Paths.page.createRoute(page.id)){
    router.push(Paths.page.createRoute(page.id))}
     
     }} 
     alt={page.title} src={image}
    />:
    <IonImg       id="page-data-pic"
    className="w-full h-full object-contain w-[100%]"

    onClick={()=>{
   
   if(router.routeInfo.pathname!=Paths.page.createRoute(page.id)){
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
    return(<div        id="page-data-skeleton "className={`skeleton `}>
   <IonImg src={loadingGif}/>
</div>)
}
}
if(!page){
    return(
    <IonImg src={loadingGif}/>
) 
}

return (<div className=" "><Element page={page}/></div>)
}

export default DataElement