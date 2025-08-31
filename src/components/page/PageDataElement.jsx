import { useContext, useEffect,useState } from "react"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import { PageType } from "../../core/constants"
import LinkPreview from "../LinkPreview"
import isValidUrl from "../../core/isValidUrl"
import loadingGif from "../../images/loading.gif"
import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"
import { useLocation } from "react-router-dom"
import adjustScreenSize from "../../core/adjustScreenSize"
import Context from "../../context"
import { IonImg } from '@ionic/react';
export default function PageDataElement({page,isGrid,book=null}){
    const [image,setImage]=useState(isValidUrl(page.data)?page.data:null)
    const {isPhone,isHorizPhone}=useContext(Context)
    const navigate = useNavigate()
    const location = useLocation()
    // const size = adjustScreenSize(isGrid,true," overflow-hidden  "," h-[100%]  rounded-lg  "," "," py-2 rounded-lg "," ")
    // const conSize = adjustScreenSize(isGrid,true," overflow-hidden ","h-[100%] overflow-hidden "," overflow-hidden ",""," ")
   
    useEffect(()=>{
        
        if(page && page.type==PageType.picture){
            if(isValidUrl(page.data)){
                setImage(page.data)
        
            }else{
                getDownloadPicture(page.data).then(url=>{
                    setImage(url)
             
                }).catch(err=>{
                console.log(err)
                
                })
            }
    
        }
    },[page])

 function Element({page}){   
switch(page.type){
    case PageType.text:{

    return( 

        <div 
        id="page-data-text"
    
        onClick={()=>{
                    navigate(Paths.page.createRoute(page.id))
                }}
        
        ><div 
        
        className={` ql-editor 
                ${book?`mx-2`:""}  `}
           
           dangerouslySetInnerHTML={{__html:page.data}}/></div>

  ) }
  case PageType.picture:{
  
    return(image?!isHorizPhone?<IonImg  id="page-data-pic"  
    // className={` rounded-lg ${isGrid?
    //     isPhone?
    //     "w-grid-mobile-content":
    //     "w-grid-content":
    //     isHorizPhone?"w-page-content":
    //     "w-page-mobile-content "} rounded-lg overflow-clip`} 
        className="w-page-mobile"
        onClick={()=>{
   
        if(location.pathname!=Paths.page.createRoute(page.id)){
        navigate(Paths.page.createRoute(page.id))}
     
     }} 
     alt={page.title} src={image}
    />:
    <IonImg        id="page-data-pic"
    className="w-page-mobile"
    // className={` rounded-lg ${isGrid?
    //     isPhone?
    //     "w-grid-mobile-content":
    //     "w-grid-content":
    //     isHorizPhone?"w-page-content":
    //     "w-page-mobile-content "} rounded-lg overflow-clip`}
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
        id="page-data-link"
    
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

return (<span className={"pb-1   "}><Element page={page}/></span>)
}