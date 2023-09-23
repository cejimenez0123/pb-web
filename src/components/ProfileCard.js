import React from "react"
import { useNavigate } from "react-router-dom"
export default function ProfileCard(props){
  
   let navigate = useNavigate()

    if(props.currentProfile!=null){
        
        return (<div>
   <div className="flex">
           <div className="profile-pic-container">
                <img className="profile-pic" inline="true" src={props.currentProfile.profilePicture} alt=""  height="auto"/>
                <div>{props.currentProfile.profilePicture}</div>
            </div>
            <div className="flex flex-direction-column profileCardNames">

                <h4>@{props.currentProfile.username}</h4>
            </div>
        </div>
        <a onClick={()=>{
            navigate("/profile/edit")
        }}>
            Settings
        </a>
    <div className="profile-buttons">

{/* <button type="button" class=" mountain button" onClick={()=>this.setState({showStartBook: "block"})}>Start Book</button>
        
//                 <button type="button" class=" blueJean button" onClick={()=>this.handleStartLib()}>Start Library</button>
     
//           {/* <FollowersBtn/>
                     
//                         <FollowingBtn followedUsers={this.props.followedUsers}/> 
//                          */}
        </div>  
    
    </div>)

    }else{
        return (
        <img src="https://media.giphy.com/media/sSgvbe1m3n93G/source.gif"  alt="gif" width="50" height="50" />
)
    }
    
    
    }