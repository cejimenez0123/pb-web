import { useEffect ,useLayoutEffect} from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { fetchCollection, fetchCollectionProtected } from "../../actions/CollectionActions"
import add from "../../images/icons/add_box.svg"
import PageList from "../../components/page/PageDashboardList"
import { getCollectionStoriesProtected, getCollectionStoriesPublic } from "../../actions/StoryActions"
import edit from "../../images/icons/edit.svg"
import Paths from "../../core/paths"

export default function CollectionContainer(props){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const colInView = useSelector(state=>state.books.collectionInView)
    const params = useParams()
    useLayoutEffect(()=>{
       
        currentProfile?dispatch(fetchCollectionProtected(params)):dispatch(fetchCollection(params))
       
    },[currentProfile])
    useLayoutEffect(()=>{
        currentProfile?dispatch(getCollectionStoriesProtected(params)):dispatch(getCollectionStoriesPublic(params))
    },[colInView])
    const collectioinIs = ()=>{
        if(colInView.collectionIdList.length>0){
            return "Community"
        }else{
            return "Anthology"
        }
    }
    const getSubCollections = ()=>{
    currentProfile?dispatch(getSubCollections(params)):dispatch(getSubCollections(params))
    }
    const collectionInfo=()=>{return(<div className="h-fit max-w-[100vw] sm:pb-8 sm:w-48 sm:border sm:border-white  mx-2 mt-4 md:mx-8 md:mt-8 rounded rounded-lg mb-8 text-left">
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
        <div className="text-left max-w-[100vw] md:ml-8">
            <h6 className="text-xl font-bold pl-4 mb-2">Pages</h6>
        <PageList/>
      
            </div>

    </>)
}