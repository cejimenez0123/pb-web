 import Context from "../../context" 
 import { useLocation, useParams } from "react-router-dom"
 import { useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import RichEditor from "./RichEditor"
import { updateStory } from "../../actions/StoryActions"
import checkResult from "../../core/checkResult"
import { PageType } from "../../core/constants"
import { useSelector } from "react-redux"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import { setHtmlContent } from "../../actions/PageActions"
import PicturePageForm from "../../components/page/PicturePageForm"
import LinkPreview from "../LinkPreview"
 export default function EditorDiv({title,isPrivate,comment,setParams}){
        const {setIsSaved}=useContext(Context)
        const location = useLocation()
        const pageParams = useParams()
        const page = useSelector(state=>state.pages.pageInView)
        const dispatch = useDispatch()
        const [type,setType]=useState(page?page.type:null)
        const [image,setImage]=useState(null)
        useEffect(()=>{
          if(page && page.type==PageType.picture){
            getDownloadPicture(page.data).then(url=>{
              setImage(url)
            })
          }
        },[page])
        
        const dispatchContent=(content)=>{
          let params = { page:pageParams,
            title: title,
            data: content,
            privacy:isPrivate,
            commentable:comment,  
            type:"html"
            }
            setType(PageType.text)
            dispatch(setHtmlContent(content))
            setIsSaved(false)
            dispatch(updateStory(params)).then((res)=>{
            checkResult(res,payload=>{
              setType(payload.story.type)
                setIsSaved(content==payload.story.data)
                },err=>{})
            })
    
        }
        if(!page){
          if(last.toUpperCase()=="image".toUpperCase()||last.toUpperCase()=="link".toUpperCase()){
            return (<PicturePageForm createPage={(params)=>{
              setParams(params)
       
            }}/>)
          }else{
            return(<div id=""><RichEditor  handleChange={(content)=>{
              dispatchContent(content)

            }}/></div>)
        }
      }
            switch(page.type){

              case PageType.picture:{
                return (<div  className="mx-auto  bg-emerald-200 rounded-b-lg w-full p-8">

                <img  className="rounded-lg my-4 mx-auto"
                src={image} alt={page.title}/>
                </div>)
              }
            
          case PageType.link:{

                  return(
                     <LinkPreview url={page.data}/>
                  )
                
            
              }
          default:{
         
        
        return(  <RichEditor  handleChange={(content)=>{
          dispatchContent(content)}}
/>
        )

          }} } 
           
        