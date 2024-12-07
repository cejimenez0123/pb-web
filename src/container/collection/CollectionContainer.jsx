import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { fetchCollection, fetchCollectionProtected } from "../../actions/CollectionActions"

import PageList from "../../components/page/PageDashboardList"
import { getCollectionStoriesProtected, getCollectionStoriesPublic } from "../../actions/StoryActions"
import MediaQuery from "react-responsive"
import CollectionIndexList from "../../components/collection/CollectionIndexList"

export default function CollectionContainer(props){
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const colInView = useSelector(state=>state.books.collectionInView)
    const params = useParams()
    useEffect(()=>{
       
        currentProfile?dispatch(fetchCollectionProtected(params)):dispatch(fetchCollection(params))
        currentProfile?dispatch(getCollectionStoriesProtected(params)):dispatch(getCollectionStoriesPublic(params))
     //   currentProfile?dispatch(getSubCollections(params)):dispatch(getSubCollections(params))
    },[currentProfile])
   
    const getSubCollections = ()=>{
    currentProfile?dispatch(getSubCollections(params)):dispatch(getSubCollections(params))
    }
    return(<>
        {colInView?<div className="h-48 w-48 text-left">
            <h6 className="m-8 text-2xl">{colInView.title}</h6>
        <p className=" ml-8">{colInView.purpose}</p></div>:null}
        <div className="text-left ml-8">
            <h6 className="text-xl font-bold mb-8">Pages</h6>
        <PageList/>
        {/* <MediaQuery min>
            <CollectionIndexList/>
        </MediaQuery> */}
            </div>

    </>)
}