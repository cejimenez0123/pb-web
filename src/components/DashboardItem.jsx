import React, { useEffect, useState } from 'react'
import "../Dashboard.css"
import { deletePageApproval, setPageInView, setPagesToBeAdded } from '../actions/PageActions'
import { createPageApproval } from '../actions/PageActions'
import { PageType } from '../core/constants'
import {useDispatch, useSelector} from 'react-redux'
import { Dropdown,Menu ,MenuItem,} from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import theme from '../theme'
import { updateLibraryContent } from '../actions/LibraryActions'
import checkResult from '../core/checkResult'
import Paths from '../core/paths'
import LinkPreview from './LinkPreview'
import ReactGA from "react-ga4"
  let size= {width: window.innerWidth,height: window.innerHeight}

function DashboardItem({page,book}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userApprovals = useSelector(state=>state.users.userApprovals)
    const [approved,setApproved]=useState(null)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const bookmarkLibrary = useSelector(state=>state.libraries.bookmarkLibrary)
    const [expanded,setExpanded]=useState(false)
    const profile = useSelector(state=>state.users.profilesInView).find(prof=>{
       return prof!=null&& prof.id == page.profileId
    })
    const [contentItemEl,setContentItemEl] = useState(null)
    const [overflowActive,setOverflowActive] =useState(null)
    const [bookmarked,setBookmarked]=useState(null)
    const [anchorEl,setAnchorEl]= useState(null)
    const handleToggle = (e) => {
        ReactGA.event({
            category: 'Share',
            action: 'Clicked Share',
            label: "SHARE",  // Pass the product name
            value: page.id
          });
     setAnchorEl(prevState=>{
        if(prevState==null){
            return e.currentTarget
        }else{
            return null
        }
     })
      };
useEffect(()=>{
    if(userApprovals!=null){
    let ua = userApprovals.find(approval=>approval.pageId === page.id && approval.profileId === currentProfile.id)
    setApproved(ua)
    }
   
},[userApprovals])
useEffect(()=>{
    if(contentItemEl){
        setOverflowActive(contentItemEl.offsetHeight < contentItemEl.scrollHeight)
    }
},[])
useEffect(()=>{

    if(bookmarkLibrary && page){
        let found = bookmarkLibrary.pageIdList.find(id=>id==page.id)
        setBookmarked(Boolean(found))
    }
   
},[page])

const hanldeClickComment=(pageItem)=>{
    
  if(pageItem){ 
   
      ReactGA.event({
        category: "Story",
        action: "View Comments",
        label: "Comments", 
        value: page.id,
        nonInteraction: false 
      });
    const params = {
        page: pageItem
    }
    dispatch(setPageInView(params))
    navigate(`/page/${pageItem.id}`)
}
}   
    const pageDataElement=()=>{
        if(page){
        
    if(page.type===PageType.text){

        return( <div>
            <div ref={
            (el)=>setContentItemEl(el)
        } className='dashboard-content text ql-editor' dangerouslySetInnerHTML={{__html:page.data}}></div>
        </div>)   
    }else if(page.type===PageType.picture){
        return(<img className='dashboard-content image' src={page.data} alt={page.title}/>)
    }else if(page.type === PageType.link){
        return(<div className='dashboard-content'>
            <LinkPreview
        url={page.data}
            />
            </div>)
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
const copyLink = ()=>{
    navigator.clipboard.writeText(window.location.href)
    .then(() => {
        // Successfully copied to clipboard
        alert('Text copied to clipboard');
      })
    ReactGA.event({
        category: "Share",
        action: "Copy URL",
        label: "Copy Share Link", 
        value: page.id,
        nonInteraction: false 
})
}
const handleApprovalClick = ()=>{
    if(Boolean(approved)){
        dispatch(deletePageApproval({userApproval:approved}))
    }else{
        const params = {pageId: page.id,
                        profileId: currentProfile.id,
                        score:2}
        dispatch(createPageApproval(params))
    }
}
const expandedBtn =()=>{
    if(overflowActive && !expanded){
    
    return <Button onClick={()=>setExpanded(true)}>See More</Button>
    }
    else if(expanded){
return <Button onClick={()=>{
    setExpanded(false)
}}>See Less</Button>
        }else if(overflowActive){
            return <Button onClick={()=>setExpanded(true)}>See More</Button>
        }
   else{
    return <div></div>
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
        
        let title = ""
        if(book.title.length>30){
        title = book.title.slice(0,30)+"..."
        }else{
            title = book.title
        }
        bookTitleDiv = (<a onClick={
            ()=>{
                navigate(`/book/${book.id}`)
            }
        }><p>{title} {">"}</p></a>)
    }
    if(page){
        let yeaColor = theme.palette.info.disabled
        if(currentProfile){
            if(Boolean(approved)){
                yeaColor = theme.palette.primary.light
            }else{
                yeaColor = theme.palette.info.main
            }
        }
        return(<div className='content-item'>
        
            <div className='dashboard-header'>
                <div className='titles'>
                {bookTitleDiv}
                <p onClick={()=>{
                    navigate(`/page/${page.id}`)

                }} > {` `+page.title}</p>
                </div>
                {profileDiv}
            </div>
           
                {pageDataElement()}
            
            <div className='btn-row'>
                
                <button className="btn" disabled={!currentProfile} 
                onClick={handleApprovalClick}
                     style={{color: theme.palette.info.contrastText,
                        backgroundColor: yeaColor}}
                  
               
                >
                    Yea
                </button>
                <button 
                 className='btn'
                        style={{color: theme.palette.info.contrastText,
                            backgroundColor: theme.palette.info.main}}
                        onClick={()=>hanldeClickComment(page)}
                        >
                
                    Comments
                </button>
                
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
                 navigate("/library/new")
            }}>
                Add to Library
                        </MenuItem>
                        <MenuItem onClick={()=>{
                           copyLink()
                        }}
                    >
                          Copy Share Link
                        </MenuItem>
                        {(currentProfile && currentProfile.id == page.profileId )?
            <MenuItem onClick={()=>navigate(Paths.editPage.createRoute(page.id))}>Edit</MenuItem>:<div></div>}
                
            <MenuItem onClick={onBookmarkPage}disabled={!currentProfile}> 
            {bookmarked?<BookmarkIcon/>:<BookmarkBorderIcon/>}
            </MenuItem>
           
            
          </Menu>
        </Dropdown>
       {/* {expandedBtn()} */}
        
  </div>
  </div>
     )}else{
        return(<div>
            Loading...
        </div>)
     }

}

export default DashboardItem