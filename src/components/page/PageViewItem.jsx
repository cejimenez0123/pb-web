import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import React,{useEffect, useLayoutEffect,useState} from "react"
import isValidUrl from "../../core/isValidUrl"
import { PageType } from "../../core/constants"
import PageViewButtonRow  from "./PageViewButtonRow"
import CommentInput from "../comment/CommentInput"
import "../../styles/PageView.css"
import LinkPreview from "../LinkPreview"
import PropTypes from 'prop-types'
import PageSkeleton from "../PageSkeleton"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import Paths from "../../core/paths"
import ProfileCircle from "../profile/ProfileCircle"


export default function PageViewItem({page}) {
    PageViewItem.propTypes={
        page: PropTypes.object.isRequired
    }
    const [image,setImage]=useState(null)
    
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const navigate = useNavigate()

    const [commenting,setCommenting]=useState(false)
      const commentBox = ()=>{
        if (commenting){
            return(<CommentInput page={page} />)
        }
    }




 

let pageDataElement = (<div ></div>)
if(page){
    switch(page.type){
    case PageType.text:
        pageDataElement = <div className={ "rounded-t-lg overflow-hidden w-max ql-editor  pt-8 pb-8 px-4"} dangerouslySetInnerHTML={{__html:page.data}}></div>
    break;
    case PageType.picture:
        pageDataElement = <img className="w-[100%] rounded-t-lg min-h-72 " src={image} alt={page.title}/>
    break;
    case PageType.link:
        pageDataElement = <div className=" rounded-t-lg" ><LinkPreview url={page.data}/></div>
        break;
    default:
        pageDataElement = <div className='dashboard-content rounded-lg' dangerouslySetInnerHTML={{__html:page.data}}/>
    
}



    

        return(
        
        <div className="page rounded-lg overflow-clip">
      
            <div className="relative  ">
            <div onClick={()=>{navigate(Paths.profile.createRoute(page.author.id))}} className=' absolute   pr-3 flex flex-row justift-start '>
                <div className=" text-emerald-800 px-3 flex flex-row py-2 rounded-tl-lg text-elipsis text-md rounded-br-lg bg-gradient-to-br from-emerald-300 to-opacity-0 ">
                {page && page.author?<ProfileCircle profile={page.author}/>:null}{page.title.length>0?<span className="my-auto text-ellipsis">{page.title} </span>:<span className="my-auto">Untitled</span>}
                </div>
               
            </div>
                {pageDataElement}
                </div>
            
            <PageViewButtonRow page={page} profile={currentProfile} setCommenting={truthy=>setCommenting(truthy)}/>
            
                {commentBox()}   
        </div>
        )
            }else{
                <div>
                    <PageSkeleton/>
                </div>
            }
}
