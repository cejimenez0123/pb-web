

import React, { useEffect, useState } from 'react';
import {registerUser,fetchActiveUsers,fetchWorkshopGroups, createWorkshopGroup} from "../../actions/WorkshopActions"
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { generate, count } from "random-words"
import checkResult from '../../core/checkResult';
import { useNavigate } from 'react-router-dom';
import Paths from '../../core/paths';
import { getProfilePages } from '../../actions/PageActions';
import { getMyStories } from '../../actions/StoryActions';
const WorkshopContainer = (props) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const pages = useSelector(state=>state.pages.pagesInView)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState("")
  const [radius,setRadius]=useState(50)
  const workshopGroups = useSelector(state=>state.books.groups)
  const [location,setLocation]=useState({latitude:40.7128, longitude:74.0060})
  const currentProfile = useSelector(state=>state.users.currentProfile)
  
  useEffect(()=>{
    requestLocation()},[])
    const fetchGroups = () => {
      dispatch(fetchWorkshopGroups({radius:radius}))

    };
    const fetchUsers = async () => {
      const profiles = await fetchActiveUsers();
      setActiveUsers(profiles);
    };
  useEffect(() => {
if(currentProfile && location){
    const profileId = currentProfile.id; 
    dispatch(getMyStories({profile:currentProfile,draft:"draft"}))
    registerUser(profileId, location);

    
   let deb = debounce( ()=>{
    fetchUsers()
    fetchGroups()
   }
    ,500
  )
  deb()
    return () =>{} 
  }}, [currentProfile]);

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
        setError("Unable to retrieve location. Please allow location access.");
        setLoading(false);
  
      }
    );
  }
  const handleGroupClick=(index)=>{
    let group = workshopGroups[index]
    let groupName = generate({ min: 3, max: 6,join:" " })

    dispatch(createWorkshopGroup({profile:currentProfile,group,groupName})).then(res=>{
      checkResult(res,payload=>{
        if(payload && payload.collection){
          navigate(Paths.collection.createRoute(payload.collection.id))
        }
         
      },err=>{
        window.alert(JSON.stringify(err))
      })
    })

  }
  return (
  <div className=' justify-evenly sm:p-4 flex flex-col sm:flex-row '>
      <div className=" ">
    
      {currentProfile?(
        <div className="text-emerald-800 shadow-sm sm:h-[30em] mt-20 flex flex-col  border-2 text-left w-[20rem] border-emerald-600 p-4    rounded-lg ">
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

      </div>
      <div>
      <button  className="bg-emerald-700 text-white rounded-full"onClick={fetchGroups}>Find New Groups</button> 
       
     
        </div>
          <div>{pages?pages.map(page=>{
            return <div className='text-emerald-800'>
              {page.title}
              </div>
          }):null}</div>
        </div>
  ):null}
      </div>
      
 
      <div className='text-emerald-800 border-emerald-600 py-8 min-w-[25em] px-2 pt-20 border-2 rounded-full h-[40em]'>
     
      <h6 className='text-emerald-800 text-2xl font-bold mb-4'>Workshop Groups</h6>
      {workshopGroups && workshopGroups.length>0 && workshopGroups.map((group, index) => 
      {
        
     
        return(
        <div onClick={()=>handleGroupClick(index)}className=' border-1 my-2 border-emerald-600 px-4 flex flex-row justify-between rounded-full mx-2' key={index}>
          <h2 className='my-auto p-4'>Local Group {index + 1}</h2>
          <h5 className='my-auto  p-2 rounded-full text-white bg-emerald-500'>Start</h5>
        </div>
      )})}
        </div>
        <div className='border-2 border-emerald-600 w-[20em] h-[30em] mt-20 p-4 rounded-lg '>
      <h6 className='text-emerald-800'>Active Users</h6>
      <ul>
        {activeUsers && activeUsers.length>0?activeUsers.map((user, index) => (
          <li className='text-emerald-800 my-2 ' key={index}>
            <div className='border-1 text-left px-4 border-emerald-600 p-2 rounded-full'>{user.username}</div></li>
        )):null}
      </ul>
      </div>
    </div>
 
  );
};

export default WorkshopContainer