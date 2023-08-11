import React from "react"

export default function ProfileCard(props){
   
  
   
    console.log(`ProfileCard ${props.currentProfile}`)
    if(props.currentProfile!=null){
        
        return (<div>
   <div className="flex">
           <div className="profilePic">
                <img inline="true" style={{objectFit:"contain"}} src={props.currentProfile.profilePicture} alt=""  height="auto"/>
                <div>{props.currentProfile.profilePicture}</div>
            </div>
            <div className="flex flex-direction-column profileCardNames">

                <h4>@{props.currentProfile.username}</h4>
            </div>
        </div>
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