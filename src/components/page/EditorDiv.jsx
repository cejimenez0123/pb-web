 import Context from "../../context" 
 import { useParams } from "react-router-dom"
 import { useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import RichEditor from "./RichEditor"
import { updateStory } from "../../actions/StoryActions"
import checkResult from "../../core/checkResult"
import { PageType } from "../../core/constants"
import { useSelector } from "react-redux"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import { setHtmlContent } from "../../actions/PageActions"
 export default function EditorDiv({title,isPrivate,comment}){
        const {setIsSaved}=useContext(Context)
        const pageParams = useParams()
        const page = useSelector(state=>state.pages.pageInView)
        const dispatch = useDispatch()
        const [image,setImage]=useState(null)
        useEffect(()=>{
          if(page && page.type==PageType.picture){
            getDownloadPicture(page.data).then(url=>{
              setImage(url)
            })
          }
        },[])
        const dispatchContent=(content)=>{
          let params = { page:pageParams,
            title: title,
            data: content,
            privacy:isPrivate,
            commentable:comment,  
            type:"html"
            }
            dispatch(setHtmlContent(content))
            setIsSaved(false)
            dispatch(updateStory(params)).then((res)=>{
            checkResult(res,payload=>{
                setIsSaved(content==payload.story.data)
                },err=>{})
            })
    
        }
          if(page){
            switch(page.type){
              case PageType.text:{
                return (<div >
                  <RichEditor
                  page={page}
                                handleChange={(content)=>{
                                dispatchContent(content)
                              }}/>
                              </div>)
              }
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
                }}}else{
            let href = window.location.href.split("/")
            let last = href[href.length-1]
            if(last.toUpperCase()=="image".toUpperCase()||last.toUpperCase()=="link".toUpperCase()){
              return (<PicturePageForm createPage={(params)=>{
                setImageParams(params)
                handlePageForm(params)
              }}/>)
            }else{
              return(<div id=""><RichEditor     handleChange={(content)=>{
                dispatchContent(content)

              }}/></div>)
            }
          
            
          }
          
        }