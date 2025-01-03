import { useEffect ,useLayoutEffect, useState} from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { clearCollections, fetchCollection, fetchCollectionProtected, getSubCollectionsProtected, getSubCollectionsPublic } from "../../actions/CollectionActions"
import add from "../../images/icons/add_box.svg"
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
export default function CollectionContainer(props){
    const dispatch = useDispatch()
    const {pathName}=useLocation()
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const collection = useSelector(state=>state.books.collectionInView)
    const pending = useSelector(state=>state.books.loading)
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


        dispatch(postCollectionRole({type:collection.followersAre??RoleType.commenter,profileId:currentProfile.id,collectionId:collection.id}))
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
    },[id])
  
    const getContent= ()=>{
        dispatch(clearCollections())
        dispatch(clearPagesInView())
        let token = localStorage.getItem("token")
        token?dispatch(getCollectionStoriesProtected(params)):dispatch(getCollectionStoriesPublic(params))
    
        token?dispatch(getSubCollectionsProtected(params)):dispatch(getSubCollectionsPublic(params))
        }
    const findRole = ()=>{
    
            let foundRole= collection && collection.roles&& currentProfile?collection.roles.find(role=>role.profileId==currentProfile.id):null
           if(foundRole){
            const fRole = new Role(foundRole.id,currentProfile,collection,foundRole.role,foundRole.created)
            setRole(fRole)
           }else{
            setRole(null)
           }
          
             
                    
    }

           
    useEffect(findRole,[collection])   
    useLayoutEffect(()=>{
       
        findRole()
        getContent()
    },[collection])
  

   
    const CollectionInfo=({collection})=>{
       
        
        if(!collection){
            return(<div>Loading</div>)
        }
       
        return(<div className="h-fit max-w-[100vw] sm:max-w-[60em] mx-auto sm:pb-8 sm:w-48 sm:border-2 p-4 sm:border-emerald-800  mx-8 mt-4 md:mx-8 md:mt-8  rounded-lg mb-8 text-left">
    <h3 className="m-8  text-emerald-800 text-3xl">{collection.title}</h3>
        <h3 className="text-emerald-800  md:mx-8 rounded-lg p-4">{collection.purpose}</h3>
        <div className={"md:ml-8 mt-8 flex flex-row"}>
   {!role?<button
   onClick={handleFollow}
   className={"bg-emerald-700 text-white  min-w-36 px-4 rounded-full text-[1rem] sm:text-[1.2rem]"}>Follow</button>:
   <button 
   onClick={deleteFollow}
   className={"bg-emerald-500 text-white min-w-36 px-4 rounded-full text-[1rem] sm:text-[1.2rem]"} >
        {role.role}
   </button>}
   {currentProfile&& (collection.isOpenCollaboration || collection.profileId==currentProfile.id)?
   <div
    className="flex-row flex mx-2"
   >
    <img onClick={()=>navigate(Paths.addToCollection.createRoute(collection.id))
   }className="rounded-full bg-emerald-800 p-3 mr-2 my-auto"src={add}/>
   {collection.profileId==currentProfile.id?<img 
   onClick={()=>{
  
    navigate(Paths.editCollection.createRoute(collection.id))}}
   className="rounded-full bg-emerald-800 p-3  my-auto"src={edit}/>:null}</div>:null}



   
   </div></div>)}
if(!collection){
    if(pending){
    return(<div>
        <h6 className="text-emerald-800"> Loading</h6>
    </div>)
    }else{
        <div>
            <h6 className="text-emerald-800">Collection Not Found</h6>
        </div>
    }
}
if(collection && collections){
  

    return(<>

<div className="pb-[10rem] ">       {collection?<CollectionInfo collection={collection}/>:<div className="skeleton bg-slate-200 w-72 h-36 m-2"/>}
        <div className="text-left  max-w-[100vw]    mx-auto ">
            {collection && collections.length>0? <div>
                <h3 className="text-2xl text-emerald-800 font-bold text-center">Anthologies</h3>:
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
            <h6 className="text-2xl mb-8 w-fit text-center text-slate-800 font-bold pl-4">Pages</h6>
        <div className=" max-w-[100vw] px-2 sm:max-w-[40em] mx-auto ">
        <PageList  isGrid={false}/>
        </div>
            </div>
            </div> 
    </>)
}

}