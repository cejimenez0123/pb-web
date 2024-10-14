import React,{ useEffect, useState }  from 'react';
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
import storyRepo from '../data/storyRepo';
import checkResult from '../core/checkResult';
const MediaType = {
    stories:"stories",
    books:"books",
    libraries:"libraries"
}
function MyProfileContainer(props){
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [books,setBooks]=useState([])
    const [libraries,setLibraries]=useState([])
    const [media,setMedia]=useState(MediaType.stories)
    const [list,setList]=useState(<PageIndexList
        />
    )
    const collections = useSelector(state=>state.books.collections)
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
    }
    const dispatch = useDispatch()

    useEffect(()=>{
        if(!currentProfile){
            dispatch(getCurrentProfile()).then(res=>console.log("Resd",res))
        }else{
            dispatch(getMyStories({profile:currentProfile}))
            dispatch(getMyCollections({profile:currentProfile})).then(res=>{
       
            })
        }
    },[])
    useEffect(()=>{
        if(collections && collections.length>0){
            let libs=collections.filter(col=>{
                return col && col.collectionIdList && col.collectionIdList.length>0
            })
            setLibraries(libs)
            let boos = collections.filter(col=>{
                return col && col.collectionIdList && col.collectionIdList.length==0
            })
            setBooks(boos)
        }
    },[collections])

   
    const handleChange=(med)=>{
        
        setMedia(med)
       
    }
    
            return(
            <div className=''>
                    <div className='bg-dark w-full shadow-md m-4 pb-4 rounded-lg'>
                  
                        <div>
                            <div className='flex-row flex w-full w-[100%] pr-0 pt-4'>
                        <img className={"w-36 h-36 ml-6 rounded-lg"}src={currentProfile.profilePic}/>
                     
                            <div className='flex flex-row ml-4 mt-1  w-[100%] justify-between'>
                            <div className='text-left'>
                            <h5 className='text-xl font-bold'>{currentProfile.username}</h5>
                            <p>{currentProfile.selfStatement}</p>
                            <div className='mt-4 pt-2'>
                            <MediaQuery minWidth={'800px'}>
                            <button onClick={ClickWriteAStory} className='bg-green-600 text-white  text-xl text-bold'>
                                Write a Story
                            </button>
                           
                            <button onClick={ClickCreateAColleciton} className='bg-green-600 md:ml-4 text-white text-xl  text-bold'>
                                Create Collection
                            </button>
                            </MediaQuery>
                            </div> 
                            </div>
                            <div className='w-full text-right'>
                            <button className='bg-dark'>
                            <img src={settings}/>
                        </button>
                        <button className='bg-dark'>
                            <img 
                            src={notifications}/>
                        </button>
                            </div>
                        
                       
                        </div>
                        </div>
                        <div className='text-left mt-6'>
                        <MediaQuery maxWidth={'800px'}>
                            <div className='ml-4'>
                            <button onClick={ClickWriteAStory} className='bg-green-600 text-white  text-xl text-bold'>
                                Write a Story
                            </button>
                            <button onClick={ClickCreateAColleciton} className='bg-green-600 ml-4 text-white text-xl  text-bold'>
                                Create Collection
                            </button>
                            </div>
                            </MediaQuery>
                            </div> 
                            </div>
                            </div>
                            <div role="tablist" className="tabs bg-[#5656569a] w-128  shadow-md rounded-lg  mx-6 tabs-lifted">
  <input type="radio" name="my_tabs_2" role="tab"  className="tab shadow-sm bg-dark text-white text-xl" aria-label="Pages" />
  <div role="tabpanel" className="tab-content w-128 bg-dark border-base-300  rounded-box p-6">
  <PageIndexList/>
  </div>

  <input
    type="radio"
    name="my_tabs_2"
    role="tab"
    className="tab text-white bg-dark shadow-sm text-xl"
    aria-label="Books"
    defaultChecked />
  <div role="tabpanel" className="tab-content  max-w-128 bg-dark border-base-300 rounded-box p-6">
  <CollectionIndexList cols={books}/>
  </div>

  <input type="radio" name="my_tabs_2" role="tab" className="tab text-white bg-dark border-white shadow-sm text-xl" aria-label="Libraries" />
  <div role="tabpanel" className="tab-content  bg-dark border-base-300 rounded-box p-6">
    <CollectionIndexList cols={libraries}/>
  </div>
</div>
</div>
             

        )
     
        
    }

    

export default MyProfileContainer