

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
import Alert from '../../components/Alert';
import Context from '../../context';
const WorkshopContainer = (props) => {
  const pathParams = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const page = useSelector(state=>state.pages.pageInView)
  const [loading,setLoading]=useState(true)
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
        <div className="text-emerald-800 mx-auto w-[92vw] shadow-sm sm:h-[30em] mt-20 flex flex-col  border-2 text-left sm:w-[20rem] border-emerald-600 p-4    rounded-lg ">
       <div>
     <h2 className='text-xl my-8 font-bold '> {currentProfile.username}</h2></div>
     <label className='flex flex-row justify-between'><div className='flex flex-row'><InfoTooltip text="Do you want to find users local to your area or around the world?" /><h6 className='mont-medium text-xl'> Go Global</h6></div> <input checked={isGlobal} type="checkbox"  onChange={handleGlobal}  className='toggle bg-white bg-slate-400'/></label>
<div>

        {!isGlobal?<label className='border-1 my-4 number border-emerald-600 rounded-full   px-4'>Radius
     
       
        <input type={"number"} 
        value={radius}
        onChange={(e)=>{
          setRadius(e.target.value)
        }}
        className="input max-w-36 text-emerald-800 bg-transparent "/>km</label>:null}
  {page?<PageWorkshopItem page={page}/>:null}
  
      </div>
      <div  className="bg-emerald-700 flex text-white mt-8 rounded-full"
      onClick={handleGroupClick} ><h6 className='mx-auto lg:text-xl p-6 my-auto'>Join a Workshop</h6>
    </div>       <div className='w-fit flex justify-center p-8'>     
  {loading?<img src={loadingAnimation} className='max-w-24 mx-auto p-6 max-h-24 '/>:null}
  </div>
  </div>

):null}

    </div>
  );
};
export default WorkshopContainer