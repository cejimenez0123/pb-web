import React,{ useLayoutEffect, useState }  from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import "../styles/MyProfile.css"
import workshop from "../images/icons/workshop.svg"
import {useDispatch,useSelector} from "react-redux"
import { createStory, getMyStories } from '../actions/StoryActions';
import { getMyCollections } from '../actions/CollectionActions';
import notifications from "../images/icons/notifications.svg"
import settings from "../images/icons/settings.svg"
import { getCurrentProfile } from '../actions/UserActions';
import IndexList from '../components/page/IndexList';
import MediaQuery, { useMediaQuery } from 'react-responsive';
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
    const pages = useSelector(state=>state.pages.pagesInView)
    const isNotPhone = useMediaQuery({
        query: '(min-width: 600px)'
      })
    const [libraries,setLibraries]=useState([])
    const [openDialog,setOpenDialog]=useState(false)
    const [media,setMedia]=useState(MediaType.stories)
    const location =useLocation()
    const [openRefferal,setOpenRefferal]=useState(false)
    const [pictureUrl,setPictureUrl]=useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s")
    const [list,setList]=useState([]
    )
    useLayoutEffect(()=>{
        location.pathname=Paths.myProfile()
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
const ProfleInfo = ({profile})=>{
    const [pictureUrl,setPictureUrl]=useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s")
    
    useLayoutEffect( ()=>{

        if(!profile.profilePic.includes("http")){
            getDownloadPicture(currentProfile.profilePic).then(url=>{
               
                setPictureUrl(url)
            })
        }else{
            setPictureUrl(profile.profilePic)
        }
        
        
    },[profile])
    return (                           
    <div className='flex-row   mx-auto  flex    '>
    <img className={" min-w-24 overflow-hidden mx-2 h-24 lg:w-36 lg:h-36  sm:ml-6 rounded-full lg:rounded-lg"}src={pictureUrl}/>
 

        <div className='text-left sm:mx-3 mb-2 h-48 flex flex-col '>
        <h5 className='sm:text-xl text-emerald-900 font-bold'>{profile.username}</h5>
       <div className='w-[100%] max-w-[20em] text-left '>
        <h6 className='sm:max-h-48  sm:w-60 text-[0.8rem] sm:text-[0.8rem]  text-emerald-900 '>
            {currentProfile.selfStatement}</h6></div> 
   =
        </div></div>)
}
   
    
            return(
            <div className='md:pb-72 pt-4 sm:pt-8'>
     
                    <div className=' flex flex-col relative  justify-start sm:flex-row sm:justify-between border-4 border-emerald-300  pb-4 max-w-[94vw] mx-auto lg:h-[16em]  lg:max-w-[50em]   sm:mx-auto mt-2  rounded-lg'>
                           <div className='absolute top-1   right-1'>
                           {isNotPhone?
                       <span className=' m-3 pr-4 flex-row flex w-36  justify-evenly'>     
                       <img className='bg-emerald-500 rounded-full p-1 mx-3 min-w-8 h-8' src={settings}/>
                   
                    <img      className=' bg-emerald-500  rounded-full p-1 min-w-8 h-8'
                            src={notifications}/>

                      
                          </span>:null}
                           </div>
                           <div className='max-h-[100%] flex'>
                           <div className='flex flex-col lg:flex-row lg:px-8 mx-auto mt-4 '>
                            
                            <ProfleInfo profile={currentProfile}/>
                          
                        <MediaQuery maxWidth={'600px'}>

                            <div className=' w-[86%] mx-auto grid grid-cols-2 gap-2 '>
                                <div onClick={ClickWriteAStory} 
                                className='bg-emerald-500  flex rounded-full text-white md:mt-2  h-[5em] w-[8em] md:w-[10em] md:h-[3em]  text-bold'>
                               <h6 className='my-auto text-md mx-auto '> Write a Story</h6>
                            </div>
                            <div onClick={ClickCreateACollection} className='bg-emerald-700 flex  rounded-full  h-[5em] w-[8em]  md:w-[10em] md:h-[3em] text-white   text-bold'>
                              <div className='mx-auto text-md md:text-l my-auto flex-col flex md:flex-row'><h6 >Create </h6><h6>Collection</h6> </div> 
                            </div>
                            <div className='w-[10em] h-[3em] mx-auto flex'>
                            <h6 onClick={()=>setOpenRefferal(true)}className='my-auto mx-auto text-sm  text-emerald-800'>Refer Someone?</h6>
                            </div>
                            </div>
                            </MediaQuery>
                      
                            </div>
                            <div className='absolute bottom-[2em] right-[3em] '>

                          {isNotPhone?
                            <div className='   grid grid-cols-2  gap-1  '>
                                <div>
                                    <div                                 className='bg-emerald-700 rounded-full text-white flex w-[9rem] h-[4rem]  '>
                                    <h6 className='mx-auto lg:text-[0.8rem] px-2 my-auto'> Join a Workshop</h6>
                                        </div>
                                </div> 
                                <div>
                            <div onClick={ClickWriteAStory} className='bg-emerald-500 rounded-full flex text-white w-[8rem] lg:w-[9rem]  lg:h-[4rem] py-3 text-center lg:text-[0.8rem] text-bold'>
                            <h6 className='text-center lg:text-[0.8rem] px-2 mx-auto my-auto'>Write a Story</h6>
                            </div>
                            </div>
                            <div>
                            <div onClick={ClickCreateACollection} className='bg-emerald-500 rounded-full flex text-white w-[9rem]  h-[4rem] py-3 text-center lg:text-[0.8rem] text-bold'>
                            <h6 className='text-center  lg:text-[0.8rem] px-2 mx-auto my-auto'>Create Collection</h6>
                            </div>
                            </div>
                            <div className=' mt-6'> 
                            <h6 onClick={()=>setOpenRefferal(true)} className='text-sm mx-4 text-emerald-800'>Refer Someone?</h6>
                            </div>
                            </div> 
                         :null}
                         </div>
                          </div>
                </div>
                            <div className='w-[96vw] mt-8 mx-auto md:w-[42em]'>

                            <div role="tablist" className="tabs border-emerald-300  mx-auto border-b-4 border-emerald-500  rounded-lg w-[96vw] mx-auto md:w-[42em]  tabs-lifted">
  <input type="radio" name="my_tabs_2" role="tab"  defaultChecked className="tab text-emerald-800 border-3 border-3 w-[96vw] mx-auto md:w-[42em] [--tab-border-color:emerald] bg-transparent   border-l-4 border-r-4 border-t-4 text-xl" aria-label="Pages" />
  <div role="tabpanel" className="tab-content  pt-1 lg:py-4 rounded-lg  mx-auto border-l-4 border-t-3 border-t-emerald-500 border-b-4 border-r-4 w-[96vw] mx-auto md:w-[42em] border-emerald-300 ">
  <IndexList items={pages}/>
  </div>

  <input
    type="radio"
    name="my_tabs_2"
    role="tab"
    className="tab text-emerald-800   [--tab-border-color:emerald] bg-transparent   border-3 text-xl" aria-label="Books"
    />
  <div role="tabpanel" 
   className="tab-content  pt-1 lg:py-4 rounded-lg  mx-auto border-l-4 border-t-3 border-t-emerald-500 border-b-4 border-r-4 w-[96vw] mx-auto md:w-[42em] border-emerald-300 ">
  <IndexList items={books}/>
  </div>
  <input type="radio" name="my_tabs_2" role="tab" className="tab border-3 text-emerald-800   [--tab-border-color:emerald] bg-transparent border-l-4 border-r-4 border-t-4 text-xl" aria-label="Libraries" />
  <div role="tabpanel"  className="tab-content  pt-1 lg:py-4 rounded-lg  mx-auto border-l-4 border-t-3 border-t-emerald-500 border-b-4 border-r-4 w-[96vw] mx-auto md:w-[42em] border-emerald-300 ">
    <IndexList items={libraries}/>
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
                "bg-emerald-400 bg-opacity-80 w-[100%] md:max-w-[30em] mx-auto overscroll-none"
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