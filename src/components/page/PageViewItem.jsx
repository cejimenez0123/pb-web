import { useSelector } from "react-redux"

import {useLayoutEffect, useRef, useState} from "react"
import PageViewButtonRow  from "./PageViewButtonRow"
import CommentInput from "../comment/CommentInput"
import "../../styles/PageView.css"
import PropTypes from 'prop-types'
import Paths from "../../core/paths"
import ProfileCircle from "../profile/ProfileCircle"
import { initGA, sendGAEvent } from "../../core/ga4"
import {  useIonRouter } from "@ionic/react"

import DataElement from "./DataElement"
export default function PageViewItem({page}) {
    const ref = useRef()
  
    PageViewItem.propTypes={
        page: PropTypes.object.isRequired
    }
    useLayoutEffect(()=>{
        initGA()
        sendGAEvent("View Story",JSON.stringify(page))
    },[])

    const router = useIonRouter()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    
  
    const [commenting,setCommenting]=useState(false)
    const handleClose=()=>{
        setCommenting(false)
    }
      const commentBox = ()=>{
        if (commenting){
            return(<CommentInput page={page}  handleClose={handleClose}/>)
        }
    }
    const header=()=>{
        return <div ><span className={"flex-row flex justify-between px-1 pt-18  pb-1"}>   <ProfileCircle profile={page.author} color={"emerald-700"}/> 
                  
         <h6 className="text-emerald-700 mx-2  no-underline text-ellipsis  whitespace-nowrap overflow-hidden max-w-[100%] my-auto text-[0.9rem]  " onClick={()=>{
             dispatch(setPageInView({page}))
           router.push  (Paths.page.createRoute(page.id))
     
         }} >{` `+page.title.length>0?page.title:""}</h6>
        
    
         </span>   {page.description && page.description.length>0?<div className='min-h-24 pt-4 p-2'>
            {page.needsFeedback||page.description.length>0?<label className='text-emerald-800'>Feedback Request:</label>:null}
            <h6 className='p-2 open-sans-medium text-left lg:w-[36em]   text-emerald-800'>
                {page.description}
            </h6>
        </div>:null}   </div>
     }
if(page){
    

        return(
  
        <div className="">
        
                {header()}
              
       <div className="py-1 ">
                <DataElement page={page} isGrid={false}/>
            </div>
            
            <PageViewButtonRow page={page} profile={currentProfile} setCommenting={truthy=>setCommenting(truthy)}/>
            
                {commentBox()}   
   </div>
     
  
        )
            }else{
                <div className="skeleton" ref={ref}>
                 
                </div>
            } 
}