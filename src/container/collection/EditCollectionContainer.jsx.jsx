import { useEffect, useLayoutEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import Paths from "../../core/paths"
import { deleteCollection, patchCollectionContent } from "../../actions/CollectionActions"
import deleteIcon from "../../images/icons/delete.svg"
import { deleteCollectionFromCollection, deleteStoryFromCollection, fetchCollection, fetchCollectionProtected, getSubCollectionsProtected, getSubCollectionsPublic } from "../../actions/CollectionActions"
import add from "../../images/icons/add_box.svg"
import { getCollectionStoriesProtected } from "../../actions/StoryActions"
import SortableList from "../../components/SortableList"
import checkResult from "../../core/checkResult"
import { clearPagesInView } from "../../actions/PageActions"
import StoryToCollection from "../../domain/models/storyToColleciton"
import CollectionToCollection from "../../domain/models/ColllectionToCollection"
import { getCurrentProfile } from "../../actions/UserActions"
import { Dialog } from "@mui/material"
import RoleForm from "../../components/role/RoleForm"
import { useMediaQuery } from "react-responsive"
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
    const [isPrivate,setIsPrivate]=useState(colInView?colInView.isPrivate:true)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [openAccess,setOpenAccess]=useState(false)
    useLayoutEffect(()=>{
       
            dispatch(fetchCollection(params))
                },[])

    useEffect(()=>{
        setTitle(colInView.title)
        setPurpose(colInView.purpose)
    },[colInView])
    useLayoutEffect(()=>{

                    dispatch(getCollectionStoriesProtected(params))
                    dispatch(getSubCollectionsProtected(params))
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

        dispatch(deleteCollection({id})).then(res=>checkResult(res,payload=>{
                navigate(Paths.myProfile.createRoute(currentProfile.id))
        },err=>{

        }))
    }
 
   
    const updateCollection = ()=>{

       
        dispatch(patchCollectionContent({id:params.id,storyToCol:newPages,colToCol:newCollections,col:colInView,profile:currentProfile}))
    }

    const collectionInfo=()=>{
        
        return(<div className="h-fit max-w-[100vw]  sm:pb-8 sm:w-48 sm:border sm:border-white  mx-2 mt-4 md:mt-8 rounded rounded-lg mb-8 sm:text-left">
    <div>
    <input 
      
  onChange={(e)=>{
    setTitle(e.target.value)
}}

    type="text" className="mx-w bg-transparent text-emerald-800 px-2 py-2 w-full mb-4 text-2xl" value={title}/>
       </div>
        <textarea className="  textarea text-[1rem] min-w-[90%] w-full max-w-screen text-white mx-auto sm:mx-8 bg-emerald-600 md:w-92 md:max-w-96 rounded-lg p-4" value={purpose}/>
        <div className=" mt-8  justify-around ml-12 text-left gap-4 grid grid-flow-row-dense grid-cols-2 max-w-72 sm:max-w-[15em]">

   {currentProfile&& (colInView.isOpenCollaboration || colInView.profileId==currentProfile.id)?
   <button className="btn btn-success text-emerald-900 p-2 max-w-24 text-center rounded-lg"
   
   onClick={updateCollection}
   
   >Update</button>
   :null}
 
   <div>
    
   <img onClick={()=>navigate(Paths.addToCollection.createRoute(colInView.id))
   }className=" bg-emerald-800 rounded-full mx-auto p-2 "
   src={add}/>
   </div>
<div className=" text-emerald-900">
<button   onClick={()=>setIsOpen(!isOpen)} className={(isOpen?"border-green-800":"border-emerald-400")+" px-2 min-w-36 py-3 border-2 bg-transparent text-[1rem]   text-emerald-800 rounded-lg"}>
    {isOpen?<h3 className="">Is Open Collab?</h3>:<h3 className=" ">Is Closed</h3>}</button>
   </div>
   <div>
   <button    onClick={()=>setIsPrivate(!isPrivate)} 
   className={`${isPrivate?
    " border-2 border-emerald-400":"border-4 border-emerald-600"} text-[1rem]  py-[0.85rem] px-[1.85rem] bg-transparent text-emerald-800 rounded-lg`}>{
   isPrivate?
    "Is Private":"Is Public"}</button>
   </div>
   <div className="">
  <img className="p-2 rounded-lg w-fit mx-auto bg-emerald-800 hover:bg-red-500 my-auto "
    src={deleteIcon} 
    onClick={handleDeleteCollection}/> 
  </div>
  <div>
    <button onClick={()=>setOpenAccess(true)}className="text-white bg-emerald-600">Manage Access</button>
  </div>
   </div>
   </div>
)}
const handleStoryOrderChange = (newOrder) => {
    let list = newOrder.map((stc,i)=>{
    
        return new StoryToCollection(stc.id,i,stc.collection,stc.story,currentProfile)
    })

    setNewPages(list)
  };
  const handleColOrderChange = (newOrder) => {
    let list = newOrder.map((stc,i)=>{
        console.log(i)
        return new CollectionToCollection(stc.id,i,stc.childCollection,stc.parentCollection,currentProfile)
    })
    console.log(list)
    setNewCollections(list)
  };
const removeFromCollection = ()=>{
    let result = confirm("Are you sure you want to delete?")
    if(result){
        dispatch()
    }
}
const deleteStory = (storyId)=>{
        dispatch(deleteStoryFromCollection({id:colInView.id,storyId:storyId}))
}
const deleteSubCollection = (colId)=>{
    dispatch(deleteCollectionFromCollection({id:colInView.id,childCollectionId:colId.id}))
}
    if(!colInView){

        return(<div className="skeleton w-96 h-96">
       
        </div>)
    }
    if(colInView){
        return(<div>
            {collectionInfo()}
    
                            <div role="tablist" className="tabs mt-8 shadow-md rounded-lg  sm:max-w-128 sm:mx-6 tabs-lifted">
  <input type="radio" name="my_tabs_2" role="tab"  defaultChecked className="tab shadow-sm  border-l-2 border-r-2 border-t-2 bg-transparent text-emerald-900 text-xl" aria-label="Stories" />
  <div role="tabpanel" className="tab-content max-w-[100svw] pt-1  sm:max-w-[42rem] md:p-6">
  <SortableList items={newPages} onOrderChange={handleStoryOrderChange}
  onDelete={deleteStory}/>

  </div>
  <input type="radio" name="my_tabs_2" role="tab" className="tab text-emerald-900 bg-transparent border-emerald-900 border-l-2 border-r-2 border-t-2   shadow-sm text-xl" aria-label="Collections" />
  <div role="tabpanel" className="tab-content pt-1 bg-transparent sm:max-w-[42rem]   rounded-box ">
  <SortableList items={newCollections} onOrderChange={handleColOrderChange} onDelete={deleteSubCollection}/>
  </div>
</div>
<Dialog 
fullScreen={!md}
open={openAccess}
onClose={()=>{
    setOpenAccess(false)
}}>
    <RoleForm book={colInView} onClose={()=>setOpenAccess(false)}/>
</Dialog>
        </div>)
    }
    
}
