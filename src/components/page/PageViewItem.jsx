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

if(page){
    

        return(
        
        <div className="page rounded-lg overflow-clip">
      <div>
            <div className="relative  ">
            <div onClick={()=>{navigate(Paths.profile.createRoute(page.author.id))}} className=' absolute   pr-3 flex flex-row justift-start '>
                <div className=" text-emerald-600 px-3 flex flex-row rounded-tl-lg text-elipsis text-md rounded-br-lg bg-transparent to-opacity-0 ">
                {page && page.author?<ProfileCircle profile={page.author}/>:null}{page.title.length>0?<span className="my-auto mx-2 text-ellipsis">{page.title} </span>:<span className="my-auto">Untitled</span>}
                </div>
              
            </div>
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
