import ContentList from "../components/ContentList"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch,useSelector } from "react-redux"
import {    createFollowProfile,
            deleteFollowProfile, 
            fetchProfile,
            updateHomeCollection } from "../actions/UserActions"
// import ProfileCard from "../components/ProfileCard"
import { getProfilePages } from "../actions/PageActions"
import theme from "../theme"
import "../styles/Profile.css"
import { Button } from "@mui/material"
function ProfileContainer(props){
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const profile = useSelector(state=>state.users.profileInView)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const followedProfiles = useSelector(state=>state.users.followedProfiles)
    const homeCollection = useSelector(state=>state.users.homeCollection)
    const dispatch = useDispatch()
    const pathParams = useParams()
    useEffect(()=>{
        const { id} = pathParams
       
        if(profile==null || (profile != null && profile.id != id)){

            dispatch(fetchProfile(pathParams))
        }
    },[])
    useEffect(()=>{
        if(profile){
            const params = { profile}
            dispatch(getProfilePages(params))
        }
    },[])
    let profileCardDiv = (<div>

    </div>)
    const onClickFollow = () => {
        if(currentProfile){
            if(followedProfiles){
              let follow =  followedProfiles.find(fp=>fp.id==`${currentProfile.id}_${profile.id}`)
                if(follow){
                    const params =  {
                        followProfile:follow,
                        follower:currentProfile,
                        following:profile
                    }
                    dispatch(deleteFollowProfile(params))
                }else{
                const params = {
                    follower: currentProfile,
                    following: profile
                }
                dispatch(createFollowProfile(params)).then(()=>{
                   
                        let books = [...homeCollection.books]
                        let libraries = [...homeCollection.libraries]
                        let pages = [...homeCollection.pages]
                        let profiles = [...homeCollection.profiles,profile.id]
                        const homeParams ={
                            profile: currentProfile,
                            books: books,
                            pages: pages,
                            libraries:libraries,
                            profiles:profiles
                        }
                        dispatch(updateHomeCollection(homeParams))
                })
                }
            }
        }else{
            window.alert("Please login first!")
        }
    }

    let followDiv = (
         <Button  style={{backgroundColor:theme.palette.secondary.main,color:theme.palette.secondary.contrastText}}  variant="outlined"
                    onClick={onClickFollow}
        >Follow</Button>
    )
    if(currentProfile && profile && followedProfiles){
    const follow = followedProfiles.find(fp=>fp.id == `${currentProfile.id}_${profile.id}`)
    if(follow){
        followDiv=(<Button style={{backgroundColor:theme.palette.secondary.light}} onClick={onClickFollow}variant="outlined">Following</Button>)
    }
    }
    if(profile!=null){
      profileCardDiv =  ( <div className="info view">
        <h1>{profile.username}</h1>
        <img src={profile.profilePicture} alt="proflile-picture"/>
        <div>
            <p>{profile.selfStatement}</p>
        </div>
        <div>
           {followDiv}
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