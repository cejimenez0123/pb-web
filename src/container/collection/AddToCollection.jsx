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
    const [newStories,setNewStores]=useState([])
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
   
    const colInfo = ()=>{
        return(<div className="border border-white rounded-lg m-4 sm:m-8 p-8 text-left">
            <h2 className="text-2xl mb-2">{colInView.title}</h2>
            <p className="sm:my-4 md:mx-2 p-2 sm:p-4 bg-emerald-800 rounded-lg max-w-96">{colInView.purpose}</p></div>)
    }
    const storyList = ()=>{
        return(<div className="max-w-96 max-h-96 overflow-scroll mx-auto sm:mx-12 text-left mb-2">
            <h6 className=" text-2xl font-bold">Stories</h6><InfiniteScroll
        dataLength={pagesInView.length}>
            {pagesInView.map(story=>{
                return(<div className="text-left flex flex-row justify-between border
                border-white rounded-lg p-4  my-2">
                    <h2 className="text-xl my-auto">{story.title}</h2>
                    {colInView.storyIdList.includes(story.id)?
                    <button className="btn text-white btn-circle">
<p className="text-2xl ">i</p>
</button>:
<button className="btn btn-circle text-white  btn-outline">
<p className="text-2xl  content-center rounded-[60em]">o</p>
</button>}
                </div>)
            })}
            </InfiniteScroll></div>)
    }
    const colList = ()=>{
        return(<div className="max-w-96 max-h-96 sm:h-auto sm:min-h-full mx-auto overflow-scroll sm:mx-12">
            <h6 className="text-2xl font-bold text-left mb-2">Collections</h6><InfiniteScroll
        dataLength={collectionsList.length}>
            {collectionsList.map(col=>{
                return(<div className="text-left flex sm:min-w-96 flex-row justify-between border
                border-white rounded-lg p-4  my-2">
                    <h2 className="text-xl my-auto">{col.title}</h2>
                    {colInView.collectionIdList.includes(col.id)?
                    <button className="btn text-white btn-circle">
<p className="text-2xl ">i</p>
</button>:
<button className="btn btn-circle text-white  btn-outline">
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
    // if(page && page.id == pathParams.id){
    //     return(<div >
           
    //         <div className="border mt-16 text-left border-white p-8 mx-8 rounded-lg">
    //         <h6 className="text-xl font-bold pb-2 font-bold">Your Story</h6>
    //           <h6 className="text-xl pb-8">{page.title}</h6>
            
    //           <button  
    //           onClick={()=>setOpenDialog(true)}
    //           className="bg-emerald-900">New Collection</button>
    //           </div>
    //         <div>
    //             </div>
    //             <div className="border mt-16 text-left border-white p-8 mx-8 rounded-lg">
    //                 <h6 className="text-xl font-bold pb-8 font-bold">Your Collections</h6>
    //                 {collections.length>0?<InfiniteScroll
    //             className="scroll"
    //             dataLength={collections.length}
    //             hasMore={hasMoreCol} // Replace with a condition based on your data source
    //             loader={<p>Loading...</p>}
    //             endMessage={
    //                 <div className="no-more-data">
    //                     <p>No more data to load.</p>
    //                 </div>
    //             }
    //         >
    //          {collections.map(col=>{
    //             return(<p>{col.title}</p>)
    //          })}</InfiniteScroll>:null}

    //             </div>
    //             <div>
    //           <Dialog className={
    //             "bg-emerald-400"
    //           }
    //           PaperProps={{
    //             style: {
    //               backgroundColor: 'transparent',
    //               boxShadow: 'none',
    //             },
    //           }}
            
    //           open={openDialog}
    //           onClose={()=>setOpenDialog(false)}>
    //             <CreateCollectinForm onClose={()=>{
    //               setOpenDialog(false)
    //             }}/>
    //           </Dialog>


    //             </div>
          
    //     </div>)
    // }
    
}