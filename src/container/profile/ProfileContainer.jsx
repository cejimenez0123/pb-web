
import { useParams } from "react-router-dom"
import { useLayoutEffect,useState} from "react"
import { useDispatch,useSelector } from "react-redux"
import {    createFollowProfile,
            deleteFollowProfile, 
            fetchProfile,
            updateHomeCollection} from "../../actions/UserActions"
import "../../styles/Profile.css"
import checkResult from "../../core/checkResult"
import ReactGA from 'react-ga4'
import PageIndexList from "../../components/page/PageIndexList"
import CollectionIndexList from "../../components/collection/CollectionIndexList"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import { getProfilePages } from "../../actions/PageActions"
function ProfileContainer(props){
    ReactGA.send({ hitType: "pageview", page: window.location.pathname+window.location.search, title: "About Page" })

    const currentProfile = useSelector(state=>state.users.currentProfile)
    const collections = useSelector(state=>state.books.collections)
    const profile = useSelector(state=>state.users.profileInView)
    const homeCollection = useSelector(state=>state.users.homeCollection)
    const dispatch = useDispatch()
    const pathParams = useParams()
    const [profilePic,setProfilePic]=useState(null)
    const [following,setFollowing]=useState(null)

    useLayoutEffect(()=>{
        dispatch(fetchProfile(pathParams)).then(result=>{
                checkResult(result,payload=>{
                const {profile}=payload
                if(profile){
                
                }
                
                },()=>{
                })
        })
    },[])
    useLayoutEffect(()=>{

        if(profile){
            dispatch(getProfilePages({profile}))

        }
    },[profile])
    useLayoutEffect(()=>{
        if(profile){
            getDownloadPicture(profile.profilePic).then(url=>{
                setProfilePic(url)
            })
        }
    },[profile])
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
       (<div 
        className=""
                onClick={onClickFollow}>
                    Follower</div>):(
         <div className="border-2 border-emerald-600 bg-transparent w-[9rem] rounded-full text-center"
                    onClick={onClickFollow}
        ><h5 className="text-emerald-800 py-2 font-bold">Follow</h5></div>)
    }
   const ProfileCard =()=>{
    if(profile!=null){
      return(<div className="pb-8 border-2 rounded-lg  sm:m-h-[30em] mx-auto sm:max-w-[52em] border-emerald-800">
        <div className="text-left p-4">
            <div className="flex flex-row">  
            <img src={profilePic} className="max-w-36 object-fit max-h-42 mb-2 rounded-lg" alt=""/>
         <div>
            <div className="px-3 pt-3 flex flex-col justify-between  h-48">
           <div className="h-fit"><h5 className="sm:text-[1rem] text-[0.8rem]  text-emerald-800 overflow-scroll">{profile.selfStatement}</h5>
           </div> 
            <div className="h-fit pb-2"><h5 className="text-emerald-800 text-[1.2rem] font-bold">{profile.username}</h5></div>
        </div></div>
        </div>
            <div>
                {followDiv()}
            </div>
        </div>
      
        </div>)
    }else{
       return <div className=" skeleton profile-card"/>
    }
}
///Alert
    return(
        <div className="">
            <div className="pt-8">
                <ProfileCard/>
            </div>
            
                         <div role="tablist" className="tabs mt-8 shadow-md min-h-48 rounded-lg  mx-auto max-w-[96vw]   sm:max-w-[42em]  tabs-lifted">
  <input type="radio" name="my_tabs_2" role="tab"  defaultChecked className="tab  bg-transparent text-emerald-700 text-xl" aria-label="Pages" />
  <div role="tabpanel" className="tab-content mx-auto  border-emerald-400 border-3 w-[100%] h-[100%] rounded-lg  ">
  <PageIndexList/>
  </div>

  <input
    type="radio"
    name="my_tabs_2"
    role="tab"
    className="tab text-emerald-700 bg-transparent   text-xl"
    aria-label="Collecitons"
    />
  <div role="tabpanel" className="tab-content bg-transparent border-emerald-400 border-3 w-[100%] h-[100%] rounded-lg  ">
  <CollectionIndexList cols={collections}/>
</div>
</div>
            
        </div> 
            )
}
export default ProfileContainer