
import { useParams } from "react-router-dom"
import { useContext, useEffect, useLayoutEffect,useState} from "react"
import { useDispatch,useSelector } from "react-redux"
import { 
            fetchProfile,
        } from "../../actions/UserActions" 
import ProfileCard from "../../components/ProfileCard"
import "../../styles/Profile.css"
import checkResult from "../../core/checkResult"
import ReactGA from 'react-ga4'
import IndexList from "../../components/page/IndexList"
import { getProtectedProfilePages,getPublicProfilePages, setPagesInView } from "../../actions/PageActions"
import { createFollow, deleteFollow } from "../../actions/FollowAction"
import { getProtectedProfileCollections, getPublicProfileCollections } from "../../actions/CollectionActions"
import { debounce } from "lodash"
import { setCollections } from "../../actions/BookActions"
import { useMediaQuery } from "react-responsive"
import Context from "../../context"
function ProfileContainer(props){
    ReactGA.send({ hitType: "pageview", page: window.location.pathname+window.location.search, title: "About Page" })
    const {setError,setSuccess}=useContext(Context)
    const isPhone =  useMediaQuery({
        query: '(max-width: 600px)'
      })
    const [pending,setPending]=useState(true)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const collections = useSelector(state=>state.books.collections).filter(col=>col)
    const profile = useSelector(state=>state.users.profileInView)
    const dispatch = useDispatch()
    const pathParams = useParams()

    const [following,setFollowing]=useState(null)
    const pages = useSelector(state=>state.pages.pagesInView).filter(page=>page)
    useLayoutEffect(()=>{
        dispatch(fetchProfile(pathParams)).then(result=>{
                checkResult(result,payload=>{
                const {profile}=payload
                    if(profile){
                        getContent()
                    }
                
                },()=>{
                })
        })
    },[])
   
    useEffect(()=>{
            
    },[profile])
    const getContent=()=>{
        dispatch(setPagesInView({pages:[]}))
            dispatch(setCollections({collections:[]}))
            localStorage.getItem("token")?dispatch(getProtectedProfilePages({profile:profile})):dispatch(getPublicProfilePages({profile:profile}))
            localStorage.getItem("token")?dispatch(getProtectedProfileCollections({profile:profile})):dispatch(getPublicProfileCollections({profile:profile}))
        setPending(false)
    }
    useEffect(()=>{
checkIfFollowing()

    },[profile,currentProfile])
    const checkIfFollowing =()=>{
        if(currentProfile){
        if(currentProfile.id==profile.id){
            setFollowing(true)
            return
        }
    if( profile && profile.followers){
        let found = profile.followers.find(follow=>follow.followerId==currentProfile.id)
         setFollowing(found)
     }else{
        setFollowing( null)
     }
    }
    }
   
    const onClickFollow = debounce(()=>{
        if(currentProfile){
        if(profile && currentProfile.id !=profile.id){
            if(following){    

              dispatch(deleteFollow({follow:following})).then(res=>
                checkResult(res,payload=>{
                  
        
                },err=>{

                })
              )
              
                }else{
                if(profile){
                    const params = {
                        follower:currentProfile,
                        following:profile
                    }
                    dispatch(createFollow(params)).then(res=>{
                     
                    })
                }
               
            }}else{
                setSuccess(null)
                setError("This is you silly")
                
            }
        }else{
            setSuccess(null)
            setError("Please login first!")
            
        }
    },[20])

 

    return(
        <div className="">
            <div className="pt-2 md:pt-8 mx-2">
                <ProfileCard profile={profile} following={following} onClickFollow={onClickFollow}/>
            </div>
            {isPhone? <label className='flex  mt-8 flex-row mx-2'>
<span className='my-auto text-emerald-800 mx-2 w-full mont-medium'> Search</span>
  <input type='text' value={search} onChange={(e)=>handleSearch(e.target.value)} className=' px-2 min-w-[19em] py-1 text-sm bg-transparent my-1 rounded-full border-emerald-700 border-1 text-emerald-800' />
  </label>:null}
                       {!pending?  <div role="tablist" className="tabs  mt-8 shadow-md mb-36 rounded-lg w-[96vw] mx-auto md:w-page tabs-lifted">
  <input type="radio" name="my_tabs_2" role="tab"  defaultChecked className="tab [--tab-bg:transparent] [--tab-border-color:emerald] bg-transparent focus:bg-emerald-200 text-emerald-800 text-xl" aria-label="Pages" />
  <div role="tabpanel" className="tab-content w-[96vw]  mx-auto md:w-page border-emerald-400 border-3 h-[100%] rounded-lg border-3 border-emerald-400 ">
  <IndexList items={pages}/>
  </div>
  <input
    type="radio"
    name="my_tabs_2"
    role="tab"
    className="tab  [--tab-border-color:emerald] [--tab-bg:transparent] active:bg-emerald-200  text-emerald-800 text-xl"
    aria-label="Collections"
    />
  <div role="tabpanel"  className="tab-content w-[96vw]  md:w-page mx-auto border-emerald-400 border-3 h-[100%] rounded-lg  border-3 border-emerald-400 ">
  <IndexList items={collections}/>
</div>
</div>:<div className="skeleton bg-slate-200 h-page w-[96vw] mx-auto md:w-page"></div>}
</div>    

            )
}
export default ProfileContainer