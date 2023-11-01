import React, { useEffect, useState } from 'react'
import "../Dashboard.css"
import { setPageInView, setPagesToBeAdded } from '../actions/PageActions'
import { PageType } from '../core/constants'
import {useDispatch, useSelector} from 'react-redux'
import { Dropdown,Menu ,MenuItem} from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import theme from '../theme'
import { updateLibraryContent } from '../actions/LibraryActions'
import checkResult from '../core/checkResult'
// import {useBottomScrollListener} from "react-bottom-scroll-listener"
  let size= {width: window.innerWidth,height: window.innerHeight}

function DashboardItem({page,book}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const bookmarkLibrary = useSelector(state=>state.libraries.bookmarkLibrary)
    const profile = useSelector(state=>state.users.profilesInView).find(prof=>{
       return prof.id == page.profileId
    })
    const [bookmarked,setBookmarked]=useState(null)
    const [anchorEl,setAnchorEl]= useState(null)
    const anchorRef = React.useRef(null);
    const handleToggle = (e) => {
     setAnchorEl(prevState=>{
        if(prevState==null){
            return e.currentTarget
        }else{
            return null
        }
     })
      };
useEffect(()=>{

    if(bookmarkLibrary){
        let found = bookmarkLibrary.pageIdList.find(id=>id==page.id)
        setBookmarked(Boolean(found))
    }
   
},[page])

const hanldeClickComment=(pageItem)=>{
    
   
    const params = {
        page: pageItem
    }
    dispatch(setPageInView(params))
    navigate(`/page/${pageItem.id}`)
}   
const contentStyle={
    backgroundColor:"white"
}
const pageDataElement=()=>{
    if(page){
    if(page.type==PageType.text){
        return( <div  className='text' dangerouslySetInnerHTML={{__html:page.data}}></div>)   }else if(page.type==PageType.picture){
    }
    if(page.type==PageType.picture){
        return(<img className='image' src={page.data} alt={page.title}/>)
    }else if(page.type==PageType.video){
        return(<iframe src={page.data}/>)
    }else{
        return(<div className='empty'>
        Loading...
</div>)
    }}else{
        return(<div className='empty'>
                Loading...
        </div>)
    }
}

    let profileDiv = (<div>

    </div>)
    if(profile){
        profileDiv = (<p onClick={()=>{
            navigate(`/profile/${profile.id}`)
        }}>
            {profile.username}
        </p>)

    }
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
    let bookTitleDiv =  (<div></div>)
    if(book){
        bookTitleDiv = (<a onClick={
            ()=>{
                navigate(`/book/${book.id}`)
            }
        }><p>{book.title} {">"}</p></a>)
    }
        return(<div className='content-item'>
        
            <div className='dashboard-header'>
                <div className='titles'>
                {bookTitleDiv}
                <p onClick={()=>{
                    navigate(`/page/${page.id}`)
                }}>{page.title}</p>
                </div>
                {profileDiv}
            </div>
           
                {pageDataElement()}
            
            <div className='btn-row'>
                <Button disabled={!currentProfile} 
                     style={{color: theme.palette.info.contrastText,
                        backgroundColor: currentProfile? theme.palette.info.main:theme.palette.info.disabled}}
                  
               
                >
                    Yea
                </Button>
                <Button 
                        style={{color: theme.palette.info.contrastText,
                            backgroundColor: theme.palette.info.main}}
                        onClick={()=>hanldeClickComment(page)}
                        >
                
                    Comments
                </Button>
                
                <Dropdown>
                        <Button onClick={(e)=>{
                            handleToggle(e)
                        }}
                        aria-controls={anchorEl ? 'menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={anchorEl ? 'true' : undefined}
          >
        Share
          </Button>
          <Menu 
              id="menu"
              
          anchorEl={anchorEl}
          onClose={()=>setAnchorEl(null)}
          open={Boolean(anchorEl)}
          unmountOnExit>
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
                 navigate("/book/new")
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
            <MenuItem onClick={onBookmarkPage}disabled={!currentProfile}> 
            {bookmarked?<BookmarkIcon/>:<BookmarkBorderIcon/>}
            </MenuItem>
          </Menu>
        </Dropdown>
            </div>
        </div>)

}

export default DashboardItem