import { useDispatch,useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import React,{useState} from "react"
import { updateLibraryContent } from "../../actions/LibraryActions"
import {Button } from "@mui/material"
import { PageType } from "../../core/constants"
import { setProfileInView } from "../../actions/UserActions"
import ReactGA from 'react-ga4'
import {IconButton} from "@mui/joy"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import {setPagesToBeAdded, setEditingPage, setPageInView} from "../../actions/PageActions"
import CommentInput from "../CommentInput"
import checkResult from "../../core/checkResult"
import Paths from "../../core/paths"
import "../../styles/PageView.css"
import LinkPreview from "../LinkPreview"
import PropTypes from 'prop-types'
import PageSkeleton from "../PageSkeleton"

export default function PageViewItem({page}) {
    PageViewItem.propTypes={
        page: PropTypes.object.isRequired
    }
    const [pending,isPending]=useState(true)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [bookmarked,setBookmarked]= useState(false)
    const profilesInView = useSelector(state=>state.users.profilesInView)
    const [commenting,setCommenting]=useState(false)
    const bookmarkLibrary = useSelector(state=>state.libraries.bookmarkLibrary)
    const commentBox = (show)=>{
        if (show){
            return(<CommentInput page={page} />)
        }
    }
    let pageDataElement = (<div ></div>)
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
if(page){
    switch(page.type){
    case PageType.text:
        pageDataElement = <div className='w-max  pt-4 px-4' dangerouslySetInnerHTML={{__html:page.data}}></div>
    break;
    case PageType.picture:
        pageDataElement = <img className="dashboard-content image" src={page.data} alt={page.title}/>
    break;
    case PageType.link:
        pageDataElement = <div className="" ><LinkPreview url={page.data}/></div>
        break;
    default:
        pageDataElement = <div className='dashboard-content' dangerouslySetInnerHTML={{__html:page.data}}/>
    
}
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
        return(
        
        <div className="">
            <div className=' border-b rounded-t-lg text-left pl-4 pt-4 pb-2 bg-green-600 text-white'>
                <div className="titles ">
                {page.title.length>0?<p>{page.title}</p>:<p>Untitled</p>}
                </div>
                {profile}
            </div>
            <div className="bg-green-600 ">
                {pageDataElement}
                </div>
            <div className='bg-green-600  border-t'>
                <button 
                className="bg-green-600 "
                   disabled={!currentProfile} 
                >
                    Yea
                </button>
                <button
                className="bg-green-600 px-4 mx-4 rounded-none border-white border-l-1 border-r-1 border-t-0 border-b-0 "
                   disabled={!currentProfile} 
                    onClick={()=>{setCommenting(!commenting)}}>
                
                    Discuss
                </button>
                <div className="dropdown  dropdown-top">
        <div tabIndex={0} role="button" className="btn pt-2 mt-1 text-white "> Share</div>
        <ul tabIndex={0} className="dropdown-content bg-white text-green-600 menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        <li>
            <a disabled={!currentProfile} 
  className=' text-green-600 '
  
  onClick={()=>{}}> 
                            Add to Book
            </a></li>
            <li><a disabled={!currentProfile} 
            onClick={()=>{
                 const params = {pageList:[page]}
                 dispatch(setPagesToBeAdded(params))
                 navigate("/library/new")
            }}
            className=' text-green-600 '
            >
                Add to Library
                        </a></li>
             {currentProfile && currentProfile.id == page.authorId? <li> <a
                        className=' text-green-600 '
                       onClick={()=> {
                        dispatch(setPageInView({page}))
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
            </div>
            
            
                {commentBox(commenting)}   
        </div>
        )
            }else{
                <div>
                    <PageSkeleton/>
                </div>
            }
}
