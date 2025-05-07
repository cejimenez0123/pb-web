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
import {  addCollectionListToCollection, deleteCollectionFromCollection,  } from '../../actions/CollectionActions'
import Context from '../../context'
import { debounce } from 'lodash'
import { useMediaQuery } from 'react-responsive'
import Carousel from './Carousel'
import { useNavigate } from 'react-router-dom'
import adjustScreenSize from '../../core/adjustScreenSize'
function BookDashboardItem({book,isGrid}) {
 
    const dispatch = useDispatch()
    const {setSuccess,setError,currentProfile,isPhone,isHorizPhone}=useContext(Context)
    const navigate = useNavigate()

    const [expanded,setExpanded]=useState(false)
   const [likeFound,setLikeFound]=useState(null)
    const [overflowActive,setOverflowActive] =useState(null)
    const [bookmarked,setBookmarked]=useState()
    const [isArchived,setIsArchived]=useState()
   const [title,setTitle]=useState("")
    let size = adjustScreenSize(isGrid,false," grid-item rounded-lg "," overflow-hidden rounded-lg max-h-[25em]",""," min-h-[25rem] ","  ")
    const soCanUserEdit=()=>{}

   
const deleteBtc=()=>{

        if(bookmarked){
            console.log("masx",bookmarked)
          dispatch(deleteCollectionFromCollection({tcId:bookmarked.id})).then(res=>checkResult(res,payload=>{
    setBookmarked(null)

   },err=>{
    setError(err.message)
   })
)
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
const checkFound=()=>{
    
    if(currentProfile && currentProfile.profileToCollections){
   let archive = currentProfile.profileToCollections[0].collection
   let home = currentProfile.profileToCollections[1].collection

    if(book&&book.parentCollections){
        console.log(book.parentCollections)
         let isfound = book.parentCollections.find(ptc=>ptc.parentCollectionId==home.id)
       
            setBookmarked(isfound)
            
         let found = book.parentCollections.find(ptc=>ptc.parentCollectionId==archive.id)

            setIsArchived(found)
            setBookmarked(found)
            }
 
    }}
 

useLayoutEffect(()=>{
    checkFound()
},[book])
const description = (book)=>{return !isPhone&&!isGrid?book.description && book.description.length>0?
    <div id="book-description" className={`text-emerald-700 min-h-12 pt-4 px-3 rounded-t-lg`}>
        <h6 className={`text-emerald-700 ${isGrid?isPhone?" w-grid-mobile-content ":" w-grid ":isHorizPhone?" w-page-content ":" w-page-mobile-content px-4 "} open-sans-medium text-left `}>
            {book.description}
        </h6>
    </div>:null:null}

    useLayoutEffect(()=>{
        soCanUserEdit()
        let tit = ""
        if(book){
        
        
            if(book.title.length>30){
            tit = book.title.slice(0,30)+"..."
            setTitle(tit)
            }else{
               setTitle(book.title)
            }
       
        }
    },[book])
  
 
  
    const bookmarkBtn =()=>{
        let title =  book.title.length > 23 ? book.title.slice(0, 20) + '...' : book.title
        return(
       
       <div id="bookmark-btn-item"   className={`flex flex-row justify-between rounded-b-lg text-emerald-700 pt-2 px-2 mx-auto pb-1  ${isGrid?isPhone?" w-grid-mobile px-4 ":" w-grid px-4":isPhone?" w-page-mobile px-2 ":isHorizPhone?" w-page-content ":"w-page-mobile-content px-4"} `}>{isPhone&&isGrid?null:
       <ProfileCircle isGrid={isGrid} color={"emerald-700"}
       profile={book.profile}/>}
  
  <span className={`${isGrid?isPhone?"w-grid-mobile justify-between":" px-2 ":isPhone?"":""} flex flex-row text-right open-sans-medium text-emerald-700`}>       <h6 
            className='my-auto text-ellipsis   
            whitespace-nowrap no-underline text-[0.7rem]'
            onClick={()=>{
                navigate(Paths.collection.createRoute(book.id))
            }}
            
>{` `+title}</h6>
<img onClick={handleBookmark} src={bookmarked?bookmarkfill:bookmarkoutline}/></span>
</div>
  

)
    }
   
    const handleBookmark =debounce((e)=>{
        if(currentProfile){
        e.preventDefault()
        if(bookmarked){
                deleteBtc()
        }else{
         let archive =   currentProfile.profileToCollections.find(col=>col.collection.title.toLowerCase()=="archive").collection
       
         if(archive.id&&book.id){
           
           dispatch(addCollectionListToCollection({id:archive.id,list:[book.id],profile:currentProfile})).then(res=>{
            checkResult(res,payload=>{
                    const {collection}=payload
                    const marked = collection.parentCollections.find(col=>col.parentCollectionId==archive.id)
                  console.log(marked)
                    setBookmarked(marked)
                },err=>{

            })
           })
            }else{
                setError("Error with Archive Collection")
            }
        }}else{
            
            setError("Please Login")
        }
          },10)


if(!book){
    return<span className={`skeleton ${size}`}/>
}
    
        return(
        // <ErrorBoundary >
        <div id="book-dashboard-item" className={`mt-2 shadow-md overflow-clip ${size} rounded-box flex flex-col bg-emerald-100  `}>
               

        {isGrid?isPhone?null:description(book):null}
       
            <Carousel book={book} isGrid={isGrid}/>

                {bookmarkBtn()} </div>   

//  </ErrorBoundary>
     )

}


export default BookDashboardItem



