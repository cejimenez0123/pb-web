

import React, { useEffect, useLayoutEffect, useState } from 'react';
import {registerUser,postAcitveUser,createWorkshopGroup} from "../../actions/WorkshopActions"
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import checkResult from '../../core/checkResult';
import { useNavigate, useParams } from 'react-router-dom';
import Paths from '../../core/paths';
import { getStory } from '../../actions/StoryActions';
import PageWorkshopItem from '../page/PageWorkshopItem';
const WorkshopContainer = (props) => {
  const pathParams = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const page = useSelector(state=>state.pages.pageInView)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState(null)
  const [success,setSuccess]=useState(null)
  const [radius,setRadius]=useState(50)
  const [location,setLocation]=useState({latitude:40.7128, longitude:74.0060})
  const currentProfile = useSelector(state=>state.users.currentProfile)
  useEffect(()=>{
   
  
  },[currentProfile])
  useEffect(()=>{
setTimeout(()=>{
  if(error){
    setError(null)
  }
 
},4001)
  },[error])

  useEffect(()=>{
    if(page && currentProfile){
      requestLocation()
      dispatch(postAcitveUser({story:page,profile:currentProfile})).then(res=>{
          checkResult(res,payload=>{

          },err=>{
            setError("")
          })
      })
    }
  },[page,currentProfile])
  useLayoutEffect(()=>{
    console.log(pathParams)
    dispatch(getStory({id:pathParams.pageId}))
  },[pathParams.pageId])

  useEffect(()=>{
    registerUser(currentProfile.id,location)
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

  const handleGroupClick=()=>{
  
    if(page){
        dispatch(createWorkshopGroup({profile:currentProfile,story:page,location})).then(res=>{
      checkResult(res,payload=>{
        if(payload && payload.collection){
          navigate(Paths.collection.createRoute(payload.collection.id))
        }
         
      },err=>{
        setError(err.message)
      })
    })
  }else{
    setError("No Page")
    
  }}

  return (
    <div>
  
    {/* <div className='sm:p-4  sm:w-[98vw] mx-auto '>
      <div className='fixed top-1 left-0 right-0 md:left-[20%] w-[96vw] mx-4 md:w-[60%]  z-50 mx-auto'> */}
  {error || success? <div role="alert" className="alert    alert-warning animate-fade-out">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 shrink-0 stroke-current"
    fill="none"
    viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>{error?error:success}</span>
</div>:null}
{/* </div> */}
  {/* <div className='justify-between  flex flex-col sm:flex-row '>

      <div className=" mx-auto"> */}
    
      {currentProfile?(
        <div className="text-emerald-800 mx-auto w-[92vw] shadow-sm sm:h-[30em] mt-20 flex flex-col  border-2 text-left sm:w-[20rem] border-emerald-600 p-4    rounded-lg ">
       <div>
     <h2 className='text-xl font-bold'> {currentProfile.username}</h2></div>
<div>
        <label className='border-1 my-4 number border-emerald-600 rounded-full   px-4'>Radius
     
       
        <input type={"number"} 
        value={radius}
        onChange={(e)=>{
          setRadius(e.target.value)
        }}
        className="input max-w-36 text-emerald-800 bg-transparent "/></label>
  <PageWorkshopItem page={page}/>
  
      </div>
      <div  className="bg-emerald-700 flex text-white rounded-full"
      onClick={handleGroupClick} ><h6 className='mx-auto my-auto py-2'>Join a Workshop</h6></div>
  </div>):null}


    
       
     
     
   
      
 
      {/* <div className='text-emerald-800 mx-auto  max-h-[28rem] max-w-[94vw] sm:border-emerald-600  py-8 sm:shadow-sm sm:min-w-[36em] px-2 pt-20 sm:border-2 sm:rounded-full  h-[90vh]'>
     <div className='sm:px-4'> */}
      {/* <h6 className='text-emerald-800 text-2xl font-bold mb-4'>Workshop Groups</h6>
      <div className='overflow-scroll '>{workshopGroups && workshopGroups.length>0 && workshopGroups.map((group, index) => 
      {
        if(group.length>0){
          return(
            <div onClick={()=>handleGroupClick(index)}
            className=' border-1 shadow-sm my-2 border-emerald-600 px-4 flex flex-row justify-between rounded-full mx-2' key={index}>
              <h2 className='my-auto p-4'>Local Group {index + 1}</h2>
              <h5 className='my-auto  py-2 px-4 rounded-full text-white bg-emerald-500'>Start</h5>
            </div>
          )
        }else{
          return(<div>
            <div onClick={()=>handleGroupClick(index)}
            className=' border-1 shadow-sm my-2 border-emerald-600 px-4 flex flex-row justify-between rounded-full mx-2' key={index}>
              <h2 className='my-auto p-4'>{group.title}</h2>
              <h5 className='my-auto  py-2 px-4 rounded-full text-white bg-emerald-500'>Start</h5>
            </div>
            </div>)
        }
     
       })}
       </div> */}
        {/* </div> */}
        {/* </div>
        <div className='border-2 border-emerald-600 w-[92vw]  mx-auto sm:w-[20em] h-[30em] mt-20 p-4 rounded-lg '>
      <h6 className='text-emerald-800 text-lg font-bold text-left mx-3'>Active Users</h6> */}
      {/* <ul className='overflow-scroll mt-3'> */}
        {/* {activeUsers && activeUsers.length>0?activeUsers.map((user, index) => (
          <li className='text-emerald-800 my-2 ' key={index}>
            <div className='border-1 text-left px-4 border-emerald-600 p-2 rounded-full'>{user.username}</div></li>
        )):null} */}
      {/* </ul> */}
      {/* </div> */}
{/*       
    </div> */}
    </div>
  );
};
export default WorkshopContainer