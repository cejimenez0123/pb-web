import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import "../../Dashboard.css"
import { deletePageApproval,   setEditingPage,   setPageInView, setPagesInView, } from '../../actions/PageActions'
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
import PageDataElement from './PageDataElement'
import ProfileCircle from '../profile/ProfileCircle'
import { addStoryListToCollection, deleteStoryFromCollection } from '../../actions/CollectionActions'
import Context from '../../context'
import Enviroment from '../../core/Enviroment'
import ErrorBoundary from '../../ErrorBoundary'

import { debounce } from 'lodash'
import { initGA,sendGAEvent } from '../../core/ga4'
import { useMediaQuery } from 'react-responsive'
function DashboardItem({page, book,isGrid}) {
    const isPhone =  useMediaQuery({
        query: '(max-width: 768px)'
      })
    const dispatch = useDispatch()
    const [loading,setLoading]=useState(false)
    const pathParams = useParams()
    const location = useLocation()
    useLayoutEffect(()=>{
        initGA()
    },[])
    const {setSuccess,setError,currentProfile}=useContext(Context)
    const navigate = useNavigate()
    const [canUserEdit,setCanUserEdit]=useState(false)
   const pagesInView = useSelector(state=>state.pages.pagesInView)
    const [expanded,setExpanded]=useState(false)
    const colInView = useSelector(state=>state.books.collectionInView)
   const [likeFound,setLikeFound]=useState(null)
    const [overflowActive,setOverflowActive] =useState(null)
    const [bookmarked,setBookmarked]=useState()
    const addStoryToCollection = ()=>{
      if(page){
       const list= [page]
       if(location.pathname.includes("collection")&&pathParams.id&&colInView.id==pathParams.id)
        dispatch(addStoryListToCollection({id:colInView.id,list:list,profile:currentProfile})).then(res=>{
    checkResult(res,payload=>{
        let pages = pagesInView
        let index = pages.findIndex(page=>page==Enviroment.blankPage)
        let stories = payload.collection.storyIdList.map(sTc=>sTc.story)
       let back = pages.slice(index,pages.length).filter(page=>{
return !stories.find(story=>story && page &&story.id && page.id&& story.id==page.id)
       })

        
       
        dispatch(setPagesInView({pages:[...stories,...back]}))
        setSuccess("Added")
    },err=>{
        if(err.message){
            setError("Error Adding Story to Collection "+err.message)
        }

    })
  
          
        
    })}
    }

    const soCanUserEdit=()=>{

        if(currentProfile&&page){
            if(page.authorId==currentProfile.id){
                setCanUserEdit(true)
                return
            }
        }
    }
    useEffect(()=>{
        if(currentProfile && page){
            let found = null
           if(currentProfile.likedStories){

        let  found= currentProfile.likedStories.find(like=>like && like.storyId==page.id)
          setLikeFound(found)
        }
         
            if(currentProfile.profileToCollections){
            let marked = currentProfile.profileToCollections.find(ptc=>{
                return ptc && ptc.type=="archive"&&ptc.collection.storyIdList.find(stc=>stc.storyId==page.id)})
       
                setBookmarked(marked)
            }
               
               
        }          
    },[currentProfile,page])
const deleteStc=()=>{

        if(bookmarked){
            setLoading(true)
   dispatch( deleteStoryFromCollection({stId:bookmarked.id})).then((res)=>{
   checkResult(res,payload=>{
    setBookmarked(null)
    setLoading(false)
   },err=>{
    if(err.message){
    setError("Error deleting bookmark "+err.message)}
   }
)
   })
}}

const handleClickComment=()=>{   
  if(page){ 
    sendGAEvent(`Click to Review- ${page.title}-${page.id}`,"Click Review","Review",0,false)
    navigate(Paths.page.createRoute(page.id))
}
}   

const header=()=>{

   return isGrid?null:<span className={"flex-row flex justify-between w-[96vw]  md:w-page px-1 rounded-t-lg  pt-2 pb-1"}>  
<ProfileCircle isGrid={isGrid} profile={page.author}/>


             
    <h6 className={`text-emerald-800
    mx-2
     ${isGrid?isPhone?"":"":""}
      no-underline text-ellipsis  whitespace-nowrap overflow-hidden text-[0.9rem]`}
    onClick={()=>{
        dispatch(setPageInView({page}))
        navigate(Paths.page.createRoute(page.id))

    }} >{` `+page.title.length>0?page.title:""}</h6></span>
}
const handleApprovalClick = ()=>{
    page?sendGAEvent(`Click to Yea- ${page.title}-${page.id}`,"Click Yea","Review",0,false):null
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
    },[page])
    const onBookmarkPage = ()=>{
            if(currentProfile&&currentProfile.profileToCollections){
                setLoading(true)
                let ptc = currentProfile.profileToCollections.find(ptc=>ptc.type=="archive")
                if(ptc&&ptc.collectionId&&page&&page.id){{
                    dispatch(addStoryListToCollection({id:ptc.collectionId,list:[page],profile:currentProfile})).then(res=>{
                        checkResult(res,payload=>{
                            setBookmarked({collectionId:payload.id})
                            setSuccess("Added Successfully")
                            setLoading(false)
                        },err=>{
                            setBookmarked(null)
                            setError("Error Bookmarking")
                            setLoading(false)
                        })
                    })
           
                }
                 }
   
    }}
    const ClickAddStoryToCollection=()=>{
        navigate(Paths.addStoryToCollection.story(page.id))
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
        return isGrid ?<div className={`w-[100%]  ${isPhone?"":"py-2"}  my-auto flex flex-row justify-between  text-white `}>
            {isPhone?null:<ProfileCircle isGrid={isGrid} profile={page.author}/>}
        <span className='bg-transparent flex flex-row  w-[100%] justify-between '>
            <h6 className={`text-white ${isPhone?"":"  ml-1 pr-1"}text-right  whitespace-nowrap  no-underline text-ellipsis  overflow-hidden  my-auto text-[0.9rem]`}
    onClick={()=>{
        navigate(Paths.page.createRoute(page.id))
    }}

>{` `+page.title.length>0?page.title:""}</h6>

<img onClick={handleBookmark}className='text-white' src={bookmarked?bookmarkfill:bookmarkoutline}/></span>
    
    </div>:null
    }
    const handleBookmark =debounce((e)=>{
        e.preventDefault()
        if(bookmarked){
                deleteStc()
        }else{
            onBookmarkPage()
        }
          },10)
    const buttonRow = ( )=>{
        return isGrid?null:
        <div className='  flex flex-row w-[96vw]  md:w-page rounded-b-lg  overflow-hidden justify-evenly   '>
            
         <div className={`${likeFound?"bg-emerald-400":"bg-emerald-700"} text-center  grow w-1/3`}>
         <div
         
         onClick={handleApprovalClick}
            
          className={`
            py-2   flex mont-medium  mx-auto text-white border-none h-[100%]  border-none  `}
        
         >
            <h6 className=' text-[1.2rem] mont-medium my-auto mx-auto'>Yea{likeFound?"h!":""}</h6> 
         </div>
         </div>
         <div className={" bg-emerald-700 mont-medium  border-white border-x-2 border-y-0  text-center border-white grow w-1/3"}>
         <div
             className='
             text-white
        text-center mx-auto
       bg-transparent py-2
       border-none mont-medium 
         '
             onClick={()=>handleClickComment()}
                 >
          <h6 className='text-[1.2rem]'> Review</h6>
         </div>
         </div>
         {!page.recommended?<div className="dropdown    text-center   bg-emerald-700  py-2   grow w-1/3 dropdown-top">
<div tabIndex={0} role="button" 
    className="             
        text-white
        text-center mx-auto
        bg-transparent
        border-none 
        mont-medium 
     
         ">
<h6 className=' text-[1.2rem]'>Share</h6></div>
<ul tabIndex={0} className="dropdown-content  text-center    text-emerald-800  z-50 menu bg-emerald-100 rounded-box  w-60 p-1 shadow">

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
                 {canUserEdit
                ? <li className=' text-emerald-700'> 
              
     <a onClick={()=>{
        dispatch(setEditingPage({page}))
        dispatch(setPageInView({page:null}))
        navigate(Paths.editPage.createRoute(page.id))}}
        className='text-emerald-700'>Edit</a>
     </li>:null}
    <li> 
        
        <button className="my-auto w-fit mx-auto border-none bg-transparent"onClick={handleBookmark}
    disabled={!currentProfile}> 
    
    
    {loading?<img className="max-h-6"src={loadingGif}/>:
    bookmarked?<img src={bookmarkFillGreen}
     className='text-emerald-800'/>:<img src={bookmarkadd}/>}
     </button></li>
</ul>
</div>:<div onClick={addStoryToCollection} 
className='  bg-emerald-700 flex grow flex-1/3 '> <img  className="mx-auto my-auto" src={addCircle}/></div>}

</div>

                
    }
    if(page){
    
        return(
        <ErrorBoundary>
                <div className={`shadow-md ${isGrid ? (isPhone ? 'overall-hidden' : `relative w-[96vw] rounded-lg overflow-clip shadow-md md:w-page my-2`) : ''}`}>
        <div className={`shadow-md  ${isGrid?"bg-emerald-700 rounded-lg   ":"bg-emerald-50 rounded-t-lg md:w-page w-[96vw]"}   `}>
               {!isGrid?header():null}
        {page.description && page.description.length>0?<div className='max-h-16 mb-2 overflow-hidden text-ellipsis md:p-2'>
            {page.needsFeedback?<label className='text-emerald-800'>Feedback Request:</label>:null}
            <h6 className={`${!isGrid?"text-emerald-800":isPhone?"text-white overflow-scroll":"text-white "} p-2 mont-medium text-left `}>
                {page.description}
            </h6>
        </div>:null}
       
             
          <div className={isGrid?isPhone?" rounded-lg overflow-clip":' rounded-lg flex justify-between flex-col h-[100%]  pt-1':"rounded-lg"}>
      <div onClick={()=>{
         navigate(Paths.page.createRoute(page.id))
        }} 
        className={isGrid?isPhone?"pt-2 rounded-lg overflow-hidden":"":isPhone?"h-[18em]  ":"h-[29rem"}>
          <PageDataElement  isGrid={isGrid} page={page}/>
          </div>
                {buttonRow()}
                {isGrid? <div className='flex flex-row pt-2 justify-between px-3 py-1  rounded-b-lg bottom-0'>
                {header()}
            
                {bookmarkBtn()} </div>   :null}
                </div>
                <div>
            
                </div>
              
          
              
               
  </div>
  </div>
 
  </ErrorBoundary>
     )}else{
        return(<div className={isGrid?isPhone?"overall-hidden":"shadow-md":'relative w-[96vw] rounded-lg overflow-clip shadow-md md:w-page   my-2 '}><span className='skeleton'/></div>)
     }

}


export default DashboardItem