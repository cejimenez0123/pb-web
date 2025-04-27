import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import "../../Dashboard.css"
import { deletePageApproval } from '../../actions/PageActions'
import { createPageApproval } from '../../actions/PageActions'
import {useDispatch} from 'react-redux'
import { Button } from '@mui/material'
import bookmarkfill from "../../images/bookmarkfill.svg"
import checkResult from '../../core/checkResult'
import Paths from '../../core/paths'
import bookmarkoutline from "../../images/bookmarkadd.svg"
import ProfileCircle from '../profile/ProfileCircle'
import {  deleteStoryFromCollection } from '../../actions/CollectionActions'
import Context from '../../context'
import { debounce } from 'lodash'
import { useMediaQuery } from 'react-responsive'
import Carousel from './Carousel'
import ErrorBoundary from '../../ErrorBoundary'
import { useNavigate } from 'react-router-dom'
function BookDashboardItem({book,isGrid}) {
      const isPhone =  useMediaQuery({
    query: '(max-width: 768px)'
  })
    const dispatch = useDispatch()
    const {setSuccess,setError,currentProfile}=useContext(Context)
    const navigate = useNavigate()
    const [canUserEdit,setCanUserEdit]=useState(false)
    const [expanded,setExpanded]=useState(false)

   const [likeFound,setLikeFound]=useState(null)
    const [overflowActive,setOverflowActive] =useState(null)
    const [bookmarked,setBookmarked]=useState()
    const isHorizPhone =  useMediaQuery({
        query: '(min-width: 768px)'
      })
    const soCanUserEdit=()=>{}

   
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
        return(
  
        <span id="bookmark-btn-item"  className={`flex pt-2 pb-1 pl-2 pr-2  justify-between bg-emerald-600 h-[100%] flex-row ${isGrid?isPhone?`w-grid-mobile`:`w-grid`:isHorizPhone?`w-page`:`w-page-mobile`}`}>
       {isPhone&&isGrid?null:
       <ProfileCircle isGrid={isGrid&&isPhone} profile={book.profile}/>}
  
  <span className='flex flex-row text-right text-white'>       <h6 
            className='my-auto text-ellipsis   
            whitespace-nowrap no-underline'
            onClick={()=>{
                navigate(Paths.collection.createRoute(book.id))
            }}
            
>{` `+book.title.length>0?book.title:""}</h6>
<img onClick={handleBookmark}className='text-white' src={bookmarked?bookmarkfill:bookmarkoutline}/></span>
</span>   

)
    }
    const handleBookmark =debounce((e)=>{
        e.preventDefault()
        if(bookmarked){
                deleteStc()
        }else{
           
        }
          },10)
          const description = (book)=>{return !isPhone&&!isGrid?book.description && book.description.length>0?
            <div id="book-description" className={`min-h-12 pt-4 p-2`}>
                <h6 className={`${isGrid?isPhone?" w-grid-mobile-content text-white":`${isHorizPhone?"w-grid-content":"w-grid-mobile-content"}`:isHorizPhone?"":""} p-2 open-sans-medium text-left `}>
                    {book.description}
                </h6>
            </div>:null:null}

    if(book){
    
        return(
        <ErrorBoundary>
        <div id="book-dashboard-item" className={`shadow-md  bg-emerald-200 rounded-lg   overflow-hidden ${isGrid?isPhone?"  w-grid-mobile ":'mx-auto max-h-[20rem] w-grid':isHorizPhone?"w-page mt-4":` w-page-mobile mt-2`}   flex justify-between flex-col   pt-1`}>
                 <div className={isGrid?isPhone?" ":"bg-emerald-700  rounded-lg overflow-hidden":'relative w-[96vw]  overflow-clip  md:w-page   '}>
           


        {isGrid?isPhone?null:description(book):null}
       

            <Carousel book={book} isGrid={isGrid}/>
     
           
            
                {bookmarkBtn()} </div>   
        
       
  </div>
 </ErrorBoundary>
     )}else{
        return null
     }

}


export default BookDashboardItem