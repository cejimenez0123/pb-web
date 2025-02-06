

import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import {registerUser,postActiveUser,createWorkshopGroup} from "../../actions/WorkshopActions"
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import checkResult from '../../core/checkResult';
import { useNavigate, useParams } from 'react-router-dom';
import Paths from '../../core/paths';
import { getStory } from '../../actions/StoryActions';
import PageWorkshopItem from '../page/PageWorkshopItem';
import loadingAnimation from "../../images/loading.gif"
import InfoTooltip from '../../components/InfoTooltip';

import Context from '../../context';
const WorkshopContainer = (props) => {
  const pathParams = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const page = useSelector(state=>state.pages.pageInView)
  const [loading,setLoading]=useState(false)
  const {error,setError,setSuccess}=useContext(Context)

  const [radius,setRadius]=useState(50)
  const [location,setLocation]=useState(null)
  const currentProfile = useSelector(state=>state.users.currentProfile)
  const [isGlobal,setIsGlobal]=useState(true)
  
  useEffect(()=>{
   if(isGlobal){
    setLocation(null)
   }
  
  },[isGlobal])
  useEffect(()=>{
setTimeout(()=>{

    setError(null)
  setSuccess(null)
  
 
},4001)
  },[error])
  useEffect(()=>{

  })
  useEffect(()=>{
    if(currentProfile){
      
      
      dispatch(postActiveUser({story:page,profile:currentProfile})).then(res=>{
          checkResult(res,payload=>{
            if(payload.profiles){
              setError(null)

              setSuccess(payload.profiles.length+" Users Active")
              setLoading(false)
            }
          },err=>{
            setSuccess(null) 
            setError("Error getting active users")
          setLoading(false)
          })
      })

    }
  },[page,currentProfile])
  useEffect(()=>{
  
},[isGlobal])
  useLayoutEffect(()=>{
  
    const {pageId}=pathParams
    if(pageId){
      dispatch(getStory({id:pageId}))
    }
  
  },[pathParams.pageId])

  useEffect(()=>{
    if(currentProfile){
      registerUser(currentProfile.id,location)
    }

  },[currentProfile,location])
  const requestLocation=()=>{
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        if(currentProfile){
          registerUser(currentProfile.id,location)
        }
    
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.log("location error")
        setError("We use location to conect with you fellow writers. Reload for access.");
        setLoading(false);
  
      }
    );
  }
  const handleGlobal = () => {
   setIsGlobal(!isGlobal)
   if(isGlobal){
    requestLocation()
   }
  };
  const handleGroupClick=()=>{
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    if(pathParams.pageId && page){
        dispatch(createWorkshopGroup({profile:currentProfile,story:page,isGlobal,location})).then(res=>{
      checkResult(res,payload=>{
        if(payload && payload.collection){
          setLoading(false)
          navigate(Paths.collection.createRoute(payload.collection.id))
        }
        if(payload.error){
          setError(payload.error.message)
          setSuccess(null)
          setLoading(false)
        }
         
      },err=>{
        setLoading(false)
        setError(err.message)
        setSuccess(null)
      })
    })
  }else{
    dispatch(createWorkshopGroup({profile:currentProfile,story:null,isGlobal,location})).then(res=>{
      checkResult(res,payload=>{
        if(payload && payload.collection){
          setLoading(false)
          navigate(Paths.collection.createRoute(payload.collection.id))
        }
        if(payload.error){
          setError(payload.error.message)
          setSuccess(null)
          setLoading(false)
        }
         
      },err=>{
        setLoading(false)
        setError(err.message)
        setSuccess(null)
      })
    })
  }
  
  }

  return (
    <div>

      {currentProfile?(
        <div className="text-emerald-800 mx-auto w-[92vw] shadow-sm sm:min-h-[30em] mt-20 flex flex-col  border-2 text-left sm:w-[20rem] border-emerald-600 p-4    rounded-lg ">
       <div>
     <h2 className='text-xl my-8 font-bold '> {currentProfile.username}</h2></div>
     <div className='flex flex-row justify-start'>
     <InfoTooltip text="Do you want to find users local to your area or around the world?" />
     <label className='flex w-[100%] flex-row justify-between'><h6 className='mont-medium text-xl'> Go Global</h6> <input checked={isGlobal} type="checkbox"  onChange={handleGlobal}  className='toggle bg-white bg-slate-400'/></label>

</div>


        {!isGlobal?<label className='border-1 mb-4 mt-8 border-2 border-emerald-800 flex flex-row p-2 number border-emerald-600 rounded-full   '>
          <h6 className='text-xl my-auto ml-4'>Radius:</h6>
     
       
        <input type={"number"} 
        value={radius}
        onChange={(e)=>{
          setRadius(e.target.value)
        }}
        className="input my-auto max-w-36 text-xl text-emerald-800 bg-transparent "/>km</label>:null}
  {page?<PageWorkshopItem page={page}/>:null}
  
   
      <div  className="bg-emerald-700 flex text-white mt-8 rounded-full"
      onClick={handleGroupClick} ><h6 className='mx-auto lg:text-xl  mont-medium p-6 my-auto'>Join a Workshop</h6>
    </div>       <div className='w-fit flex justify-center p-8'>     
  {loading?<img src={loadingAnimation} className='max-w-24 mx-auto p-6 max-h-24 '/>:null}
  </div>
  </div>

):<div className='text-emerald-800 mx-auto w-[92vw] shadow-sm sm:h-[30em] mt-20 flex flex-col  border-2 text-left sm:w-[20rem] border-emerald-600 p-4  skeleton bg-slate-100  rounded-lg '/>}

    </div>
  );
};
export default WorkshopContainer