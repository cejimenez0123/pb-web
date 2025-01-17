
 import { useContext, useEffect, useState } from "react"
import RichEditor from "./RichEditor"
import { PageType } from "../../core/constants"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import PicturePageForm from "./PicturePageForm"
import EditorContext from "../../container/page/EditorContext"
import { useLocation } from "react-router-dom"

 export default function EditorDiv({parameters,handleChange,createPage}){
        const location = useLocation()
        const {page} = useContext(EditorContext)
        let href =location.pathname.split("/")
        let last = href[href.length-1]
        const [image,setImage]=useState(null)
      
        
        useEffect(()=>{
          if(page && page.type==PageType.picture){
            getDownloadPicture(page.data).then(url=>{
              setImage(url)
            })
          }
        },[page])
    

        if(!page){
          if(last){
         
          switch(last){
            case PageType.picture:{
            
                return(<div><PicturePageForm /></div>)
              
           
            }
          
        case PageType.link:{
        
                return(<div><PicturePageForm /></div>)
            
             
              
          
            }
        case PageType.text:{
              return(<RichEditor initContent={parameters.data} handleChange={(content)=>{
                handleChange(content)}}/>)
            }
        default:{
    
            return(<div className="skeleton w-24 h-24"/>)
            
            }
        }
        }}

      switch(page.type){
              case PageType.picture:{
                if(!page){
                  return(<div><PicturePageForm createPage={createPage}/></div>)
                }
                return (<div  className="mx-auto  bg-emerald-200 rounded-b-lg w-full p-8">

                <img  className="rounded-lg my-4 mx-auto"
                src={image} alt={page.title}/>
                </div>)
              }
            
          case PageType.link:{
           
                  return(<div><PicturePageForm createPage={createPage}/></div>)
                
                
            
              }
          case PageType.text:{
                return(<RichEditor initContent={parameters.data} handleChange={(content)=>{
                  handleChange(content)}}/>)
              }
          default:{
                return(<RichEditor  initContent={parameters.data}  handleChange={(content)=>{
                  handleChange(content)}}/>)
              }
          }
     
      
    }