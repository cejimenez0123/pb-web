import { useContext, useEffect ,useLayoutEffect, useState} from "react"
import { useDispatch, useSelector } from "react-redux"
import {  useNavigate, useParams } from "react-router-dom"
import { clearCollections, fetchCollection, fetchCollectionProtected, getRecommendedCollections, getRecommendedCollectionsProfile, getRecommendedCollectionStory, getSubCollectionsProtected, getSubCollectionsPublic } from "../../actions/CollectionActions"
import add from "../../images/icons/add_circle.svg"
import PageList from "../../components/page/PageList"
import { getCollectionStoriesProtected, getCollectionStoriesPublic } from "../../actions/StoryActions"
import edit from "../../images/icons/edit.svg"
import Paths from "../../core/paths"
import InfiniteScroll from "react-infinite-scroll-component"
import BookListItem from "../../components/BookListItem"
import Role from "../../domain/models/role"
import { deleteCollectionRole, postCollectionRole } from "../../actions/RoleActions"
import { RoleType } from "../../core/constants"
import checkResult from "../../core/checkResult"
import { appendToPagesInView, clearPagesInView } from "../../actions/PageActions"
import { postCollectionHistory } from "../../actions/HistoryActions"
import ProfileCircle from "../../components/profile/ProfileCircle"
import Context from "../../context"
import Enviroment from "../../core/Enviroment"
import ExploreList from "../../components/collection/ExploreList"

