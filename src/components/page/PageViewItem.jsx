import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import React,{useEffect, useLayoutEffect,useState} from "react"
import PageViewButtonRow  from "./PageViewButtonRow"
import CommentInput from "../comment/CommentInput"
import "../../styles/PageView.css"
import PropTypes from 'prop-types'
import PageSkeleton from "../PageSkeleton"
import Paths from "../../core/paths"
import ProfileCircle from "../profile/ProfileCircle"
import PageDataElement from "./PageDataElement"


export default function PageViewItem({page}) {
    PageViewItem.propTypes={
        page: PropTypes.object.isRequired
    }
 
    
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const navigate = useNavigate()
  
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

        return <div ><span className={"flex-row flex justify-between px-1 rounded-t-lg lex pt-2 pb-1"}>   <ProfileCircle profile={page.author}/> 
                  
         <h6 className="text-emerald-700 mx-2  no-underline text-ellipsis  whitespace-nowrap overflow-hidden max-w-[100%] my-auto text-[0.9rem]  " onClick={()=>{
             dispatch(setPageInView({page}))
             navigate(Paths.page.createRoute(page.id))
     
         }} >{` `+page.title.length>0?page.title:"Untitled"}</h6>
        
    
         </span>   {page.description && page.description.length>0?<div className='min-h-24 pt-4 p-2'>
            {page.needsFeedback?<label className='text-emerald-800'>Feedback Request:</label>:null}
            <h6 className='p-2 open-sans-medium text-left text-emerald-800'>
                {page.description}
            </h6>
        </div>:null}   </div>
     }
if(page){
    

        return(
        
        <div className="page rounded-lg overflow-clip">
      <div>
        <div>
        
                {header()}
              
       
                <PageDataElement page={page} isGrid={false}/>
                </div>
            
            <PageViewButtonRow page={page} profile={currentProfile} setCommenting={truthy=>setCommenting(truthy)}/>
            
                {commentBox()}   
        </div>
        </div>
  
        )
            }else{
                <div>
                    <PageSkeleton/>
                </div>
            } 
}
