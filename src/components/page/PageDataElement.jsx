import { useContext, useEffect,useState } from "react"
import { PageType } from "../../core/constants"
import LinkPreview from "../LinkPreview"
import isValidUrl from "../../core/isValidUrl"
import loadingGif from "../../images/loading.gif"
import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"
import { useLocation } from "react-router-dom"
import Context from "../../context"
import { IonImg } from '@ionic/react';
import Enviroment from "../../core/Enviroment"
export default function PageDataElement({page,isGrid,book=null}){
    const [image,setImage]=useState(isValidUrl(page.data)?page.data:null)
    const {isHorizPhone}=useContext(Context)
    const navigate = useNavigate()
    const location = useLocation()
   
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
        className="w-[100vw] sm:w-[50em] no-scroll overscroll-none"
    
        onClick={()=>{
                    navigate(Paths.page.createRoute(page.id))
                }}
        
        ><div 
        
        className={`ql-editor no-scroll sm:w-[48em]`} dangerouslySetInnerHTML={{__html:page.data}}/>
        </div>
        // </div>
  ) }
  case PageType.picture:{
  
    return(image?!isHorizPhone?<img  id="page-data-pic"  

        className="w-page-mobile sm:w-[50em]"
        onClick={()=>{
   
        if(location.pathname!=Paths.page.createRoute(page.id)){
        navigate(Paths.page.createRoute(page.id))}
     
     }} 
     alt={page.title} src={image}
    />:
    <IonImg        id="page-data-pic"
    className="w-full h-full object-contain sm:w-[50em]"

    onClick={()=>{
   
   if(location.pathname!=Paths.page.createRoute(page.id)){
   navigate(Paths.page.createRoute(page.id))}

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

return (<Element page={page}/>)
}