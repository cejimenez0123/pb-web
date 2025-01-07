import React,{ useEffect,useLayoutEffect, useState }  from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import "../styles/MyProfile.css"
import workshop from "../images/icons/workshop.svg"
import {useDispatch,useSelector} from "react-redux"
import { createStory, getMyStories } from '../actions/StoryActions';
import { getMyCollections } from '../actions/CollectionActions';
import notifications from "../images/icons/notifications.svg"
import settings from "../images/icons/settings.svg"
import { getCurrentProfile } from '../actions/UserActions';
import PageIndexList from '../components/page/PageIndexList';
import MediaQuery, { useMediaQuery } from 'react-responsive';
import CollectionIndexList from '../components/collection/CollectionIndexList';
import Paths from '../core/paths';
import ReactGA from "react-ga4"
import {Dialog} from "@mui/material"
import CreateCollectionForm from '../components/collection/CreateCollectionForm';
import checkResult from '../core/checkResult';
import getDownloadPicture from '../domain/usecases/getDownloadPicture';
import ReferralForm from '../components/auth/ReferralForm';
const MediaType = {
    stories:"stories",
    books:"books",
    libraries:"libraries"
}
function MyProfileContainer(props){
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const collections = useSelector(state=>state.books.collections)
    const [books,setBooks]=useState(collections)
 
    const isNotPhone = useMediaQuery({
        query: '(min-width: 600px)'
      })
    const [libraries,setLibraries]=useState([])
    const [openDialog,setOpenDialog]=useState(false)
    const [media,setMedia]=useState(MediaType.stories)
    const location =useLocation()
    const [openRefferal,setOpenRefferal]=useState(false)
    const [pictureUrl,setPictureUrl]=useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s")
    const [list,setList]=useState(<PageIndexList
        />
    )
    useLayoutEffect(()=>{
        location.pathname=Paths.myProfile()
    },[])
    useLayoutEffect( ()=>{
        if(!currentProfile.profilePic.includes("http")){
            getDownloadPicture(currentProfile.profilePic).then(url=>{
               
                setPictureUrl(url)
            })
        }else{
            setPictureUrl(currentProfile.profilePic)
        }
        
        
    },[])
   
    const dispatch = useDispatch()

    const ClickWriteAStory = ()=>{
        ReactGA.event({
            category: "Page",
            action: "Navigate To Editor",
            label: "Write a Story", 
            value: currentProfile.id,
            nonInteraction: false
          });
          
          dispatch(createStory({profileId:currentProfile.id,privacy:true,type:"html",
          title:"",commentable:true
        })).then(res=>checkResult(res,data=>{
    
            navigate(Paths.editPage.createRoute(data.story.id))
        },e=>{

        }))
            
      
        
    }
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
        if(!currentProfile){
            dispatch(getCurrentProfile()).then(res=>console.log("Resd",res))
        }else{
            dispatch(getMyStories({profile:currentProfile}))
            dispatch(getMyCollections({profile:currentProfile}))

        }
    },[])
    useLayoutEffect(()=>{
        if(collections && collections.length>0){
            let libs=collections.filter(col=>{
                return col && col.childCollections && col.childCollections.length>0
            })
            setLibraries(libs)
            let boos = collections.filter(col=>{
                return col && col.childCollections && col.childCollections.length==0
            })
            setBooks(boos)
        }
    },[collections])

   
    
            return(
            <div className='pb-72 pt-8'>
                    <div className='  border-4 border-emerald-300 max-w-[94vw] mx-auto sm:m-h-[30em] sm:max-w-[50em] sm:mx-auto mt-2 py-4 sm:m-4 sm:pb-4 rounded-lg'>
                  
                        <div className='  '>
                            <div className='sm:flex-row  flex-col flex  justify-between pr-0 pt-4'>
                        <img className={"max-w-36 max-h-36  ml-6 rounded-lg"}src={pictureUrl}/>
                     
                            <div className='flex sm:flex-row ml-4 mt-1  w-[100%] justify-between'>
                            <div className='text-left mx-3 mt-3 mb-2 '>
                            <h5 className='sm:text-xl text-emerald-900 font-bold'>{currentProfile.username}</h5>
                            <h6 className='max-h-48 overflow-scroll  text-[0.9rem] sm:text-[0.8rem]  text-emerald-900 '>{currentProfile.selfStatement}</h6>
                            </div>
                            {}
                    
                            <MediaQuery minWidth={'600px'}>
                            <div className='justify-around flex flex-row max-w-[96vw] flex-wrap sm:w-60'>
                                <div>
                                <div onClick={()=>navigate(Paths.workshop.route())}
                                className='bg-emerald-700 rounded-full text-white w-[9rem] text-center py-3 sm:text-[0.8rem] text-bold'>
                                    <h6 className=''>Find a Workshop Group</h6>
                                </div>

                                </div>
                                <div>
                            <div onClick={ClickWriteAStory} className='bg-emerald-500 rounded-full text-white w-[9rem] py-3 text-center sm:text-[0.8rem] text-bold'>
                                <h6 >Write a Story</h6>
                            </div>
                            </div>
                            <div>
                            <div onClick={ClickCreateACollection} className='bg-emerald-500 rounded-full  w-[9rem] text-white sm:text-[0.8rem] py-3   text-bold'>
                                <h6 >Create Collection</h6>
                            </div>
                            </div>
                            <div>
                            <a onClick={()=>setOpenRefferal(true)} className='text-sm mx-4 my-6 text-emerald-800'>Refer Someone?</a>
                            </div>
                            </div> 
                            </MediaQuery>
                           
                            </div>
                            <MediaQuery minWidth={'800px'}>
                            <div className='w-full text-right flex sm:mr-8 flex-row h-12'>
                            <button className=' sm:mr-4 bg-transparent'>
                            <img src={settings}/>
                        </button>
                        <button className=' bg-transparent'>
                            <img 
                            src={notifications}/>
                        </button>
                            </div>
                            </MediaQuery>
                       
                       
                        </div>
                        <div className='text-left mt-2'>
                        <MediaQuery maxWidth={'600px'}>
                            <div className='ml-4 flex  flex-col '>
                            <div className='flex-row  flex  justify-between w-[83%]'>
                                <button onClick={ClickWriteAStory} 
                                className='bg-emerald-500 max-w-48 min-w-[12rem] rounded-full text-white mt-2 sm:text-xl text-bold'>
                                Write a Story
                            </button>
                            <img  onClick={()=>{navigate(Paths.workshop.route())}}className={`bg-emerald-600 rounded-full h-12 mt-1 p-2`}src={workshop} />
                            </div>
                            <button onClick={ClickCreateACollection} className='bg-emerald-700 max-w-48 rounded-full sm:ml-4 mt-4 text-white sm:text-xl  text-bold'>
                                Create Collection
                            </button>
                            <a onClick={()=>setOpenRefferal(true)}className='my-6 text-sm mx-4 text-emerald-800'>Refer Someone?</a>
                            </div>
                            </MediaQuery>
                            </div> 
                            </div>
                            </div>
                            {/*  */}
                            <div className='max-w-[100vw] mx-atuo  flex flex-col justify-center'>

                            <div role="tablist" className="tabs border-emerald-300 mt-8 max-w-[94vw] mx-auto border-b-4 border-emerald-500 min-h-48 rounded-lg  sm:max-w-128 sm:mx-6 tabs-lifted">
  <input type="radio" name="my_tabs_2" role="tab"  defaultChecked className="tab text-emerald-800  sm:max-w-[42em] [--tab-border-color:emerald] bg-transparent   border-l-4 border-r-4 border-t-4 text-xl" aria-label="Pages" />
  <div role="tabpanel" className="tab-content  sm:max-w-[42em] pt-1 sm:py-4 rounded-lg  max-w-[94vw] mx-auto border-l-4 border-t-3 border-t-emerald-500 border-b-4 border-r-4  border-emerald-300 ">
  <PageIndexList/>
  </div>

  <input
    type="radio"
    name="my_tabs_2"
    role="tab"
    className="tab text-emerald-800  sm:max-w-[42em] [--tab-border-color:emerald] bg-transparent   border-l-4 border-r-4 border-t-4 text-xl" aria-label="Books"
    />
  <div role="tabpanel" 
  className="tab-content  sm:max-w-[42em] pt-1 sm:py-4 rounded-lg  max-w-[94vw] mx-auto border-t-3 border-t-emerald-500 border-l-4 border-b-4 border-4-4 border-emerald-300">
  <CollectionIndexList cols={books}/>
  </div>

  <input type="radio" name="my_tabs_2" role="tab" className="tab text-emerald-800  sm:max-w-[42em] [--tab-border-color:emerald] bg-transparent   border-l-3 border-r-3 border-t-3 text-xl" aria-label="Libraries" />
  <div role="tabpanel" className="tab-content  sm:max-w-[42em] pt-1 sm:py-4 rounded-lg  max-w-[94vw] mx-auto border-t-3 border-t-emerald-500 border-l-3 border-b-3 border-r-3  border-emerald-300">
    <CollectionIndexList cols={libraries}/>
  </div>
</div>

</div>
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
            
              open={openDialog}
              onClose={()=>setOpenDialog(false)}>
                <CreateCollectionForm onClose={()=>{
                    setOpenDialog(false)
                }}/>
              </Dialog>
              <Dialog className={
                "bg-emerald-400 bg-opacity-30 w-[100%] md:max-w-[30em] mx-auto overscroll-none"
              }
              PaperProps={{
                style: {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                 overflow:"hidden",
                 height:"100%",
                 width:"60%",
                
                },
              }}
            
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