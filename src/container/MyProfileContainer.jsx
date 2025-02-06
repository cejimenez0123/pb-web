import React,{ useLayoutEffect,useEffect, useState, useContext }  from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import "../styles/MyProfile.css"
import {useDispatch,useSelector} from "react-redux"
import { createStory, getMyStories,updateStory } from '../actions/StoryActions';
import { getMyCollections,setCollections } from '../actions/CollectionActions';
import notifications from "../images/icons/notifications.svg"
import settings from "../images/icons/settings.svg"
import IndexList from '../components/page/IndexList';

import MediaQuery, { useMediaQuery } from 'react-responsive';
import Paths from '../core/paths';
import { debounce } from 'lodash';
import sortAlphabet from "../images/icons/sort_by_alpha.svg"
import clockArrowUp from "../images/icons/clock_arrow_up.svg"
import clockArrowDown from "../images/icons/clock_arrow_down.svg"
import { setPageInView, setPagesInView, setEditingPage  } from '../actions/PageActions.jsx';
import ReactGA from "react-ga4"

import {Dialog} from "@mui/material"
import CreateCollectionForm from '../components/collection/CreateCollectionForm';
import checkResult from '../core/checkResult';
import ReferralForm from '../components/auth/ReferralForm';
import { PageType } from '../core/constants';
import ProfileInfo from '../components/profile/ProfileInfo';
import usePersistentMyCollectionCache from '../domain/usecases/usePersistentMyCollectionCache';
import Context from '../context';
import DescriptionDialog from '../components/page/FeedbackDialog';
import usePersistentMyStoriesCache from '../domain/usecases/usePersistentMyStoriesCache.jsx';

