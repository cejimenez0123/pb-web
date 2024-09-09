import ContentList from "../components/ContentList"
import { useParams } from "react-router-dom"
import { useEffect ,useLayoutEffect,useState} from "react"
import { useDispatch,useSelector } from "react-redux"
import {    createFollowProfile,
            deleteFollowProfile, 
            fetchProfile,
            updateHomeCollection,fetchFollowProfilesForProfile } from "../actions/UserActions"
// import ProfileCard from "../components/ProfileCard"
import theme from "../theme"
import "../styles/Profile.css"
import { Button,Skeleton } from "@mui/material"
import checkResult from "../core/checkResult"
function ProfileContainer(props){
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const profile = useSelector(state=>state.users.profileInView)
    const followedProfiles = useSelector(state=>state.users.followedProfiles)
    const homeCollection = useSelector(state=>state.users.homeCollection)
    const dispatch = useDispatch()
    const pathParams = useParams()
    const [following,setFollowing]=useState(null)
    useLayoutEffect(()=>{
        dispatch(fetchProfile(pathParams)).then(result=>{
                checkResult(result,payload=>{
                    fetchProfileFollows()
                },()=>{
                })
        })
    },[])
   
    const fetchProfileFollows =()=>{
        if(currentProfile && profile && followedProfiles.length<=0){
            const params = {
                profile: currentProfile
            }
            dispatch(fetchFollowProfilesForProfile(params)).then(result=>{
                checkResult(result,payload=>{


                        const {followList}= payload
                       let foundFollow = followList.find(follow=>follow!=null && follow.followerId==currentProfile.id && follow.followingId == profile.id)
                        setFollowing(foundFollow)
                    },()=>{

                    })  })
        }else if(currentProfile && profile){
            let foundFollow = followedProfiles.find(follow=>follow!=null && follow.followerId==currentProfile.id && follow.followingId == profile.id)
                        setFollowing(foundFollow)
        }
    }
    const onClickFollow = () => {
        if(currentProfile){
            if(following){      
              
                    const params =  {
                        followProfile:following,
                        follower:currentProfile,
                        following:profile
                    }
                    dispatch(deleteFollowProfile(params)).then(result=>{
                        checkResult(result,()=>{
                            setFollowing(null)
                        },()=>{})
                    })
                }else{
                const params = {
                    follower: currentProfile,
                    following: profile
                }
                dispatch(createFollowProfile(params)).then(result=>{
                 checkResult(result,payload=>{
                    const {followProfile}= payload;
                        setFollowing(followProfile)
            
                        let books = [...homeCollection.books]
                        let libraries = [...homeCollection.libraries]
                        let pages = [...homeCollection.pages]
                        let profiles = [...homeCollection.profiles]
                        
                        let id = homeCollection.profiles.find(id=>id==followProfile.followingId)
                        if(!id){
                           profiles = [...homeCollection.profiles,followProfile.followingId]
                        
                        const homeParams ={
                            profile: currentProfile,
                            books: books,
                            pages: pages,
                            libraries:libraries,
                            profiles:profiles
                        }
                        dispatch(updateHomeCollection(homeParams))}
                    },()=>{

                    }) 
                })
            
            }
        }else{
            window.alert("Please login first!")
        }
    }

    let followDiv=()=>{

       return following?
       (<Button style={{backgroundColor:theme.palette.secondary.light}}
                onClick={onClickFollow}variant="outlined">
                    Reader</Button>):(
         <Button  style={{backgroundColor:theme.palette.secondary.main,color:theme.palette.secondary.contrastText}}  variant="outlined"
                    onClick={onClickFollow}
        >Read</Button>)
    }
   const ProfileCard =()=>{
    if(profile!=null){
      return(<div className="profile-card">
        <div className="profile-info">
            <img src={profile.profilePic} alt="proflile-picture"/>
            <h5 className="username">{profile.username}</h5>
            <div>
                {followDiv()}
            </div>
        </div>
        <div className="statement">
            <p>{profile.selfStatement}</p>
        </div>
        </div>)
    }else{
       return <Skeleton variant="rectangular" className="profile-card"/>
    }
}
    return(
        <div className="two-panel">
            <div className="left-bar">
                <ProfileCard/>
            </div>
            <div className="right-bar">
                <ContentList profile={profile}
                            />
            </div>
        </div> 
            )
}
export default ProfileContainer