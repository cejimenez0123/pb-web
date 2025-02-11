
import { useLocation, useParams } from "react-router-dom"
import { useContext, useEffect, useLayoutEffect,useState} from "react"
import { useDispatch,useSelector } from "react-redux"
import { 
            fetchProfile,
        
        } from "../../actions/UserActions" 
import stream from "../../images/stream.svg"
import ProfileCard from "../../components/ProfileCard"
import "../../styles/Profile.css"
import checkResult from "../../core/checkResult"
import ReactGA from 'react-ga4'
import IndexList from "../../components/page/IndexList"
import { getProtectedProfilePages,getPublicProfilePages, setPagesInView } from "../../actions/PageActions.jsx"
import { createFollow, deleteFollow } from "../../actions/FollowAction"
import { getProtectedProfileCollections, getPublicProfileCollections } from "../../actions/CollectionActions"
import { debounce } from "lodash"
import { setCollections } from "../../actions/CollectionActions"
import { useMediaQuery } from "react-responsive"
import Context from "../../context"
import sortAlphabet from "../../images/icons/sort_by_alpha.svg"
import clockArrowUp from "../../images/icons/clock_arrow_up.svg"
import clockArrowDown from "../../images/icons/clock_arrow_down.svg"
import Paths from "../../core/paths.js"
import { Helmet } from "react-helmet"
import Enviroment from "../../core/Enviroment.js"
import ErrorBoundary from "../../ErrorBoundary.jsx"
import PageList from "../../components/page/PageList.jsx"
function ProfileContainer(props){
    ReactGA.send({ hitType: "pageview", page: window.location.pathname+window.location.search, title: "About Page" })
    const {setError,setSuccess,currentProfile}=useContext(Context)
    
    const isPhone =  useMediaQuery({
        query: '(max-width: 600px)'
      })
      const [search,setSearch]=useState("")
          const dispatch = useDispatch()
    const [showPageList,setShowPageList]=useState(true)
    const pathname = useLocation().pathname
    const pathParams = useParams()
    const {id}=pathParams
    const [sortAlpha,setSortAlpha]=useState(true)
    const [sortTime,setSortTime]=useState(true)
    const [canUserSee,setCanUserSee]=useState(false)
 
    const profile = useSelector(state=>state.users.profileInView)
  

    const collections = useSelector(state=>state.books.collections)
    .filter(col=>col).filter(col=>{
        if(search.length>0){
         return col.title.toLowerCase().includes(search.toLowerCase())
        }else{
         return true
        }
    
       })
 
    const pages = useSelector(state=>state.pages.pagesInView).filter(page=>page).filter(page=>{
        if(search.length>0){
         return page.title.toLowerCase().includes(search.toLowerCase())
        }else{
         return true
        }
    
       })
   
    const handleSortTime=debounce(()=>{
    
            setSortTime(!sortTime)
            let list = collections
          list = list.sort((a,b)=>{
         
                if(sortTime){
                    return new Date(a.created)< new Date(b.created)
                     
                      
                    }else{
                     return new Date(a.created) > new Date(b.created)
                            }
            })
        dispatch(setCollections({collections:list}))
        let arr = pages
     let newArr = arr.sort((a,b)=>{
         
                if(sortTime){
            return new Date(a.created)< new Date(b.created)
          
            }else{
                  return new Date(a.created)> new Date(b.created)
                                     
                    }
            })
        dispatch(setPagesInView({pages:newArr}))
    },10)
    const handleSortAlpha=debounce(()=>{
     
   
        let list =collections
      let newList = list.sort((a,b)=>{
           
            if(sortAlpha){
                return a.title.toLowerCase() < b.title.toLowerCase()
                
            }else{
                   return a.title.toLowerCase() > b.title.toLowerCase()
                }
                   
        })
     
        dispatch(setCollections({collections:newList}))

        let arr = pages
      arr = arr.sort((a,b)=>{
            if(sortAlpha){
        
             return   a.title.toLowerCase() < b.title.toLowerCase()
       
            }else{
                return (a.title.toLowerCase() > b.title.toLowerCase()) 
            }
        
        })

      dispatch(setPagesInView({pages:arr}))
    },10)


  
    const [following,setFollowing]=useState(null)

   
  
 
    const getContent=()=>{
        dispatch(setPagesInView({pages:[]}))
            dispatch(setCollections({collections:[]}))
            let token = localStorage.getItem("token")
            token?dispatch(getProtectedProfilePages({profile:{id}})):dispatch(getPublicProfilePages({profile:{id}}))
           token?dispatch(getProtectedProfileCollections({profile:{id}})):dispatch(getPublicProfileCollections({profile:{id}}))
     
    }
    useLayoutEffect(()=>{
        dispatch(fetchProfile(pathParams)).then(result=>{
                checkResult(result,payload=>{
                    checkIfFollowing()
                    getContent()
                },(err)=>{
                    setError(err.message)
                })
        })
      
    },[id])
    useEffect(()=>{
        if(profile){
            getContent()
        }
    },[profile])
    useLayoutEffect(()=>{
        checkIfFollowing()
    },[currentProfile,profile])
    const handleSearch = (value)=>{
        setSearch(value)
    }
    const checkIfFollowing =()=>{
        
        if(currentProfile&&profile){
            if(!profile.isPrivate){
                setCanUserSee(true)
                return
            }
        if(currentProfile.id==profile.id){
            setCanUserSee(true)
            setFollowing(true)
            return
        }
    if( profile && profile.followers){
        let found = profile.followers.find(follow=>follow.followerId==currentProfile.id)
        setCanUserSee(true) 
        setFollowing(found)
        return
     }else{

        setFollowing( null)
        return
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
    },[10])

 
    const handleAlphaClick=debounce(()=>{
        
            let newValue = !sortAlpha
            setSortAlpha(newValue)
            handleSortAlpha()
   
    },10)
    const handleTimeClick=debounce(()=>{
        
        let newValue = !sortTime
        setSortTime(newValue)
        handleSortTime()

},10)
const meta = ()=>{
    if(profile){
        return<Helmet>
            <title>{profile.username} | Plumbum</title>
    <meta name="description" content={profile.selfStatement || "Read this amazing story on Plumbum."} />
    {/* <meta name="keywords" content={page.hashtags.map((tag) => tag.name).join(", ")} />
    <meta property="og:title" content={page.title} />
    <meta property="og:description" content={page.description} /> */}
    <meta property="og:type" content="profile" />
    <meta property="og:url" content={Enviroment.domain+Paths.profile.createRoute(profile.id)} />
    <meta name="twitter:card" content="summary_large_image" />
       
       
        </Helmet>
    }else{
       return null
    }
}
    return(
        <ErrorBoundary>
        <div className="">
            {meta()}
            <div className="pt-2 md:pt-8 mb-8 mx-2">
                <ProfileCard profile={profile} following={following} onClickFollow={onClickFollow}/>
            </div>
            {isPhone?<span className="flex flex-row">
                 <label className='flex   my-1 border-emerald-400 border-2 border-opacity-70 w-[100%] rounded-full mt-8 flex-row mx-2'>

<span className='my-auto text-emerald-800 ml-3 mr-1 w-full mont-medium'> Search:</span>
  <input type='text' value={search} onChange={(e)=>handleSearch(e.target.value)} className=' px-2 w-[100%] py-1 text-sm bg-transparent my-1 rounded-full text-emerald-800' />
  </label></span>:null}

<div role="tablist" className="tabs   mb-36 rounded-lg w-[96vw] mx-auto  md:w-page tabs-boxed bg-transparent">
    <input type="radio" name="my_tabs_2" role="tab"  defaultChecked     className="tab  hover:min-h-10 [--tab-bg:transparent] rounded-full mont-medium  text-emerald-800  border-3 w-[96vw]  mx-auto md:w-page   text-xl" aria-label="Pages" />
    <div role="tabpanel" className="tab-content w-[96vw]  mx-auto md:w-page   rounded-lg border-3 ">
       {showPageList?<PageList items={pages}/>: <IndexList items={pages} />}
    </div>
    <input
    type="radio"
    name="my_tabs_2"
    role="tab"
    className="tab  hover:min-h-10 [--tab-bg:transparent] rounded-full mont-medium text-emerald-800 border-3 w-[96vw]  mx-auto md:w-page   text-xl"
    aria-label="Collections"
    />  
    <div role="tabpanel"  className="tab-content w-[96vw]  md:w-page mx-auto  [--tab-bg:transparent] border-3 bg-transparent ">
  <IndexList items={collections} />

    </div>
    <><div className=" my-auto  icon mx-1  flex  justify-between flex-row">
<img onClick={()=>setShowPageList(!showPageList)} src={stream}/>

 <img src={sortAlphabet} onClick={handleAlphaClick} 
 className="my-auto text-emerald-800 icon mx-2 "/>
    <img src={sortTime?clockArrowUp:clockArrowDown} onClick={handleTimeClick} 
    className="my-auto icon text-emerald-800"/>
    </div></> 
               </div>
</div>
</ErrorBoundary>
            )
}
export default ProfileContainer