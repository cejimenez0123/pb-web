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
import sortAlphabet from "../images/icons/sort_by_alpha.svg"
import clockArrowUp from "../images/icons/clock_arrow_up.svg"
import clockArrowDown from "../images/icons/clock_arrow_down.svg"
import { setPageInView, setPagesInView, setEditingPage  } from '../actions/PageActions.jsx';
import { initGA,sendGAEvent } from '../core/ga4.js';
import {Dialog,DialogActions,Button} from "@mui/material"
import CreateCollectionForm from '../components/collection/CreateCollectionForm';
import checkResult from '../core/checkResult';
import ReferralForm from '../components/auth/ReferralForm';
import { PageType } from '../core/constants';
import ProfileInfo from '../components/profile/ProfileInfo';
import usePersistentMyCollectionCache from '../domain/usecases/usePersistentMyCollectionCache';
import Context from '../context';
import FeedbackDialog from '../components/page/FeedbackDialog';
import usePersistentMyStoriesCache from '../domain/usecases/usePersistentMyStoriesCache.jsx';
import ErrorBoundary from '../ErrorBoundary.jsx';
import copyContent from "../images/icons/content_copy.svg"
import DeviceCheck from '../components/DeviceCheck.jsx';
import { IonButton, IonText } from '@ionic/react';
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
    const stories = usePersistentMyStoriesCache(()=>{
      dispatch(setPagesInView({pages:[]}))
      return dispatch(getMyStories())
    })
    
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
             
  })

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
            return new Date(a.created)< new Date(b.created)
             
              
            }else{
             return new Date(a.created) > new Date(b.created)
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
            
      }},20)
    
        
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
                       <img className='bg-emerald-500 rounded-full p-1 mx-3 min-w-8 h-8' src={settings}/>
                   
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
                               <h6 className='my-auto text-[0.8rem] mont-medium md:text-md mx-auto '> Write a Story</h6>
                            </div>
                            <div onClick={ClickCreateACollection} className='bg-emerald-700 flex  rounded-full  h-[5em] w-[10em]   md:h-[3em] text-white   text-bold'>
                              <div className='mx-auto text-[0.8rem] md:text-md  mont-medium   mt-8  mx-auto flex-col flex md:flex-row'><h6 className='text-center' >Create a Collection</h6> </div> 
                            
                            </div>
                            </div>
                            {isNative?<div><IonButton                  onClick={()=>navigate(Paths.workshop.reader())} 
                                        className='bg-emerald-700  text-white border-emerald-600  rounded-full mont-medium  text-center w-[90%] h-[3rem]   '>
                                    Join a Workshop
                                        </IonButton>
                                        <GoogleDrivePicker/></div>:<><IonButton
            // onClick={navigateToWorkshop}
            onClick={()=>navigate(Paths.workshop.reader())} 
            className="bg-emerald-700 flex rounded-full mont-medium my-8 h-[5rem]"
            style={{ width: '90%' }} // Adjusting width to match the original
        >
            <h6 className="mx-auto lg:text-[1rem] text-white font-bold my-auto">Join a Workshop</h6>
        </IonButton>
                                        
                                        <div                   
                                        className='bg-emerald-700 flex rounded-full mont-medium my-8 -[90%] h-[5rem]  '>
                                    <h6 className='mx-auto lg:text-[1rem] text-white text-bold my-auto'> Join a Workshop</h6>
                                        </div>
                                        </>}
                            </div>
                  
                            </MediaQuery>
                      
                            </div>
                            <div className='absolute bottom-[2em] right-[2em] '>

                          {isNotPhone?
                          <div className='flex flex-col'>
                            <span className="mb-4">
                              <div
                              className='bg-emerald-200 btn mb-4 w-[100%] rounded-full mont-medium  text-center w-[90%] h-[3rem]   '                                       
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
                              {isPhone?<span className="flex   mb-2 flex-row"> 
                <label className='flex my-auto border-emerald-600  w-[100%] border-opacity-70 border-2 min-h-10 rounded-full  mt-8 flex-row mx-2'>
<span className='my-auto text-emerald-800 mx-2 w-full mont-medium'> Search:</span>
  <input type='text' value={search} onChange={(e)=>handleSearch(e.target.value)} className=' rounded-full  open-sans-medium px-2 w-[100%] py-1 text-sm bg-transparent my-1 rounded-full border-emerald-700 border-1 text-emerald-800' />
  </label><span className=" mx-1  w-24 flex  items-end pb-2 justify-evenly flex-row">

   </span></span>:null}
 <br/>
          </div>   
  </div>
  </div>
                            <div className='w-[96vw] md:mt-8  flex flex-col mx-auto md:w-page'>

                         
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
 {isPhone?<div className=''>

  <select  onChange={(e)=>{
    setFilterType(e.target.value)
  }} defaultValue={filterType} className="select bg-transparent  text-emerald-800 border-2 border-emerald-600 rounded-full mx-3">
    <option value={filterTypes.filter}>Filter</option>
    <option value={filterTypes.recent}>Most Recent</option>
    <option value={filterTypes.oldest}>Oldest</option>
    <option value={filterTypes.feedback}>Feeback</option>
    <option value={filterTypes.AZ}>A-Z</option>
    <option value={filterTypes.ZA}>Z-A</option>
  </select>

{/* </fieldset>   */}
<div></div>
{/* </span> */}
</div>:null}

  {isNotPhone? <span className='flex flex-row'> <label className={`flex border-emerald-600 border-2 rounded-full my-1 ${search.length==0?"w-[14em]":"w-[20em]"} flex-row mx-4 `}>
<span className='my-auto text-emerald-800 mx-2 w-full mont-medium '> Search</span>
  <input type='text' value={search}  onChange={(e)=>handleSearch(e.target.value)} className=' px-2 w-[100%] py-1 rounded-full text-sm bg-transparent my-1  text-emerald-800' />
  </label>
  <span className={`${search.length==0?"":"hidden"} mx-1  w-24 flex  items-end pb-4 justify-evenly flex-row`}>

  <select  onChange={(e)=>{
    setFilterType(e.target.value)
  }} defaultValue={filterType} className="select bg-transparent  text-emerald-800 border-2 border-emerald-600 rounded-full mx-3">
    <option value={filterTypes.filter}>Filter</option>
    <option value={filterTypes.recent}>Most Recent</option>
    <option value={filterTypes.oldest}>Oldest</option>
    <option value={filterTypes.feedback}>Feeback</option>
    <option value={filterTypes.AZ}>A-Z</option>
    <option value={filterTypes.ZA}>Z-A</option>
  </select>
   </span></span>:null}
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
<Dialog className={
                "bg-emerald-400 bg-opacity-30 "
              }
              PaperProps={{
                style: {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                 overflow:"hidden",
                 height:"100%",
                 width:"100%",
                
                },
              }}
            fullScreen={isPhone}
              open={openDialog}
              onClose={()=>setOpenDialog(false)}>
                <CreateCollectionForm onClose={()=>{
                    setOpenDialog(false)
                }}/>
              </Dialog>
        
              <Dialog
               fullScreen={isPhone}
               open={firstLogin}
               onClose={()=>{
                setFirstLogin(false)
               }}
              >
                <div className='card  bg-emerald-50 px-4 py-8 overflow-x-hidden h-[100%] md:min-w-72 md:min-h-72'>
                <h1 class="text-2xl font-bold text-center text-gray-800 mb-4">Welcome to Plumbum! 🎉</h1>
        <p class="text-lg text-gray-600 mb-4">You’ve just joined a community built for writers like you—a space to share, connect, and grow with fellow creatives.</p>
        <p class="text-lg text-gray-600 mb-4">To get the best experience, invite your friends so they can keep up with your work and be part of your creative journey.</p>
        
        <div class="text-center">
          
        <span className="rounded-full btn flex mb-4 text-center border-none text-lg mont-medium text-white px-4  bg-gradient-to-r 
from-emerald-400 to-emerald-600 "
onClick={()=>generateReferral()}>
    <h6 >Create Referral Link</h6></span>    
            {referralLink?
            <h6 className='flex-row  min-h-12 flex'><a onClick={copyToClipboard} className='text-nowrap  my-auto overflow-hidden text-ellipsis '>{referralLink}</a>
            <img onClick={copyToClipboard} src={copyContent}  className="btn bg-transparent border-none my-auto icon "/></h6>
            :null}
        </div>
        
        <p class="text-center text-sm text-gray-500 mt-4">Share it with the people who inspire and support your writing! ✨</p>
               <DialogActions>
         
        <Button onClick={()=>{
          localStorage.getItem("firstTime",false)
          setFirstLogin(false)}} ><span className="mont-medium">Close</span></Button>
     
               </DialogActions>
                </div>
              </Dialog>
</div>

</ErrorBoundary>
        )
     
        
    }

    

export default MyProfileContainer