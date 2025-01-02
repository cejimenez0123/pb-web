import React, { useEffect, useState } from 'react'
import "../../Dashboard.css"
import { deletePageApproval,  setHtmlContent, setPageInView, } from '../../actions/PageActions'
import { createPageApproval } from '../../actions/PageActions'
import { PageType } from '../../core/constants'
import {useDispatch, useSelector} from 'react-redux'
import { IconButton} from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { updateLibraryContent } from '../../actions/LibraryActions'
import checkResult from '../../core/checkResult'
import Paths from '../../core/paths'
import LinkPreview from '../LinkPreview'
import ReactGA from 'react-ga4'
import isValidUrl from "../../core/isValidUrl"
import {useMediaQuery} from 'react-responsive'
import bookmarkadd from "../../images/bookmarkadd.svg"
import getDownloadPicture from '../../domain/usecases/getDownloadPicture'
import loadingJson from "../../images/loading-animation.json"
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
    if(userApprovals!=null && page &&currentProfile){
    let ua = userApprovals.find(approval=>approval.pageId === page.id && approval.profileId === currentProfile.id)
    setApproved(ua)
    }
   
},[userApprovals])
useEffect(()=>{

    if(bookmarkLibrary && page){
        let found = bookmarkLibrary.pageIdList.find(id=>id==page.id)
        setBookmarked(Boolean(found))
    }
   
},[page])

const hanldeClickComment=(pageItem)=>{
    
  if(pageItem){ 
    dispatch(setHtmlContent({html:pageItem.data}))
    navigate(`/page/${pageItem.id}`)
}
}   
    const PageDataElement=({page})=>{
        const [image,setImage]=useState(loadingJson)
        useEffect(()=>{
            if(page && page.type==PageType.picture){
                if(isValidUrl(page.data)){
                    setImage(image)
                }else{
                    if(page.data&& page.data.length>0){
                        console.log(page.data)
                    getDownloadPicture(page.data).then(url=>setImage(url))
                    }
                }
        
            }
        
        },[page])
        if(page){
        
   switch(page.type){
        case PageType.text:{

        return( 
            <div 
    
           className={`  ${isGrid?"max-h-[13em] rounded-lg overflow-hidden p-2 max-w-48 mx-auto overflow-clip  ":""}`}
            >
            <div className={` ql-editor w-full ${isGrid?"rounded-lg":""}`}
        dangerouslySetInnerHTML={{__html:page.data}}></div>
        </div>
      )   }
      case PageType.picture:{
        console.log(page)
        return(<div className={` ${isGrid?"max-h-40 overflow-clip rounded-lg mx-auto pt-2 max-w-48":"w-[100%]"}`} ><img className='rounded-t-lg' src={image} alt={page.title}/></div>)
    }
    case PageType.link:{
        return(<div 
            className={` ${isGrid?"max-h-48 px-2":"w-[100%]"}`}>
            <LinkPreview
            isGrid={isGrid}
                    url={page.data}
            />
            </div>)
    }
    default:
        return(<div className='empty'>
        Loading...
</div>)
    }
    }
}
const handleApprovalClick = ()=>{
    if(Boolean(approved)){
        dispatch(deletePageApproval({userApproval:approved}))
    }else{
        if(page){

        
        const params = {pageId: page.id,
                        profileId: currentProfile.id,
                        score:2}
        dispatch(createPageApproval(params))
        }
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
        let pageIdList = bookmarkLibrary.pageIdList.filter(id=>page && id!=page.id)
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
                         let found =library.pageIdList.find(id=>page&&id==page.id)
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
        return isGrid?<div className='text-right  h-fit text-white '>
        <button className='bg-transparent absolute right-1 bottom-1'><img src={bookmarkadd}/></button>
    
    </div>:
        <div className=' bg-emerald-700 text-white rounded-b-lg border-none  text-center '><div>
         <button disabled={!currentProfile} 
         onClick={handleApprovalClick}
            
          className={`rounded-none
          text-xl  text-white pr-8 bg-transparent border-none  `}
        
         >
             Yea
         </button>
         <button
             className=' px-4 rounded-none 
             text-white
             border-x-2 border-y-0 text-xl bg-emerald-700 border-white '
             onClick={()=>hanldeClickComment(page)}
                 >
         
           Review
         </button>
         <div className="dropdown  dropdown-top">
<button tabIndex={0} role="button" 
className="             
      text-white
         rounded-none
         pl-8
      
         text-xl
        border-none
         bg-transparent 
         ">
Share</button>
<ul tabIndex={0} className="dropdown-content    z-50 menu bg-white text-emerald-700 rounded-box  w-60 p-1 shadow">
{currentProfile&& page.authorId===currentProfile.id?<li onClick={()=>{

    navigate(Paths.editPage.createRoute(page.id))
}}>
    <a>Edit</a></li>:null}
<li><a disabled={!currentProfile} 
className=' text-emerald-700'

onClick={()=>ClickAddStoryToCollection()}> 
                     Add to a Collection
     </a></li>
                <li> <a
                 className=' text-emerald-700'
                onClick={()=>{
                     navigator.clipboard.writeText(`https://plumbum.app/page/${page.id}`)
                     .then(() => {
                         // Successfully copied to clipboard
                         alert('Text copied to clipboard');
                       })
                 }}
             >
                    Share Link
                 </a></li>
                <li className=' text-emerald-700'> 
                {(currentProfile && currentProfile.id == page.profileId )
                ?
     <a onClick={()=>{
  
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
    if(page){
    
        return(
        <div onClick={()=>{
            isGrid?navigate(Paths.page.createRoute(page.id)):null
        }} className={`rounded-lg relative   ${isGrid?"bg-emerald-700 h-60 max-w-52 ":"bg-emerald-50 max-w-[96vw]"} mx-auto  shadow-sm   `}>
        
        <div className='justify-between flex flex-col'>
              
                <h6 className="text-white  rounded-t-lg py-1 px-3 text-[0.9rem] absolute bg-gradient-to-br from-emerald-900 to-opacity-0  " onClick={()=>{
                    dispatch(setPageInView({page}))
                    navigate(Paths.page.createRoute(page.id))

                }} > {` `+page.title.length>0?page.title:"Untitled"}</h6>
             
          <div className=' rounded-lg'>
               <PageDataElement page={page}/>
               </div>
             
                {buttonRow()}
                </div>
            
               
  </div>
     )}else{
        return(<div className='min-h-24'>
            Loading...
        </div>)
     }

}


export default DashboardItem