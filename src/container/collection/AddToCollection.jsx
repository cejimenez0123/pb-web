import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { fetchCollection, getMyCollections } from "../../actions/CollectionActions"
import { getMyStories } from "../../actions/StoryActions"
import InfiniteScroll from "react-infinite-scroll-component"

export default function AddToCollectionContainer(props){
    const pathParams = useParams()
    const dispatch = useDispatch()
    const profile = useSelector(state=>state.users.currentProfile)
    const colInView = useSelector(state=>state.books.collectionInView)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const collectionsList = useSelector(state=>state.books.collections)
    const [newStories,setNewStories]=useState([])
    const[newCollection,setNewCollections]=useState([])
    useEffect(()=>{
        if(colInView.id!=pathParams.id){
            dispatch(fetchCollection(pathParams))
        }
    },[])
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
    const colInfo = ()=>{
        return(<div className="border border-white rounded-lg m-4 sm:m-8 p-8 text-left">
            <h2 className="text-2xl mb-2">{colInView.title}</h2>
            <p className="sm:my-4 md:mx-2 p-2 sm:p-4 bg-emerald-800 rounded-lg max-w-96">{colInView.purpose}</p></div>)
    }
    const storyList = ()=>{
        if(pagesInView){
        return(<div className="max-w-96 max-h-96 overflow-scroll mx-auto sm:mx-12 text-left mb-2">
            <h6 className=" text-2xl font-bold">Stories</h6><InfiniteScroll
        dataLength={pagesInView.length}>
            {pagesInView.map(story=>{
                return(<div className="text-left flex flex-row justify-between border
                border-white rounded-lg p-4  my-2">
                    <h2 className="text-xl my-auto">{story.title}</h2>
                    {colInView.storyIdList.includes(story.id)||newStories.includes(story)?
                    <h1 onClick={()=>removeNewStory(story)}className="">
<p className="text-2xl px-2 h-8 rounded-full bg-emerald-400 ">i</p>
</h1>:
<h1 onClick={()=>addNewStory(story)}className=" text-white  ">
<p className="text-2xl px-2 h-8 content-center rounded-full rounded-full bg-emerald-400">o</p>
</h1>}
                </div>)
            })}
            </InfiniteScroll></div>)
        }else{
            return null
        }}
    const colList = ()=>{
        return(<div className="max-w-96 max-h-96 sm:h-auto sm:min-h-full mx-auto overflow-scroll sm:mx-12">
            <h6 className="text-2xl font-bold text-left mb-2">Collections</h6><InfiniteScroll
        dataLength={collectionsList.length}>
            {collectionsList.map(col=>{
                return(<div className="text-left flex sm:min-w-96 flex-row justify-between border
                border-white rounded-lg p-4  my-2">
                    <h2 className="text-xl my-auto">{col.title}</h2>
                    {colInView.collectionIdList.includes(col.id)||newCollection.includes(col)?
                    <button
                    onClick={()=>removeNewCollection(col)}
                    className="btn text-white btn-circle">
<p className="text-2xl  ">i</p>
</button>:
<button  onClick={()=>addNewCollection(col)} className="btn btn-circle text-white  btn-outline">
<p className="text-2xl  content-center rounded-[60em]">o</p>
</button>}
                </div>)
            })}
            </InfiniteScroll></div>)
    }
    return(<div>
{colInfo()}
<div className=" sm:flex sm:flex-row">
{storyList()}
{colList()}
</div>
    </div>)
}