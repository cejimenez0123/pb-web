import React, { useEffect, useState } from 'react'
import "../../Dashboard.css"
import { deletePageApproval, setPageInView, setPagesToBeAdded } from '../../actions/PageActions'
import { createPageApproval } from '../../actions/PageActions'
import { PageType } from '../../core/constants'
import {useDispatch, useSelector} from 'react-redux'
import { IconButton} from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import theme from '../../theme'
import { updateLibraryContent } from '../../actions/LibraryActions'
import checkResult from '../../core/checkResult'
import Paths from '../../core/paths'
import LinkPreview from '../LinkPreview'
import ReactGA from 'react-ga4'
import {useMediaQuery} from 'react-responsive'
import MediaQuery from 'react-responsive'
import bookmarkadd from "../../images/bookmarkadd.svg"
function DashboardItem({page,book,isGrid}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isNotPhone = useMediaQuery({
        query: '(min-width: 500px)'
      })
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
     setAnchorEl(prevState=>{
        if(prevState==null){
            return e.currentTarget
        }else{
            return null
        }
     })
      };
      useEffect(()=>{


      },[page])
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

        return( <div className='page-text'>
            <div 
    
           className={` ${isGrid?"h-48 overflow-clip":""}`}
            >
            <div ref={
            (el)=>setContentItemEl(el)
        } className=' content text-white bg-transparent p-4 '
        dangerouslySetInnerHTML={{__html:page.data}}></div>
        </div>
        </div>)   
    }else if(page.type===PageType.picture){
        return(<img className='dashboard-content image' src={page.data} alt={page.title}/>)
    }else if(page.type === PageType.link){
        return(<div 
            className={`bg-white ${isGrid?"h-48 overflow-clip":""}`}>
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
        profileDiv = (<p className="text-white" onClick={()=>{
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
    const ClickAddStoryToCollection=()=>{
        navigate(Paths.addStoryToCollection.createRoute(page.id))
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
    // const addToLibrary=()=>{
    //     ReactGA.event({
    //         category: "Story",
    //         action: "Add Story To Library",
    //         label: "Add to Library", 
    //         value: page.id,
    //         nonInteraction: false
    //       });
    //     const params = {pageList:[page]}
    //     dispatch(setPagesToBeAdded(params))
    //     navigate("/library/new")
    // }
    const buttonRow = ( )=>{
        return isGrid?<div className='border-t text-right border-green-100 '>
        <button className='bg-transparent  '><img src={bookmarkadd}/></button>
    
    </div>:
        <div className='border-t  text-center border-green-100 '><div>
         <button disabled={!currentProfile} 
         onClick={handleApprovalClick}
            
          className={`rounded-none w-fit 
           border-x-1 border-y-0 px-4 bg-transparent border-white  text-white `}
        
         >
             Yea
         </button>
         <button
             className=' px-4 rounded-none
             border-x-2 border-y-0  bg-transparent border-white text-white'
             onClick={()=>hanldeClickComment(page)}
                 >
         
             Comments
         </button>
         <div className="dropdown dropdown-top">
<button tabIndex={0} role="button" 
className="             
         pt-2 
         rounded-none
         px-4 
         border-x-2 border-y-0
         btn-primary
         bg-transparent border-white
         border-b-none
         text-white ">
Share</button>
<ul tabIndex={0} className="dropdown-content menu bg-dark rounded-box z-[1] w-52 p-2 shadow">
<li><a disabled={!currentProfile} 
className='text-white'

onClick={()=>ClickAddStoryToCollection()}> 
                     Add to Collection
     </a></li>
     {/* <li><a disabled={!currentProfile} 
     onClick={()=>{
          const params = {pageList:[page]}
          dispatch(setPagesToBeAdded(params))
          navigate("/library/new")
     }}
     className='text-white'
     >
         Add to Library
                 </a></li> */}
                <li> <a
                 className='text-white'
                onClick={()=>{
                     navigator.clipboard.writeText(`https://plumbum.app/page/${page.id}`)
                     .then(() => {
                         // Successfully copied to clipboard
                         alert('Text copied to clipboard');
                       })
                 }}
             >
                   Copy Share Link
                 </a></li>
                <li> {(currentProfile && currentProfile.id == page.profileId )?
     <a onClick={()=>navigate(Paths.editPage.createRoute(page.id))}>Edit</a>:<div></div>}
     </li>
    <li> <IconButton onClick={onBookmarkPage}
    disabled={!currentProfile}> 
     {bookmarked?<BookmarkIcon/>:<BookmarkBorderIcon/>}
     </IconButton></li>
</ul>
</div>
</div>
</div>

                
    }
    const addToBook=()=>{
        ReactGA.event({
            category: "Story",
            action: "Add Story To Book",
            label: "Add to book", 
            value: page.id,
            nonInteraction: false
          });
        const params = {pageList:[page]}
        dispatch(setPagesToBeAdded(params))
        navigate("/book/new")
    }
    if(page){
    
        return(
        <div className={`rounded-lg bg-green-600 mb-4 overflow-hidden`}>
        
            <div className=' border-white border border-b border-2   pl-2 text-white   pb-2 pt-4'>
                <div className=' flex flex-row ml-4'>
                {bookTitleDiv}
                <p className="text-white" onClick={()=>{
                    navigate(`/page/${page.id}`)

                }} > {` `+page.title}</p>
                </div>
                {profileDiv}
            </div>
                {pageDataElement()}
                {buttonRow()}
  </div>
     )}else{
        return(<div>
            Loading...
        </div>)
     }

}

export default DashboardItem