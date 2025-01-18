import { useEffect, useLayoutEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import Paths from "../../core/paths"
import { deleteCollection, patchCollectionContent } from "../../actions/CollectionActions"
import deleteIcon from "../../images/icons/delete.svg"
import { deleteCollectionFromCollection, deleteStoryFromCollection, fetchCollection, fetchCollectionProtected, getSubCollectionsProtected, getSubCollectionsPublic } from "../../actions/CollectionActions"
import add from "../../images/icons/add_circle.svg"
import view from "../../images/icons/view.svg"
import { getCollectionStoriesProtected } from "../../actions/StoryActions"
import SortableList from "../../components/SortableList"
import checkResult from "../../core/checkResult"
import StoryToCollection from "../../domain/models/storyToColleciton"
import CollectionToCollection from "../../domain/models/ColllectionToCollection"
import { Dialog } from "@mui/material"
import RoleForm from "../../components/role/RoleForm"
import { useMediaQuery } from "react-responsive"
import { RoleType } from "../../core/constants"
import Role from "../../domain/models/role"
function getUniqueValues(array) {
    let unique = []
    return array.filter(item=>{
        let i = unique.indexOf(item.id)

        if(i<0){
            unique=[...unique,item.id]
            return true
        }
        return false
    })
  }
export default function EditCollectionContainer(props){
    const colInView = useSelector(state=>state.books.collectionInView)
    const params = useParams()
    const md = useMediaQuery({query:"(min-width:500px"})
    const loading = useSelector(state=>state.books.loading)
    const storyToCols = useSelector(state=>state.pages.storyToCollectionList)
    const colToCols = useSelector(state=>state.books.collectionToCollectionsList)
    const [isOpen,setIsOpen]=useState(false)
    const [followersAre,setFollowersAre]=useState(RoleType.commenter)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [error,setError]=useState(null)
    const [success,setSuccess]=useState(null)
    const stcList = storyToCols.map(stc=>{
                    return new StoryToCollection(stc.id,stc.index,stc.collection,stc.story,currentProfile)
                })
    const ctcList = colToCols.map(stc=>{
                                    return new CollectionToCollection(stc.id,stc.index,stc.childCollection,stc.parentCollection,currentProfile)})
                        
                
    const [newPages,setNewPages]=useState(stcList)
    const [newCollections,setNewCollections]=useState(ctcList)
    const [title,setTitle]=useState("")
    const [purpose,setPurpose]=useState("")
    const [isPrivate,setIsPrivate]=useState(true)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [openAccess,setOpenAccess]=useState(false)
    useLayoutEffect(()=>{
            currentProfile?dispatch(fetchCollectionProtected(params)):dispatch(fetchCollection(params))
    },[params.id,currentProfile])

    useEffect(()=>{
    if(colInView){
        setTitle(colInView.title)
        setPurpose(colInView.purpose)
        setIsPrivate(colInView.isPrivate)
        setFollowersAre(colInView.followersAre??RoleType.commenter)
        handleSetOpen(colInView.isOpenCollaboration)
        
        
    }
    },[colInView])
    useLayoutEffect(()=>{

        if(currentProfile){
            dispatch(getCollectionStoriesProtected(params))
            dispatch(getSubCollectionsProtected(params))
        }

                   
    },[colInView])
            
        useEffect(()=>{
console.log(storyToCols)
            let stcList = storyToCols.map(stc=>{
                           
                return new StoryToCollection(stc.id,stc.index,stc.collection,stc.story,currentProfile)
            })
                setNewPages(stcList)
                let newList = colToCols.map(stc=>{
                    return new CollectionToCollection(stc.id,stc.index,stc.childCollection,stc.parentCollection,currentProfile)
            })
        
                setNewCollections(newList)
            
        },[storyToCols,colToCols])
    
    const handleDeleteCollection = ()=>{
        const {id}=params

        dispatch(deleteCollection(params)).then(res=>checkResult(res,payload=>{
                navigate(Paths.myProfile())
        },err=>{

        }))
    }
 
   
    const updateCollection = (e)=>{
        e.preventDefault()
        dispatch(patchCollectionContent({id:params.id,isPrivate:isPrivate,isOpenCollaboration:isOpen,title,purpose,storyToCol:newPages,colToCol:newCollections,col:colInView,profile:currentProfile})).then(res=>{
            setError(null)
              setSuccess("Successful Update")

        },err=>{
            setSuccess(null)
            setError(err.message)
        })
    }
    const handleSetOpen=(open)=>{
        setIsOpen(open)
        if(open){
            const arr = [RoleType.writer,RoleType.editor]
            if(!arr.includes(followersAre)){
                setFollowersAre(RoleType.writer)
            }
        }
    }
    const collectionInfo=()=>{
        
        return(<div className="   sm:flex-row sm:flex justify-around lg:w-info mx-auto max-h-full  sm:pb-8 sm:w-48 p-4 sm:border-emerald-600 sm:border-2 mx-2 mt-4 md:mt-8 rounded-lg mb-8 sm:text-left">
    <div>
        <div>
    <input 
  onChange={(e)=>{
    setTitle(e.target.value)
}}
    type="text" className="bg-transparent text-emerald-800 px-2 py-2 w-full mb-4  lora-medium text-2xl" value={title}/>
       </div>
        <textarea onChange={e=>setPurpose(e.target.value)}className="  textarea  text-[0.8rem]  text-emerald-800  sm:mx-8 border-emerald-600 bg-transparent lg:h-[17em] max-w-[96vw] w-[100%] md:w-92 md:max-w-96 rounded-lg p-2" value={purpose}/>
        </div>
        
  
        
        <div className="">
        <div className=" mt-8 w-[100%]  justify-around md:ml-12  gap-2 grid  grid-cols-2  ">

   {currentProfile&& (colInView.isOpenCollaboration || colInView.profileId==currentProfile.id)?
   <span className="bg-emerald-800 flex  mont-medium text-white sm:ml-0 w-[10em] h-[5em] text-center mx-auto rounded-full"
   
   onClick={updateCollection}
   
   ><h6 className="mx-auto my-auto">Update</h6></span>
   :null}
 
   <div className="flex flex-row">
    
   <img onClick={()=>navigate(Paths.addToCollection.createRoute(colInView.id))
   }className=" bg-emerald-800 h-4 w-4 p-2 rounded-full mx-auto "
   src={add}/>
   <img
   onClick={()=>navigate(Paths.collection.createRoute(colInView.id))}
    className=" bg-emerald-800 w-4 h-4 rounded-full mx-auto p-2" src={view}/>
   </div>
    {isOpen?<div  onClick={()=>setIsOpen(false)} className={"border-green-800 mont-medium border-4 min-w-36 text-center  flex  bg-transparent m text-[1rem]  mx-auto text-emerald-800 w-[10em] h-[5em] rounded-full"}><h3 className="text-[0.8rem] w-[6em] mx-auto my-auto lg:text-[0.8rem] ">Collection is Open Collab</h3> </div>:
    <div onClick={()=>setIsOpen(true)} className={"border-emerald-400 border-2 min-w-36 mont-medium flex text-center bg-transparent mx-auto   text-emerald-800 w-[10em] h-[5em] rounded-full"}><h3 className="text-[0.8rem] w-[6em] mx-auto my-auto lg:text-[0.8rem]  ">Collection is Close Collab</h3></div>}
    
 
   <div>
   
    {isPrivate?<div
       className={`
        " border-2 flex border-emerald-300 w-[10em] h-[5em]  mont-medium bg-transparent text-emerald-800  mx-auto rounded-full`}
    ><a className="mx-auto text-emerald-800 my-auto">
        Is Private
    </a></div>:<div
    
    className={`
        " border-2 border-emerald-300 border-4 flex mx-auto border-success w-[10em] h-[5em]  bg-transparent text-emerald-800  rounded-full`}
   ><a className="mx-auto my-auto text-emerald-800">Is Public</a></div>}
  
   </div>
   <div className="mx-auto">
    <div >
    <div className="dropdown">
  <div tabIndex={0} role="button"  className=" "> <label className=" text-emerald-700 border-2 border-emerald-600 rounded-full text-center   py-3 px-2 w-[10em] mont-medium h-[5em] ">Followers are <span   className="text-emerald-700 shadow-sm">{followersAre}s</span>   </label>
 
</div>
  <ul tabIndex={0} className="dropdown-content menu bg-white text-emerald-800 rounded-box z-[1] w-52 p-2 shadow">
  <li onClick={()=>{setFollowersAre(RoleType.commenter)}}><a>{RoleType.commenter}</a></li>
        <li
        onClick={()=>{setFollowersAre(RoleType.reader)}}
        ><a>{RoleType.reader}</a></li>
        <li
        onClick={()=>{setFollowersAre(RoleType.writer)}}
        ><a>{RoleType.writer}</a></li>

    </ul>
</div>


   </div>
   </div>
   <div className="mx-auto my-auto">
  
 
    <a onClick={()=>setOpenAccess(true)}className="text-white px-2 py-3 text-[0.8rem] w-[10em]  rounded-full mont-medium bg-emerald-600">Manage Access</a>
  </div>
   <div>

</div>
   <div className="">
  <img className="p-2 rounded-full w-12 h-12  mt-2 w-fit mx-auto bg-emerald-800 hover:bg-red-500  "
    src={deleteIcon} 
    onClick={handleDeleteCollection}/> 
  </div>
  
   </div>
   </div></div>
)}
const handleStoryOrderChange = (newOrder) => {
    let list = newOrder.map((stc,i)=>{
    
        return new StoryToCollection(stc.id,i,stc.collection,stc.story,currentProfile)
    })

    setNewPages(list)
  };
  const handleColOrderChange = (newOrder) => {
    let list = newOrder.map((stc,i)=>{
     
        return new CollectionToCollection(stc.id,i,stc.childCollection,stc.parentCollection,currentProfile)
    })
    setNewCollections(list)
  };

const deleteStory = (storyId)=>{
        dispatch(deleteStoryFromCollection({id:colInView.id,storyId:storyId}))
}
const deleteSubCollection = (colId)=>{
    dispatch(deleteCollectionFromCollection({id:colInView.id,childCollectionId:colId.id}))
}
    if(!colInView){
        if(loading){
        return(<div className="skeleton w-96 bg-emerald-50 max-w-[96vw]  m-2 h-96"/>
       
        )
    }else{
        return(<div className="w-[100%] h-[100%]" >
            <h6 className="text-emerald-800 mx-auto my-24">Collection Not Found </h6>
        </div>)
    }
    }
    if(colInView){
        return(<div>
                  <div className='fixed top-4 left-0 right-0 md:left-[20%] w-[96vw] mx-4 md:w-[60%]  z-50 mx-auto'>
             {error || success? <div role="alert" className={`alert    ${success?"alert-success":"alert-warning"} animate-fade-out`}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 shrink-0 stroke-current"
    fill="none"
    viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>{error?error:success}</span>
</div>:null}</div>
            {collectionInfo()}
    <div className="max-w-[96vw] lg:w-page mx-auto">
                            <div role="tablist" className="tabs mt-8 max-w-[96vw] mb-48 lg::w-page mx-auto rounded-lg sm:mx-6 tabs-lifted">
  <input type="radio" name="my_tabs_2" role="tab"  defaultChecked className="tab shadow-sm  border-l-2 border-r-2 border-t-2 bg-transparent text-emerald-900 text-xl" aria-label="Stories" />
  <div role="tabpanel" className="tab-content max-w-[96vw] pt-1   border-emerald-600 lg::w-page rounded-lg border-2">
    {newPages.length==0?<div><h6 className="text-emerald-700 py-24 text-center bg-opacity-20 bg-emerald-400 rounded-lg m-4  text-xl">Room for who you are</h6></div>:<SortableList items={newPages} onOrderChange={handleStoryOrderChange}
  onDelete={deleteStory}/>}

  </div>
  <input type="radio" name="my_tabs_2" role="tab" className="tab text-emerald-900 bg-transparent border-emerald-900 border-l-2 border-r-2 border-t-2  text-xl" aria-label="Collections" />
  <div role="tabpanel" className="tab-content max-w-[96vw] pt-1 bg-transparent lg:w-page  border-emerald-600 border-2 rounded-lg md:p-6 ">
 <div className="min-h-24">{newCollections.length==0?<div><div className="bg-emerald-400 rounded-lg bg-opacity-20"><h6 className="text-emerald-800 py-24 text-center  m-4 opacity-100 text-xl">A place filled with possibility</h6></div></div>:<SortableList items={newCollections} onOrderChange={handleColOrderChange} onDelete={deleteSubCollection}/>}
 </div> 
  </div>
</div>
</div>
<Dialog 
fullScreen={!md}
open={openAccess}
onClose={()=>{
    setOpenAccess(false)
}}>
    
    <div className="overflow-y-scroll overflow-x-hidden">
    <RoleForm book={colInView} onClose={()=>setOpenAccess(false)}/>
    </div>
</Dialog>
        </div>)
    }
    
}
