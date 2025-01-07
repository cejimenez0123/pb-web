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


export default function PageViewItem({page}) {
    PageViewItem.propTypes={
        page: PropTypes.object.isRequired
    }
    const [image,setImage]=useState(null)
    
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const navigate = useNavigate()
    const [likeFound,setLikeFound]=useState(null)
    const [profilePic,setProfilePic]=useState(null)
    const [bookmarked,setBookmarked]= useState(false)
    const [commenting,setCommenting]=useState(false)
    const bookmarkLibrary = useSelector(state=>state.libraries.bookmarkLibrary)
    const commentBox = ()=>{
        if (commenting){
            return(<CommentInput page={page} />)
        }
    }

    const [anchorEl,setAnchorEl]= useState(null)

    const handleToggle = (e) => {
    setAnchorEl(prevState=>{
    if(prevState==null){
        return e.currentTarget
    }else{
        return null
    }
 })
  };
  useLayoutEffect(()=>{
    if(currentProfile && page && currentProfile.likedStories){
        let found = currentProfile.likedStories.find(like=>like.storyId==page.id)
        setLikeFound(found)
    }else{
        setLikeFound(null)
    }
        
},[currentProfile])

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
useEffect(()=>{
    if(page.type==PageType.picture){
        
        if(!isValidUrl(page.data)){
            getDownloadPicture(page.data).then(url=>setImage(url))
        }else{
            setImage(page.data)
        }
    }
    if(page.author){
        getDownloadPicture(page.author.profilePic).then(url=>
            setProfilePic(url)
        )
    }
},[page])


    

        return(
        
        <div className="page rounded-lg overflow-clip">
      
            <div className="relative  ">
            <div onClick={()=>{navigate(Paths.profile.createRoute(page.author.id))}} className=' absolute   pr-3 flex flex-row justift-start '>
                <div className=" text-emerald-800 px-3 flex flex-row py-2 rounded-tl-lg text-elipsis text-md rounded-br-lg bg-gradient-to-br from-emerald-300 to-opacity-0 ">
                {profilePic?<div  className="overflow-hidden rounded-full my-auto h-7 w-8  border-2 border-white mr-4"><img className="object-scale-down h-6 h-8  " src={profilePic}/></div>:null}{page.title.length>0?<span className="my-auto">{page.title} </span>:<span className="my-auto">Untitled</span>}
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
