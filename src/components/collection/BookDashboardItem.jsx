import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import "../../Dashboard.css"
import { deletePageApproval } from '../../actions/PageActions'
import { createPageApproval } from '../../actions/PageActions'
import {useDispatch, useSelector} from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@mui/material'
import addCircle from "../../images/icons/add_circle.svg"
import bookmarkFillGreen from "../../images/bookmark_fill_green.svg"
import bookmarkfill from "../../images/bookmarkfill.svg"
import checkResult from '../../core/checkResult'
import Paths from '../../core/paths'
import loadingGif from "../../images/loading.gif"
import bookmarkoutline from "../../images/bookmarkadd.svg"
import bookmarkadd from "../../images/bookmark_add.svg"
import PageDataElement from '../page/PageDataElement'
import ProfileCircle from '../profile/ProfileCircle'
import { addStoryListToCollection, deleteStoryFromCollection } from '../../actions/CollectionActions'
import Context from '../../context'
import { debounce } from 'lodash'
import { useMediaQuery } from 'react-responsive'
function BookDashboardItem({book,isGrid}) {
      const isPhone =  useMediaQuery({
    query: '(max-width: 768px)'
  })
    const dispatch = useDispatch()
    const [loading,setLoading]=useState(false)
    const pathParams = useParams()
    const location = useLocation()
    const {setSuccess,setError,currentProfile}=useContext(Context)
    const navigate = useNavigate()
    const [canUserEdit,setCanUserEdit]=useState(false)
   

    const [expanded,setExpanded]=useState(false)

   const [likeFound,setLikeFound]=useState(null)
    const [overflowActive,setOverflowActive] =useState(null)
    const [bookmarked,setBookmarked]=useState()

    const soCanUserEdit=()=>{}

    useEffect(()=>{
        
    },[currentProfile,book])
const deleteStc=()=>{

        if(bookmarked){
            setLoading(true)
   dispatch( deleteStoryFromCollection({stId:bookmarked.id})).then((res)=>{
   checkResult(res,payload=>{
    setBookmarked(null)
    setLoading(false)
   },err=>{
    setError(err.message)
   }
)
   })
}}

  

const header=()=>{

   return isGrid?null:<span className={"flex-row flex justify-between w-[96vw]  md:w-page px-1   pt-2 pb-1"}>  
<ProfileCircle isGrid={isGrid} profile={book.profile}/>


             
    <h6 className={`${isGrid?"text-white":"text-emerald-800"}
     ml-1 pr-2 
      no-underline text-ellipsis  whitespace-nowrap overflow-hidden max-w-[100%] my-auto text-[0.9rem]`}
    onClick={()=>{
        navigate(Paths.collection.createRoute(book.id))
    }} >{` `+book.title.length>0?book.title:""}</h6></span>
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

    useLayoutEffect(()=>{
        soCanUserEdit()
    },[book])
    let title = ""
 
    if(book){
        
        
        if(book.title.length>30){
        title = book.title.slice(0,30)+"..."
        }else{
            title = book.title
        }
   
    }
    const bookmarkBtn =()=>{
        return isGrid ?<div className='w-[100%]  md:py-2 my-auto flex flex-row justify-between text-white '>
          {!isPhone?  <ProfileCircle isGrid={isGrid} profile={book.profile}/>:null}
        {/* <span className='bg-transparent flex flex-row '> */}
            <h6 
            onClick={()=>{
                navigate(Paths.collection.createRoute(book.id))
            }}
            className={`${isPhone?"flex justify-between w-[100%]":" ml-1 pr-1 "}  text-white w-full  no-underline text-ellipsis  whitespace-nowrap overflow-hidden max-w-[100%] my-auto text-[0.9rem]`}
>{` `+book.title.length>0?book.title:""}</h6><img onClick={handleBookmark}className='text-white' src={bookmarked?bookmarkfill:bookmarkoutline}/>
{/* </span> */}
    
    </div>:null
    }
    const handleBookmark =debounce((e)=>{
        e.preventDefault()
        if(bookmarked){
                deleteStc()
        }else{
           
        }
          },10)


const Carousel = ({book})=>{

    if(book){
      
        return(
            
          
        <div className={`carousel  rounded-box pt-2 overflow-x-auto pr-6

         ${isPhone?"":""} ${isGrid?isPhone?`w-grid-mobile p-1 bg-emerald-700 `:`bg-emerald-700`:  ` max-w-[94.5vw]   md:w-page`}`}>
     
       {book.storyIdList.map((stc,i)=>{
        if(stc && stc.story){

      
        return(
            // carousel-item
        <div  className={`  carousel-item  flex flex-col ${isPhone?"h-[17em] rounded-lg overflow-hidden":""}  ${isGrid?isPhone?"w-grid-mobile-content max-h-full px-2    ":"":" max-w-[95vw]   md:w-[49.5em] "}`}
         id={stc.id} key={stc.id}

>
<h5  id="desc"className={ `${isPhone?"top-0 h-12 ml-2  ":" bottom-0 "} ${isGrid?isPhone?" text-white   ":"text-white":"text-emerald-800"} mont-medium   text-left`}><span className='px-2'>{stc.story.title}</span></h5>
    {stc.story.description && stc.story.description.length>0?<div className=' p-1 2 md:pt-4 p-2'>
            {stc.story.needsFeedback?<label className='text-emerald-800'>Feedback Request:</label>:null}
            <h6 className={`${isGrid?isPhone?"max-h-8 m-1 p-1 overflow-scroll text-white":"text-white":"text-emerald-800"} p-2 open-sans-medium text-left `}>
                {stc.story.description}
            </h6>
        </div>:null}
        <span onClick={()=>navigate(Paths.page.createRoute(stc.storyId))}className={`max-h-[40em] ${isPhone?isGrid?'w-grid-mobile-content  overflow-hidden':" h-[20em]":""}`}>
       <PageDataElement isGrid={isGrid} page={stc.story} /> 
       </span>
        </div>)}else{
            return null
        }})}

    
       <span className='flex flex-row justify-center'>


      </span>
      </div>)
    }else{
        return(<div className='skeleton rounded-box'/>)
    }
}

    if(book){
    
        return(
        // <ErrorBoundary>
        <div className={` ${isGrid?isPhone?"overflow-y-hidden  m-1 ":'':``} ${isPhone?" overall-hidden":""} rounded-lg    flex justify-between flex-col   pt-1`}>
                 <div className={isGrid?isPhone?" shadow-md ":"shadow-md bg-emerald-700  ":'relative w-[96vw]  overflow-clip shadow-md md:w-page  shrink my-2 '}>
           
        <div className={`shadow-sm ${isGrid?"overflow-hidden bg-emerald-700  text-white ":"bg-emerald-100 rounded-t-lg md:w-page w-[96vw]"}   `}>
               {!isGrid&&book?header():null}
        {book.description && book.description.length>0?<div className='min-h-12 pt-4 p-2'>
            {/* {book.needsFeedback?<label className='text-emerald-800'>Feedback Request:</label>:null} */}
            <h6 className={`${isGrid?"text-white":"text-emerald-800"} p-2 open-sans-medium text-left `}>
                {book.description}
            </h6>
        </div>:null}
       
{/*              
          
      */}
            <Carousel book={book}/>
        
        
                {isGrid? <div className='flex flex-row pt-2 justify-between px-3 py-1  rounded-b-lg bottom-0'>
                {header()}
            
                {bookmarkBtn()} </div>   :null}
                </div>
                <div>
            
        
                      
                </div>
  </div>
  </div>
//  </ErrorBoundary>
     )}else{
        return null
     }

}


export default BookDashboardItem
