import { useEffect ,useLayoutEffect, useState} from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { clearCollections, fetchCollection, fetchCollectionProtected, getSubCollectionsProtected, getSubCollectionsPublic } from "../../actions/CollectionActions"
import add from "../../images/icons/add_box.svg"
import PageList from "../../components/page/PageList"
import { getCollectionStoriesProtected, getCollectionStoriesPublic } from "../../actions/StoryActions"
import edit from "../../images/icons/edit.svg"
import Paths from "../../core/paths"
import InfiniteScroll from "react-infinite-scroll-component"
import BookListItem from "../../components/BookListItem"

export default function CollectionContainer(props){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const colInView = useSelector(state=>state.books.collectionInView)
    const sTcList = useSelector(state=>state.pages.storyToCollectionList)
    let stories = sTcList.map(stc=>stc.story)
    const [pages,setPages]=useState(stories)
    const collections = useSelector(state=>state.books.collections)
    const params = useParams()
    useLayoutEffect(()=>{
       
        currentProfile?dispatch(fetchCollectionProtected(params)):dispatch(fetchCollection(params))
       
    },[currentProfile])
    const getSubCollections = ()=>{
        dispatch(clearCollections())
        currentProfile?dispatch(getSubCollectionsProtected(params)):dispatch(getSubCollectionsPublic(params))
        }
    useLayoutEffect(()=>{
        currentProfile?dispatch(getCollectionStoriesProtected(params)):dispatch(getCollectionStoriesPublic(params))
      getSubCollections()
    },[colInView])
  

   
    const collectionInfo=()=>{
        
        
        if(!colInView){
            return(<div>Loading</div>)
        }
        return(<div className="h-fit max-w-[100vw] sm:pb-8 sm:w-48 sm:border-2 p-4 sm:border-emerald-800  mx-2 mt-4 md:mx-8 md:mt-8  rounded-lg mb-8 text-left">
    <h3 className="m-8  text-emerald-800 text-3xl">{colInView.title}</h3>
        <h3 className=" md:mx-8 text-emerald-800 max-w-[100vw] md:max-w-96 rounded-lg p-4">{colInView.purpose}</h3>
        <div className="md:ml-8 mt-8 flex flex-row">
   <button className="bg-emerald-700 rounded-full text-l">Follow</button>
   {currentProfile&& (colInView.isOpenCollaboration || colInView.profileId==currentProfile.id)?
   <div
    className="flex-row flex mx-2"
   >
    <img onClick={()=>navigate(Paths.addToCollection.createRoute(colInView.id))
   }className="rounded-full bg-emerald-800 p-2 mr-2 my-auto"src={add}/>
   {colInView.profileId==currentProfile.id?<img 
   onClick={()=>{
  
    navigate(Paths.editCollection.createRoute(colInView.id))}}
   className="rounded-full bg-emerald-800 p-2  my-auto"src={edit}/>:null}</div>:null}



   
   </div></div>)}

if(colInView && collections){
  

    return(<>

<div className="pb-[10rem] ">       {colInView?collectionInfo():null}
        <div className="text-left  max-w-[100vw]    mx-auto ">
            {colInView && colInView.childCollections ? <h3 className="text-2xl text-emerald-800 font-bold text-center">Anthologies</h3>:<div className="skeleton bg-slate-200 w-72 h-36 m-2"/>}
            <div>
                <InfiniteScroll
                dataLength={collections.length}
                className="flex flex-row py-8"
                next={()=>{}}
                hasMore={false} // Replace with a condition based on your data source
                loader={<p>Loading...</p>}
                endMessage={
                    <div className="text-emerald-800 p-5">
                    <p className="mx-auto">Fin</p>
                    </div>
                }
                >
                    {collections.map(col=>{
                       return <BookListItem book={col}/>
                    })}
                </InfiniteScroll>
            </div>
            <h6 className="text-2xl mb-8 w-fit text-center text-slate-800 font-bold pl-4">Pages</h6>
        <div className=" ">
        <PageList  isGrid={false}/>
        </div>
            </div>
            </div> 
    </>)
}
return(<div>
    Loading...
</div>)
}