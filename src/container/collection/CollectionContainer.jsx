import { useEffect ,useLayoutEffect, useState} from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { clearCollections, fetchCollection, fetchCollectionProtected, getSubCollectionsProtected, getSubCollectionsPublic } from "../../actions/CollectionActions"
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
import { clearPagesInView } from "../../actions/PageActions"
import { postCollectionHistory } from "../../actions/HistoryActions"
import ProfileCircle from "../../components/profile/ProfileCircle"
import loadingJson from "../../images/loading.gif"
export default function CollectionContainer(props){
    const dispatch = useDispatch()
    const {pathName}=useLocation()
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const collection = useSelector(state=>state.books.collectionInView)
    const pending = useSelector(state=>state.books.loading)
    const [loading,setLoading]=useState(true)
    const sightArr = [RoleType.commenter,RoleType.editor,RoleType.reader,RoleType.writer]
    const writeArr = [RoleType.editor,RoleType.writer]
    const [canUserAdd,setCanUserAdd]=useState(false)
    const [canUserEdit,setCanUserEdit]=useState(false)
    const [canUserSee,setCanUserSee]=useState(false)
    const [role,setRole]=useState(null)
    const collections = useSelector(state=>state.books.collections)
    const params = useParams()
    const {id}=params
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
            window.alert("please sign in")
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
                window.alert(err.message)
            })
        })
    }else{
        window.alert("Please Sign In")
    }
    }
    const getCol=()=>{
        currentProfile?dispatch(fetchCollectionProtected(params)):dispatch(fetchCollection(params))
    }
    useEffect(()=>{
       getCol()
    },[currentProfile,id])
    useLayoutEffect(()=>{
        findRole()
        // if(collection && currentProfile){
    //     if(collection.roles){

          
    //       const found =   collection.roles.find(colRole=>{
    //                return colRole&& colRole.profile && colRole.profileId == currentProfile.id
    //             })
    //             if(found){

           
    //     const inst =new Role(found.id,currentProfile,collection,found.role,found.created)
    //     setRole(inst) 
    // }
    //         }}
    },[collection,currentProfile])
    const soUserCanSee=()=>{
        setLoading(true)
       if(collection){
       
            if( !collection.isPrivate){
                setCanUserSee(true)

                    return 
             }
            if(currentProfile){
            let found =  collection.roles.find(colRole=>{
                return colRole && colRole.profileId == currentProfile.id
            })
                 if(found && sightArr.includes(found.role)||collection.profileId==currentProfile.id){
                setCanUserSee(true)
                    }else{
                setCanUserSee(false)
            }
        }
        if(!canUserSee){
            if(collection.parentCollections){
                    collection.parentCollections.find(cTc=>{
                        const col = cTc.parentCollection
                        if(!col.isPrivate){
                            setCanUserSee(true)
                        }else{
                        if(col.roles){
                     let found = col.roles.find(colRole=>{
                            return colRole && colRole.profileId == currentProfile.id
                        })
                    if(found || sightArr.includes(found.role)||collection.profileId==currentProfile.id){
                            setCanUserSee(true)
                                }else{
                            setCanUserSee(false)
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
        if(collection&&currentProfile && collection.roles){    
            let found =  collection.roles.find(colRole=>{
                return colRole && colRole.profileId == currentProfile.id
            })
            if((found && RoleType.editor==found.role)||collection.profileId==currentProfile.id){
                setCanUserEdit(true)
            }else{
                setCanUserEdit(false)
            }
        } 
    }
    useEffect(()=>{
       soUserCanSee() 
       soUserCanAdd()   
       soUserCanEdit() 
    },[currentProfile,collection])
    const getContent= ()=>{
        dispatch(clearCollections())
        dispatch(clearPagesInView())
        let token = localStorage.getItem("token")
        token?dispatch(getCollectionStoriesProtected(params)):dispatch(getCollectionStoriesPublic(params))
    
        token?dispatch(getSubCollectionsProtected(params)):dispatch(getSubCollectionsPublic(params))
        }
    const findRole = ()=>{
     
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
    },[])
  

   
    const CollectionInfo=({collection})=>{  
        if(!collection){
            return(<div>Loading</div>)
        }
       
        return(<div><div className="h-fit w-[96vw] mx-auto lg:w-[50em] mx-auto mt-4 sm:pb-8 border-3 p-4 border-emerald-600   rounded-lg mb-8 text-left">
                {collection.profile?<div className="flex flex-row"><div className="min-w-8 min-h-8  my-auto"><ProfileCircle profile={collection.profile}/></div><span onClick={()=>navigate(Paths.profile.createRoute(collection.profile.id))} className="text-emerald-800 mx-2 my-auto rounded-lg ">{collection.profile.username}</span></div>:null}
                <div className="mx-1 mt-4 md:mx-8 md:mt-8 ">
    <h3 className="mt-8 mb-2  text-emerald-800 lora-medium text-xl sm:text-3xl">{collection.title}</h3>

        <h6 className="text-emerald-800  open-sans-medium rounded-lg py-4 px-2">{collection.purpose}</h6>
</div>
        <div className={" w-36  mx-auto flex flex-row"}>
   {!role?<div
   onClick={handleFollow}
   className={"border-emerald-600 bg-transparent border-2 text-emerald-600  mont-medium min-w-36 px-4 rounded-full text-[1rem] sm:text-[1.2rem] mx-4 sm:mx-6"}><h6 className="px-4 py-3 mont-medium  ">Follow</h6></div>:
   <div
   onClick={deleteFollow}
   className={"bg-emerald-500 text-white min-w-36 px-4 rounded-full flex text-[1rem] "} >
       <h6 className="mx-auto my-auto text-[1rem] sm:text-[1.2rem]"> {role.role}</h6>
   </div>}
   <div
    className="flex flex-row   "
   >
   {canUserAdd?
    <img onClick={()=>navigate(Paths.addToCollection.createRoute(collection.id))
   }className="rounded-full bg-emerald-800 p-3  mx-2 my-auto"src={add}/>:null}
   {canUserEdit?
   
   <img 
   onClick={()=>{
  
    navigate(Paths.editCollection.createRoute(collection.id))}}
   className="rounded-full bg-emerald-800 p-3  my-auto"src={edit}/>:null}</div>:




   
   </div></div></div>)}

if(collection&&canUserSee&&!loading){
  

    return(<>

<div className="pb-[10rem] ">       {collection?<CollectionInfo collection={collection}/>:<div className="skeleton bg-slate-200 w-72 h-36 m-2"/>}
        <div className="text-left  max-w-[100vw]    mx-auto ">
            {collections && collections.length>0? <div>
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
                    <p className="mx-auto">Fin</p>
                    </div>
                }
                >
                    {collections.map(col=>{
                       return <BookListItem book={col}/>
                    })}
                </InfiniteScroll>
            </div>
            </div>:null}
            <h6 className="text-2xl mb-8 w-fit text-center  lora-medium text-emerald-800 font-bold pl-4">Pages</h6>
        <div className=" max-w-[100vw] px-2 sm:max-w-[40em] mx-auto ">
        <PageList  isGrid={false}/>
        </div>
            </div>
            </div> 
    </>)
}else{
    if(!loading){
     
        return(<div>
            <div className="skeleton h-fit w-[96vw] mx-auto lg:w-[50em] lg:h-[25em] bg-slate-100 mx-auto mt-4 sm:pb-8 p-4  bg-slate-50 rounded-lg mb-8 text-left"/>
        <div className=" max-w-[100vw] skeleton px-2 sm:max-w-[40em] bg-slate-100 mx-auto  h-40"/></div>)
    }else{

            return(<div className="mx-auto my-36"><h6 className=" lora-bold text-xl text-emerald-800">Collection does not exist</h6></div>)
    
    }
}

}