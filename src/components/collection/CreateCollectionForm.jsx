import { useState } from "react"
import close from "../../images/icons/close.svg"
import { useDispatch, useSelector } from "react-redux"
import { createCollection } from "../../actions/CollectionActions"
import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"

export default function CreateCollectinForm(props){
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
            navigate(Paths.collection.createRoute(res.payload.collection.id))
            
        })
    }
    return(<form className="sm:border-white w-[100%] sm:border-2 mx-auto bg-transparent sm:border rounded ">

        <div >
        <button onClick={()=>props.onClose} className="bg-transparent flex flex-start" >
            <img src={close}/>
        </button>
        <div class="mb-4 flex flex-col">
        </div>
        <h2 className="text-white mx-auto text-xl font-bold mb-4">Create Collection</h2>
        <label className="text-white">
            Name of Collection
        </label>
        <input 
        value={name}
        className="bg-transparent rounded-lg w-[100%] text-white p-2 text-xl border-white border"
        onChange={(e)=>setName(e.target.value)}
        />
        <label className="text-white">
            Purpose
        </label>
        <textarea value={purpose}
        className="bg-transparent rounded-lg w-[100%] text-white p-2 text-xl border-white border resize-y"
                 onChange={(e)=>setPurpose(e.target.value)}/>
        <label className="text-white h-18 mt-4 flex flex-row content-between my-auto">
            <p>Collection is {isPrivate?"Private":"Public"}</p> <input type="checkbox"
            className="checkbox border-white ml-24 border"
            checked={isPrivate} onChange={(e)=>setIsPrivate(e.target.checked)}/>
        </label>
        
        <label className="text-white flex mt-4  flex-row my-auto">
            Anyone can add to collection
            <input  checked={writingIsOpen} 
            onChange={(e)=>setWritingIsOpen(e.target.checked)}
            className="checkbox border-white border ml-6"
            type="checkbox"/>
        </label>
<button onClick={(e)=>clickCreateCollection(e)} className="bg-emerald-800 mt-8 text-white">
    Submit
</button>
    </div>
  </form>)
}