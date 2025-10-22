

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
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"
import Context from '../../context';
import GoogleMapSearch from './GoogleMapSearch';
import { LoadScript } from '@react-google-maps/api';
import check from "../../images/icons/check.svg"
import { Geolocation } from '@capacitor/geolocation';
import DeviceCheck from '../../components/DeviceCheck';
import { IonContent } from '@ionic/react';

const WorkshopContainer = (props) => {
  const pathParams = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const page = useSelector(state=>state.pages.pageInView)
  const [loading,setLoading]=useState(false)
  const {error,setError,setSuccess,setSeo}=useContext(Context)
  const isNative = DeviceCheck()
  const [radius,setRadius]=useState(50)
  const [location,setLocation]=useState(null)
  const {currentProfile} = useContext(Context)
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
      setSeo({title:"Plumbum (Workshop) - Your Writing, Your Community", description:"Explore events, workshops, and writer meetups on Plumbum.", name:"Plumbum", type:""})

  },[pathParams.pageId])

  useEffect(()=>{
    if(currentProfile){
      registerUser(currentProfile.id,location)
    }

  },[currentProfile,location])

  const webRequestLocation=()=>{
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        if(currentProfile&&currentProfile.id){
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


    useEffect(() => {
      if(!isGlobal){
      if (isNative) {
        requestLocation();
      } else {
        webRequestLocation();
      }}
    }, [isGlobal]);
   


 const requestLocation = async () => {
  setLoading(true);
  try {
    // Check current geolocation permission state
    const permStatus = await Geolocation.checkPermissions();

    if (permStatus.location === 'granted') {
      // Permission already granted, get location
      const position = await Geolocation.getCurrentPosition();
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      if (currentProfile && currentProfile.id) {
        registerUser(currentProfile.id, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }
      setError(null);
    } else if (permStatus.location === 'prompt' || permStatus.location === 'denied') {
      // Request permission explicitly, triggers iOS popup if needed
      const requestResult = await Geolocation.requestPermissions();
      if (requestResult.location === 'granted') {
        const position = await Geolocation.getCurrentPosition();
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        if (currentProfile && currentProfile.id) {
          registerUser(currentProfile.id, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
        setError(null);
      } else {
        setError("Location permission denied. Please enable location permissions in your device settings.");
      }
    } else {
      setError("Unable to determine location permission state.");
    }
  } catch (err) {
    console.error("Error requesting location or getting position:", err);
    setError("Could not get location. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const handleGlobal = () => {
   setIsGlobal(!isGlobal)
  
  };
  const handleGroupClick=()=>{
    setLoading(true)
    setError(null)
    setSuccess(null)
    if(currentProfile){
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
  }}else{
    setError("No Author logged in")
  }}


  
const localCheck=()=>{
  return(<label className=' mb-4 mt-8 border-2 border-emerald-800 flex flex-row p-2 number border-emerald-600 rounded-full   '>
        
          <h6 className='text-xl my-auto ml-4'>Radius:</h6>
     
    
        <input type={"number"} 
        value={radius}
        onChange={(e)=>{
          setRadius(e.target.value)
        }}
        className="input my-auto max-w-36 text-xl text-emerald-800 bg-transparent "/>km</label>)
}

  return (
    <IonContent fullscreen={true} scrollY={false} className='ion-padding  max-h-screen '>
    <LoadScript
    googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
    libraries={['places']}
  >
   <div className='h-[100vh] overflow-hidden'>
      {currentProfile?(
        <div className="text-emerald-800 mx-auto w-[92vw] shadow-sm sm:min-h-[30em] flex flex-col  md:border-2 text-left sm:w-[20rem] md:border-emerald-600 p-4    rounded-lg ">
       <div>
        <span className='flex my-8 flex-row'>
     <h2 className='text-xl  font-bold ml-2 mr-10'> {currentProfile.username}</h2>{!isGlobal?<span className={`${location&& location.longitude && location.latitude?"bg-emerald-600":"bg-yellow-500" } rounded-full w-8 max-h-6 flex`}><img  className="mx-auto my-auto" src={check}/></span>:null}</span></div>
     <div className='flex flex-row mb-8  justify-start'>
     <InfoTooltip text="Do you want to find users local to your area or around the world?" />
     <label className='flex w-[100%] flex-row justify-between'>
      <h6 className='mont-medium text-xl'> Go {!isGlobal?"Global":"Local"}</h6>
      <input checked={isGlobal} type="checkbox"  onChange={handleGlobal}  className='toggle bg-white bg-slate-400'/></label>

</div>


        {!isGlobal?<>  <GoogleMapSearch onLocationSelected={(coordinates)=>{
          setLocation(coordinates)
        }}/>{localCheck()}</>:null}
  {page?<PageWorkshopItem page={page}/>:null}
  
   
      <div  className="bg-emerald-700 flex text-white mt-8 rounded-full"
      onClick={handleGroupClick} ><h6 className='mx-auto lg:text-xl  mont-medium p-6 my-auto'>Join a Workshop</h6>
    </div>       <div className='w-fit flex justify-center p-8'>     
  {loading?<img src={loadingAnimation} className='max-w-24 mx-auto p-6 max-h-24 '/>:null}
  </div>
  </div>

):<div className='text-emerald-800 mx-auto w-[92vw] shadow-sm sm:h-[30em] mt-20 flex flex-col  border-2 text-left sm:w-[20rem] border-emerald-600 p-4  skeleton bg-slate-100  rounded-lg '/>}

    
   
    </div>
    </LoadScript>
    </IonContent>
  );
};
export default WorkshopContainer