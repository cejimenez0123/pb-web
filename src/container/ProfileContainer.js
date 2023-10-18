import ContentList from "../components/ContentList"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch,useSelector } from "react-redux"
import { fetchProfile } from "../actions/UserActions"
import ProfileCard from "../components/ProfileCard"
import { getProfilePages } from "../actions/PageActions"

import "../styles/Profile.css"
function ProfileContainer(props){

    const profile = useSelector(state=>state.users.profileInView)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const dispatch = useDispatch()
    const pathParams = useParams()
    useEffect(()=>{
        const { id} = pathParams
       
        if(profile==null || (profile != null && profile.id != id)){

            dispatch(fetchProfile(pathParams))
        }else{

        }
    },[profile])
    useEffect(()=>{
        if(profile){
            const params = { profile}
            dispatch(getProfilePages(params))
        }
    },[profile])
    let profileCardDiv = (<div>

    </div>)
    if(profile!=null){
      profileCardDiv =  ( <div className="info">
        <h1>{profile.username}</h1>
        <img src={profile.profilePicture} alt="proflile-picture"/>
        <div>
            <p>{profile.selfStatement}</p>
        </div>
        </div>)
    }
    return(
        <div className="container">
            <div className="left-bar">
               {profileCardDiv}
            </div>
            <div className="right-bar">
                <ContentList currentProfile={profile}
                             pagesInView={pagesInView}/>
            </div>
          
            
                                    
                                      
         
        </div>
                
            )
}
export default ProfileContainer