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
import Carousel from './Carousel'
import ErrorBoundary from '../../ErrorBoundary'
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

  

const header=()=>{

   return <span className={`booker flex-row flex justify-between w-[96vw] ${isGrid?isPhone?" w-grid-mobile ":" w-grid ":""}  md:w-page px-1   pt-2 pb-1`}>  
<span>{isGrid?null:<ProfileCircle isGrid={isGrid} profile={book.profile}/>}</span>


             <span className='justify-end'>
    {!isPhone?<h6 className={`${isPhone?"text-emerald-800":""} ${isGrid?isPhone?"text-white":"text-emerald-800":""}
     ml-1 pr-2 
     text-ellipsis   overflow-hidden max-w-[100%] my-auto ${isGrid?isPhone?" text-[0.8rem] ":null:isPhone?" text-[0.9rem]":""}`}
    onClick={()=>{
        navigate(Paths.collection.createRoute(book.id))
    }} >{` `+book.title.length>0?book.title:""}</h6>:null}</span></span>
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
        return(<div className={`w-[100%]  md:py-2 my-auto flex flex-row ${isGrid?"justify-end":"justify-between"} text-white `}>

         {isGrid?null: <ProfileCircle isGrid={isGrid} profile={book.profile}/>}
     <span className='flex flex-row'>
            <h6 
            onClick={()=>{
                navigate(Paths.collection.createRoute(book.id))
            }}
            className={`${isGrid?isPhone?" w-grid-mobile":" ml-1 pr-1 ":""}  text-white w-full  no-underline text-ellipsis  whitespace-nowrap overflow-hidden max-w-[100%] my-auto 
            ${isGrid?"text-[0.8em]":"text-[0.9rem]"}`}
>{` `+book.title.length>0?book.title:""}</h6><img onClick={handleBookmark}className='text-white' src={bookmarked?bookmarkfill:bookmarkoutline}/>
</span>
    
    </div>)
    }
    const handleBookmark =debounce((e)=>{
        e.preventDefault()
        if(bookmarked){
                deleteStc()
        }else{
           
        }
          },10)
          const description = (book)=>{return !isPhone&&!isGrid?book.description && book.description.length>0?
            <div className={`min-h-12 pt-4 p-2`}>
                <h6 className={`${isGrid?"text-white":"text-emerald-800"} p-2 open-sans-medium text-left `}>
                    {book.description}
                </h6>
            </div>:null:null}

    if(book){
    
        return(
        <ErrorBoundary>
        <div className={`shadow-md  rounded-lg overall-clip ${isGrid?isPhone?" overflow-y-hidden  m-1 ":'':``}   flex justify-between flex-col   pt-1`}>
                 <div className={isGrid?isPhone?" ":"bg-emerald-700  rounded-lg overflow-hidden":'relative w-[96vw]  overflow-clip  md:w-page  shrink my-2 '}>
           
        <div className={`${isGrid?"overflow-hidden bg-emerald-700  text-white ":"bg-emerald-100 rounded-t-lg md:w-page w-[96vw]"}   `}>

        {isGrid?isPhone?null:description(book):null}
       

            <Carousel book={book} isGrid={isGrid}/>
     
                 <div  className='flex flex-row justify-between px-3 py-1  rounded-b-lg bottom-0'>
             
            
                {isGrid?isPhone?bookmarkBtn():bookmarkBtn():null} </div>   
        
                </div>
                <div>
            
        
                      
                </div>
  </div>
  </div>
 </ErrorBoundary>
     )}else{
        return null
     }

}


export default BookDashboardItem