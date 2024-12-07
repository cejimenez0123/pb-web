import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { fetchCollection, fetchCollectionProtected } from "../../actions/CollectionActions"
import add from "../../images/icons/add_box.svg"
import PageList from "../../components/page/PageDashboardList"
import { getCollectionStoriesProtected, getCollectionStoriesPublic } from "../../actions/StoryActions"
import MediaQuery from "react-responsive"
import CollectionIndexList from "../../components/collection/CollectionIndexList"
import Paths from "../../core/paths"

export default function CollectionContainer(props){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const colInView = useSelector(state=>state.books.collectionInView)
    const params = useParams()
    useEffect(()=>{
       
        currentProfile?dispatch(fetchCollectionProtected(params)):dispatch(fetchCollection(params))
        currentProfile?dispatch(getCollectionStoriesProtected(params)):dispatch(getCollectionStoriesPublic(params))
     //   currentProfile?dispatch(getSubCollections(params)):dispatch(getSubCollections(params))
    },[currentProfile])
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
    const collectionInfo=()=>{return(<div className="h-fit pb-8 w-48 border border-white  mx-8 mt-8 rounded rounded-lg mb-8 text-left">
    <h6 className="m-8 text-2xl">{colInView.title}</h6>
        <p className=" ml-8 bg-emerald-800 max-w-96 rounded-lg p-4">{colInView.purpose}</p>
        <div className="ml-8 mt-8 flex flex-row">
   <button className="bg-emerald-600">Follow</button>
   <img onClick={()=>navigate(Paths.addToCollection.createRoute(colInView.id))
   }className="w-8 h-8 mx-4 my-auto"src={add}/>



   {/* <button className="bg-transparent"><img className="w-8 h-8"src={add}/></button> */}
   </div></div>)}



    return(<>
        {colInView?collectionInfo():null}
        <div className="text-left ml-8">
            <h6 className="text-xl font-bold mb-8">Pages</h6>
        <PageList/>
      
            </div>

    </>)
}