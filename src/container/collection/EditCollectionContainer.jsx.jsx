import { useEffect, useLayoutEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import Paths from "../../core/paths"
import checked from "../../images/icons/checked_box.svg"
import empty from "../../images/icons/empty_box.svg"
import { fetchCollection, fetchCollectionProtected, getSubCollectionsProtected, getSubCollectionsPublic } from "../../actions/CollectionActions"
import add from "../../images/icons/add_box.svg"
import { getCollectionStoriesProtected, getCollectionStoriesPublic } from "../../actions/StoryActions"
import SortableList from "../../components/SortableList"
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
    const [newPages,setNewPages]=useState(pages)
    const [isOpen,setIsOpen]=useState(false)
    const collections = useSelector(state=>state.books.collections)
    let unique =getUniqueValues(collections)
    const [newCollections,setNewCollections]=useState(unique)
    const [title,setTitle]=useState(colInView.title)
    const [purpose,setPurpose]=useState(colInView.purpose)
    const [isPrivate,setIsPrivate]=useState(colInView.isPrivate)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // useLayoutEffect(()=>{
       
    //     setNewCollections(unique)
    // },[collections])
    useEffect(()=>{
        const {id}=params
        if(colInView && colInView.id != id){
            dispatch(fetchCollection(params))
        }
    },[])
  
    const getSubCollections = ()=>{
        currentProfile?dispatch(getSubCollectionsProtected(params)):dispatch(getSubCollectionsPublic(params))
        }
    useLayoutEffect(()=>{
        currentProfile?dispatch(getCollectionStoriesProtected(params)):dispatch(getCollectionStoriesPublic(params))
      getSubCollections()
    },[colInView])
  
    useLayoutEffect(()=>{
        setTitle(colInView.title)
        setPurpose(colInView.purpose)
    },[colInView])
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const collectionInfo=()=>{
        
        return(<div className="h-fit max-w-[100vw] flex flex-col sm:pb-8 sm:w-48 sm:border sm:border-white  mx-2 mt-4 md:mt-8 rounded rounded-lg mb-8 text-left">
    <input 
      
  onChange={(e)=>{
    setTitle(e.target.value)
}}
    type="text" className="mx-4 bg-transparent text-white px-2 py-4 w-full mb-4 text-2xl" value={title}/>
        <textarea className=" sm:mx-8 textarea text-xl bg-emerald-600 md:w-92 md:max-w-96 rounded-lg p-4">{purpose}</textarea>
        <div className=" mt-8 flex justify-around flex-wrap w-[100vw]">
<div>
   {currentProfile&& (colInView.isOpenCollaboration || colInView.profileId==currentProfile.id)?

   <button className="bg-green-600 md:ml-8 rounded-lg">Update</button>
   

   :null}
   </div>
   <div>
   <img onClick={()=>navigate(Paths.addToCollection.createRoute(colInView.id))
   }className="w-8 h-8 mx-4 my-auto"
   src={add}/>
   </div>
<div className=" mt-8  md:mt-0">
<label className="btn  ">
    {isOpen?<span onClick={()=>setIsOpen(false)}
className="bg-green-300 text-slate-800  w-8 h-8 py-2 px-4 rounded-lg">Is Open Collab?</span>:
<span 
   onClick={()=>setIsOpen(true)}
   className="bg-green-400 text-slate-800  w-8 h-8 py-2 px-4 rounded-lg">Is Closed?</span>}</label>
   </div>
   <div>
   <label className="btn  m-4 md:my-auto">{isPrivate?<span onClick={()=>setIsPrivate(false)}className="bg-green-300  text-slate-800  w-8 h-8 py-3 px-4 rounded-lg">Is Private</span>:<span 
   onClick={()=>setIsPrivate(true)}
   className="bg-green-400 w-8 h-8 text-slate-800 py-2 px-4 rounded-lg">Is Public</span>}</label>
   </div>
   </div>
   </div>
)}
const handleStoryOrderChange = (newOrder) => {
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
    if(colInView){
        return(<div>
            {collectionInfo()}
    
                            <div role="tablist" className="tabs mt-8 shadow-md rounded-lg  sm:max-w-128 sm:mx-6 tabs-lifted">
  <input type="radio" name="my_tabs_2" role="tab"  defaultChecked className="tab shadow-sm  border-l-2 border-r-2 border-t-2 bg-transparent text-white text-xl" aria-label="Stories" />
  <div role="tabpanel" className="tab-content max-w-[100svw] pt-1  sm:max-w-[42rem] md:p-6">
  <SortableList items={newPages} onOrderChange={handleStoryOrderChange}/>

  </div>
  <input type="radio" name="my_tabs_2" role="tab" className="tab text-white bg-transparent border-white border-l-2 border-r-2 border-t-2   shadow-sm text-xl" aria-label="Collections" />
  <div role="tabpanel" className="tab-content pt-1 bg-transparent sm:max-w-[42rem]   rounded-box ">
  <SortableList items={newCollections} onOrderChange={handleColOrderChange}/>
  </div>
</div>
        </div>)
    }else{
        return(<div>
            Loading
            {colInView.title}
        </div>)
    }
    
}