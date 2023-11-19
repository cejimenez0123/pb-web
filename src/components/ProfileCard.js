import React from "react"
import { Settings } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { IconButton } from "@mui/material"
import theme from "../theme"
export default function ProfileCard(props){
  


    if(props.currentProfile!=null){
        
        return (
   <div className="">
        <div  className="profile-container">
          <div >
            
                <img className="profile-pic" inline="true" src={props.currentProfile.profilePicture} />
                <h4 >{props.currentProfile.username}</h4>
        
           </div> 
        
            <div>
                <h6>{props.currentProfile.selfStatement}</h6>
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