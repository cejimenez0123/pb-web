import { useEffect, useLayoutEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { addCollectionListToCollection, addStoryListToCollection, fetchCollection, getMyCollections } from "../../actions/CollectionActions"
import { getMyStories } from "../../actions/StoryActions"
import InfiniteScroll from "react-infinite-scroll-component"
import checked from "../../images/icons/checked_box.svg"
import emptyBox from "../../images/icons/empty_box.svg"
import "../../App.css"
import Paths from "../../core/paths"
import { clearPagesInView } from "../../actions/PageActions"
export default function AddToCollectionContainer(props){
    const pathParams = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const pending = useSelector(state=>state.books.loading)
    const profile = useSelector(state=>state.users.currentProfile)
    const colInView = useSelector(state=>state.books.collectionInView)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const collections = useSelector(state=>state.books.collections)
    const [collectionsList,setCollectionList]=useState([])
    useLayoutEffect(()=>{
        setCollectionList(collections.filter(col=>col.id!=pathParams.id) ) 
    },[collections]
)
    const [newStories,setNewStories]=useState([])
    
    const[newCollection,setNewCollections]=useState([])
    useLayoutEffect(()=>{
     
            dispatch(fetchCollection(pathParams))
        
    },[])
    const save = ( )=>{
        let storyIdList = newStories.map(stor=>stor.id)
        let collectionIdList = newCollection.map(col=>col.id)
        let completeCol = false
        let completeStory = false
        console.log(colInView)
     if(collectionIdList.length>0) dispatch(addCollectionListToCollection({id:colInView.id,list:collectionIdList})).then(
        ()=>{
      
                dispatch(clearPagesInView())
                setNewCollections([])
                setNewStories([])
                dispatch(clearPagesInView())
                navigate(Paths.collection.createRoute(colInView.id))
            
        }
    )
   if (storyIdList.length>0) dispatch(addStoryListToCollection({id:colInView.id,list:storyIdList})).then(res=>{
       
            dispatch(clearPagesInView())
            setNewCollections([])
            setNewStories([])
            navigate(Paths.collection.createRoute(colInView.id))
        
    })
      
    }
  
    
    useEffect(()=>{
        dispatch(getMyCollections({profile}))
        dispatch(getMyStories({profile}))
    },[])
    const addNewCollection =(col)=>{
        setNewCollections(state=>{
            return [...state,col]
        })
    }
    const addNewStory = (story)=>{
        setNewStories(state=>{
            return [...state,story]
        })
        console.log(newStories)
    }
    
    const removeNewStory = (sto)=>{
        let list = newStories.filter(story=>{
            return story.id!=sto.id})
        setNewStories(list)
    
    }
    const removeNewCollection = (col)=>{
        let list = newCollection.filter(collection=>col.id!=collection.id)
        setNewCollections(list)
        console.log(newCollection)
    }

    const storyList = ()=>{
        if(pagesInView && colInView){
        return(<div className=" my-4 max-h-96 text-emerald-800 mx-auto overflow-scroll sm:mx-12 text-left mb-2">
            <h6 className=" text-2xl  mt-4 mb-2 ml-2 font-bold">Add Stories to Collection</h6>
            <InfiniteScroll
            className=" mx-2 "
        dataLength={pagesInView.length}>
            {pagesInView.filter(story=>!colInView.storyIdList.find(storyJoint=>storyJoint.storyId==story.id)).map(story=>{
                return(<div className="text-left mx-auto   sm:mx-1 flex flex-row justify-between border-1
                border-emerald-400  rounded-lg p-4  my-2">
                    <h2 className="text-xl my-auto  overflow-hidden">{story?story.title:null}</h2>
                    <div className="bg-emerald-800 rounded-lg p-2">{colInView && colInView.storyIdList && colInView.storyIdList.find(storyJoint=>storyJoint.storyId==story.id)||newStories.includes(story)?
                    <h1 onClick={()=>removeNewStory(story)}className="">
<p className="text-2xl   "><img src={checked}/></p>
</h1>:
<h1 onClick={()=>addNewStory(story)}className=" text-emerald-800">
<p className="text-2xl  content-center "><img src={emptyBox}/></p>
</h1>}</div>
                </div>)
            })}
            </InfiniteScroll></div>)
        }else{
            return null
        }}
    const colList = ()=>{
        if(pagesInView && colInView){
        
        return(<div className=" my-4 max-h-96 mx-auto text-emerald-800 overflow-scroll sm:mx-12 text-left mb-2">
        <h6 className=" text-2xl  mt-4 mb-2 ml-2 font-bold">Add Collections to Collection</h6>
        <InfiniteScroll
        className=" mx-2 "
        dataLength={collectionsList.length}>
{collectionsList.filter(col=>!colInView.childCollections.find(joint=>joint.childCollectionId==col.id)).map(col=>{
            return(<div className="text-left mx-auto   sm:mx-1 flex flex-row justify-between border-1
            border-emerald-400 rounded-lg p-4  my-2">
                <h2 className="text-xl my-auto  overflow-hidden">{col?col.title:"Untitled"}</h2>
                <div className="bg-emerald-800 rounded-lg p-2">{colInView&& colInView.childCollections&& colInView.childCollections.find(colJoint=>colJoint.childCollectionId==col.id)||newCollection.includes(col)?
                <h1  onClick={()=>removeNewCollection(col)}className="">
<p className="text-2xl   "><img src={checked}/></p>
</h1>:
<h1 onClick={()=>addNewCollection(col)}className=" text-emerald-800">
<p className="text-2xl  content-center rounded-[60em]"><img src={emptyBox}/></p>
</h1>}</div>
            </div>)
        })}
        </InfiniteScroll></div>)}

    }
    if(pending || !colInView){
        return(<div>
            Loading
            </div>)
    }
 
    return(<div className=''>
        <div className="static">
<div className="border-1 border-emerald-400  rounded-lg mx-2 my-2 sm:m-8 p-8 text-left">
            <h2 className="text-2xl text-emerald-800 mb-2">{colInView.title && colInView.title.length>0?colInView.title:"Untitled"}</h2>
            <p className="sm:my-4 md:mx-2 p-2 min-h-24 sm:p-4 bg-emerald-800 rounded-lg sm:max-w-[42rem]">{colInView?colInView.purpose:null}</p>
        
        <div className="flex flex-row justify-center">
        <button onClick={save}className="bg-green-600 ml-4 mt-4 px-4 text-xl">Save</button>
    <div className="text-xl my-auto flex flex-col content-center px-4   pt-[0.7em] rounded-full">
    
    <span className="text-center mx-a">{newCollection.length+newStories.length}</span>
    <span className=" text-center text-sm">New items</span> 
    </div>
    </div>


            
            </div>
<div className=" sm:flex sm:flex-row">


<div role="tablist" className="tabs mt-8 shadow-md rounded-lg   sm:mx-6 tabs-lifted">
  <input type="radio" name="my_tabs_2" role="tab"  defaultChecked className="tab shadow-sm border-emerald-400 border-l-2 border-r-2 border-t-2 bg-transparent text-emerald-800 text-xl" aria-label="Stories" />
  <div role="tabpanel" className="tab-content max-w-[100svw] pt-1  md:w-[30em] md:p-6">
  {storyList()}
  </div>
  <input type="radio" name="my_tabs_2" role="tab" className="tab  bg-transparent border-emerald-400 border-l-2 border-r-2 border-t-2   text-emerald-800 shadow-sm text-xl" aria-label="Collections" />
  <div role="tabpanel" className="tab-content pt-1 max-w-[100svw] bg-transparent   md:w-[30em]  md:p-6 rounded-box ">
  {colList()}
   </div>
</div>
        </div>

 
</div>


    </div>)
}