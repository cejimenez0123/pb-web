

import React, { useEffect, useState } from 'react';
import {registerUser,fetchActiveUsers,fetchWorkshopGroups} from "../../actions/WorkshopActions"

const WorkshopContainer = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [workshopGroups, setWorkshopGroups] = useState([]);

  useEffect(() => {

    const userId = 'user123'; // Replace with actual user ID
    const location = { latitude: 40.7128, longitude: -74.0060 }; // Replace with actual location
    registerUser(userId, location);

    // Fetch active users periodically
    const fetchUsers = async () => {
      const profiles = await fetchActiveUsers();
      setActiveUsers(profiles);
    };

    // Fetch workshop groups
    const fetchGroups = async () => {
      const groups = await fetchWorkshopGroups(50); // 50km radius
      setWorkshopGroups(groups);
    };

    fetchUsers();
    fetchGroups();

    const interval = setInterval(() => {
      fetchUsers();
      fetchGroups();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 className='text-emerald-800'>Active Users</h1>
      <ul>
        {activeUsers && activeUsers.length>0?activeUsers.map((user, index) => (
          <li className='text-emerald-800' key={index}>{user.username}</li>
        )):null}
      </ul>

      <h1 className='text-emerald-800'>Workshop Groups</h1>
      {workshopGroups && workshopGroups.length>0 && workshopGroups.map((group, index) => (
        <div key={index}>
          <h2>Group {index + 1}</h2>
          <ul>
            {group.map((user, i) => (
              <li key={i}>{user.userId}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default WorkshopContainer