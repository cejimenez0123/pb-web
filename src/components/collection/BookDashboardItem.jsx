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
import adjustScreenSize from '../../core/adjustScreenSize'
function BookDashboardItem({book,isGrid}) {
    const isPhone =  useMediaQuery({
        query: '(max-width: 768px)'
      })
      const isHorizPhone =  useMediaQuery({
        query: '(min-width: 768px)'
      })
    const dispatch = useDispatch()
    const {setSuccess,setError,currentProfile}=useContext(Context)
    const navigate = useNavigate()

    const [expanded,setExpanded]=useState(false)

   const [likeFound,setLikeFound]=useState(null)
    const [overflowActive,setOverflowActive] =useState(null)
    const [bookmarked,setBookmarked]=useState()
    const contentSize = adjustScreenSize(isGrid,false,""," bg-emerald-700 px-1  ","","","  ")
    let size = adjustScreenSize(isGrid,false," grid-item rounded-lg "," overflow-hidden rounded-lg ","","","h-fit")
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
        let title =  book.title.length > 23 ? book.title.slice(0, 20) + '...' : book.title
        return(
       
       <div id="bookmark-btn-item"   className={`flex flex-row justify-between rounded-b-lg bg-emerald-700 pt-2 px-2 mx-auto pb-1  ${isGrid?isPhone?" w-grid-mobile px-4 ":" w-grid px-4":isPhone?" w-page-mobile px-2 ":isHorizPhone?" w-page-content ":"w-page-mobile-content px-4"} `}>{isPhone&&isGrid?null:
       <ProfileCircle isGrid={isGrid} color={"white"}
       profile={book.profile}/>}
  
  <span className={`${isGrid?isPhone?"w-grid-mobile justify-between":" px-2 ":isPhone?"":""} flex flex-row text-right text-white`}>       <h6 
            className='my-auto text-ellipsis   
            whitespace-nowrap no-underline text-[0.7rem]'
            onClick={()=>{
                navigate(Paths.collection.createRoute(book.id))
            }}
            
>{` `+title}</h6>
<img onClick={handleBookmark}className='text-white' src={bookmarked?bookmarkfill:bookmarkoutline}/></span>
</div>
  

)
    }
   
    const handleBookmark =debounce((e)=>{
        if(currentProfile){
        e.preventDefault()
        if(bookmarked){
                deleteStc()
        }else{
           
        }}else{
            setError("Pleas Login")
        }
          },10)
    const description = (book)=>{return !isPhone&&!isGrid?book.description && book.description.length>0?
            <div id="book-description" className={`bg-emerald-700 min-h-12 pt-4 px-3 rounded-t-lg`}>
                <h6 className={`text-white ${isGrid?isPhone?" w-grid-mobile-content ":" w-grid ":isHorizPhone?" w-page-content ":" w-page-mobile-content px-4 "} open-sans-medium text-left `}>
                    {book.description}
                </h6>
            </div>:null:null}

if(!book){
    return<span className={`skeleton ${size}`}/>
}
    
        return(
        <ErrorBoundary >
        <div id="book-dashboard-item" className={`mt-2 shadow-md overflow-clip  rounded-box flex flex-col `}>
               

        {isGrid?isPhone?null:description(book):null}
       
<div className={` ${contentSize} `}>
            <Carousel book={book} isGrid={isGrid}/>
            </div>    
            
                {bookmarkBtn()} </div>   

 </ErrorBoundary>
     )

}


export default BookDashboardItem



