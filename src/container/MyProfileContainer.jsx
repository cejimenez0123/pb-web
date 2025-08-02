import React,{ useLayoutEffect,useEffect, useState, useContext }  from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import "../styles/MyProfile.css"
import {useDispatch,useSelector} from "react-redux"
import { createStory, getMyStories,updateStory } from '../actions/StoryActions';
import { getMyCollections,setCollections } from '../actions/CollectionActions';
import notifications from "../images/icons/notifications.svg"
import settings from "../images/icons/settings.svg"
import IndexList from '../components/page/IndexList';
import authRepo from '../data/authRepo.js';
import MediaQuery, { useMediaQuery } from 'react-responsive';
import Paths from '../core/paths';
import { debounce, } from 'lodash';
import { setPageInView, setPagesInView, setEditingPage  } from '../actions/PageActions.jsx';
import { initGA,sendGAEvent } from '../core/ga4.js';
// import {Dialog,DialogActions,Button} from "@mui/material"
import Dialog from '../components/Dialog.jsx';
import CreateCollectionForm from '../components/collection/CreateCollectionForm';
import checkResult from '../core/checkResult';
import { PageType } from '../core/constants';
import ProfileInfo from '../components/profile/ProfileInfo';
import usePersistentMyCollectionCache from '../domain/usecases/usePersistentMyCollectionCache';
import Context from '../context';
import FeedbackDialog from '../components/page/FeedbackDialog';
import usePersistentMyStoriesCache from '../domain/usecases/usePersistentMyStoriesCache.jsx';
import ErrorBoundary from '../ErrorBoundary.jsx';
import copyContent from "../images/icons/content_copy.svg"
import DeviceCheck from '../components/DeviceCheck.jsx';
import {  IonText } from '@ionic/react';
import GoogleDrivePicker from '../components/GoogleDrivePicker.jsx';
function MyProfileContainer(props){
  const isNative = DeviceCheck()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useLayoutEffect(()=>{
      initGA()
    },[])
    const {currentProfile,seo,setSeo}=useContext(Context)
    const [search,setSearch]=useState("")
    const [sortAlpha,setSortAlpha]=useState(true)
    const [sortTime,setSortTime]=useState(true)
    const [description,setFeedback]=useState("")
    const [referralLink,setReferralLink]=useState(null)
    const [referral,setReferral]=useState(null)
    const [firstLogin,setFirstLogin]=useState(localStorage.getItem("firstTime")=="true")
    const [openDialog,setOpenDialog]=useState(false)
    const [filterType,setFilterType]=useState("Filter")
    const location =useLocation()
    const filterTypes = {
      filter: "Filter",
      recent:"Recent",
      oldest:"Oldest",
      feedback:"Feedback",
        AZ:"A-Z",
        ZA:"Z-A"
    }
  
    const [ogCols,setOgCols]=useState([])
 
    const [openReferral,setOpenReferral]=useState(false)
    // const stories = usePersistentMyStoriesCache(()=>{
    //   dispatch(setPagesInView({pages:[]}))
    //   return dispatch(getMyStories())
    // })
    
    const pages =useSelector(state=>[...state.pages.pagesInView] ).filter(page=>{
      if(search.toLowerCase()=="untitled"){
        return page.title.length==0
      }
      if(search.length>0){
       return page.title.toLowerCase().includes(search.toLowerCase())
      }else{
       return true
      }
  
     })
  let cols = usePersistentMyCollectionCache(()=>{
    dispatch(setCollections({collections:[]}))
    return dispatch(getMyCollections())
  })
  const collections = useSelector(state=>state.books.collections).filter(col=>{
    if(col){

     if(search.length>0){
      return col.title.toLowerCase().includes(search.toLowerCase())
     }else{
      return true
     }
   }else{
     return true
   }
 
    })
    useEffect(()=>{
      setOgCols(cols)
    },[cols])

 
const handleTimeClick=debounce((truthy)=>{
        
        let newValue = truthy
        setSortTime(newValue)
        handleSortTime(newValue)

},10)
const handleSortAlpha = debounce((sorted)=>{

  let list =collections
let newList = list.sort((a,b)=>{
     
      if(sorted){
          return a.title.toLowerCase() < b.title.toLowerCase()
          
      }else{
             return a.title.toLowerCase() > b.title.toLowerCase()
          }
             
  },5)

  dispatch(setCollections({collections:newList}))

  
const arr = pages.sort((a,b)=>{
      if(sorted){
  
       return a.title.toLowerCase() < b.title.toLowerCase()
 
      }else{
          return a.title.toLowerCase() > b.title.toLowerCase()
      }
  
  })

dispatch(setPagesInView({pages:arr}))
},10)

  const handleSortTime=(sorted)=>{
    
   
    let list = collections
  list = list.sort((a,b)=>{
 
        if(sorted){
            return new Date(a.updated)< new Date(b.updated)  
            }else{
             return new Date(a.updated) > new Date(b.updated)
        }
    })
dispatch(setCollections({collections:list}))

    let newPages = pages
newPages = [...newPages].sort((a,b)=>{

      if(sorted){
          return new Date(a.updated)< new Date(b.updated)
           
            
          }else{
           return new Date(a.updated) > new Date(b.updated)
                  }
  })
  dispatch(setPagesInView({pages:newPages}))
  
}

     
     const [feedbackPage,setFeedbackPage]=useState(null)
    const [books,setBooks]=useState(collections)
    const [libraries,setLibraries]=useState([])

    const handleSearch = (value)=>{
        setSearch(value)
    }
    const isNotPhone = useMediaQuery({
        query: '(min-width: 600px)'
      })
      const isPhone =  useMediaQuery({
        query: '(max-width: 600px)'
      })

   
      
      useLayoutEffect(()=>{
        if(currentProfile){
          let soo = seo
          soo.title = `Plumbum (${currentProfile.username}) Home`
          setSeo(soo)
        }
          
      },[currentProfile])
    // useLayoutEffect(()=>{
    //     location.pathname=Paths.myProfile()
    // },[])
  const handleFeedback=()=>{
   
  let params= structuredClone(feedbackPage,{description:description,needsFeedback:true})
   
params.page = feedbackPage
   
     dispatch(updateStory(params)).then(res=>{
      checkResult(res,payload=>{
          const {story}=payload
        if(payload.story){
        
            navigate(Paths.workshop.createRoute(story.id))
           }

    

 })})}
   
 const copyToClipboard=()=>{
  navigator.clipboard.writeText(referralLink).then(res=>{

    localStorage.setItem("firstTime",null)
    setOpenReferral(false)
    setFirstLogin(false)
    setSuccess('Link Copied to clipboard');
  })
  
    
  

 
}

    const ClickWriteAStory = debounce(()=>{
      if(currentProfile){
        sendGAEvent("Create","Write a Story","Click Write Story")        
          dispatch(createStory({profileId:currentProfile.id,privacy:true,type:PageType.text,
          title:"",commentable:true
        })).then(res=>checkResult(res,payload=>{
            dispatch(setEditingPage({page:payload.story}))
            dispatch(setPageInView({page:payload.story}))
            navigate(Paths.editPage.createRoute(payload.story.id))
        },e=>{

        }))
            
      }},5)
    
        
    const ClickCreateACollection = ()=>{
      sendGAEvent("Create","Create Collection","Create A Collection")

          setOpenDialog(true)
    }

    const generateReferral=()=>{
      authRepo.generateReferral().then(data=>{
        
          if(data.referralLink){
          setReferralLink(data.referralLink)
          }
          if(data.referral){
            setReferral(data.referral)
          }
      })}

    useLayoutEffect(()=>{
if(currentProfile){
      dispatch(setPagesInView({pages:currentProfile.stories}))
     
}
    },[currentProfile])
    useLayoutEffect(()=>{
       debounce(()=>{
      
         if(collections && collections.length>0){
            let libs=collections.filter(col=>{
                return col && col.childCollections && col.childCollections.length>0
            })
            setLibraries(libs)
            let boos = collections.filter(col=>{
                return col && col.childCollections && col.childCollections.length==0
            })
            setBooks(boos)
        }},20)()
    },[collections])

    const handleAlphaClick=(truthy)=>{
      
      setSortAlpha(truthy)
      handleSortAlpha(truthy)

}
const handleSortFeedback=()=>{
  let libs=collections.filter(col=>{
    return col.type=="feedback"
})
dispatch(setCollections({collections:libs}))
}
useEffect(()=>{
 console.log(ogCols)
 console.log(filterType==filterType.filter)
switch (filterType) {
  case filterType.filter:
      dispatch(setCollections({collections:ogCols}));
      break;
  case filterTypes.recent:
      handleSortTime(true);
      break;
  case filterTypes.oldest:
      handleSortTime(false);
      break;
  case filterTypes.feedback:
      handleSortFeedback();
      break;
      case filterTypes.AZ:
        handleSortAlpha(false)
        break;
        case filterTypes.ZA:
          handleSortAlpha(true)
     break;
  default:
    dispatch(setCollections({collections:ogCols}));
      break;
}

},[filterType])

    
            return(
              <ErrorBoundary fallback={"error"}>
            
     <div>
                    <div className=' flex flex-col relative  justify-start md:flex-row md:justify-between md:border-4 md:border-emerald-300  pb-4 max-w-[94vw] mx-auto sm:h-info sm:w-info  sm::mx-auto mt-2  rounded-lg'>
                           <div className='absolute top-1   right-1'>
                           {isNotPhone?
                       <span className=' m-3 pr-4 flex-row flex w-36  justify-evenly'>     
                       <img onClick={()=>navigate(Paths.editProfile.route())}className='bg-emerald-500 rounded-full p-1 mx-3 min-w-8 h-8' src={settings}/>
                   
                    <img   onClick={()=>navigate(Paths.notifications())}   className=' bg-emerald-500  rounded-full p-1 min-w-8 h-8'
                            src={notifications}/>

                      
                          </span>:null}
                           </div>
                           <div className='max-h-[100%] flex'>
                           <div className='p-4' >
                         
                            <div className='my-4 h-[15em]'>
                           <ProfileInfo profile={currentProfile}/>
                           </div>
                        <MediaQuery maxWidth={'600px'}>
                        <div>
                            <div className=' w-[100%] items-center mx-auto grid grid-cols-2 gap-2 '>
                                <div onClick={ClickWriteAStory} 
                                className='bg-emerald-600  flex rounded-full text-white md:mt-2  h-[5em] w-[10em]  md:h-[3em]  text-bold'>
                               <h6 className='my-auto text-[0.8rem] mont-medium md:text-md mx-auto text-center'> Write <br/>a<br/> Story</h6>
                            </div>
                            <div onClick={ClickCreateACollection} className='bg-emerald-700 flex  rounded-full  h-[5em] w-[10em]   text-white   text-bold'>
                              <div className='mx-auto my-auto'><IonText className='text-center mx-auto my-auto text-[0.8rem]' >Create Collection</IonText> </div> 
                            
                            </div>
                            </div>
                            {isPhone?<div>
                              <div className='btn bg-transparent rounded-full  border-emerald-600 mont-medium flex mb-4 mt-2 text-center w-[90%] h-[3rem]'>
                   <IonText  className='mx-auto my-auto text-emerald-900 '           onClick={()=>navigate(Paths.workshop.reader())} 
                                        >
                                    Join a Workshop
                                        </IonText></div>
                                        <GoogleDrivePicker/></div>:null
  
                                        }
                            </div>
                  
                            </MediaQuery>
                      
                            </div>
                            <div className='absolute bottom-[2em] right-[2em] '>

                          {isNotPhone?
                          <div className='flex flex-col'>
                            <span className="mb-4">
                              <div
                              className='bg-transparent border-3 border-green-400 btn mb-4 w-[100%] rounded-full mont-medium  text-center w-[90%] h-[3rem]   '                                       
                               >

                            <IonText   className='text-[1rem] text-emerald-900' onClick={()=>navigate(Paths.workshop.reader())} 
>
                                    Join a Workshop
                                        </IonText>
                                        </div>
                            <GoogleDrivePicker/>
                            </span>
                            <div className='   grid grid-cols-2  gap-1  '>
                          
                              <div onClick={ClickWriteAStory} className='bg-emerald-600 btn rounded-full flex text-white w-[10rem] mont-medium lg:w-[11rem]  lg:h-[4rem] py-3 text-center lg:text-[0.8rem] text-bold'>
                            <h6 className='text-center text-[0.8rem] mx-auto mont-medium my-auto'>Write <br/>a<br/> Story</h6>
                            
                            </div>
                        
                      
                            <div onClick={ClickCreateACollection} className='bg-emerald-500 btn mont-medium rounded-full flex text-white w-[10rem] lg:w-[10rem]  border-emerald-500 border-1 h-[4rem] py-3  text-bold'>
                         <h6 className='text-[0.8rem]'>Create <br/>a<br/> Collection</h6>
                            </div>
                          </div></div>:null}
               </div>
                <div>
                   
 <br/>
          </div>   
  </div>
  </div>
                            <div className='w-[96vw] md:mt-8  flex flex-col mx-auto md:w-page'>
                            {isPhone && (
  <div className="flex flex-nowrap items-center mb-4 mx-auto h-9 max-w-[100vw] pr-4 rounded-full overflow-visible bg-transparent">
    <span className="text-emerald-800 mont-medium mx-2 flex-shrink-0">Search:</span>
    <input
      type="text"
      value={search}
      onChange={e => handleSearch(e.target.value)}
      className="h-9 open-sans-medium px-2 text-sm bg-transparent border-none text-emerald-800 flex-grow min-w-0"
      placeholder="Search..."
    />
    <div className='w-fit'>
    <select
      onChange={e => setFilterType(e.target.value)}
      value={filterType}
      className="select  w-24 text-emerald-800 rounded-full bg-transparent"
    >
      <option value={filterTypes.filter}>Filter</option>
      <option value={filterTypes.recent}>Most Recent</option>
      <option value={filterTypes.oldest}>Oldest</option>
      <option value={filterTypes.feedback}>Feedback</option>
      <option value={filterTypes.AZ}>A-Z</option>
      <option value={filterTypes.ZA}>Z-A</option>
    </select>
    </div>
  </div>
)}



                         
                            <div role="tablist" className="tabs mx-auto w-[100%] items-start ">
                            
  <input type="radio" name="my_tabs_2" role="tab"  defaultChecked className="tab hover:min-h-10  [--tab-bg:transparent] rounded-full mont-medium text-emerald-800 border-3 w-[96vw]  md:w-page    text-md md:text-xl" aria-label="Pages" />
   <div role="tabpanel" className="tab-content  pt-1 lg:py-4  md:w-page w-[96vw]  rounded-lg md:mx-auto  ">
  <IndexList items={pages} handleFeedback={item=>{
    setFeedbackPage(item)
    dispatch(setPageInView({page:item}))
  }}/>
  </div>

  <input
    type="radio"
    name="my_tabs_2"
    role="tab"
    className="tab text-emerald-800 mont-medium rounded-full  mx-auto bg-transparent   [--tab-border-color:emerald]   aria-selected:[--tab-bg:transparent] [--tab-bg:transparent]   border-3  text-md md:text-xl" aria-label="Collections"
    />
  <div role="tabpanel" 
   className="tab-content  pt-1 lg:py-4 rounded-lg   md:w-page w-[96vw]  md:w-page mx-auto rounded-full">
  <IndexList items={collections}/>
  </div>


  {isNotPhone?
  <span className="flex flex-row  items-center gap-1">
  <label
    className={`flex items-center border-2 border-emerald-600 rounded-full px-3 py-1 ${
      search.length === 0 ? 'w-[19em]' : 'w-[20em]'
    }`}
  >
    <span className="text-emerald-800 mr-2 whitespace-nowrap mont-medium">Search:</span>
    <input
      type="text"
      value={search}
      onChange={(e) => handleSearch(e.target.value)}
      className=" w-[9em] overflow-ellipsis bg-transparent rounded-full text-lg text-emerald-800 outline-none"
    />
  </label>

  {/* Only show filters if search is empty */}
  <span className={`${search.length === 0 ? '' : 'hidden'} w-[10em]`}>
    <select
      onChange={(e) => setFilterType(e.target.value)}
      defaultValue={filterType}
      className="w-full px-3 py-2 border-2 border-emerald-600 text-emerald-800 bg-transparent rounded-full text-sm"
    >
      <option value={filterTypes.filter}>Filter</option>
      <option value={filterTypes.recent}>Most Recent</option>
      <option value={filterTypes.oldest}>Oldest</option>
      <option value={filterTypes.feedback}>Feedback</option>
      <option value={filterTypes.AZ}>A-Z</option>
      <option value={filterTypes.ZA}>Z-A</option>
    </select>
  </span>
</span>
:null}
</div>

</div>
{/* </div> */}
<FeedbackDialog

page={feedbackPage}
open={!!feedbackPage} 
isFeedback={true}

handleChange={setFeedback} 
handleFeedback={handleFeedback}
handlePostPublic={()=>{}}
handleClose={()=>{
  navigate(Paths.workshop.createRoute(feedbackPage.id))
}}/>
<Dialog 
          
              isOpen={openDialog}
              onClose={()=>setOpenDialog(false)}
              text={<CreateCollectionForm onClose={()=>{
                    setOpenDialog(false)
                }}/>}/>
        
              <Dialog
               isOpen={firstLogin}
               onClose={()=>{
                localStorage.getItem("firstTime",false)
                setFirstLogin(false)
                setFirstLogin(false)}}
                disagreeText={"Close"}
               title={"Welcome to Plumbum! 🎉"}
              text={<>
              <div className='card  bg-emerald-50 px-4 py-8 overflow-x-hidden h-[100%] md:min-w-72 md:min-h-72'>
        <p class="text-lg text-gray-600 mb-4">You’ve just joined a community built for writers like you—a space to share, connect, and grow with fellow creatives.</p>
        <p class="text-lg text-gray-600 mb-4">To get the best experience, invite your friends so they can keep up with your work and be part of your creative journey.</p>
        
        <div class="text-center">
          
        <span className="rounded-full btn flex mb-4 text-center border-none text-lg mont-medium text-white px-4  bg-gradient-to-r 
from-emerald-400 to-emerald-600 "
onClick={()=>generateReferral()}>
    <h6 >Create Referral Link</h6></span>    
            {referralLink?
            <h6 className='flex-row  min-h-12 flex'><a onClick={copyToClipboard} className='text-nowrap  my-auto overflow-hidden text-ellipsis '>{referralLink}</a>
            <img onClick={copyToClipboard} src={copyContent}  className="btn bg-transparent border-none my-auto icon "/></h6>:null
            }
        </div>
        
        <p class="text-center text-sm text-gray-500 mt-4">Share it with the people who inspire and support your writing! ✨</p>
        </div>
        </>}/>
         
</div>

</ErrorBoundary>
        )
     
        
    }

    

export default MyProfileContainer