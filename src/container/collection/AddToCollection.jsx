import { useEffect, useLayoutEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { addCollectionListToCollection,fetchCollectionProtected, addStoryListToCollection, fetchCollection, getMyCollections } from "../../actions/CollectionActions"
import { getMyStories } from "../../actions/StoryActions"
import InfiniteScroll from "react-infinite-scroll-component"
import checked from "../../images/icons/check.svg"
import emptyBox from "../../images/icons/empty_circle.svg"
import "../../App.css"
import Paths from "../../core/paths"
import { clearPagesInView } from "../../actions/PageActions"
export default function AddToCollectionContainer(props){
    const pathParams = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const pending = useSelector(state=>state.books.loading)
    const profile = useSelector(state=>state.users.currentProfile)
    const colInView = useSelector(state=>state.books.collectionInView)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const collections = useSelector(state=>state.books.collections)
    const cTcList = useSelector(state=>state.books.collectionToCollectionsList)
    const [newStories,setNewStories]=useState([])  
    const[newCollection,setNewCollections]=useState([])


   
    useLayoutEffect(()=>{
     
            profile?dispatch(fetchCollectionProtected(pathParams)):dispatch(fetchCollection(pathParams))
        
    },[pathParams.id])
    const save = ( )=>{
        let storyIdList = newStories.filter(stor=>stor)
        let collectionIdList = newCollection.filter(col=>col).map(col=>col.id)
     if(collectionIdList.length>0 && currentProfile) dispatch(addCollectionListToCollection({id:colInView.id,list:collectionIdList,profile:currentProfile})).then(
        ()=>{
      
                dispatch(clearPagesInView())
                setNewCollections([])
                setNewStories([])
                dispatch(clearPagesInView())
                navigate(Paths.collection.createRoute(colInView.id))
            
        }
    )

   if (storyIdList.length>0) dispatch(addStoryListToCollection({id:colInView.id,list:storyIdList,profile:currentProfile})).then(res=>{
       
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
    
    }
    
    const removeNewStory = (sto)=>{
        let list = newStories.filter(story=>{
            return story.id!=sto.id})
        setNewStories(list)
    
    }
    const removeNewCollection = (col)=>{
        let list = newCollection.filter(collection=>col.id!=collection.id)
        setNewCollections(list)
    
    }

    const storyList = ()=>{
      
        return(<div className=" my-4 max-h-96 text-emerald-800 mx-auto overflow-scroll sm:mx-12 text-left mb-2">
            <h6 className=" text-2xl  mt-4 mb-2 ml-2 font-bold">Add Stories to Collection</h6>
            <InfiniteScroll
            className=" mx-2 "
        dataLength={pagesInView.length}>
            {pagesInView.filter(str=>str)
            .filter(story=>
                !colInView.storyIdList.find(storyJoint=>
                    storyJoint.storyId==story.id)).map(story=>{
                return(<div className="text-left mx-auto   sm:mx-1 flex flex-row justify-between border-1
                border-emerald-700  rounded-lg p-4  my-2">
                    <h2 className="text-l max-w-[60%] my-auto  overflow-clip">{story?story.title:null}</h2>
                    <div className="bg-emerald-800 rounded-full p-2">{colInView && colInView.storyIdList && colInView.storyIdList.find(storyJoint=>storyJoint.storyId==story.id)||newStories.includes(story)?
                    <h1 onClick={()=>removeNewStory(story)}className="">
<p className="text-2xl    "><img src={checked}/></p>
</h1>:
<h1 onClick={()=>addNewStory(story)}className=" text-emerald-800">
<p className="text-2xl  content-center "><img src={emptyBox}/></p>
</h1>}</div>
                </div>)
            })}
            </InfiniteScroll></div>)
        }
    const colList = ()=>{
        let list =[]
         if(collections){
            list = collections
         }
         if(cTcList.length>0){
            list = cTcList.filter(col=>!colInView.childCollections.find(joint=>joint.childCollectionId==col.id))
         }
        return(<div className=" my-4 max-h-96 mx-auto text-emerald-800 overflow-scroll sm:mx-12 text-left mb-2">
        <h6 className=" text-2xl  mt-4 mb-2 ml-2 font-bold">Add Collections to Collection</h6>
        <InfiniteScroll
        className=" mx-2 "
        dataLength={list.length}>
{list.map(col=>{
            return(<div className="text-left mx-auto   sm:mx-1 flex flex-row justify-between border-1
            border-emerald-400 rounded-lg p-4  my-2">
                <h2 className="text-l my-auto max-w-[60%] no-underline overflow-clip">{col?col.title:"Untitled"}</h2>
                <div className="bg-emerald-800 rounded-lg p-2">{colInView&& colInView.childCollections&& colInView.childCollections.find(colJoint=>colJoint.childCollectionId==col.id)||newCollection.includes(col)?
                <h1  onClick={()=>removeNewCollection(col)}className="">
<p className="text-2xl   "><img src={checked}/></p>
</h1>:
<h1 onClick={()=>addNewCollection(col)}className=" text-emerald-800">
<p className="text-2xl  content-center rounded-[60em]"><img src={emptyBox}/></p>
</h1>}</div>
            </div>)
        })}
        </InfiniteScroll></div>)

    }
    if(!colInView){

        if(pending){
            return(<div>
                Loading
                </div>)
        }else{
            return(<div>
               <h5>Collection Not Found</h5> 
            </div>)
        }
        
    }
 
    return(<div className=''>
        <div className="static">
<div className="border-1 border-emerald-400  rounded-lg mx-2 my-2 sm:m-8 p-8 text-left">
            <h2 className="text-2xl text-emerald-800 mb-2">{colInView.title && colInView.title.length>0?colInView.title:"Untitled"}</h2>
            <h6 className="sm:my-4 text-emerald-800 sm:mx-8 p-4 min-h-24 text-lg sm:max-w-[35rem]">{colInView?colInView.purpose:null}</h6>
        
        <div className="flex flex-row justify-center">
        <button onClick={save}className="bg-green-600 ml-4 rounded-full mt-4 px-4 text-xl">Save</button>
    <div className="text-xl my-auto flex flex-col content-center px-4   pt-[0.7em] rounded-full">
    
    <span className="text-center  text-emerald-800  mx-a">{newCollection.length+newStories.length}</span>
    <span className=" text-center text-emerald-800 text-sm">New items</span> 
    </div>
    </div>


            
            </div>
<div className=" sm:flex sm:flex-row">


<div role="tablist" className="tabs mt-8 shadow-md rounded-lg   sm:mx-6 tabs-lifted">
  <input type="radio" name="my_tabs_2" role="tab"  defaultChecked className="tab border-emerald-800 border-l-2 border-r-2 border-t-2 bg-transparent text-emerald-800 text-xl" aria-label="Stories" />
  <div role="tabpanel" className="tab-content h-[100%] max-w-[100vw] pt-1  md:p-6">
  {storyList()}
  </div>
  <input type="radio" name="my_tabs_2" role="tab" className="tab  bg-transparent border-emerald-400 border-l-2 border-r-2 border-t-2   text-emerald-800  text-xl" aria-label="Collections" />
  <div role="tabpanel" className="tab-content pt-1 max-w-[100vw] bg-transparent  h-[100%]  md:p-6 rounded-box ">
  {colList()}
   </div>
</div>
        </div>

 
</div>


    </div>)
}