function MyProfileContainer(props){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {currentProfile}=useContext(Context)
    const [search,setSearch]=useState("")
    const [sortAlpha,setSortAlpha]=useState(true)
    const [sortTime,setSortTime]=useState(true)
    const [description,setFeedback]=useState("")
    const stories = usePersistentMyStoriesCache(()=>{
      dispatch(setPagesInView({pages:[]}))
      return dispatch(getMyStories())
    })
  const cols = usePersistentMyCollectionCache(()=>{
    dispatch(setCollections({collections:[]}))
    return dispatch(getMyCollections())
  })

  const handleSortAlpha=debounce(()=>{
     
   
    let list =collections
  let newList = list.sort((a,b)=>{
       
        if(sortAlpha){
            return a.title.toLowerCase() < b.title.toLowerCase()
            
        }else{
               return a.title.toLowerCase() > b.title.toLowerCase()
            }
               
    })
 
    dispatch(setCollections({collections:newList}))

    let arr = pages
  arr = arr.sort((a,b)=>{
        if(sortAlpha){
    
         return   a.title.toLowerCase() < b.title.toLowerCase()
   
        }else{
            return (a.title.toLowerCase() > b.title.toLowerCase()) 
        }
    
    })

  dispatch(setPagesInView({pages:arr}))
},10)
  const handleSortTime=debounce(()=>{
    
    setSortTime(!sortTime)
    let list = collections
  list = list.sort((a,b)=>{
 
        if(sortTime){
            return new Date(a.created)< new Date(b.created)
             
              
            }else{
             return new Date(a.created) > new Date(b.created)
                    }
    })
dispatch(setCollections({collections:list}))})
    const collections=useSelector(state=>state.books.collections??cols).filter(col=>{
     if(col){
      if(search.toLowerCase()=="feedback"){
        return col.type=="feedback"
      }
      if(search.length>0){
       return col.title.toLowerCase().includes(search.toLowerCase())
      }else{
       return true
      }
    }else{
      return true
    }
  
     })
     
     const [feedbackPage,setFeedbackPage]=useState(null)
    const [books,setBooks]=useState(collections)
    const [libraries,setLibraries]=useState([])
    const pages = useSelector(state=>state.pages.pagesInView??stories).filter(page=>{
     if(search.length>0){
      return page.title.toLowerCase().includes(search.toLowerCase())
     }else{
      return true
     }
 
    })
    const handleSearch = (value)=>{
        setSearch(value)
    }
    const isNotPhone = useMediaQuery({
        query: '(min-width: 600px)'
      })
      const isPhone =  useMediaQuery({
        query: '(max-width: 600px)'
      })

    const [openDialog,setOpenDialog]=useState(false)
  
    const location =useLocation()
   
    const [openRefferal,setOpenRefferal]=useState(false)
      
   
    useLayoutEffect(()=>{
        location.pathname=Paths.myProfile()
    },[])
  const handleFeedback=()=>{
   
  let params= structuredClone(feedbackPage,{description:description,needsFeedback:true})
    //  parameters.description = description
params.page = feedbackPage
   
     dispatch(updateStory(params)).then(res=>{
      checkResult(res,payload=>{
          const {story}=payload
        if(payload.story){
        
            navigate(Paths.workshop.createRoute(story.id))
           }

    

 })})}
   


    const ClickWriteAStory = debounce(()=>{
      if(currentProfile){
        ReactGA.event({
            category: "Page",
            action: "Navigate To Editor",
            label: "Write a Story", 
            value: currentProfile.id,
            nonInteraction: false
          });
          
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
        ReactGA.event({
            category: "Collection",
            action: "Navigate to Create Collection",
            label: "Create A Collection", 
            value: currentProfile.id,
            nonInteraction: false
          });
          setOpenDialog(true)
    }



    useLayoutEffect(()=>{
if(currentProfile){
      dispatch(setPagesInView({pages:currentProfile.stories}))
      // dispatch(setCollections({collections:currentProfile.collections}))
}
    },[currentProfile])
    useLayoutEffect(()=>{
       debounce(()=>{ if(collections && collections.length>0){
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

    const handleAlphaClick=()=>{
        
      let newValue = !sortAlpha
      setSortAlpha(newValue)
      handleSortAlpha()

}
    
            return(
            <div className='md:pb-72 pt-4 md:pt-8'>
     
                    <div className=' flex flex-col relative  justify-start md:flex-row md:justify-between border-4 border-emerald-300  pb-4 max-w-[94vw] mx-auto sm:h-info sm:w-info  sm::mx-auto mt-2  rounded-lg'>
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
                           {currentProfile? <ProfileInfo profile={currentProfile}/>:null}
                           </div>
                        <MediaQuery maxWidth={'600px'}>

                            <div className=' w-[100%] items-center mx-auto grid grid-cols-2 gap-2 '>
                                <div onClick={ClickWriteAStory} 
                                className='bg-emerald-600  flex rounded-full text-white md:mt-2  h-[5em] w-[10em]  md:h-[3em]  text-bold'>
                               <h6 className='my-auto text-[0.8rem] mont-medium md:text-md mx-auto '> Write a Story</h6>
                            </div>
                            <div onClick={ClickCreateACollection} className='bg-emerald-700 flex  rounded-full  h-[5em] w-[10em]   md:h-[3em] text-white   text-bold'>
                              <div className='mx-auto text-[0.8rem] md:text-md my-auto mont-medium  flex-col flex md:flex-row'><h6 className='text-center' >Create Collection</h6> </div> 
                            </div>
                            <div className='w-[10em] h-[3em] mx-auto flex'>
                            <h6 onClick={()=>setOpenRefferal(true)}className='my-auto mx-auto text-sm  mont-medium text-emerald-800'>Refer Someone?</h6>
                            </div>
                            </div>
                            </MediaQuery>
                      
                            </div>
                            <div className='absolute bottom-[2em] right-[3em] '>

                          {isNotPhone?
                            <div className='   grid grid-cols-2  gap-1  '>
                                <div>
                                    <div                    onClick={()=>navigate(Paths.workshop.reader())} 
                                        className='bg-emerald-700 rounded-full mont-medium text-white flex w-[10rem] h-[4rem]  '>
                                    <h6 className='mx-auto lg:text-[0.8rem] px-2 my-auto'> Join a Workshop</h6>
                                        </div>
                                </div> 
                                <div>
                            <div onClick={ClickWriteAStory} className='bg-emerald-600 rounded-full flex text-white w-[10rem] mont-medium lg:w-[10rem]  lg:h-[4rem] py-3 text-center lg:text-[0.8rem] text-bold'>
                            <h6 className='text-center text-[0.8rem] mx-auto mont-medium my-auto'>Write a Story</h6>
                            </div>
                            </div>
                            <div>
                            <div onClick={ClickCreateACollection} className='bg-emerald-500 btn mont-medium rounded-full flex text-white w-[10rem] lg:w-[10rem]  border-emerald-500 border-1 h-[4rem] py-3  text-bold'>
                         <h6 className='text-[0.8rem]'>Create Collection</h6>
                            </div>
                            </div>
                            <div className=' mt-6'> 
                            <h6 onClick={()=>setOpenRefferal(true)} className='text-sm mx-4 mont-medium text-emerald-800'>Refer Someone?</h6>
                            </div>
                            </div> 
                         :null}
                         </div>
                          </div>
                </div>
                <div className='md:w-page mx-auto'> 
                {isPhone? <label className='flex border-emerald-700 border-2 rounded-full mb-1 mt-8 flex-row mx-2'>
<span className='my-auto text-emerald-800 mx-2 w-full mont-medium'> Search:</span>
  <input type='text' value={search} onChange={(e)=>handleSearch(e.target.value)} className=' rounded-full  open-sans-medium px-2 min-w-[19em] py-1 text-sm bg-transparent my-1 rounded-full border-emerald-700 border-1 text-emerald-800' />
  </label>:null}
                            <div className='w-[96vw] md:mt-8 mx-auto flex flex-col md:w-page'>

                         
                            <div role="tablist" className="tabs   grid ">
                            
  <input type="radio" name="my_tabs_2" role="tab"  defaultChecked className="tab hover:min-h-10  [--tab-bg:transparent] rounded-full mont-medium text-emerald-800 border-3 w-[96vw]  md:w-page   text-xl" aria-label="Pages" />
   <div role="tabpanel" className="tab-content  pt-1 lg:py-4 rounded-lg md:mx-auto  w-[96vw] md:w-page  ">
  <IndexList items={pages} handleFeedback={item=>{
    setFeedbackPage(item)
    dispatch(setPageInView({page:item}))
  }}/>
  </div>

  <input
    type="radio"
    name="my_tabs_2"
    role="tab"
    className="tab text-emerald-800 mont-medium rounded-full  mx-auto bg-transparent   [--tab-border-color:emerald]   aria-selected:[--tab-bg:transparent] [--tab-bg:transparent]   border-3 text-xl" aria-label="Books"
    />
  <div role="tabpanel" 
   className="tab-content  pt-1 lg:py-4 rounded-lg  max-w-[96vw] md:w-page md:mx-auto border-l-4  rounded-full   w-[96vw]  md:w-page ">
  <IndexList items={books}/>
  </div>
  <input type="radio" name="my_tabs_2" role="tab" className="tab   bg-transparent  border-3 mx-auto [--tab-bg:emerald] mont-medium text-emerald-800  rounded-full  [--tab-border-color:emerald] border-2  text-xl" aria-label="Libraries" />
  <div role="tabpanel"  className="tab-content  pt-1 lg:py-4 rounded-lg  w-[96vw] mx-auto md:w-page ">
    <IndexList items={libraries}/>
  </div>
  {isNotPhone?  <label className='flex border-emerald-600 border-2 rounded-full my-1 flex-row mx-4 '>
<span className='my-auto text-emerald-800 mx-2 w-full mont-medium '> Search</span>
  <input type='text' value={search} onChange={(e)=>handleSearch(e.target.value)} className=' px-2   w-full min-w-58 py-1 text-sm bg-transparent my-1  text-emerald-800' />
  </label>:null}
</div>

</div>
</div>
<DescriptionDialog

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
              open={openRefferal}
              onClose={()=>setOpenRefferal(false)}>
          <ReferralForm onClose={()=>{
            setOpenRefferal(false)
          }}/>
              </Dialog>
</div>
             

        )
     
        
    }

    

export default MyProfileContainer