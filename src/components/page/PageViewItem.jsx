import { useDispatch,useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import React,{useEffect, useState} from "react"
import { updateLibraryContent } from "../../actions/LibraryActions"
import isValidUrl from "../../core/isValidUrl"
import { PageType } from "../../core/constants"
import { setProfileInView } from "../../actions/UserActions"
import ReactGA from 'react-ga4'
import {IconButton} from "@mui/joy"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { setPageInView} from "../../actions/PageActions"
import CommentInput from "../comment/CommentInput"
import checkResult from "../../core/checkResult"
import Paths from "../../core/paths"
import "../../styles/PageView.css"
import LinkPreview from "../LinkPreview"
import PropTypes from 'prop-types'
import PageSkeleton from "../PageSkeleton"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"


export default function PageViewItem({page}) {
    PageViewItem.propTypes={
        page: PropTypes.object.isRequired
    }
    const [image,setImage]=useState(null)
    const [pending,isPending]=useState(true)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [bookmarked,setBookmarked]= useState(false)
    const profilesInView = useSelector(state=>state.users.profilesInView)
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
  const onBookmarkPage = ()=>{
    if(bookmarked && page){
    let pageIdList = bookmarkLibrary.pageIdList.filter(id=>id!=page.id)
    const params = {
        library:bookmarkLibrary,
        pageIdList:pageIdList,
        bookIdList: bookmarkLibrary.bookIdList
          }
          dispatch(updateLibraryContent(params))
          setBookmarked(false)
    }else{
        if(bookmarkLibrary && currentProfile && page){
            const pageIdList = [...bookmarkLibrary.pageIdList,page.id]
            const params = {
                library:bookmarkLibrary,
                pageIdList:pageIdList,
                bookIdList: bookmarkLibrary.bookIdList
                  }
            dispatch(updateLibraryContent(params)).then(result=>{
                checkResult(result,(payload)=>{
                const {library} = payload
                     let found =library.pageIdList.find(id=>id==page.id)
                    setBookmarked(Boolean(found))
                    },()=>{

                })
            })
        }
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
useEffect(()=>{
    if(page.type==PageType.picture){
        
        if(!isValidUrl(page.data)){
            getDownloadPicture(page.data).then(url=>setImage(url))
        }else{
            setImage(page.data)
        }
    }
},[page])
const navigateToProfile = ()=>{ 
    ReactGA.event({
        category: "Profile",
        action: "Navigate to from Page View to Profile",
        label: prof.username, 
        value: prof.id,
        nonInteraction: false
      });   
    const params = { profile: prof}
setProfileInView(params)
navigate(`/profile/${prof.id}`)
}
const copyShareLink=()=>{
    ReactGA.event({
        category: "Page View",
        action: "Copy Share Link",
        label: page.title, 
        value: page.id,
        nonInteraction: false
      });
    navigator.clipboard.writeText(`https://plumbum.app/page/${page.id}`)
                            .then(() => {
                                // Successfully copied to clipboard
                                alert('Text copied to clipboard');
                              })
}
let profile = (<div></div>)
        let prof= profilesInView.find(profile=>profile.id == page.profileId)
        if(prof){
            profile=(
            <div>
                <p className="text-white" onClick={navigateToProfile}>{prof.username}</p>
            </div>)
        }
    function ButtonRow({page,profile,}){
        return(<div className='bg-emerald-600 text-white'>
        <button 
        className="bg-emerald-600 text-white mx-auto text-xl border-none"
           disabled={!profile} 
        >
            Yea
        </button>
        <button
        className="bg-emerald-600  px-4 mx-4  text-white text-xl rounded-none border-white border-l-1 border-r-1 border-t-0 border-b-0 "
           disabled={!profile} 
            onClick={()=>{setCommenting(!commenting)}}>
        
            Discuss
        </button>
        <div className="dropdown  dropdown-top">
<div tabIndex={0} role="button" className=" border-none  bg-emerald-600 mx-auto  text-white text-bold "> <h6 className="text-[1.3rem]">Share</h6></div>
<ul tabIndex={0} className="dropdown-content bg-white text-green-600 menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
<li>
    <a disabled={!profile} 
className=' text-green-600 '

onClick={()=>{
    navigate(Paths.addStoryToCollection.createRoute(page.id))

}}> 
                    Add to Collection
 
   </a></li>
     {currentProfile && currentProfile.id == page.authorId? <li> <a
                className=' text-green-600 '
               onClick={()=> {
                
                navigate(Paths.editPage.createRoute(page.id))
               }}
            >
                 Edit
                </a></li>:null}           
               <li> <a
                className=' text-green-600 '
               onClick={()=>copyShareLink()}
            >
                  Copy Share Link
                </a></li>
               <li> {(currentProfile && currentProfile.id == page.profileId )?
    <a onClick={()=>{
        dispatch(setPageInView({page}))
        navigate(Paths.editPage.createRoute(page.id))}}>Edit</a>:<div></div>}
    </li>
   <li> <IconButton onClick={onBookmarkPage}
   className=" text-green-600 "
   disabled={!currentProfile}> 
    {bookmarked?<BookmarkIcon/>:<BookmarkBorderIcon/>}
    </IconButton></li>
    </ul>
</div>
    </div>)
    }
        return(
        
        <div className="text-slate-800 ">
      
            <div className="relative bg-white ">
            <div className=' absolute '>
                <div className=" text-white px-4  py-2 rounded-tl-lg text-md bg-gradient-to-br from-emerald-900 to-opacity-40 ">
                {page.title.length>0?<h6>{page.title}</h6>:<h6>Untitled</h6>}
                </div>
                {profile}
            </div>
                {pageDataElement}
                </div>
            
            <ButtonRow page={page} profile={currentProfile}/>
            
                {commentBox()}   
        </div>
        )
            }else{
                <div>
                    <PageSkeleton/>
                </div>
            }
}
