import React from "react"
import { Settings } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { Button } from "@mui/material"
export default function ProfileCard(props){
  
   let navigate = useNavigate()

    if(props.currentProfile!=null){
        
        return (<div className="profile-card">
   <div className="flex-direction-column">
        <div className="profile-pic-container">
            <img className="profile-pic" inline="true" src={props.currentProfile.profilePicture} alt=""  height="auto"/>
            <div className="flex flex-direction-column profileCardNames">

                <h4>@{props.currentProfile.username}</h4>
            </div>
            <div className="profile-buttons">
    <Button onClick={()=>{
            navigate("/profile/edit")
        }}>
            <Settings/>
        </Button>

        </div> 
        </div>
        
 
        </div>
    </div>)

    }else{
        return (
        <img src="https://media.giphy.com/media/sSgvbe1m3n93G/source.gif"  alt="gif" width="50" height="50" />
)
    }
    
    
    }