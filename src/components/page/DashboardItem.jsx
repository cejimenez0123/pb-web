

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
import { debounce, size } from 'lodash'
import { initGA,sendGAEvent } from '../../core/ga4'
import adjustScreenSize from '../../core/adjustScreenSize'
export default function DashboardItem({page, book,isGrid}) {
    const {isPhone,isHorizPhone}=useContext(Context)

    const dispatch = useDispatch()
    const [loading,setLoading]=useState(false)
    const pathParams = useParams()
    const location = useLocation()
    useLayoutEffect(()=>{
        initGA()
    },[])
    const widthSize = adjustScreenSize(isGrid,true,""," pt-1 pb-2 ","","","","")
    let sizeOuter = adjustScreenSize(isGrid,false,"   rounded-lg  shadow-md grid-item relative  ","  justify-between flex ","mt-2  mx-auto "," mt-2 ","  ") 

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
    },[currentProfile,page,likeFound])
const deleteStc=()=>{

        if(bookmarked&&bookmarked.id){
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
    sendGAEvent(`Click to Review`,`Click Review ${JSON.stringify({id:page.id,title:page.title})}`,"Review",0,false)
    navigate(Paths.page.createRoute(page.id))
}
}   

const header=()=>{

   return <span className={`flex-row flex justify-between ${isGrid?isPhone?"w-gird-mobile":" w-grid  ":isPhone?"w-page-mobile":"w-page"}  px-1 rounded-t-lg  pt-2 pb-1`}>  
<ProfileCircle isGrid={isGrid} color={"emerald-700"} profile={page.author}/>


             
   {!isGrid? <h6 className={`text-emerald-800
    mx-2
     ${isGrid?isPhone?"":"":""}
      no-underline text-ellipsis text-emerald-700 whitespace-nowrap overflow-hidden ${isGrid?"text-[0.7rem] ":"text-[0.9rem]"}`}
    onClick={()=>{
        dispatch(setPageInView({page}))
        navigate(Paths.page.createRoute(page.id))

    }} >{` `+page.title.length>0?page.title:""}</h6>:null}</span>
}
const handleApprovalClick = ()=>{
    page?sendGAEvent(`Click to Yea ${JSON.stringify({id:page.id,title:page.title})}`,`Click Yea`,"Review",0,false):null
    if(currentProfile){

        if(likeFound && likeFound.id){
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
                        setLikeFound(true)
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
                          const {collection}=payload
                          let stc =collection.storyIdList.find(stc=>stc.storyId==page.id)
                    
                            
                          setBookmarked(stc)
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
        return isGrid ?<div className={` bg-emerald-100 ${widthSize} 
        flex flex-row justify-between  text-emerald-700`}>
            {isPhone?null:<ProfileCircle isGrid={isGrid} profile={page.author} color='emerald-700'/>}
          
           <span className={`${isGrid?isPhone?" w-grid-mobile-content flex flex-row justify-between":" flex justify-end ":isHorizPhone?"":""}`}><h6 className={`text-emerald-700 ${isGrid?isPhone?"":" text-right ":isHorizPhone?"":""}${isPhone?" text-[0.6rem] ":"text-[0.9rem]  w-[10rem]  ml-1 pr-2"}   whitespace-nowrap  no-underline text-ellipsis  overflow-hidden  my-auto `}
    onClick={()=>{
        sendGAEvent("Navigate",`Navigate to ${JSON.stringify({id:page.id,title:page.title})}`)
        navigate(Paths.page.createRoute(page.id))
    }}

>{` `+page.title.length>0?page.title:""}</h6>

<img onClick={handleBookmark}className='text-white' src={bookmarked?bookmarkfill:bookmarkoutline}/></span> 

    
    </div>:null
    }
    const handleBookmark =debounce((e)=>{
        if(currentProfile){
        e.preventDefault()
        if(bookmarked){
                deleteStc()
        }else{
            onBookmarkPage()
        }}else{
            setError("Please Sign Up")
        }
          },10)

const description = (story) => {
    if (!story.description || story.description.length === 0) return null;
  
    return (
      <div className="md:pt-4 p-1">
        {story.needsFeedback? (
          <label className="text-emerald-800">Feedback Request:</label>
        ):null}
        <h6
          className={`overflow-hidden ${
            isGrid
              ? isPhone
                ? "max-h-20 m-1 p-1 w-grid-mobile-content text-white"
                : isHorizPhone
                ? "w-page-mobile-content text-white"
                : "w-page-content text-emerald-700 text-white"
              : isHorizPhone
              ? "text-emerald-800"
              : ""
          }`}
        >
          {story.description}
        </h6>
      </div>
    );}

    const buttonRow = ( )=>{
        return isGrid?null:
        <div className='  flex flex-row w-full rounded-b-lg  justify-evenly   '>
            
         <div className={`${likeFound?"bg-emerald-400":"bg-emerald-200"} text-center  grow w-1/3`}>
         <div
         
         onClick={handleApprovalClick}
            
          className={`
            py-2   flex mont-medium  mx-auto text-white border-none h-[100%]  border-none  `}
        
         >
            <h6 className=' text-[1.2rem] mont-medium text-emerald-700 my-auto mx-auto'>Yea{likeFound?"":""}</h6> 
         </div>
         </div>
         <div className={" bg-emerald-200 mont-medium  border-white border-x-2 border-y-0  text-center border-white grow w-1/3"}>
         <div
             className='
             text-emerald-700
        text-center mx-auto
       bg-emerald-200 py-2
       border-none mont-medium 
         '
             onClick={()=>handleClickComment()}
                 >
          <h6 className='text-[1.2rem]'> Review</h6>
         </div>
         </div>
         {!page.recommended?<div className="dropdown    text-center   bg-emerald-200  py-2   grow w-1/3 dropdown-top">
<div tabIndex={0} role="button" 
    className="             
        text-emerald-800
        text-center mx-auto
        bg-emerald-200
        border-none 
        mont-medium 
     
         ">
<h6 className=' text-[1.2rem]'>Share</h6></div>
<ul tabIndex={0} className="dropdown-content  text-center   bg-emerald-100 text-emerald-800  z-50 menu  rounded-box  w-60 p-1 shadow">

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
                
//     }
//       const description=()=>{page.description && page.description.length>0?<div className='max-h-16 mb-2 overflow-hidden text-ellipsis md:p-2'>
//     {page.needsFeedback||page.description.length>0?<label className='text-emerald-800'>Feedback Request:</label>:null}
//     <h6 className={`${!isGrid?"text-emerald-800":isPhone?"text-white overflow-scroll":"text-white "} p-2 mont-medium text-left `}>
//         {page.description}
//     </h6>
// </div>:null}
    if(page){
    
        return(
    
                <div 
                id="dashboard-item"
                className={'mt-3 rounded-lg bg-emerald-100 shadow-md flex flex-col  '+sizeOuter}
                >
              {description(page)}
              {header()} 
          <PageDataElement  isGrid={isGrid} page={page}/>
          
  
                {isGrid? 
         
                <div id="bottom-dash" className={`flex flex-row  justify-between  rounded-b-lg bottom-0`}>
                {isGrid?null:header()}
            
                {bookmarkBtn()}
               </div>   
                 :  buttonRow()}
           
                <div>
            
                </div>
              
  </div>

     )}else{
        return(<span  className={sizeOuter+" skeleton"} />)
     }

}