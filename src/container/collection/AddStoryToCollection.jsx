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
    const [search,setSearch]=useState("")
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const collections = useSelector(state=>state.books.collections).filter(col=>col).filter(col=>{
      if(search.length>0){
       return col.title.toLowerCase().includes(search.toLowerCase())
      }else{
       return true
      }
  
     })
    const addStory = (e,collection)=>{
        e.preventDefault()
      dispatch(addStoryListToCollection({id:collection.id,list:[page],profile:currentProfile}))
    }
    const handleSearch = (value)=>{
      setSearch(value)
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
        return(<div className="text-emerald-800 w-[100vw]">
           
            <div className="border-2 mt-16 w-[96vw] h-info mx-auto md:w-info  text-left border-emerald-600 p-8   rounded-lg">
            <h6 className="text-xl font-bold pb-2 lora-medium  font-bold">Your Story</h6>
              <h6 className="text-xl mont-medium pb-8">{page.title}</h6>
            
              <button  
              onClick={()=>setOpenDialog(true)}
              className="bg-emerald-900 text-white rounded-full">New Collection</button>
              </div>
            <div>
                </div>
                <div className="border-2   max-w-[96vw] md:w-page md:px-2  mx-auto border-emerald-600  md:mb-4 mb-1 mt-16 text-left   mx-2 rounded-lg">
                    <div className="flex flex-col md:flex-row pb-8 md:ml-4 pt-4  w-[100%]">
                    <h6 className="text-xl font-bold my-auto ml-4 lora-medium font-bold">Your Collections</h6>
                   <label className='flex my-auto w-[80%] mt-4 mx-auto border-emerald-600 border-2 rounded-full my-1 flex-row md:mx-4 '>
<span className='my-auto text-emerald-800 mx-2 w-full mont-medium '> Search</span>
  <input type='text' value={search} onChange={(e)=>handleSearch(e.target.value)} className=' px-2   w-full min-w-58 py-1  text-sm bg-transparent my-1  text-emerald-800' />
  </label></div>
                    {collections.length>0?
                    <InfiniteScroll
                className="scroll "
                dataLength={collections.length}
                hasMore={hasMoreCol} // Replace with a condition based on your data source
                loader={<p>Loading...</p>}
                endMessage={
                    <div className="flex ">
                        <p className="text-emerald-800 mx-auto md:text-xl py-12 lora-medium">Fin </p>
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