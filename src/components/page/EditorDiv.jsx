
 import { useContext, useEffect, useState } from "react"
import RichEditor from "./RichEditor"
import { PageType } from "../../core/constants"
import { useSelector } from "react-redux"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import LinkPreview from "../LinkPreview"
import PicturePageForm from "./PicturePageForm"
import EditorContext from "../../container/page/EditorContext"
 export default function EditorDiv({parameters,handleChange,createPage}){
        const {page} = useContext(EditorContext)
        
        const loading = useSelector(state=>state.pages.loading)
    
        const [type,setType]=useState()
        const [image,setImage]=useState(null)
      
        
        useEffect(()=>{
          if(page && page.type==PageType.picture){
            getDownloadPicture(page.data).then(url=>{
              setImage(url)
            })
          }
        },[page])
      
console.log(page)
        if(!page){
          return(<div className="skeleton"/>)
        }

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
                if(!page){
                  return(<div><PicturePageForm createPage={createPage}/></div>)
                }
                console.log("page touch")
                  return(
                     <LinkPreview url={page.data}/>
                  )
                
            
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