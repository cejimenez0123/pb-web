import { useEffect ,useLayoutEffect} from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { fetchCollection, fetchCollectionProtected, getSubCollectionsProtected, getSubCollectionsPublic } from "../../actions/CollectionActions"
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
    const collections = useSelector(state=>state.books.collections)
    const params = useParams()
    useLayoutEffect(()=>{
       
        currentProfile?dispatch(fetchCollectionProtected(params)):dispatch(fetchCollection(params))
       
    },[currentProfile])
    const getSubCollections = ()=>{
        currentProfile?dispatch(getSubCollectionsProtected(params)):dispatch(getSubCollectionsPublic(params))
        }
    useLayoutEffect(()=>{
        currentProfile?dispatch(getCollectionStoriesProtected(params)):dispatch(getCollectionStoriesPublic(params))
      getSubCollections()
    },[colInView])
  
    const collectioinIs = ()=>{
        if(colInView.childCollections.length>0){
            return "Community"
        }else{
            return "Anthology"
        }
    }
   
    const collectionInfo=()=>{
        
        
        if(!colInView){
            return(<div>Loading</div>)
        }
        return(<div className="h-fit max-w-[100vw] sm:pb-8 sm:w-48 sm:border sm:border-white  mx-2 mt-4 md:mx-8 md:mt-8 rounded rounded-lg mb-8 text-left">
    <h3 className="m-8  text-3xl">{colInView.title}</h3>
        <h3 className=" md:ml-8 text-xl bg-emerald-600 max-w-[100vw] md:max-w-96 rounded-lg p-4">{colInView.purpose}</h3>
        <div className="md:ml-8 mt-8 flex flex-row">
   <button className="bg-green-700 text-xl">Follow</button>
   {currentProfile&& (colInView.isOpenCollaboration || colInView.profileId==currentProfile.id)?
   <div
    className="flex-row flex"
   >
    <img onClick={()=>navigate(Paths.addToCollection.createRoute(colInView.id))
   }className="w-8 h-8 mx-8 my-auto"src={add}/>
   {colInView.profileId==currentProfile.id?<img 
   onClick={()=>navigate(Paths.editCollection.createRoute(colInView.id))}
   className="w-8 h-8 mx-4 my-auto"src={edit}/>:null}</div>:null}



   
   </div></div>)}



    return(<>
        {colInView?collectionInfo():null}
        <div className="text-left  max-w-[100vw]   mx-auto ">
            {colInView.collectionIdList && colInView.collectionIdList.length>0?<h3 className="text-2xl font-bold text-center">Anthologies</h3>:null}
            <div>
                <InfiniteScroll
                dataLength={collections.length}
                className="flex flex-row py-8"
                next={()=>{}}
                hasMore={false} // Replace with a condition based on your data source
                loader={<p>Loading...</p>}
                >
                    {collections.map(col=>{
                       return <BookListItem book={col}/>
                    })}
                </InfiniteScroll>
            </div>
            <h6 className="text-2xl mb-8 w-fit text-center font-bold pl-4">Pages</h6>
        <div className=" ">
        <PageList/>
        </div>
            </div>

    </>)
}