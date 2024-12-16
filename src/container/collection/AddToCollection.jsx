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
    useEffect(()=>{
        if(colInView.id!=pathParams.id){
            dispatch(fetchCollection(pathParams))
        }
    },[])
    const save = ( )=>{
        let storyIdList = newStories.map(stor=>stor.id)
        let collectionIdList = newCollection.map(col=>col.id)
        let completeCol = false
        let completeStory = false
        console.log(colInView)
      dispatch(addCollectionListToCollection({id:colInView.id,list:collectionIdList})).then(
        ()=>{
            completeCol=true
            if(completeCol&&completeStory){
                dispatch(clearPagesInView())
                navigate(Paths.collection.createRoute(colInView.id))
            }
        }
    )
    dispatch(addStoryListToCollection({id:colInView.id,list:storyIdList})).then(res=>{
        completeStory=true
        if(completeCol&&completeStory){
            dispatch(clearPagesInView())
            navigate(Paths.collection.createRoute(colInView.id))
        }
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
        console.log(newCollection)
    }
    const removeNewCollection = (col)=>{
        let list = newCollection.filter(collection=>col.id!=collection.id)
        setNewCollections(list)
        console.log(newCollection)
    }

    const storyList = ()=>{
        if(pagesInView){
        return(<div className="max-w-96 max-h-96 overflow-scroll sm:mx-12 text-left mb-2">
            <h6 className=" text-2xl ml-2 font-bold">Add Stories to Collection</h6><InfiniteScroll
        dataLength={pagesInView.length}>
            {pagesInView.map(story=>{
                return(<div className="text-left mx-1 flex flex-row justify-between border
                border-white rounded-lg p-4  my-2">
                    <h2 className="text-xl my-auto max-w-[75%] overflow-hidden">{story.title}</h2>
                    {colInView.storyIdList && colInView.storyIdList.includes(story.id)||newStories.includes(story)?
                    <h1 onClick={()=>removeNewStory(story)}className="">
<p className="text-2xl  h-8 rounded-full  "><img src={checked}/></p>
</h1>:
<h1 onClick={()=>addNewStory(story)}className=" text-white  ">
<p className="text-2xl  content-center rounded-[60em]"><img src={emptyBox}/></p>
</h1>}
                </div>)
            })}
            </InfiniteScroll></div>)
        }else{
            return null
        }}
    const colList = ()=>{
        return(<div  className="max-w-96   sm:h-auto sm:min-h-full   sm:mx-12">
            <h6 className="text-2xl font-bold text-lef ml-2 mb-2">Add New Collections</h6><InfiniteScroll
            className="overflow-scroll mx-1"
        dataLength={collectionsList.length}>
            {collectionsList.map(col=>{
                return(<div className="text-left flex sm:min-w-96 flex-row justify-between border
                border-white rounded-lg p-4  my-2">
                    <h2 className="text-xl my-auto">{col.title}</h2>
                    {colInView.collectionIdList && colInView.collectionIdList.includes(col.id)||newCollection.includes(col)?
                    <button
                    onClick={()=>removeNewCollection(col)}
                    className="btn text-white btn-circle">
<p className="text-2xl  content-center rounded-[60em]  "><img src={checked} /></p>
</button>:
<button  onClick={()=>addNewCollection(col)} className="btn btn-circle text-white  btn-outline">
<p className="text-2xl  content-center rounded-[60em]"><img src={emptyBox}/></p>
</button>}
                </div>)
            })}
            </InfiniteScroll></div>)
    }
    return(<div className=''>
        <div className="static">
<div className="border border-white rounded-lg m-4 sm:m-8 p-8 text-left">
            <h2 className="text-2xl mb-2">{colInView.title}</h2>
            <p className="sm:my-4 md:mx-2 p-2 min-h-24 max-w-[1/2] sm:p-4 bg-emerald-800 rounded-lg max-w-96">{colInView.purpose}</p>
        
        <div className="flex flex-row justify-center">
        <button onClick={save}className="bg-green-600 ml-4 mt-4 px-4 text-xl">Save</button>
    <div className="text-xl my-auto flex flex-col content-center px-4   pt-[0.7em] rounded-full">
    
    <span className="text-center mx-a">{newCollection.length+newStories.length}</span>
    <span className=" text-center text-sm">New items</span> 
    </div>
    </div>


            
            </div>
<div className=" sm:flex sm:flex-row">
{storyList()}
{colList()}


 
</div>
</div>

    </div>)
}