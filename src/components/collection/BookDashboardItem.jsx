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
import PageDataElement from '../page/PageDataElement'
import ProfileCircle from '../profile/ProfileCircle'
import { addStoryListToCollection, deleteStoryFromCollection } from '../../actions/CollectionActions'
import Context from '../../context'
import Enviroment from '../../core/Enviroment'
import ErrorBoundary from '../../ErrorBoundary'
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

   return isGrid?null:<span className={"flex-row flex justify-between w-[96vw]  md:w-page px-1 rounded-t-lg  pt-2 pb-1"}>  
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
        return isGrid ?<div className='w-[100%]  py-2 my-auto flex flex-row justify-between  text-white '>
          {!isPhone?  <ProfileCircle isGrid={isGrid} profile={book.profile}/>:null}
        <span className='bg-transparent flex flex-row '>
            <h6 
            onClick={()=>{
                navigate(Paths.collection.createRoute(book.id))
            }}
            className={`text-white max-w-[15em] min-w-[10em] text-right ml-1 pr-1  no-underline text-ellipsis  whitespace-nowrap overflow-hidden max-w-[100%] my-auto text-[0.9rem]`}
>{` `+book.title.length>0?book.title:""}</h6><img onClick={handleBookmark}className='text-white' src={bookmarked?bookmarkfill:bookmarkoutline}/></span>
    
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
            
               
        <div className={`carousel carousel-start ${isGrid?isPhone?`bg-emerald-700 `:`bg-emerald-700`:  ` max-w-[94.5vw]   md:w-page`}`}>
     
       {book.storyIdList.map((stc,i)=>{
        if(stc && stc.story){

      
        return(
        <div  className={` carousel-item flex flex-col justify-center ${isGrid?isPhone?"max-w-[100%]":"":" max-w-[95vw]  md:w-[49.5em] "}`}
         id={stc.id} key={stc.id}

>
<h5  className={ `${isGrid?isPhone?"text-white  ":"text-white":"text-emerald-800"} mont-medium  bottom-0 mx-2 text-left`}>{stc.story.title}</h5>
    {stc.story.description && stc.story.description.length>0?<div className='h-1  2 pt-4 p-2'>
            {stc.story.needsFeedback?<label className='text-emerald-800'>Feedback Request:</label>:null}
            <h6 className={`${isGrid?isPhone?"text-white":"text-white":"text-emerald-800"} p-2 open-sans-medium text-left `}>
                {stc.story.description}
            </h6>
        </div>:null}
       <PageDataElement isGrid={isGrid} page={stc.story} /> 

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
                 <div className={isGrid?isPhone?"shadow-md":"shadow-md bg-emerald-700  ":'relative w-[96vw] rounded-lg overflow-clip shadow-md md:w-page  shrink my-2 h-fit'}>
           
        <div className={`shadow-sm ${isGrid?"overflow-hidden bg-emerald-700 rounded-lg text-white h-fit min-h-56   ":"bg-emerald-50 rounded-t-lg md:w-page w-[96vw]"}   `}>
               {!isGrid&&book?header():null}
        {book.description && book.description.length>0?<div className='min-h-12 pt-4 p-2'>
            {/* {book.needsFeedback?<label className='text-emerald-800'>Feedback Request:</label>:null} */}
            <h6 className={`${isGrid?"text-white":"text-emerald-800"} p-2 open-sans-medium text-left `}>
                {book.description}
            </h6>
        </div>:null}
       
             
          <div className={` ${isGrid?isPhone?"overflow-y-hidden m-1 ":'':``} rounded-lg max-h-[34em]   flex justify-between flex-col   pt-1`}>
     
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
// // import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
// // import "../../Dashboard.css"
// // import { deletePageApproval,   setEditingPage,   setPageInView, setPagesInView, } from '../../actions/PageActions'
// // import { createPageApproval } from '../../actions/PageActions'
// // import {useDispatch, useSelector} from 'react-redux'
// // import { useLocation, useNavigate, useParams } from 'react-router-dom'
// // import { Button } from '@mui/material'
// // import addCircle from "../../images/icons/add_circle.svg"
// // import bookmarkFillGreen from "../../images/bookmark_fill_green.svg"
// // import bookmarkfill from "../../images/bookmarkfill.svg"
// // import checkResult from '../../core/checkResult'
// // import Paths from '../../core/paths'
// // import bookmarkoutline from "../../images/bookmarkadd.svg"
// // import PageDataElement from '../page/PageDataElement'
// // import ProfileCircle from '../profile/ProfileCircle'
// // import { addStoryListToCollection, deleteStoryFromCollection } from '../../actions/CollectionActions'
// // import Context from '../../context'
// // import { debounce } from 'lodash'
// // import { useMediaQuery } from 'react-responsive'
// // import ErrorBoundary from '../../ErrorBoundary'
// // function BookDashboardItem({book,isGrid}) {
// //     const isPhone = useMediaQuery({
// //         query: '(max-width: 768px)'
// //       })
// //       const isNotPhone = useMediaQuery({
// //         query: '(min-width:768px)'
// //       })
// //       const ref = useRef()
// //     const dispatch = useDispatch()
 
// //     const {setSuccess,setError,currentProfile}=useContext(Context)
// //     const navigate = useNavigate()
// //     const [canUserEdit,setCanUserEdit]=useState(false)
   

// //     const [expanded,setExpanded]=useState(false)

// //    const [likeFound,setLikeFound]=useState(null)
// //     const [overflowActive,setOverflowActive] =useState(null)
// //     const [bookmarked,setBookmarked]=useState()

// //     const soCanUserEdit=()=>{}


// // const deleteStc=()=>{

// //         if(bookmarked){
// //             setLoading(true)
// //    dispatch( deleteStoryFromCollection({stId:bookmarked.id})).then((res)=>{
// //    checkResult(res,payload=>{
// //     setBookmarked(null)
// //     setLoading(false)
// //    },err=>{
// //     setError(err.message)
// //    }
// // )
// //    })
// // }}

  

// // const header=()=>{

// //    return isGrid?null:<span className={`flex-row ${isGrid?" pl-2 ":"w-[96vw]"} flex justify-between w-[96vw]  md:w-page px-1 rounded-t-lg  pt-2 pb-1`}>  
// // {isNotPhone?<ProfileCircle isGrid={isGrid} profile={book.profile}/>:null}


             
// //     <h6 className={`${isGrid?"text-white":" pr-2      ml-1   text-emerald-800"}

// //       no-underline text-ellipsis  whitespace-nowrap overflow-hidden my-auto text-[0.9rem]`}
// //     onClick={()=>{
// //         navigate(Paths.collection.createRoute(book.id))
// //     }} >{` `+book.title.length>0?book.title:""}</h6></span>
// // }
// // const handleApprovalClick = ()=>{
// //     if(currentProfile){
// //         if(likeFound ){
// //          dispatch(deletePageApproval({id:likeFound.id})).then(res=>{
// //             checkResult(res,payload=>{
// //                 setLikeFound(null)
// //             },err=>{

// //             })
// //         })
// //     }else{
// //         if(page&&currentProfile ){

        
// //         const params = {story:page,
// //             profile:currentProfile,
// //                         }
// //         dispatch(createPageApproval(params))
// //         }else{
// //             setError("Sign Up so you can show support")
// //         }
// //     }
// // }else{
// //     setError("Please Sign Up")
// // }
// // }
// // const expandedBtn =()=>{
// //     if(overflowActive && !expanded){
    
// //     return <Button onClick={()=>setExpanded(true)}>See More</Button>
// //     }
// //     else if(expanded){
// // return <Button onClick={()=>{
// //     setExpanded(false)
// // }}>See Less</Button>
// //         }else if(overflowActive){
// //             return <Button onClick={()=>setExpanded(true)}>See More</Button>
// //         }
// //    else{
// //     return <div></div>
// //    }
// // }

// //     useLayoutEffect(()=>{
// //         soCanUserEdit()
// //     },[book])
// //     let title = ""
 
// //     if(book){
        
        
// //         if(book.title.length>30){
// //         title = book.title.slice(0,30)+"..."
// //         }else{
// //             title = book.title
// //         }
   
// //     }
// //     const bookmarkBtn =()=>{
// //         return isGrid ?<div className='w-full   md:max-h-[28em] py-2  flex flex-row justify-between  text-white '>
// //            {isNotPhone?<ProfileCircle isGrid={isGrid} profile={book.profile}/>:null}
// //         <span className='bg-transparent flex flex-row '>
// //             <h6 
// //             onClick={()=>{
// //                 navigate(Paths.collection.createRoute(book.id))
// //             }}
// //             className={`text-white max-w-[15em] min-w-[10em] text-right ml-1 pr-1  no-underline text-ellipsis  whitespace-nowrap overflow-hidden my-auto text-[0.9rem]`}
// // >{` `+book.title.length>0?book.title:""}</h6><img onClick={handleBookmark}className='text-white' src={bookmarked?bookmarkfill:bookmarkoutline}/></span>
    
// //     </div>:null
// //     }
// //     const handleBookmark =debounce((e)=>{
// //         e.preventDefault()
// //         if(bookmarked){
// //                 deleteStc()
// //         }else{
           
// //         }
// //           },10)

// //           const height = !location.pathname.includes("story")?` max-h-[32em] md:max-h-[40rem] text-ellipsis`:""
// //           const Carousel = ({book})=>{

// //             if(book){
              
// //                 return(
                    
                        
// //                 <div className={isGrid?"carousel max-w-grid ":" max-w-[94.5vw] carousel md:w-page "}>
             
// //                {book.storyIdList.map((stc,i)=>{
// //                 if(stc && stc.story){
        
              
// //                 return(
// //                 <div  className={`carousel-item min-w-[100%] h-[100%] flex flex-col justify-center
// //                  ${isGrid?"max-w-[100%]":" max-w-[95vw]  md:w-[49.5em] "}`}
// //                  id={stc.id} key={stc.id}
        
// //         >
// //         <h5  className={ `${isGrid?"text-white":"text-emerald-800"} mont-medium text-emerald-800 bottom-0 mx-2 text-left`}>{stc.story.title}</h5>
// //             {stc.story.description && stc.story.description.length>0?<div className='min-h-12 pt-4 p-2'>
// //                     {stc.story.needsFeedback?<label className='text-emerald-800'>Feedback Request:</label>:null}
// //                     <h6 className={`${isGrid?"text-white":"text-emerald-800"} p-2 open-sans-medium text-left `}>
// //                         {stc.story.description}
// //                     </h6>
// //                 </div>:null}
// //                <PageDataElement isGrid={isGrid} page={stc.story} /> 
        
// //                 </div>)}else{
// //                     return null
// //                 }})}
        
            
// //                <span className='flex flex-row justify-center'>
        
        
// //               </span>
// //               </div>)
// //             }else{
// //                 return(<div className='skeleton rounded-box'/>)
// //             }
// //         }
// // // const Carousel = ({book})=>{
// // //     const carRef = useRef()
// // //     if(book){
// // //         return(
       
// // //     <div  ref={carRef}  className={` overflow-clip ${isGrid?isNotPhone?"max-w-grid ":" overflow-hidden":`w-[96vw]  ${height}`} rounded-box shadow-md carousel `}>       
    
// // //        {book.storyIdList.map((stc,i)=>{
// // //         if(stc && stc.story){

      
// // //         return(
// // //                  <div  className={` carousel-item  ${isGrid?isNotPhone?"   ":"":""}  h-[34em]  flex flex-col `}
// // //          id={stc.id} key={stc.id}

// // // >
  
// // // <h5  className={ `${isGrid?"text-white":"text-emerald-800"} pl-2 mont-medium text-emerald-800 bottom-0 text-left  pt-4 pb-2`}>{stc.story.title}</h5>
// // //     {stc.story.description &&isNotPhone?<div className='pt-4 lg:w-page p-2'>
// // //             {stc.story.needsFeedback?<label className='text-emerald-800'>Feedback Request:</label>:null}
// // //             <h6 className={`${isGrid?"text-white":"text-emerald-800"} p-2 open-sans-medium text-left `}>
// // //                 {stc.story.description}
// // //             </h6>
// // //         </div>:null}

// // //        <PageDataElement isGrid={isGrid} page={stc.story} /> 

// // //         </div>)}else{
// // //             return null
// // //         }})}

    
// // //        <span className='flex flex-row justify-center'>


// // //       </span>
// // //       </div>)
// // //     }else{
// // //         return(<div className='skeleton rounded-box'/>)
// // //     }
// // // }

// // //     if(book){
    
// // //         return(
// // //         <ErrorBoundary>
// // //                <div  ref={ref}  className={isGrid?isPhone?"shadow-md w-grid-mobile max-h-[15em] md:max-h-[24em] ":"md:w-grid":' w-[96vw] rounded-lg shadow-md md:w-page   my-2 '}>
// // //         <div className={`shadow-sm ${isGrid?isPhone?"bg-emerald-700 rounded-lg min-h-56   ":"":"bg-emerald-50 rounded-t-lg md:w-page w-[96vw]"}   `}>
              
// // //         <div className={`shadow-sm w-grid-mobile md:w-grid ${isGrid?"bg-emerald-700 rounded-lg text-white   ":"bg-emerald-50 rounded-t-lg"}   `}>
// // //                {!isGrid&&book&&isPhone?<span>{header()}</span>:null}
// // //                  {book.needsFeedback?<label className='text-emerald-800'>Feedback Request:</label>:null}
          
// // //         {book.description && book.description.length>0?<div className={`pt-4  p-2`}>
// // //             <h6 className={`${isGrid?"text-white":"text-emerald-800"} p-2 open-sans-medium text-left `}>
// // //                 {book.description}
// // //             </h6>
// // //         </div>:null}
       
             
// // //           {/* <div className={""+isGrid?' rounded-lg flex justify-between flex-col   pt-1':"rounded-lg"}> */}
// // //      <span className={height}>
// // //             <Carousel book={book}/>
// // //         </span>
// // //             {/* </div> */}
// // //                 {isGrid? <div className='flex flex-row pt-2 justify-between px-3 py-1  rounded-b-lg bottom-0'>
// // //                 {header()}
            
// // //                 {isNotPhone?bookmarkBtn():null} </div>   :null}
// // //                 </div>            
// // //   </div>
// // //   </div>
// // //  </ErrorBoundary>
// // //      )}else{
// // //         return null
// // //      }

// // }


// // export default BookDashboardItem

// import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
// import "../../Dashboard.css"
// import { deletePageApproval,   setEditingPage,   setPageInView, setPagesInView, } from '../../actions/PageActions'
// import { createPageApproval } from '../../actions/PageActions'
// import {useDispatch, useSelector} from 'react-redux'
// import { useLocation, useNavigate, useParams } from 'react-router-dom'
// import { Button } from '@mui/material'
// import addCircle from "../../images/icons/add_circle.svg"
// import bookmarkFillGreen from "../../images/bookmark_fill_green.svg"
// import bookmarkfill from "../../images/bookmarkfill.svg"
// import checkResult from '../../core/checkResult'
// import Paths from '../../core/paths'
// import loadingGif from "../../images/loading.gif"
// import bookmarkoutline from "../../images/bookmarkadd.svg"
// import bookmarkadd from "../../images/bookmark_add.svg"
// import PageDataElement from '../page/PageDataElement'
// import ProfileCircle from '../profile/ProfileCircle'
// import { addStoryListToCollection, deleteStoryFromCollection } from '../../actions/CollectionActions'
// import Context from '../../context'
// import Enviroment from '../../core/Enviroment'
// import ErrorBoundary from '../../ErrorBoundary'
// import { debounce } from 'lodash'
// function BookDashboardItem({book,isGrid}) {
//     const dispatch = useDispatch()
//     const [loading,setLoading]=useState(false)
//     const pathParams = useParams()
//     const location = useLocation()
//     const {setSuccess,setError,currentProfile}=useContext(Context)
//     const navigate = useNavigate()
//     const [canUserEdit,setCanUserEdit]=useState(false)
   

//     const [expanded,setExpanded]=useState(false)

//    const [likeFound,setLikeFound]=useState(null)
//     const [overflowActive,setOverflowActive] =useState(null)
//     const [bookmarked,setBookmarked]=useState()

//     const soCanUserEdit=()=>{}

//     useEffect(()=>{
        
//     },[currentProfile,book])
// const deleteStc=()=>{

//         if(bookmarked){
//             setLoading(true)
//    dispatch( deleteStoryFromCollection({stId:bookmarked.id})).then((res)=>{
//    checkResult(res,payload=>{
//     setBookmarked(null)
//     setLoading(false)
//    },err=>{
//     setError(err.message)
//    }
// )
//    })
// }}

  

// const header=()=>{

//    return isGrid?null:<span className={"flex-row flex justify-between w-[96vw]  md:w-page px-1 rounded-t-lg  pt-2 pb-1"}>  
// <ProfileCircle isGrid={isGrid} profile={book.profile}/>


             
//     <h6 className={`${isGrid?"text-white":"text-emerald-800"}
//      ml-1 pr-2 
//       no-underline text-ellipsis  whitespace-nowrap overflow-hidden max-w-[100%] my-auto text-[0.9rem]`}
//     onClick={()=>{
//         navigate(Paths.collection.createRoute(book.id))
//     }} >{` `+book.title.length>0?book.title:""}</h6></span>
// }
// const handleApprovalClick = ()=>{
//     if(currentProfile){
//         if(likeFound ){
//          dispatch(deletePageApproval({id:likeFound.id})).then(res=>{
//             checkResult(res,payload=>{
//                 setLikeFound(null)
//             },err=>{

//             })
//         })
//     }else{
//         if(page&&currentProfile ){

        
//         const params = {story:page,
//             profile:currentProfile,
//                         }
//         dispatch(createPageApproval(params))
//         }else{
//             setError("Sign Up so you can show support")
//         }
//     }
// }else{
//     setError("Please Sign Up")
// }
// }
// const expandedBtn =()=>{
//     if(overflowActive && !expanded){
    
//     return <Button onClick={()=>setExpanded(true)}>See More</Button>
//     }
//     else if(expanded){
// return <Button onClick={()=>{
//     setExpanded(false)
// }}>See Less</Button>
//         }else if(overflowActive){
//             return <Button onClick={()=>setExpanded(true)}>See More</Button>
//         }
//    else{
//     return <div></div>
//    }
// }

//     useLayoutEffect(()=>{
//         soCanUserEdit()
//     },[book])
//     let title = ""
 
//     if(book){
        
        
//         if(book.title.length>30){
//         title = book.title.slice(0,30)+"..."
//         }else{
//             title = book.title
//         }
   
//     }
//     const bookmarkBtn =()=>{
//         return isGrid ?<div className='w-[100%]  py-2 my-auto flex flex-row justify-between  text-white '>
//             <ProfileCircle isGrid={isGrid} profile={book.profile}/>
//         <span className='bg-transparent flex flex-row '>
//             <h6 
//             onClick={()=>{
//                 navigate(Paths.collection.createRoute(book.id))
//             }}
//             className={`text-white max-w-[15em] min-w-[10em] text-right ml-1 pr-1  no-underline text-ellipsis  whitespace-nowrap overflow-hidden max-w-[100%] my-auto text-[0.9rem]`}
// >{` `+book.title.length>0?book.title:""}</h6><img onClick={handleBookmark}className='text-white' src={bookmarked?bookmarkfill:bookmarkoutline}/></span>
    
//     </div>:null
//     }
//     const handleBookmark =debounce((e)=>{
//         e.preventDefault()
//         if(bookmarked){
//                 deleteStc()
//         }else{
           
//         }
//           },10)


// const Carousel = ({book})=>{

//     if(book){
      
//         return(
            
                
//         <div className={isGrid?"carousel  ":" max-w-[94.5vw] carousel md:w-page "}>
     
//        {book.storyIdList.map((stc,i)=>{
//         if(stc && stc.story){

      
//         return(
//         <div  className={`carousel-item min-w-[100%] h-[100%] flex flex-col justify-center
//          ${isGrid?"max-w-[100%]":" max-w-[95vw]  md:w-[49.5em] "}`}
//          id={stc.id} key={stc.id}

// >
// <h5  className={ `${isGrid?"text-white":"text-emerald-800"} mont-medium text-emerald-800 bottom-0 mx-2 text-left`}>{stc.story.title}</h5>
//     {stc.story.description && stc.story.description.length>0?<div className='min-h-12 pt-4 p-2'>
//             {stc.story.needsFeedback?<label className='text-emerald-800'>Feedback Request:</label>:null}
//             <h6 className={`${isGrid?"text-white":"text-emerald-800"} p-2 open-sans-medium text-left `}>
//                 {stc.story.description}
//             </h6>
//         </div>:null}
//        <PageDataElement isGrid={isGrid} page={stc.story} /> 

//         </div>)}else{
//             return null
//         }})}

    
//        <span className='flex flex-row justify-center'>


//       </span>
//       </div>)
//     }else{
//         return(<div className='skeleton rounded-box'/>)
//     }
// }

//     if(book){
    
//         return(
//         // <ErrorBoundary>
//         <div className={`${isGrid?"grid-item":""}`}>
//                 <div className={isGrid?"shadow-md":'relative w-[96vw] rounded-lg overflow-clip shadow-md md:w-page  shrink my-2 h-fit'}>
           
//         <div className={`shadow-sm ${isGrid?"bg-emerald-700 rounded-lg text-white h-fit min-h-56   ":"bg-emerald-50 rounded-t-lg md:w-page w-[96vw]"}   `}>
//                {!isGrid&&book?header():null}
//         {book.description && book.description.length>0?<div className='min-h-12 pt-4 p-2'>
//             {/* {book.needsFeedback?<label className='text-emerald-800'>Feedback Request:</label>:null} */}
//             <h6 className={`${isGrid?"text-white":"text-emerald-800"} p-2 open-sans-medium text-left `}>
//                 {book.description}
//             </h6>
//         </div>:null}
       
             
//           <div className={isGrid?' rounded-lg flex justify-between flex-col h-[100%]  pt-1':"rounded-lg"}>
     
//             <Carousel book={book}/>
        
        
//                 {isGrid? <div className='flex flex-row pt-2 justify-between px-3 py-1  rounded-b-lg bottom-0'>
//                 {header()}
            
//                 {bookmarkBtn()} </div>   :null}
//                 </div>
//                 <div>
            
//                 </div>
              
          
              
               
//   </div>
//   </div>
//   </div>
// //  </ErrorBoundary>
//      )}else{
//         return null
//      }

// }


// export default BookDashboardItem