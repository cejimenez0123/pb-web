import { useLayoutEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import Paths from "../../core/paths"
import { deleteCollection } from "../../actions/CollectionActions"
import deleteIcon from "../../images/icons/delete.svg"
import { deleteCollectionFromCollection, deleteStoryFromCollection, fetchCollection, fetchCollectionProtected, getSubCollectionsProtected, getSubCollectionsPublic } from "../../actions/CollectionActions"
import add from "../../images/icons/add_box.svg"
import { getCollectionStoriesProtected, getCollectionStoriesPublic } from "../../actions/StoryActions"
import SortableList from "../../components/SortableList"
import checkResult from "../../core/checkResult"
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
    const pages = useSelector(state=>state.pages.pagesInView)
    const loading = useSelector(state=>state.books.loading)
    const [newPages,setNewPages]=useState(pages)
    const [isOpen,setIsOpen]=useState(false)
    const collections = useSelector(state=>state.books.collections)
    let unique =getUniqueValues(collections)
    const [newCollections,setNewCollections]=useState(unique)
    const [title,setTitle]=useState(colInView?colInView.title:"")
    const [purpose,setPurpose]=useState(colInView?colInView.purpose:"")
    const [isPrivate,setIsPrivate]=useState(colInView?colInView.isPrivate:true)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    useLayoutEffect(()=>{
   
            dispatch(fetchCollection(params)).then(res=>checkResult(res,(payload)=>{
                currentProfile?dispatch(getCollectionStoriesProtected(params)):dispatch(getCollectionStoriesPublic(params))
                currentProfile?dispatch(getSubCollectionsProtected(params)):dispatch(getSubCollectionsPublic(params))
        
            }))
   
 
    },[])
  
    const handleDeleteCollection = ()=>{
        const {id}=params
        console.log(id)
        dispatch(deleteCollection({id})).then(res=>checkResult(res,payload=>{
                navigate(Paths.myProfile.createRoute(currentProfile.id))
        },err=>{

        }))
    }
    const updateCollectionContent=()=>{

    }
    useLayoutEffect(()=>{
        setTitle(colInView.title)
        setPurpose(colInView.purpose)
    },[colInView])
    const updateCollection = ()=>{

    }
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const collectionInfo=()=>{
        
        return(<div className="h-fit max-w-[100vw]  sm:pb-8 sm:w-48 sm:border sm:border-white  mx-2 mt-4 md:mt-8 rounded rounded-lg mb-8 sm:text-left">
    <div>
    <input 
      
  onChange={(e)=>{
    setTitle(e.target.value)
}}

    type="text" className="mx-4 bg-transparent text-white px-2 py-4 w-full mb-4 text-2xl" value={title}/>
       </div>
        <textarea className="  textarea text-xl w-full max-w-screen mx-auto sm:mx-8 bg-emerald-600 md:w-92 md:max-w-96 rounded-lg p-4">{purpose}</textarea>
        <div className=" mt-8  justify-around ml-12 text-left gap-4 grid grid-flow-row-dense grid-cols-2 max-w-72 sm:max-w-[15em]">

   {currentProfile&& (colInView.isOpenCollaboration || colInView.profileId==currentProfile.id)?
   <button className="btn btn-success text-white p-2 max-w-24 text-center rounded-lg"
   
   onClick={updateCollection}
   
   >Update</button>
   :null}
 
   <div>
    
   <img onClick={()=>navigate(Paths.addToCollection.createRoute(colInView.id))
   }className="w-8 h-8 my-auto  "
   src={add}/>
   </div>
<div className=" ">
<button   onClick={()=>setIsOpen(!isOpen)} className={(isOpen?"btn border-green-800":"btn border-white")+" px-2 border py-2 text-slate-800 rounded-lg"}>
    {isOpen?<h3 className="text-white">Is Open Collab?</h3>:<span className="text-white text-sm">Is Closed</span>}</button>
   </div>
   <div>
   <button    onClick={()=>setIsPrivate(!isPrivate)} 
   className={(isPrivate?
   "btn  border-green-800 border":"btn b border border-white")+" text-white text-2xl px-2 py-2 text-slate-800 rounded-lg"}>{
   isPrivate?
    "Is Private":"Is Public"}</button>
   </div>
   <div className="mt-6">
  <img className="w-8 h-8 my-auto "
    src={deleteIcon} 
    onClick={handleDeleteCollection}/> 
  </div>
   </div>
   </div>
)}
const handleStoryOrderChange = (newOrder) => {
    newOrder.map(story=>{
        console.log(story)
        return story
    })
    setNewPages(newOrder)
  };
  const handleColOrderChange = (newOrder) => {
    setNewCollections(newOrder)
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

        return(<div>
            Looking in all the wrong places
        </div>)
    }else if(loading){
        return(<div>
            Loading
        </div>)
    }
    if(colInView){
        return(<div>
            {collectionInfo()}
    
                            <div role="tablist" className="tabs mt-8 shadow-md rounded-lg  sm:max-w-128 sm:mx-6 tabs-lifted">
  <input type="radio" name="my_tabs_2" role="tab"  defaultChecked className="tab shadow-sm  border-l-2 border-r-2 border-t-2 bg-transparent text-white text-xl" aria-label="Stories" />
  <div role="tabpanel" className="tab-content max-w-[100svw] pt-1  sm:max-w-[42rem] md:p-6">
  <SortableList items={newPages} onOrderChange={handleStoryOrderChange}
  onDelete={deleteStory}/>

  </div>
  <input type="radio" name="my_tabs_2" role="tab" className="tab text-white bg-transparent border-white border-l-2 border-r-2 border-t-2   shadow-sm text-xl" aria-label="Collections" />
  <div role="tabpanel" className="tab-content pt-1 bg-transparent sm:max-w-[42rem]   rounded-box ">
  <SortableList items={newCollections} onOrderChange={handleColOrderChange} onDelete={deleteSubCollection}/>
  </div>
</div>
        </div>)
    }
    
}
