
import { useLocation, useParams } from "react-router-dom"
import { useContext, useEffect, useLayoutEffect,useState} from "react"
import { useDispatch,useSelector } from "react-redux"
import { 
            fetchProfile,
            setProfileInView,
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
import { setCollections } from "../../actions/CollectionActions"
import { useMediaQuery } from "react-responsive"
import Context from "../../context"
import sortAlphabet from "../../images/icons/sort_by_alpha.svg"
import clockArrowUp from "../../images/icons/clock_arrow_up.svg"
import clockArrowDown from "../../images/icons/clock_arrow_down.svg"
function ProfileContainer(props){
    ReactGA.send({ hitType: "pageview", page: window.location.pathname+window.location.search, title: "About Page" })
    const {setError,setSuccess}=useContext(Context)
    const isPhone =  useMediaQuery({
        query: '(max-width: 600px)'
      })
      const [search,setSearch]=useState("")
          const dispatch = useDispatch()
      
    const pathname = useLocation().pathname
    const pathParams = useParams()
    const {id}=pathParams
    const [sortAlpha,setSortAlpha]=useState(true)
    const [sortTime,setSortTime]=useState(true)
    const [canUserSee,setCanUserSee]=useState(false)
    const currentProfile = useSelector(state=>state.users.currentProfile)
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
        // dispatch(setPagesInView({pages:[]}))
        //     dispatch(setCollections({collections:[]}))
        //     currentProfile?dispatch(getProtectedProfilePages({profile:profile})):dispatch(getPublicProfilePages({profile:profile}))
        //    currentProfile?dispatch(getProtectedProfileCollections({profile:profile})):dispatch(getPublicProfileCollections({profile:profile}))
     
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
    },[id,currentProfile])
    useEffect(()=>{
        if(profile){
            checkIfFollowing()
            getContent()
        }
    },[profile])
  
    const handleSearch = (value)=>{
        setSearch(value)
    }
    const checkIfFollowing =()=>{
        
        if(currentProfile&&profile){
            if(!profile.isPrivate){
                setCanUserSee(true)
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

 
    const handleAlphaClick=()=>{
        
            let newValue = !sortAlpha
            setSortAlpha(newValue)
            handleSortAlpha()
   
    }
    const handleTimeClick=()=>{
        
        let newValue = !sortTime
        setSortTime(newValue)
        handleSortTime()

}
    return(
        <div className="">
            <div className="pt-2 md:pt-8 mb-8 mx-2">
                <ProfileCard profile={profile} following={following} onClickFollow={onClickFollow}/>
            </div>
            {isPhone? <label className='flex   my-1 border-emerald-400 border-2 rounded-full mt-8 flex-row mx-2'>
<span className='my-auto text-emerald-800 ml-3 mr-1 w-full mont-medium'> Search:</span>
  <input type='text' value={search} onChange={(e)=>handleSearch(e.target.value)} className=' px-2 w-[100%] py-1 text-sm bg-transparent my-1 rounded-full border-emerald-700 border-1 text-emerald-800' />
  </label>:null}

{!canUserSee ?<div className="skeleton bg-slate-100 mx-auto h-page md:w-page"/>:                  
<div role="tablist" className="tabs   shadow-md mb-36 rounded-lg w-[96vw] mx-auto  md:w-page tabs-lifted">
    <input type="radio" name="my_tabs_2" role="tab"  defaultChecked className="tab [--tab-bg:transparent] [--tab-border-color:emerald] bg-transparent focus:bg-emerald-200 text-emerald-800 text-xl" aria-label="Pages" />
    <div role="tabpanel" className="tab-content w-[96vw]  mx-auto md:w-page  border-emerald-400 border-3  rounded-lg border-3 border-emerald-400 ">
        <IndexList items={pages} />
    </div>
    <input
    type="radio"
    name="my_tabs_2"
    role="tab"
    className="tab  [--tab-border-color:emerald] [--tab-bg:transparent] active:bg-emerald-200  text-emerald-800 text-xl"
    aria-label="Collections"
    />  
    <div role="tabpanel"  className="tab-content w-[96vw]  md:w-page mx-auto border-emerald-400 border-3 h-[100%] rounded-lg  border-3 border-emerald-400 ">
  <IndexList items={collections} />

    </div> 

{!isPhone? <div className=" min-w-[27em] mx-1 sm:min-w-[22rem] flex 0 h-fit justify-between flex-row">

    <label className='flex  mx-2 my-1 border-emerald-400 border-2 rounded-full  flex-row mx-2'>
<span className='my-auto text-emerald-800 ml-3 mr-1 w-full mont-medium'> Search:</span>
  <input type='text' value={search} onChange={(e)=>handleSearch(e.target.value)} className=' px-2 w-[100%] py-1 text-sm bg-transparent my-1 rounded-full border-emerald-700 border-1 text-emerald-800' />
  </label>  

 {!isPhone? <div className="flex-row flex w-fit ">  
 <img src={sortAlphabet} onClick={handleAlphaClick}
 className="my-auto text-emerald-800  mx-2 h-8"/>
    <img src={sortTime?clockArrowUp:clockArrowDown} onClick={handleTimeClick} className="my-auto text-emerald-800 h-8"/></div>:null}</div>
    :  <div className=" min-w-20 min-h-10 max-w-[96vw] mx-8 md:max-w-page flex flex-row">
       <a  onClick={handleAlphaClick} className="btn  border-none max-h-8 bg-transparent"> <img src={sortAlphabet} 
   /></a>
<a className={"my-auto mx-2 btn max-h-8 border-none bg-transparent"}
onClick={handleTimeClick}> <img src={sortTime?clockArrowDown:clockArrowUp}/></a></div>}
  
</div>

}
</div>    

            )
}
export default ProfileContainer