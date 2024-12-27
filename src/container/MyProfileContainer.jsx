import React,{ useEffect,useLayoutEffect, useState }  from 'react';
import { useNavigate} from 'react-router-dom';
import "../styles/MyProfile.css"
import {useDispatch,useSelector} from "react-redux"
import { createStory, getMyStories } from '../actions/StoryActions';
import { getMyCollections } from '../actions/CollectionActions';
import notifications from "../images/icons/notifications.svg"
import settings from "../images/icons/settings.svg"
import { getCurrentProfile } from '../actions/UserActions';
import PageIndexList from '../components/page/PageIndexList';
import MediaQuery from 'react-responsive';
import CollectionIndexList from '../components/collection/CollectionIndexList';
import Paths from '../core/paths';
import ReactGA from "react-ga4"
import {Dialog} from "@mui/material"
import CreateCollectinForm from '../components/collection/CreateCollectionForm';
import checkResult from '../core/checkResult';
import { setPageInView } from '../actions/PageActions';
import UseCaseDownloadPicture from '../domain/usecases/getDownloadPicture';
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
    const [libraries,setLibraries]=useState(collections.filter(col=>col.collectionIdList>0))
    const [openDialog,setOpenDialog]=useState(false)
    const [media,setMedia]=useState(MediaType.stories)
    const [openRefferal,setOpenRefferal]=useState(false)
    const [pictureUrl,setPictureUrl]=useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s")
    const [list,setList]=useState(<PageIndexList
        />
    )
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
          title:"Untitled",commentable:true
        })).then(res=>checkResult(res,data=>{
            dispatch(setPageInView({page:data.story}))
            navigate(Paths.editPage.createRoute(data.story.id))
        },e=>{

        }))
            
      
        
    }
    const ClickCreateAColleciton = ()=>{
        ReactGA.event({
            category: "Colleciton",
            action: "Navigate to Create Collection",
            label: "Create A Colleciton", 
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
            <div className=''>
                    <div className=' w-full border-2 py-4 sm:m-4 sm:pb-4 rounded-lg'>
                  
                        <div>
                            <div className='sm:flex-row flex-col flex  pr-0 pt-4'>
                        <img className={"max-w-36 max-h-36 ml-6 rounded-lg"}src={pictureUrl}/>
                     
                            <div className='flex sm:flex-row ml-4 mt-1  w-[100%] justify-between'>
                            <div className='text-left '>
                            <h5 className='text-xl font-bold'>{currentProfile.username}</h5>
                            <h6 className='max-h-48 overflow-scroll text-l'>{currentProfile.selfStatement}</h6>
                           
                            <MediaQuery minWidth={'600px'}>
                            <div className='mt-4 pt-2 flex flex-row'>
                            <button onClick={ClickWriteAStory} className='bg-green-600 text-white  sm:text-xl text-bold'>
                                Write a Story
                            </button>
                           
                            <button onClick={ClickCreateAColleciton} className='bg-green-600 md:ml-4 text-white sm:text-xl  text-bold'>
                                Create Collection
                            </button>
                            <a onClick={()=>setOpenRefferal(true)} className='text-sm mx-4 my-4 text-white'>Refer Someone?</a>
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
                        </div>
                        <div className='text-left mt-2'>
                        <MediaQuery maxWidth={'600px'}>
                            <div className='ml-4 flex  flex-col '>
                            <button onClick={ClickWriteAStory} className='bg-green-600 max-w-48 text-white mt-2 sm:text-xl text-bold'>
                                Write a Story
                            </button>
                            <button onClick={ClickCreateAColleciton} className='bg-green-600 max-w-48 sm:ml-4 mt-2 text-white sm:text-xl  text-bold'>
                                Create Collection
                            </button>
                            <a onClick={()=>setOpenRefferal(true)}className='my-4 text-sm mx-4 text-white'>Refer Someone?</a>
                            </div>
                            </MediaQuery>
                            </div> 
                            </div>
                            </div>
                            <div role="tablist" className="tabs mt-8 shadow-md min-h-48 rounded-lg  sm:max-w-128 sm:mx-6 tabs-lifted">
  <input type="radio" name="my_tabs_2" role="tab"  defaultChecked className="tab shadow-sm  border-l-2 border-r-2 border-t-2 bg-transparent text-white text-xl" aria-label="Pages" />
  <div role="tabpanel" className="tab-content max-w-[100svw] pt-1  sm:max-w-[42rem] md:p-6">
  <PageIndexList/>
  </div>

  <input
    type="radio"
    name="my_tabs_2"
    role="tab"
    className="tab text-white bg-transparent  border-emerald-600 border-l-2 border-r-2 border-t-2 shadow-sm text-xl"
    aria-label="Books"
    />
  <div role="tabpanel" className="tab-content bg-transparent sm:max-w-[42rem]   rounded-box pt-1">
  <CollectionIndexList cols={books}/>
  </div>

  <input type="radio" name="my_tabs_2" role="tab" className="tab text-white bg-transparent border-emerald-600 border-l-2 border-r-2 border-t-2   shadow-sm text-xl" aria-label="Libraries" />
  <div role="tabpanel" className="tab-content pt-1 bg-transparent sm:max-w-[42rem]   rounded-box ">
    <CollectionIndexList cols={libraries}/>
  </div>
</div>
<Dialog className={
                "bg-emerald-400 overscroll-none"
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
                <CreateCollectinForm onClose={()=>{
                    setOpenDialog(false)
                }}/>
              </Dialog>
              <Dialog className={
                "bg-emerald-400 w-[100%] md:max-w-[30em] mx-auto overscroll-none"
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