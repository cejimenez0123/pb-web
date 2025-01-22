import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getStory } from "../../actions/StoryActions"
import { addStoryListToCollection, deleteStoryFromCollection, getMyCollections } from "../../actions/CollectionActions"
import InfiniteScroll from "react-infinite-scroll-component"
import CreateCollectionForm from "../../components/collection/CreateCollectionForm"
import {Dialog} from "@mui/material"
import addBox from "../../images/icons/add_circle.svg"
import clear from "../../images/icons/close.svg"
import { useMediaQuery } from "react-responsive"
export default function AddStoryToCollectionContainer(props){
  const isPhone =  useMediaQuery({
    query: '(max-width: 600px)'
  })
    const pathParams = useParams()
    const dispatch = useDispatch()
    const page = useSelector(state=>state.pages.pageInView)
    const [hasMoreCol,setHasMoreCol]=useState(true)
    const [openDialog,setOpenDialog]=useState(false)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const collections = useSelector(state=>state.books.collections)
    const addStory = (e,collection)=>{
        e.preventDefault()
      dispatch(addStoryListToCollection({id:collection.id,list:[page],profile:currentProfile}))
    }
    const deleteStory = (e,collection)=>{
      e.preventDefault()
      dispatch(deleteStoryFromCollection({id:collection.id,storyId:page.id}))
    }
    useEffect(()=>{

        dispatch(getStory({id:pathParams.id}))
    },[])
    useEffect(()=>{
        dispatch(getMyCollections()).then(()=>{
            setHasMoreCol(false)
        })
    },[])
  
    
    if(page && page.id == pathParams.id){
        return(<div className="text-emerald-800">
           
            <div className="border-2 mt-16 w-[96vw] h-info lg:w-info mx-auto mx-auto text-left border-emerald-600 p-8 mx-8 sm:mx-8 rounded-lg">
            <h6 className="text-xl font-bold pb-2 lora-medium  font-bold">Your Story</h6>
              <h6 className="text-xl mont-medium pb-8">{page.title}</h6>
            
              <button  
              onClick={()=>setOpenDialog(true)}
              className="bg-emerald-900 text-white rounded-full">New Collection</button>
              </div>
            <div>
                </div>
                <div className="border-2   max-w-[96vw] md:w-page  mx-auto border-emerald-600 mt-16 text-left   mx-2 rounded-lg">
                    <h6 className="text-xl font-bold pb-8 mont-medium font-bold">Your Collections</h6>
                    {collections.length>0?
                    <InfiniteScroll
                className="scroll "
                dataLength={collections.length}
                hasMore={hasMoreCol} // Replace with a condition based on your data source
                loader={<p>Loading...</p>}
                endMessage={
                    <div className="no-more-data">
                        <p>No more data to load.</p>
                    </div>
                }
            >
             {collections.map(col=>{
  const found =col.storyIdList.find(sTc=>{
  
   return sTc.storyId == page.id
  })

              if(col){
                return(<div key={col.id}  className="border-emerald-600 border-2 mx-auto w-[96%] flex flex-row justify-between rounded-full px-6 py-4 my-3">
                  <h6  className="text-md lg:text-xl my-auto  overflow-hidden text-ellipsis max-w-[12rem] whitespace-nowrap " >{col.title}</h6>{!found?<img onClick={(e)=>addStory(e,col)}className="bg-emerald-600 p-2 w-12 h-12 rounded-full" src={addBox}/>:<img onClick={(e)=>deleteStory(e,col)}className="bg-emerald-600 p-2 w-12 h-12 rounded-full" src={clear}/>}</div>)
}else{
  return <div className="skeleton w-[100%]"></div>
}})}</InfiniteScroll>:null}

                </div>
                <div>
              <Dialog className={
                "bg-emerald-400"
              }
              fullScreen={isPhone}
              PaperProps={{
                style: {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                },
              }}
            
              open={openDialog}
              onClose={()=>setOpenDialog(false)}>
                <CreateCollectionForm onClose={()=>{
                  setOpenDialog(false)
                }}/>
              </Dialog>


                </div>
          
        </div>)
    }
    
}