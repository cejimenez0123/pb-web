import React, { useEffect, useLayoutEffect, useState } from 'react'
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
 
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const bookmarkLibrary = useSelector(state=>state.libraries.bookmarkLibrary)
    const [expanded,setExpanded]=useState(false)
   const [likeFound,setLikeFound]=useState(null)
    const profile = useSelector(state=>state.users.profilesInView).find(prof=>{
       return prof!=null&& prof.id == page.profileId
    })
    const [overflowActive,setOverflowActive] =useState(null)
    const [bookmarked,setBookmarked]=useState(null)


    useLayoutEffect(()=>{
        if(currentProfile && page && currentProfile.likedStories){
            let found = currentProfile.likedStories.find(like=>like.storyId==page.id)
            setLikeFound(found)
        }else{
            setLikeFound(null)
        }
            
    },[currentProfile]),

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
    
           className={`  ${isGrid?"max-h-[12em] rounded-lg max-w-48  mx-auto overflow-clip mt-4 ":"rounded-t-lg"}`}
            >
            <div className={` w-[100%] bg-emerald-50 text-emerald-800 px-4 pb-8 overflow-hidden pt-8 text-[0.8rem] ${isGrid?"isGrid mt-1 rounded-lg overflow-hidden":" rounded-t-lg  ql-editor"}`}
        dangerouslySetInnerHTML={{__html:page.data}}></div>
        </div>
      )   }
      case PageType.picture:{
   
        return(<div className={` ${isGrid?"max-h-40 overflow-clip rounded-lg mx-auto pt-2 max-w-48":"w-[100%]"}`} ><img className={isGrid?"rounded-lg":'rounded-t-lg'} src={image} alt={page.title}/></div>)
    }
    case PageType.link:{
        return(<div 
            className={` ${isGrid?"max-h-36 mx-auto mx-auto w-fit px-2":"w-[100%]"}`}>
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
    if(currentProfile){
        if(likeFound ){
         dispatch(deletePageApproval({id:likeFound.id})).then(res=>{
            checkResult(res,payload=>{
                setLikeFound(null)
            },err=>{

            })
        })
    }else{
        if(page ){

        
        const params = {story:page,
            profile:currentProfile,
                        }
        dispatch(createPageApproval(params))
        }
    }
}else{
    window.alert("Please Sign Up")
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
    //     if(bookmarked && page){
    //     let pageIdList = bookmarkLibrary.pageIdList.filter(id=>page && id!=page.id)
    //     const params = {
    //         library:bookmarkLibrary,
    //         pageIdList:pageIdList,
    //         bookIdList: bookmarkLibrary.bookIdList
    //           }
    //           dispatch(updateLibraryContent(params))
    //           setBookmarked(false)
    //     }else{
    //         if(bookmarkLibrary && currentProfile && page){
    //             const pageIdList = [...bookmarkLibrary.pageIdList,page.id]
    //             const params = {
    //                 library:bookmarkLibrary,
    //                 pageIdList:pageIdList,
    //                 bookIdList: bookmarkLibrary.bookIdList
    //                   }
    //             dispatch(updateLibraryContent(params)).then(result=>{
    //                 checkResult(result,(payload)=>{
    //                 const {library} = payload
    //                      let found =library.pageIdList.find(id=>page&&id==page.id)
    //                     setBookmarked(Boolean(found))
    //                     },()=>{

    //                 })
    //             })
    //         }
    //     }
        
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
        <div className='  flex flex-row rounded-b-lg justify-center justify-evenly sm:max-w-[100%]  '>
            
         <div className={`${likeFound?"bg-emerald-400":"bg-emerald-700"} text-center rounded-bl-lg grow flex-1/3`}>
         <button disabled={!currentProfile} 
         onClick={handleApprovalClick}
            
          className={`
          text-xl      text-center mx-auto text-white border-none bg-transparent  border-none  `}
        
         >
             Yea{likeFound?"h!":""}
         </button>
         </div>
         <div className={" bg-emerald-700 border-white border-x-2 border-y-0  text-center border-white grow flex-1/3"}>
         <button
             className='
             text-white
        text-center mx-auto
       bg-transparent
       border-none
       text-xl  '
             onClick={()=>hanldeClickComment(page)}
                 >
         
           Review
         </button>
         </div>
         <div className="dropdown    text-center   bg-emerald-700    rounded-br-lg  grow flex-1/3 dropdown-top">
<button tabIndex={0} role="button" 
className="             
      text-white

      text-center mx-auto
      bg-transparent
        text-xl
        border-none
     
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
             
          <div className=' rounded-lg '>
               <PageDataElement page={page}/>
            
             
                {buttonRow()}
                </div>
                </div>
               
  </div>
     )}else{
        return(<div className='min-h-24'>
            Loading...
        </div>)
     }

}


export default DashboardItem