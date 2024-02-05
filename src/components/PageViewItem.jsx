import { useDispatch,useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import React,{useState} from "react"
import { updateLibraryContent } from "../actions/LibraryActions"
import {Button } from "@mui/material"
import { PageType } from "../core/constants"
import { setProfileInView } from "../actions/UserActions"
import { Dropdown,Menu ,MenuItem} from '@mui/joy'
import theme from "../theme"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import {setPagesToBeAdded, setEditingPage} from "../actions/PageActions"
import CommentInput from "./CommentInput"
import checkResult from "../core/checkResult"
import Paths from "../core/paths"
import "../styles/PageView.css"
import LinkPreview from "./LinkPreview"
import PropTypes from 'prop-types'
import Lottie from "lottie-react";
import loadingAnimation from "../images/loading-animation.json"
export default function PageViewItem({page}) {
    PageViewItem.propTypes={
        page: PropTypes.object.isRequired
    }
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
let pageDataElement = (<div></div>)
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
        pageDataElement = <div className='dashboard-content text ql-editor' dangerouslySetInnerHTML={{__html:page.data}}></div>
    break;
    case PageType.picture:
        pageDataElement = <img className="dashboard-content image" src={page.data} alt={page.title}/>
    break;
    case PageType.link:
        pageDataElement = <div className="dashboard-content" ><LinkPreview url={page.data}/></div>
        break;
    default:
        pageDataElement = <div className='dashboard-content' dangerouslySetInnerHTML={{__html:page.data}}/>
    break;
}
const navigateToProfile = ()=>{    
    const params = { profile: prof}
setProfileInView(params)
navigate(`/profile/${prof.id}`)
}
let profile = (<div></div>)
        let prof= profilesInView.find(profile=>profile.id == page.profileId)
        if(prof){
            profile=(
            <div>
                <p onClick={navigateToProfile}>{prof.username}</p>
            </div>)
        }
        return(
        <div className='content-item'>
        
            <div className='dashboard-header'>
                <div className="titles">
                {page.title.length>0?<p>{page.title}</p>:<p>Untitled</p>}
                </div>
                {profile}
            </div>
            <div>
                {pageDataElement}
                </div>
            <div className='btn-row'>
                <Button 
                    style={{color:theme.palette.info.contrastText,
                            backgroundColor:currentProfile?theme.palette.info.main:theme.palette.info.disabled}}
                    disabled={!currentProfile} 
                >
                    Yea
                </Button>
                <Button 
                    style={{color:"white",
                    backgroundColor:currentProfile?theme.palette.info.main:theme.palette.info.disabled}} 
                    disabled={!currentProfile} 
                    onClick={()=>{setCommenting(!commenting)}}>
                
                    Comment
                </Button>
                <Dropdown>
                        <Button onClick={(e)=>{
                            handleToggle(e)
                        }}
                        aria-controls={anchorEl ? 'menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={anchorEl ? 'true' : undefined}>
                            Share
                        </Button>
          <Menu 
            id="menu"
            anchorEl={anchorEl}
            onClose={()=>setAnchorEl(null)}
            open={Boolean(anchorEl)}>
          <MenuItem disabled={!currentProfile} onClick={()=>{
            const params = {pageList:[page]}
            dispatch(setPagesToBeAdded(params))
            navigate("/book/new")
            }}> 
                            Add to Book
            </MenuItem>
            <MenuItem disabled={!currentProfile} onClick={()=>{
                 const params = {pageList:[page]}
                 dispatch(setPagesToBeAdded(params))
                 navigate("/library/new")
            }}>
                Add to Library
                        </MenuItem>
                        <MenuItem onClick={()=>{
                            navigator.clipboard.writeText(`plumbum.app/page/${page.id}`)
                            .then(() => {
                                // Successfully copied to clipboard
                                alert('Text copied to clipboard');
                              })
                        }}
                    >
                          Copy Share Link
                        </MenuItem>
                        {currentProfile && page && currentProfile.id===page.profileId?
                        <MenuItem onClick={()=>{
                            dispatch(setEditingPage({page}))
                            navigate(Paths.editPage.createRoute(page.id))
                        }}>
                        Edit</MenuItem>:<div></div>}
                        <MenuItem onClick={onBookmarkPage}disabled={!currentProfile}> 
            {bookmarked?<BookmarkIcon/>:<BookmarkBorderIcon/>}
            </MenuItem>
          </Menu>
        </Dropdown>
            </div>
            
                {commentBox(commenting)}   
        </div>
        )
            }else{
                <div>
                    <Lottie animationData={loadingAnimation}/>
                </div>
            }
}
