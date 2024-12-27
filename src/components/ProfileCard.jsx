import React from "react"
import { Settings } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { IconButton } from "@mui/material"
import {useSelector} from 'react-redux'
import theme from "../theme"
export default function ProfileCard(props){
    const currentProfile = useSelector(state=>state.users.currentProfile)


    if(currentProfile){
        
        return (
   <div className="">
        <div  className="profile-container">
          <div >
            
                <img className="profile-pic" inline="true" src={currentProfile.profilePic} />
             <h6 className="username">{currentProfile.username}</h6>
        
           </div> 
        
            <div className="statement">
                <h6>{currentProfile.selfStatement}</h6>
            </div>
           </div>
           
        </div>
    
  )

    }else{
        return (
        <img src="https://media.giphy.com/media/sSgvbe1m3n93G/source.gif"  alt="gif" width="50" height="50" />
)
    }
    
    
    }