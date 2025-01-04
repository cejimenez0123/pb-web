

import React, { useEffect, useState } from 'react';
import {registerUser,fetchActiveUsers,fetchWorkshopGroups} from "../../actions/WorkshopActions"
import LocationAccess from '../../components/LocationAccess';
import { useSelector } from 'react-redux';
import LocationPoint from '../../domain/models/location';
import { useDispatch } from 'react-redux';
import axios from "axios"
const WorkshopContainer = (props) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const dispatch = useDispatch()
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState("")
  // const [workshopGroups, setWorkshopGroups] = useState([]);
  const workshopGroups = useSelector(state=>state.books.groups)
  const [location,setLocation]=useState(new LocationPoint(40.7128,74.0060))
  const currentProfile = useSelector(state=>state.users.currentProfile)
  const [locationName,setLocationName]=useState("")
  const fetchLocation = async ({latitude, longitude}) => {
    const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
            params: {
                lat: latitude,
                lon: longitude,
                format: "json",
            },
        }
    );
    const address = response.data.address;
    const city = address.city || address.town || address.village;
    const neighborhood = address.neighbourhood;
    return neighborhood || city || "";
}
  useEffect(() => {

if(currentProfile && location){
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let point = new LocationPoint(position.coords.latitude,position.coords.longitude)
    
      setLocation(point);
       setError(null);
      setLoading(false);},(err) => {
        setError("Unable to retrieve location. Please allow location access.");
        setLoading(false);
        
      })
    
    

    const profileId = currentProfile.id; // Replace with actual user ID
    registerUser(profileId, location);
    const fetchUsers = async () => {
      const profiles = await fetchActiveUsers();
      setActiveUsers(profiles);
    };

    // Fetch workshop groups
    const fetchGroups = async () => {
      // const {groups} = 
      dispatch(fetchWorkshopGroups({radius:50}))

      // setWorkshopGroups(groups);
    };

    fetchUsers();
    fetchGroups();
    fetchLocation(location).then(name=>{
      setLocationName(name)
    })
    // const interval = setInterval(() => {
  
    return () => {}
  }}, [currentProfile,location]);
  const ProfileCard = ({profile}) =>{
    if(profile){

    }
  }
  return (
    // <div>
    // <div className='flex flex-row justify-evenly sm:flex-col' >
      <div>
      <div>
      <ProfileCard profile={currentProfile}/>
      </div>
      <div>
      <h6 className='text-emerald-800'>Active Users</h6>
      <ul>
        {activeUsers && activeUsers.length>0?activeUsers.map((user, index) => (
          <li className='text-emerald-800' key={index}>{user.username}</li>
        )):null}
      </ul>
      <div>
      <h6 className='text-emerald-800'>Workshop Groups</h6>
      {workshopGroups && workshopGroups.length>0 && workshopGroups.map((group, index) => 
      {
        
     
        return(
        <div className='text-emerald-800' key={index}>
          <h2>Group {index + 1}</h2>
          <ul>
            {group.map((user, i) => (
              <li className="text-emerald-800" key={i}>{user.username}</li>
            ))} 
          </ul>
        </div>
      )})}
        </div>
    
    </div>
    </div>
  );
};

export default WorkshopContainer