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

        return( <div className=' '>
            <div 
    
           className={` ${isGrid?"h-48 overflow-clip ":""}`}
            >
            <div ref={
            (el)=>setContentItemEl(el)
        } className='px-4  pt-12 pb-6 '
        dangerouslySetInnerHTML={{__html:page.data}}></div>
        </div>
        </div>)   
    }else if(page.type===PageType.picture){
        return(<img className='dashboard-content image ' src={page.data} alt={page.title}/>)
    }else if(page.type === PageType.link){
        return(<div 
            className={`bg-white  ${isGrid?"h-48 overflow-clip":""}`}>
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
        profileDiv = (<p className="text-slate-800" onClick={()=>{
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
    const buttonRow = ( )=>{
        return isGrid?<div className='text-right text-white '>
        <button className='bg-transparent  '><img src={bookmarkadd}/></button>
    
    </div>:
        <div className='border-t bg-emerald-700 text-white  text-center border-green-100 '><div>
         <button disabled={!currentProfile} 
         onClick={handleApprovalClick}
            
          className={`rounded-none
           border-x-1 text-xl border-y-0 px-4 bg-transparent   `}
        
         >
             Yea
         </button>
         <button
             className=' px-4 rounded-none
             border-x-2 border-y-0 text-xl bg-emerald-700 border-white '
             onClick={()=>hanldeClickComment(page)}
                 >
         
           Review
         </button>
         <div className="dropdown dropdown-top">
<button tabIndex={0} role="button" 
className="             
      text-white
         rounded-none
         px-4 
         text-xl
         btn-primary
         bg-transparent 
         ">
Share</button>
<ul tabIndex={0} className="dropdown-content menu bg-green-600 rounded-box z-[1] w-52 p-2 shadow">
<li><a disabled={!currentProfile} 
className='text-slate-800'

onClick={()=>ClickAddStoryToCollection()}> 
                     Add to a Collection
     </a></li>
                <li> <a
                 className='text-slate-800'
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
     <a onClick={()=>{
        dispatch(setPageInView({page}))
        navigate(Paths.editPage.createRoute(page.id))}}>Edit</a>:<div></div>}
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
        <div className={`rounded-lg relative bg-emerald-50  shadow-lg w-[95%] md:w-[34em] shadow-sm justify-self-center  overflow-hidden`}>
        
            <div className=' '>
                <div className=' flex flex-row  '>
                {bookTitleDiv}
                <h6 className="text-white-800 px-4 py-1 text-[0.9rem] absolute bg-gradient-to-br from-emerald-900 to-opacity-0  " onClick={()=>{
                    dispatch(setPageInView({page}))
                    navigate(Paths.page.createRoute(page.id))

                }} > {` `+page.title.length>0?page.title:"Untitled"}</h6>
                </div>
                {profileDiv}
            </div>
             <div className='page text-slate-800'> 
                {pageDataElement()}
                </div> 
                {buttonRow()}
  </div>
     )}else{
        return(<div className='min-h-24'>
            Loading...
        </div>)
     }

}

export default DashboardItem