import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getStory } from "../../actions/StoryActions"
import { addStoryListToCollection, getMyCollections } from "../../actions/CollectionActions"
import InfiniteScroll from "react-infinite-scroll-component"
import CreateCollectinForm from "../../components/collection/CreateCollectionForm"
import {Dialog} from "@mui/material"
import addBox from "../../images/icons/add_box.svg"
import emptyBox from "../../images/icons/empty_box.svg"
export default function AddStoryToCollectionContainer(props){
    const pathParams = useParams()
    const dispatch = useDispatch()
    const page = useSelector(state=>state.pages.pageInView)
    const [hasMoreCol,setHasMoreCol]=useState(true)
    const [openDialog,setOpenDialog]=useState(false)
    const collections = useSelector(state=>state.books.collections)
    const addStory = (collection)=>{

      dispatch(addStoryListToCollection({id:collection.id,list:[page]}))
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
           
            <div className="border-2 mt-16 text-left border-emerald-600 p-8 mx-2 sm:mx-8 rounded-lg">
            <h6 className="text-xl font-bold pb-2  font-bold">Your Story</h6>
              <h6 className="text-l pb-8">{page.title}</h6>
            
              <button  
              onClick={()=>setOpenDialog(true)}
              className="bg-emerald-900 text-white rounded-full">New Collection</button>
              </div>
            <div>
                </div>
                <div className="border-2 border-emerald-600 mt-16 text-left  p-8 mx-2 sm:mx-8 rounded-lg">
                    <h6 className="text-xl font-bold pb-8 font-bold">Your Collections</h6>
                    {collections.length>0?
                    <InfiniteScroll
                className="scroll"
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
                return(<div key={col.id} onClick={()=>addStory(col)} className="border-emerald-600 border-2 rounded-full px-6 py-4 my-3">
                  <h6  className="text-l" >{col.title}</h6></div>)
             })}</InfiniteScroll>:null}

                </div>
                <div>
              <Dialog className={
                "bg-emerald-400"
              }
              PaperProps={{
                style: {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                },
              }}
            
              open={openDialog}
              onClose={()=>setOpenDialog(false)}>
                <CreateCollectinForm onClose={()=>{
                  setOpenDialog(false)
                }}/>
              </Dialog>


                </div>
          
        </div>)
    }
    
}