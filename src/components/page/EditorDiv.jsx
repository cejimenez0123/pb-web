
 import { useContext, useEffect, useState } from "react"
import RichEditor from "./RichEditor"
import { PageType } from "../../core/constants"
import { useSelector } from "react-redux"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import LinkPreview from "../LinkPreview"
import PicturePageForm from "./PicturePageForm"
 export default function EditorDiv({parameters,handleChange,createPage}){
        const ePage = useSelector(state=>state.pages.editingPage)
        const loading = useSelector(state=>state.pages.loading)
        let href =location.pathname.split("/")
        let last = href[href.length-1]
        const [type,setType]=useState(ePage?ePage.type:last)
        const [image,setImage]=useState(null)
      
        
        useEffect(()=>{
          if(ePage && ePage.type==PageType.picture){
            getDownloadPicture(ePage.data).then(url=>{
              setImage(url)
            })
          }
        },[ePage])
        useEffect(()=>{
          if(ePage){
            setType(ePage.type)
          }else{
            setType(last)
          }
      },[ePage])



      switch(type){
              case PageType.picture:{
                if(!ePage){
                  return(<div><PicturePageForm createPage={createPage}/></div>)
                }
                return (<div  className="mx-auto  bg-emerald-200 rounded-b-lg w-full p-8">

                <img  className="rounded-lg my-4 mx-auto"
                src={image} alt={ePage.title}/>
                </div>)
              }
            
          case PageType.link:{
                if(!ePage){
                  return(<div><PicturePageForm createPage={createPage}/></div>)
                }
                  return(
                     <LinkPreview url={ePage.data}/>
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