export default function CollectionContainer(props){
    const dispatch = useDispatch()

    const {setError}=useContext(Context)
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const collection = useSelector(state=>state.books.collectionInView)

    const [loading,setLoading]=useState(true)
  
    const sightArr = [RoleType.commenter,RoleType.editor,RoleType.reader,RoleType.writer]
    const writeArr = [RoleType.editor,RoleType.writer]
    const [canUserAdd,setCanUserAdd]=useState(false)
    const [canUserEdit,setCanUserEdit]=useState(false)
    const [canUserSee,setCanUserSee]=useState(false)
    const [role,setRole]=useState(null)
    const [hasMore,setHasMore]=useState(true)
    const params = useParams()
    const [recommendedCols,setRecommendedCols]=useState([])
    const collections = useSelector(state=>state.books.collections)

    const getRecommendations =()=>{
        if(collection && collection.id){
          
        if(collections.length>0){
        for(let i = 0;i<collections.length;i+=1){
          if(collection[i] && collection[i].id){  
        dispatch(getRecommendedCollectionStory({collection:collection[i]})).then(res=>{
            checkResult(res,payload=>{
                let stories = payload.pages
                let recommended =stories.map(story=>{
                       let page = story
                        page["recommended"] = true
                        return page
                })
                if(recommended){
                  dispatch(appendToPagesInView({pages:recommended}))
                  setHasMore(false)
                }

            },err=>{
                setHasMore(false)
            })
        })
    }}}


            dispatch(getRecommendedCollectionStory({collection:collection})).then(res=>{
                checkResult(res,payload=>{
                
                
                    if(payload.pages){
                        let stories = payload.pages
                        let recommended =stories.map(story=>{
                               let page = story
                                page["recommended"] = true
                                return page
                        })
                        if(recommended){
                          dispatch(appendToPagesInView({pages:[Enviroment.blankPage,...recommended]}))
                          setHasMore(false)
                        }

                    }
                 
    
                },err=>{
                    setHasMore(false)
                })
            })
        }
    }
    
    const getMore=()=>{
    for(let i = 0;i<collections.length;i+=1){
        if(collections[i]&&collections[i].storyIdList){
            let stories= collections[i].storyIdList.map(sTc=>sTc.story)

            dispatch(appendToPagesInView({pages:stories}))
        }
      
        }
        if((currentProfile && collection && currentProfile.id==collection.profileId)||canUserAdd||canUserEdit){
            getRecommendations()
        }
            setHasMore(false)
    }

 
    useEffect(()=>{
     
            getMore()
        
        dispatch(getRecommendedCollections({collection})).then(res=>{
            checkResult(res,payload=>{
       
                if(payload.collections){
                    let newRecommendations = payload.collections.filter(col=>{
                        let found = collection.childCollections.find(cTc=>cTc.childCollectionId ==col.id)
                        return col.id !=collection.id && !found
                    })
                    if(newRecommendations.length==0){
                        if(currentProfile){
                            dispatch(getRecommendedCollectionsProfile())
                        }
                    }else{

                
                setRecommendedCols(newRecommendations)
            }
                }

            },err=>{
                if(currentProfile){
                    dispatch(getRecommendedCollectionsProfile())
                }
            })
    })
      
    },[collection])
    useEffect(()=>{
        if(localStorage.getItem("token")&&recommendedCols.length==0){
            dispatch(getRecommendedCollectionsProfile())
        }
    },[recommendedCols])

 
     useLayoutEffect(()=>{
        if(currentProfile && collection){
            dispatch(postCollectionHistory({profile:currentProfile,collection}))
        }
    },[])
    const deleteFollow=()=>{
        if(currentProfile){
            dispatch(deleteCollectionRole({role})).then(res=>{
                checkResult(res,payload=>{
             
                        getCol()
                  
                   
                },err=>{

                })
            })

        }else{
            setError("Please sign in")
        }
    }
    const handleFollow = ()=>{
if(currentProfile){
    let type = collection.followersAre??RoleType.commenter
        if(currentProfile.id == collection.profileId){
            type = RoleType.editor
        }

        dispatch(postCollectionRole({type:type,profileId:currentProfile.id,collectionId:collection.id}))
        .then(res=>{
            checkResult(res,payload=>{
           
          getCol()
            },err=>{
                setError(err.message)
            })
        })
    }else{
        setError("Please Sign In")
    }
    }
    const getCol=()=>{
        localStorage.getItem("token")?dispatch(fetchCollectionProtected(params)):dispatch(fetchCollection(params))
    }
    useLayoutEffect(()=>{
       getCol()
    },[currentProfile,location.pathname])

    useLayoutEffect(()=>{
        findRole()
        soUserCanSee()
        setLoading(false)

    },[collection,currentProfile])
    const soUserCanSee=()=>{
        
       if(collection){
       
            if( !collection.isPrivate){
                setCanUserSee(true)
                    return 
             }
             
            if(currentProfile){
                if(currentProfile.id==collection.profileId){
                    setCanUserSee(true)
                    return
                }
            let found =  collection.roles.find(colRole=>{
                return colRole && colRole.profileId == currentProfile.id
            })
                 if(found && sightArr.includes(found.role)||collection.profileId==currentProfile.id){
                setCanUserSee(true)
                return
                    }else{
                setCanUserSee(false
              
                )
                return
            }
        }
        if(!canUserSee){
            if(collection.parentCollections){
                    collection.parentCollections.find(cTc=>{
                        const col = cTc.parentCollection
                        if(!col.isPrivate){
                            setCanUserSee(true)
                            return
                        }else{
                            if(col.roles){
                     let found = col.roles.find(colRole=>{
                            return colRole && colRole.profileId == currentProfile.id
                        })
                    if(found || sightArr.includes(found.role)||collection.profileId==currentProfile.id){
                            setCanUserSee(true)
                              return
                        }else{
                            setCanUserSee(false)
                            return
                        }
                    }}
                    })
            }
        }
    
    }
setLoading(false)}
    const soUserCanAdd = ()=>{
        if(collection&&currentProfile&& collection.roles){    
            let found =  collection.roles.find(colRole=>{
                return colRole && colRole.profileId == currentProfile.id
            })
            if(collection.isOpenCollaboration||(found && writeArr.includes(found.role))||collection.profileId==currentProfile.id){
                setCanUserAdd(true)
            }else{
                setCanUserAdd(false)
            }
        }
    }
    const soUserCanEdit=()=>{
        if(currentProfile && collection){
            
            
            if(collection.profileId==currentProfile.id){
            setCanUserEdit(true)
            return
        }
        if(collection&&currentProfile && collection.roles){    
            let found =  collection.roles.find(colRole=>{
                return colRole && colRole.profileId == currentProfile.id
            })
            if((found && RoleType.editor==found.role)||collection.profileId==currentProfile.id){
                setCanUserEdit(true)
                return
            }else{
                setCanUserEdit(false)
                return
            }
        } }
    }
    useLayoutEffect(()=>{
       soUserCanSee() 
       soUserCanAdd()   
       soUserCanEdit() 
    },[currentProfile,collection])
    const getContent= ()=>{
        dispatch(clearCollections())
        dispatch(clearPagesInView())
        let token=localStorage.getItem("token")
        token?dispatch(getCollectionStoriesProtected(params)):dispatch(getCollectionStoriesPublic(params))
    
        token?dispatch(getSubCollectionsProtected(params)):dispatch(getSubCollectionsPublic(params))
        }
    const findRole = ()=>{
        if(collection && currentProfile&& collection.profileId==currentProfile.id){
            setRole(new Role("owner",currentProfile,collection,RoleType.editor,new Date()))
            return
        
        }
            if(collection && currentProfile && collection.roles){
                let foundRole=  collection.roles.find(role=>{
                 
                    return role.profileId==currentProfile.id})
            
                if(foundRole){  
                    const fRole = new Role(foundRole.id,currentProfile,collection,foundRole.role,foundRole.created)
                    setRole(fRole)
                 }else{
                    setRole(null)
                }
        }               
    }
  
   
    useLayoutEffect(()=>{

        findRole()
        getContent()
    },[collection])

   
    const CollectionInfo=({collection})=>{  
        if(loading||!collection){
            return(<div className="lg:w-info h-info w-[96vw] skeleton bg-slate-200"></div>)
        }
       
        return(<div><div className=" w-[96vw] mx-auto lg:w-info h-fit lg:h-info mx-auto mt-4 sm:pb-8 border-3 p-4 border-emerald-600   rounded-lg mb-8 text-left">
                {collection.profile?<div className="flex flex-row"><div className="min-w-8 min-h-8  my-auto text-emerald-800"><ProfileCircle profile={collection.profile}/></div></div>:null}
                <div className="mx-1 mt-4 md:mx-8 md:mt-8 ">
    <h3 className="mt-8 mb-2  text-emerald-800 lora-medium text-xl sm:text-3xl">{collection.title}</h3>

        <h6 className="text-emerald-800  open-sans-medium rounded-lg py-4 px-2">{collection.purpose}</h6>
</div>
        <div className={" w-36  mx-auto flex flex-row"}>
   {!role?<div
   onClick={handleFollow}
   className={"border-emerald-600 bg-transparent border-2 sm:ml-4 text-emerald-600  mont-medium w-40 min-h-12 max-h-14 px-4 rounded-full text-[1rem] sm:text-[1.2rem] mx-4 sm:mx-6"}>
    <h6 className="px-4 py-3 mont-medium  text-[1rem] sm:text-[1.2rem] text-center  ">Follow</h6></div>:
   <div
   onClick={deleteFollow}
   className={"bg-emerald-500 text-white w-40 px-4 sm:ml-4 min-h-12 max-h-14 rounded-full flex text-[1rem] "} >
       <h6 className="mx-auto mont-medium my-auto text-[1rem]"> {role.role}</h6>
   </div>}
   <div
    className="flex flex-row   "
   >
   {canUserAdd?
    <img onClick={()=>navigate(Paths.addToCollection.createRoute(collection.id))
   }className="rounded-full bg-emerald-800 p-2 mx-2 my-auto"src={add}/>:null}
   {canUserEdit?
   
   <img 
   onClick={()=>{
  
    navigate(Paths.editCollection.createRoute(collection.id))}}
   className="rounded-full bg-emerald-800 p-2  my-auto"src={edit}/>:null}</div>:




   
   </div></div></div>)}
const bookList=()=>{
    return(<div>
        <h3 className="text-2xl lora-bold text-emerald-800 font-bold text-center">Anthologies</h3>:
    <div>
        <InfiniteScroll
        dataLength={collections.length}
        className="flex flex-row py-8"
        next={()=>{}}
        hasMore={false} // Replace with a condition based on your data source
        loader={<p>Loading...</p>}
        endMessage={
            <div className="text-emerald-800 p-5">
            <p className="mx-auto lora-medium">Fin</p>
            </div>
        }
        >
            {collections.map((col,i)=>{
               return <BookListItem key={col.id+i}book={col}/>
            })}
        </InfiniteScroll>
    </div>
    </div>)
}
if(collection&&canUserSee&&!loading){
  

    return(<>

<div className=" flex flex-col ">   
<div>
  {collection?<CollectionInfo collection={collection}/>:<div className="skeleton bg-slate-200 max-w-[96vw] mx-auto md:w-info h-info"/>}
</div>
<div>
            {collections && collections.length>0?bookList() :null}
            </div>
            <div className=" mx-auto  max-w-[96vw] md:w-page  min-h-[20em]">     
            <h6 className="text-2xl mb-8 w-fit text-center  lora-bold text-emerald-800 font-bold pl-4">Pages</h6>

        <PageList  isGrid={false} hasMore={hasMore} getMore={getMore}  forFeedback={collection&&collection.type=="feedback"}/>
        </div>
    <ExploreList items={recommendedCols}/>
         
         </div>
      
    </>)
}else{
    if(loading){
     
        return(<div>
            <div className="skeleton h-fit w-[96vw] mx-auto lg:w-[50em] lg:h-[25em] bg-slate-100 mx-auto mt-4 sm:pb-8 p-4  bg-slate-50 rounded-lg mb-8 text-left"/>
        <div className=" max-w-[100vw] skeleton px-2 sm:max-w-[40em] bg-slate-100 mx-auto  h-40"/></div>)
    }else{

            return(<div className="mx-auto my-36 flex"><h6 className=" lora-bold text-xl  mx-auto text-emerald-800">Collection does not exist</h6></div>)
    
    }
}

}