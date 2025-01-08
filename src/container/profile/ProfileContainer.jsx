
import { useParams } from "react-router-dom"
import { useEffect, useLayoutEffect,useState} from "react"
import { useDispatch,useSelector } from "react-redux"
import { 
            fetchProfile,
        } from "../../actions/UserActions"
import "../../styles/Profile.css"
import checkResult from "../../core/checkResult"
import ReactGA from 'react-ga4'
import IndexList from "../../components/page/IndexList"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import { getProtectedProfilePages,getPublicProfilePages } from "../../actions/PageActions"
import { createFollow, deleteFollow } from "../../actions/FollowAction"
import { getProtectedProfileCollections, getPublicProfileCollections } from "../../actions/CollectionActions"
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
    const pages = useSelector(state=>state.pages.pagesInView)
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
            currentProfile&&localStorage.getItem("token")?dispatch(getProtectedProfilePages({profile})):dispatch(getPublicProfilePages({profile}))
            currentProfile&&localStorage.getItem("token")?dispatch(getProtectedProfileCollections({profile:profile})):dispatch(getPublicProfileCollections({profile}))
    
    },[currentProfile])
    useLayoutEffect(()=>{
        if(profile){
            getDownloadPicture(profile.profilePic).then(url=>{
                setProfilePic(url)
            })
        }
    },[profile])
    useEffect(()=>{
checkIfFollowing({profile})

    },[profile?profile.followers:null,currentProfile])
    const checkIfFollowing =({profile})=>{

    if(currentProfile && profile && profile.followers){
        let found = profile.followers.find(follow=>follow.followerId==currentProfile.id)
         setFollowing(found)
     }
    }
    const onClickFollow = () => {
        if(currentProfile){
            if(following){    

              dispatch(deleteFollow({follow:following})).then(res=>
                checkResult(res,payload=>{
                    const{profile}=payload
                    checkIfFollowing({profile})
                },err=>{

                })
              )
              
                }else{
                if(profile){
                    const params = {
                        follower:currentProfile,
                        following:profile
                    }
                    dispatch(createFollow(params))
                }
               
            }
        }else{
            window.alert("Please login first!")
        }
    }

    let followDiv=()=>{

       return following?
       (<div 
        className=" bg-emerald-600  w-[9rem] rounded-full text-white text-center"
                onClick={onClickFollow}>
             <h5 className="text-white py-3 font-bold"> Following</h5>   </div>):(
         <div className="border-2 border-emerald-600 bg-transparent w-[9rem] rounded-full text-center"
                    onClick={onClickFollow}
        ><h5 className="text-emerald-800 py-3 font-bold">Follow</h5></div>)
    }
   const ProfileCard =()=>{
    if(profile!=null){
      return(<div className="pb-8 border-3 rounded-lg  sm:m-h-[30em] mx-auto sm:max-w-[52em] border-emerald-400">
        <div className="text-left p-4">
            <div className="flex flex-row">  
            <img src={profilePic} className="max-w-36 object-fit max-h-42 mb-2 rounded-lg" alt=""/>
         <div>
            <div className="px-3 pt-3 flex flex-col justify-between  h-48">
           <div className="h-fit"><h5 className="sm:text-[1rem] text-[0.8rem]  h-40 overflow-y-scroll flex-wrap flex text-emerald-800 overflow-scroll">{profile.selfStatement}</h5>
           </div> 
            <div className="h-fit pb-2"><h5 className="text-emerald-800 text-[1.2rem] font-bold">{profile.username}</h5></div>
        </div></div>
        </div>
            <div className="mt-3">
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
            <div className="pt-2 md:pt-8 mx-2">
                <ProfileCard/>
            </div>
            <div className=" w-[96vw]  md:w-[42em] mt-4 mb-1 mx-auto">
                         <div role="tablist" className="tabs  shadow-md mb-36 rounded-lg w-[96vw]  md:max-w-[42em] tabs-lifted">
  <input type="radio" name="my_tabs_2" role="tab"  defaultChecked className="tab  [--tab-border-color:rgb(52 211 153)] bg-transparent text-emerald-800 text-xl" aria-label="Pages" />
  <div role="tabpanel" className="tab-content w-[96vw]  md:max-w-[42em] border-emerald-400 border-3 h-[100%] rounded-lg border-3 border-emerald-400 ">
  <IndexList items={pages}/>
  </div>
  <input
    type="radio"
    name="my_tabs_2"
    role="tab"
    className="tab  [--tab-border-color:rgb(52 211 153)] bg-transparent text-emerald-800 text-xl"
    aria-label="Collections"
    />
  <div role="tabpanel"  className="tab-content w-[96vw]  md:max-w-[42em] border-emerald-400 border-3 h-[100%] rounded-lg  border-3 border-emerald-400 ">
  <IndexList items={collections}/>
</div>
</div>
</div>    
        </div> 
            )
}
export default ProfileContainer