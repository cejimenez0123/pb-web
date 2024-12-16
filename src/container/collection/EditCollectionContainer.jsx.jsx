import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { fetchCollection } from "../../actions/CollectionActions"
import edit from "../../images/icons/edit.svg"
import add from "../../images/icons/add_box.svg"
import Paths from "../../core/paths"
export default function EditCollectionContainer(props){
    const colInView = useSelector(state=>state.books.collectionInView)
    const params = useParams()
    const [title,setTitle]=useState(colInView.title)
    const [purpose,setPurpose]=useState(colInView.purpose)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(()=>{
        const {id}=params
        if(colInView && colInView.id != id){
            dispatch(fetchCollection(params))
        }
    },[])

    const currentProfile = useSelector(state=>state.users.currentProfile)
    const collectionInfo=()=>{
        
        return(<div className="h-fit max-w-[100vw] sm:pb-8 sm:w-48 sm:border sm:border-white  mx-2 mt-4 md:mx-8 md:mt-8 rounded rounded-lg mb-8 text-left">
    <input 
      
  onChange={(e)=>{
    setTitle(e.target.value)
}}
    type="text" className="mx-4 bg-transparent text-white px-2 py-4 w-full mb-4 text-2xl" value={title}></input>
        <textarea className=" md:ml-8 textarea text-xl bg-emerald-600 md:w-92 md:max-w-96 rounded-lg p-4">{purpose}</textarea>
        <div className="md:ml-8 mt-8 flex flex-row">

   {currentProfile&& (colInView.isOpenCollaboration || colInView.profileId==currentProfile.id)?
   <div className="flex flex-row mx-4"> <button className="bg-green-600 rounded-lg">Save</button><img onClick={()=>navigate(Paths.addToCollection.createRoute(colInView.id))
   }className="w-8 h-8 mx-8 my-auto"src={add}/></div>:null}
   </div>
</div>
)}
    if(colInView){
        return(<div>
            {collectionInfo()}
        </div>)
    }else{
        return(<div>
            Loading
            {colInView.title}
        </div>)
    }
    
}