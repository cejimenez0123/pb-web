import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import "../../Dashboard.css"
import { deletePageApproval,   setEditingPage,   setPageInView, } from '../../actions/PageActions'
import { createPageApproval } from '../../actions/PageActions'
import {useDispatch, useSelector} from 'react-redux'
import { IconButton} from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import checkResult from '../../core/checkResult'
import Paths from '../../core/paths'
import bookmarkadd from "../../images/bookmarkadd.svg"
import PageDataElement from './PageDataElement'
import ProfileCircle from '../profile/ProfileCircle'
import Context from '../../context'
function DashboardItem({page,forFeedback=false, book,isGrid}) {
    const dispatch = useDispatch()
    const [takingFeedback,setTakingFeedback]=useState(forFeedback)
    const {setSuccess,setError}=useContext(Context)
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const bookmarkLibrary = useSelector(state=>state.libraries.bookmarkLibrary)
    const [expanded,setExpanded]=useState(false)
   const [likeFound,setLikeFound]=useState(null)
   const [loading,setLoading]=useState(false)
    const profile = useSelector(state=>state.users.profilesInView).find(prof=>{
       return prof!=null&& prof.id == page.profileId
    })
    const [overflowActive,setOverflowActive] =useState(null)
    const [bookmarked,setBookmarked]=useState(null)


    useLayoutEffect(()=>{
        if(currentProfile && page){
            let found = currentProfile.likedStories.find(like=>like.storyId==page.id)
            setLikeFound(found)
        }else{
            setLikeFound(null)
        }
            
    },[currentProfile,page]),

useEffect(()=>{

    if(bookmarkLibrary && page){
        let found = bookmarkLibrary.pageIdList.find(id=>id==page.id)
        setBookmarked(Boolean(found))
    }
   
},[page])
const hanldeClickComment=()=>{   
  if(page){ 
    navigate(Paths.page.createRoute(page.id))
}
}   

const header=()=>{

   return <span className={"flex-row flex justify-between px-1 rounded-t-lg lex pt-2 pb-1"}>   <span className='flex justify-start flex-row'><ProfileCircle profile={page.author}/>
   </span>

             
    <h6 className="text-emerald-700 mx-1  no-underline text-ellipsis  whitespace-nowrap overflow-hidden max-w-[100%] my-auto text-[0.9rem]  " onClick={()=>{
        dispatch(setPageInView({page}))
        navigate(Paths.page.createRoute(page.id))

    }} >{` `+page.title.length>0?page.title:"Untitled"}</h6></span>
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
        if(page&&currentProfile ){

        
        const params = {story:page,
            profile:currentProfile,
                        }
        dispatch(createPageApproval(params))
        }else{
            setError("Sign Up so you can show support")
        }
    }
}else{
    setError("Please Sign Up")
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


    const onBookmarkPage = ()=>{

        
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
                navigate(Paths.collection.createRoute(book.id))
            }
        }><p>{title} {">"}</p></a>)
    }
    const bookmarkBtn =()=>{
        return isGrid ?<div className='max-w-[100%]  my-auto  h-fit text-white '>
        <div className='bg-transparent '><img className='text-white' src={bookmarkadd}/></div>
    
    </div>:null
    }
    const buttonRow = ( )=>{
        return isGrid?null:
        <div className='  flex flex-row rounded-b-lg justify-center justify-evenly sm:max-w-[100%]  '>
            
         <div className={`${likeFound?"bg-emerald-400":"bg-emerald-700"} text-center rounded-bl-lg grow flex-1/3`}>
         <div
         
         onClick={handleApprovalClick}
            
          className={`
            py-2   flex mont-medium  mx-auto text-white border-none h-[100%]  border-none  `}
        
         >
            <h6 className=' text-[1.2rem] mont-medium my-auto mx-auto'>Yea{likeFound?"h!":""}</h6> 
         </div>
         </div>
         <div className={" bg-emerald-700 mont-medium  border-white border-x-2 border-y-0  text-center border-white grow flex-1/3"}>
         <div
             className='
             text-white
        text-center mx-auto
       bg-transparent py-2
       border-none mont-medium 
         '
             onClick={()=>hanldeClickComment()}
                 >
          <h6 className='text-[1.2rem]'> Review</h6>
         </div>
         </div>
         <div className="dropdown    text-center   bg-emerald-700  py-2 rounded-br-lg  grow flex-1/3 dropdown-top">
<div tabIndex={0} role="button" 
className="             
      text-white

      text-center mx-auto
      bg-transparent
       
        border-none mont-medium 
     
         ">
<h6 className=' text-[1.2rem]'>Share</h6></div>
<ul tabIndex={0} className="dropdown-content      text-emerald-800  z-50 menu bg-white rounded-box  w-60 p-1 shadow">

    <li 
className=' text-emerald-700'

onClick={()=>ClickAddStoryToCollection()}><a className='text-emerald-800'>
                     Add to a Collection
     </a></li>

                <li> <a
                 className=' text-emerald-700'
                onClick={()=>{
                     navigator.clipboard.writeText("https://plumbum.app/page"+Paths.page.createRoute(page.id))
                     .then(() => {
                         setSuccess('Text copied to clipboard');
                       })
                 }}
             >
                    Share Link
                 </a></li>
                 {(currentProfile && currentProfile.id == page.authorId )
                ? <li className=' text-emerald-700'> 
              
     <a onClick={()=>{
        dispatch(setEditingPage({page}))
        dispatch(setPageInView({page:null}))
        navigate(Paths.editPage.createRoute(page.id))}}
        className='text-emerald-700'>Edit</a>
     </li>:null}
    <li> <button className="my-auto"onClick={onBookmarkPage}
    disabled={!currentProfile}> 
     {bookmarked?<BookmarkIcon/>:<BookmarkBorderIcon/>}
     </button></li>
</ul>
</div>

</div>

                
    }
    if(page){
    
        return(
        
                <div className='relative shrink my-2 h-fit'>
        <div onClick={()=>{
            isGrid?navigate(Paths.page.createRoute(page.id)):null
        }} className={`rounded-lg   ${isGrid?"bg-emerald-700 h-fit min-h-56   ":"bg-emerald-50 max-w-[96vw]"} mx-auto  shadow-sm   `}>
               {!isGrid?header():null}
        {page.description && page.description && takingFeedback?<div className='min-h-24 pt-16 p-2'>
            <label className='text-emerald-800'>Feedback Request:</label>
            <h6 className='p-2 open-sans-medium text-left text-emerald-800'>
                {page.description}
            </h6>
        </div>:null}
       
             
          <div className={isGrid?' rounded-lg flex justify-between flex-col h-[100%]  pt-1':""}>
         
          <PageDataElement page={page}/>
                {buttonRow()}
                {isGrid? <div className='flex flex-row pt-2 justify-between px-3 py-1 w-52 rounded-b-lg bottom-0'>
                {header()}
            
                {bookmarkBtn()} </div>   :null}
                </div>
                <div>
            
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