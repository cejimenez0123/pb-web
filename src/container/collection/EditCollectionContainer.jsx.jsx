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
        setFollowersAre(colInView.followersAre??null)
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
 
   
    const updateCollection = ()=>{
        dispatch(patchCollectionContent({id:params.id,isPrivate:isPrivate,isOpenCollaboration:isOpen,title,purpose,storyToCol:newPages,colToCol:newCollections,col:colInView,profile:currentProfile})).then(res=>{
            window.alert("Successful Update")
        },err=>{})
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
        
        return(<div className="   sm:flex-row sm:flex justify-around sm:max-w-[60em] mx-auto max-h-full  sm:pb-8 sm:w-48 p-4 sm:border-emerald-600 sm:border-2 mx-2 mt-4 md:mt-8 rounded-lg mb-8 sm:text-left">
    <div>
        <div>
    <input 
  onChange={(e)=>{
    setTitle(e.target.value)
}}
    type="text" className="bg-transparent text-emerald-800 px-2 py-2 w-full mb-4  text-2xl" value={title}/>
       </div>
        <textarea onChange={e=>setPurpose(e.target.value)}className="  textarea  text-[1rem]  text-white  sm:mx-8 bg-emerald-600 bg-opacity-60  max-w-[96vw] w-[100%] md:w-92 md:max-w-96 rounded-lg p-4" value={purpose}/>
        </div>
        
        {/*  */}
        
        <div className="">
        <div className=" mt-8 w-[100%]  justify-around md:ml-12  gap-3 grid grid-flow-row-dense grid-cols-2  sm:max-w-[22rem]">

   {currentProfile&& (colInView.isOpenCollaboration || colInView.profileId==currentProfile.id)?
   <button className="bg-emerald-800 text-white sm:ml-2 sm:ml-0 w-[9rem] text-center rounded-full"
   
   onClick={updateCollection}
   
   >Update</button>
   :null}
 
   <div className="flex flex-row">
    
   <img onClick={()=>navigate(Paths.addToCollection.createRoute(colInView.id))
   }className=" bg-emerald-800 w-12 h-12 rounded-full mx-auto p-2"
   src={add}/>
   <img
   onClick={()=>navigate(Paths.collection.createRoute(colInView.id))}
    className=" bg-emerald-800 w-12 h-12 rounded-full mx-auto p-2" src={view}/>
   </div>
<div className=" text-emerald-900">
<button   onClick={()=>handleSetOpen(!isOpen)} className={(isOpen?"border-green-800":"border-emerald-400")+" px-2 min-w-36 py-3 border-2 bg-transparent mx-auto text-[1rem]   text-emerald-800 w-[9rem] rounded-full"}>
    {isOpen?<h3 className="">Open Collab</h3>:<h3 className=" ">Close Collab</h3>}</button>
   </div>
   <div>
   <button    onClick={()=>setIsPrivate(!isPrivate)} 
   className={`${isPrivate?
    " border-2 border-emerald-300":"border-2 border-success"} text-[1rem]  py-[0.85rem] px-[1.85rem] bg-transparent text-emerald-800 w-[9rem] rounded-full`}>{
   isPrivate?
    "Is Private":"Is Public"}</button>
   </div>
   <div>
    <div className="">
    <div className="dropdown">
  <div tabIndex={0} role="button" className=" "> <h6 className="text-emerald-700 border-2 border-emerald-600 rounded-full   p-2 w-[9rem] ">Followers are {followersAre && followersAre!=RoleType.role?followersAre+"s":"What Role?"}</h6></div>
  <ul tabIndex={0} className="dropdown-content menu bg-white text-emerald-800 rounded-box z-[1] w-52 p-2 shadow">
  <li onClick={()=>{setFollowersAre(RoleType.commenter)}}><a>{RoleType.commenter}</a></li>
        <li
        onClick={()=>{setFollowersAre(RoleType.reader)}}
        ><a>{RoleType.reader}</a></li>
        <li
        onClick={()=>{setFollowersAre(RoleType.writer)}}
        ><a>{RoleType.writer}</a></li>
        <li
        onClick={()=>{setFollowersAre(RoleType.editor)}}
        ><a>{RoleType.editor}</a></li>
    </ul>
</div>


   </div>
   </div>
   <div>
  
 
    <button onClick={()=>setOpenAccess(true)}className="text-white px-2 py-3 text-[1rem] w-[9rem] rounded-full bg-emerald-600">Manage Access</button>
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
            {collectionInfo()}
    
                            <div role="tablist" className="tabs mt-8 max-w-[96vw] sm:w-[40em] mx-auto rounded-lg sm:mx-6 tabs-lifted">
  <input type="radio" name="my_tabs_2" role="tab"  defaultChecked className="tab shadow-sm  border-l-2 border-r-2 border-t-2 bg-transparent text-emerald-900 text-xl" aria-label="Stories" />
  <div role="tabpanel" className="tab-content max-w-[96vw] pt-1  sm:w-[40em] border-emerald-600 rounded-lg border-2 md:p-6">
  <SortableList items={newPages} onOrderChange={handleStoryOrderChange}
  onDelete={deleteStory}/>

  </div>
  <input type="radio" name="my_tabs_2" role="tab" className="tab text-emerald-900 bg-transparent border-emerald-900 border-l-2 border-r-2 border-t-2  text-xl" aria-label="Collections" />
  <div role="tabpanel" className="tab-content max-w-[96vw] pt-1 bg-transparent sm:w-[40em]  border-emerald-600 border-2 rounded-lg md:p-6 ">
  <SortableList items={newCollections} onOrderChange={handleColOrderChange} onDelete={deleteSubCollection}/>
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
