import { useContext, useEffect, useLayoutEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { addCollectionListToCollection,fetchCollectionProtected, addStoryListToCollection, fetchCollection, getMyCollections } from "../../actions/CollectionActions"
import { getMyStories } from "../../actions/StoryActions"
import InfiniteScroll from "react-infinite-scroll-component"
import checked from "../../images/icons/check.svg"
import emptyBox from "../../images/icons/empty_circle.svg"
import "../../App.css"
import { useMediaQuery } from "react-responsive"
import Paths from "../../core/paths"
import { clearPagesInView } from "../../actions/PageActions.jsx"
import Context from "../../context.jsx"
let colStr = "collection"
export default function AddToCollectionContainer(props){
    const pathParams = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {seo,setSeo}=useContext(Context)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const pending = useSelector(state=>state.books.loading)
    const profile = useSelector(state=>state.users.currentProfile)
    const [search,setSearch]=useState("")
    const colInView = useSelector(state=>state.books.collectionInView)
    const pagesInView = useSelector(state=>state.pages.pagesInView).filter(page=>page).filter(col=>{
        
        
        if(search.length>0){
         return col.title.toLowerCase().includes(search.toLowerCase())
        }else{
         return true
        }
    
       })
    const collections = useSelector(state=>state.books.collections).filter(col=>{
        if(search.length>0){
         return col.title.toLowerCase().includes(search.toLowerCase())
        }else{
         return true
        }
    
       })
    const cTcList = useSelector(state=>state.books.collectionToCollectionsList)
    const [newStories,setNewStories]=useState([])  
    const[newCollection,setNewCollections]=useState([])
   
    const [tab,setTab]=useState("page")
    const isPhone =  useMediaQuery({
        query: '(max-width: 600px)'
      })
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
    const handleSearch = (value)=>{
        setSearch(value)
    }
    const storyList = ()=>{
      
        return(<div className=" my-4 w-[94vw] mx-auto md:w-page text-emerald-800  overflow-scroll text-left mb-2">
            <h6 className=" text-xl  mt-4 mb-2 ml-2 lora-medium">Add Stories to Collection</h6>
            <InfiniteScroll
           className="max-w-[96vw] md:w-page"
        dataLength={pagesInView.length}>
            {pagesInView.filter(str=>str)
            .filter(story=>
                colInView && colInView.storyIdList && !colInView.storyIdList.find(storyJoint=>
                    storyJoint.story.id==story.id)).map(story=>{
                return(<div className="text-left mx-auto  w-[96%]  flex flex-row justify-between border-3
                border-emerald-400 rounded-full py-4  my-2">
                    <h2 className="text-l my-auto max-w-[15em] text-nowrap text-md md:text-lg ml-8  mont-medium overflow-hidden text-ellipsis">
                        {story.title && story.title.trim().length>0?story.title:"Untitled"}</h2>
                    <div className="bg-emerald-800 rounded-full max-w-[10em] overflow-hidden text-ellipsis mr-6 p-2">{colInView && colInView.storyIdList && colInView.storyIdList.find(storyJoint=>storyJoint.storyId==story.id)||newStories.includes(story)?
                    <h1 onClick={()=>removeNewStory(story)}className="">
<p className="text-2xl    "><img className="max-h-[1.5rem] max-w-[1.5rem]" src={checked}/></p>
</h1>:
<h1 onClick={()=>addNewStory(story)}className=" text-emerald-800">
<p className="text-2xl  content-center "><img className="max-h-[1.5rem] max-w-[1.5rem]"src={emptyBox}/></p>
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
        return(<div className=" my-4 max-h-96 mx-auto text-emerald-800 overflow-scroll text-left mb-2">
        <h6 className=" text-xl lora-medium  mt-4 mb-2 ml-2 font-bold">Add Collections to Collection</h6>
        <InfiniteScroll
        className="  "
        dataLength={list.length}>
{list.map(col=>{
            if(col&&colInView&&col.id&&colInView.id&&col.id==colInView.id){
                return null
            }
            return(<div className="text-left mx-auto w-[92vw] md:w-[96%] sm:mx-auto flex flex-row justify-between border-3
            border-emerald-400 rounded-full py-4  my-2">
                <h2 className="text-l my-auto  max-w-[15em]  overflow-hidden text-nowrap text-md md:text-lg ml-8  mont-medium ">
                    {col.title && col.title.trim().length>0?col.title:"Untitled"}</h2>
                    <div className="bg-emerald-800 rounded-full  overflow-hidden text-ellipsis mr-6 p-2">
                   
                    {colInView&& colInView.childCollections&& colInView.childCollections.find(colJoint=>colJoint.childCollectionId==col.id)||newCollection.includes(col)?
<img className="max-w-8 max-h-8"
onClick={()=>removeNewCollection(col)}src={checked}/>
:
<img className="max-w-8 max-h-8" onClick={()=>addNewCollection(col)} src={emptyBox}/>
}</div>
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
    
    return(<div className='max-h-[100vh] overflow-scroll'>
        <div className="static">
<div className="border-3 border-emerald-600 w-[96vw]  lg:w-info min-h-info mx-auto  rounded-lg  my-2  p-8 text-left">
            <h2 className="text-2xl whitespace-nowrap  overflow-hidden md:max-w-[30em]  text-nowrap text-emerald-800 mb-2">{colInView.title && colInView.title.trim().length>0?colInView.title:"Untitled"}</h2>
            <h6 className="sm:my-4 text-emerald-800 sm:mx-8 p-4 min-h-24 text-lg sm:max-w-[35rem]">{colInView?colInView.purpose:null}</h6>
        
        <div className="flex flex-row justify-center">
        <button onClick={save}className="bg-green-600 ml-4 mont-medium rounded-full text-white mt-4 px-6 text-xl">Save</button>
    <div className="text-xl my-auto flex flex-col content-center px-4   pt-[0.7em] rounded-full">
    
    <span className="text-center  text-emerald-800  mx-a">{newCollection.length+newStories.length}</span>
    <span className=" text-center text-emerald-800 text-sm">New items</span> 
    </div>
    </div>


            
            </div>
            <label className='flex max-w-[96vw] md:w-page mx-auto border-emerald-700 border-2 rounded-full mb-1 mt-8 flex-row mx-2'>
<span className='my-auto text-emerald-800 mx-2 w-full mont-medium'> Search:</span>
  <input type='text' value={search} onChange={(e)=>handleSearch(e.target.value)} className=' rounded-full  open-sans-medium px-2 min-w-[19em] py-1 text-sm bg-transparent my-1 rounded-full border-emerald-700 border-1 text-emerald-800' />
  </label>
<div className=" sm:flex max-w-[96vw] rounded-t-lg  overflow-hidden md:w-page mx-auto sm:flex-row">

<div className='w-[96vw] md:mt-8 mx-auto flex flex-col md:w-page'>

                         
<div role="tablist" className="tabs   grid ">

<input type="radio" name="my_tabs_2" role="tab" defaultChecked className="tab hover:min-h-10  [--tab-bg:transparent] rounded-full mont-medium text-emerald-800 border-3 w-[96vw]  md:w-page   text-xl" aria-label="Stories" />
<div role="tabpanel" className="tab-content  pt-1 lg:py-4 rounded-lg md:mx-auto  w-[96vw] md:w-page  ">
   

  {storyList()}
  </div>

<input type="radio" name="my_tabs_2" role="tab"  className="tab hover:min-h-10  [--tab-bg:transparent] rounded-full mont-medium text-emerald-800 border-3 w-[96vw]  md:w-page   text-xl" aria-label="Collections" />
<div role="tabpanel" className="tab-content  pt-1 lg:py-4 rounded-lg md:mx-auto  w-[96vw] md:w-page  ">
   
   {colList()}
   </div>
   </div>   </div>   </div>   </div>   



    </div>)
}