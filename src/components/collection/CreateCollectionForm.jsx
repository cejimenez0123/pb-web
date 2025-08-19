import { useState } from "react"
import close from "../../images/icons/close_dark.svg"
import { useDispatch, useSelector } from "react-redux"
import { createCollection, setCollectionInView } from "../../actions/CollectionActions"
import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"
import "../../App.css"
import { clearPagesInView } from "../../actions/PageActions.jsx"
import InfoTooltip from "../InfoTooltip"
export default function CreateCollectionForm({onClose}){
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [name,setName]=useState("")
    const [purpose,setPurpose]=useState("")
    const [isPrivate,setIsPrivate]=useState(true)
    const [writingIsOpen,setWritingIsOpen]=useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const clickCreateCollection = (e)=>{
        e.preventDefault()
        let params = {
            title:name,
            purpose:purpose,
            isPrivate:isPrivate,
            profileId:currentProfile.id,
            isOpenCollaboration:writingIsOpen
        } 
    
        dispatch(createCollection(params)).then(res=>{
            dispatch(clearPagesInView())
            dispatch(setCollectionInView({collection:res.payload.collection}))
            navigate(Paths.collection.createRoute(res.payload.collection.id))
            onClose()
        })
    }
    return(<form className=" lg:w-[100%]   rounded-lg text-emerald-700 ">

        <div className="mb-3 mx-4 pt-4" >

        <div className="px-4 pb-8">
        <div class="mb-4 flex flex-col">
        </div>
        <h2 className="mx-auto mont-medium  text-emerald-700 text-2xl font-bold mb-4">Create Collection</h2>
        <label className="xs mont-medium text-emerald-700 text-xl mb-2">
            Name of Collection
        </label>
        <input 
        value={name}
        className="bg-transparent rounded-lg w-[100%]  text-emerald-700 px-2 p-2 text-md lg:text-l border-emerald-800 border-2 "
        onChange={(e)=>setName(e.target.value)}
        />
        <label className=" mt-6 text-xl">
            Purpose
        </label>
        <textarea value={purpose}
        className="bg-transparent rounded-lg  text-emerald-700  w-[100%] mt-2  p-2 text-md lg:text-l border-emerald-700 border-2 resize-y"
                 onChange={(e)=>setPurpose(e.target.value)}/>
<div className="flex  flex-row">
     <div className="my-auto ">
        <InfoTooltip text="Collection will only be visible to you and those with roles"/></div>
        <div className="my-4 w-fit max-w-36">
   
            {isPrivate?<h6 onClick={()=>setIsPrivate(false)} className={"bg-emerald-800   mont-medium py-3 text-[0.95rem] sm:text-[1rem] w-[14em]  text-white rounded-full px-4  text-center"}>is Private</h6>:<h6
            className={"bg-emerald-700  mont-medium text-white rounded-full text-[0.95rem] text-[0.95rem] sm:text-[1rem] w-[14em]  py-3  border-3 border-emerald-400 sm:text-[1rem] text-center "}
            onClick={()=>setIsPrivate(true)}>is Public</h6>}
            
        </div>
</div>

  <div className=" flex-row flex ">
    <InfoTooltip text="Anyone who finds this collection can add to it if it's open"/>

            {writingIsOpen?<div className={"bg-transparent mont-medium flex border-emerald-800 border-4 text-center w-[14em] h-[4em] text-white text-[0.95rem] sm:text-[1rem] rounded-full  "} onClick={()=>setWritingIsOpen(false)}>
                <h6 className="mx-auto my-auto">Open Collaboration</h6></div>:<div
            onClick={()=>setWritingIsOpen(true)}
            className={"bg-transparent  mont-medium flex border-emerald-800  border-2 text-center w-[14em] text-white h-[4em] text-[0.95rem] sm:text-[1rem] rounded-full  "} 
><h6 className="mx-auto my-auto text-emerald-800">Close Collaboration</h6></div>}

</div>    </div>
    <div className="text-right">
<button onClick={(e)=>clickCreateCollection(e)} className="bg-emerald-800 px-5  mont-medium rounded-full text-[1.2rem] text-white">
   Create
</button>
</div>
</div>
  </form>)
}