
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
function ProfileContainer(props){
    ReactGA.send({ hitType: "pageview", page: window.location.pathname+window.location.search, title: "About Page" })

    const currentProfile = useSelector(state=>state.users.currentProfile)
    const collections = useSelector(state=>state.books.collections)
    const profile = useSelector(state=>state.users.profileInView)
    const homeCollection = useSelector(state=>state.users.homeCollection)
    const dispatch = useDispatch()
    const pathParams = useParams()
    const [following,setFollowing]=useState(null)
    useLayoutEffect(()=>{
        dispatch(fetchProfile(pathParams)).then(result=>{
                checkResult(result,payload=>{
                    dispatch()
                },()=>{
                })
        })
    },[])
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
       (<button 
                onClick={onClickFollow}>
                    Follower</button>):(
         <button   
                    onClick={onClickFollow}
        >Follow</button>)
    }
   const ProfileCard =()=>{
    if(profile!=null){
      return(<div className="pb-8">
        <div className="text-left px-4">
            <div className="flex flex-row">  
            <img src={profile.profilePic} className="max-w-36 max-h-36 mb-2 rounded-lg" alt=""/>
         
            <div className="">
            <h5 className="text-[0.8em] px-2 max-h-48 overflow-scroll">{profile.selfStatement}</h5>
        </div></div>
        <h5 className="mb-2">{profile.username}</h5>
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
            <div className="">
            
                         <div role="tablist" className="tabs mt-8 shadow-md min-h-48 rounded-lg  sm:max-w-128 sm:mx-6 tabs-lifted">
  <input type="radio" name="my_tabs_2" role="tab"  defaultChecked className="tab shadow-sm  border-l-2 border-r-2 border-t-2 bg-transparent text-emerald-600 text-xl" aria-label="Pages" />
  <div role="tabpanel" className="tab-content max-w-[100svw] pt-1  sm:max-w-[42rem] md:p-6">
  <PageIndexList/>
  </div>

  <input
    type="radio"
    name="my_tabs_2"
    role="tab"
    className="tab text-emerald-600 bg-transparent  border-emerald-500 border-l-2 border-r-2 border-t-2 shadow-sm text-xl"
    aria-label="Collecitons"
    />
  <div role="tabpanel" className="tab-content bg-transparent sm:max-w-[42rem]   rounded-box pt-1">
  <CollectionIndexList cols={collections}/>
</div>
</div>
            </div>
        </div> 
            )
}
export default ProfileContainer