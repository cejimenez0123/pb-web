import { useState } from "react"
import close from "../../images/icons/close_dark.svg"
import { useDispatch, useSelector } from "react-redux"
import { createCollection, setCollectionInView } from "../../actions/CollectionActions"
import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"
import { clearPagesInView } from "../../actions/PageActions"

export default function CreateCollectionForm(props){
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
            
        })
    }
    return(<form className=" w-[100%]  rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 pt-2 ">

        <div className="mb-3 mx-4 pt-4" >

            <img  onClick={props.onClose} src={close}/>

        <div className="px-4 pb-8">
        <div class="mb-4 flex flex-col">
        </div>
        <h2 className="text-emerald-800 mx-auto text-xl font-bold mb-4">Create Collection</h2>
        <label className="text-emerald-800 text-xl mb-2">
            Name of Collection
        </label>
        <input 
        value={name}
        className="bg-transparent rounded-lg w-[100%] px-2 text-emerald-800 p-2 sm:text-l border-emerald-700 border-2 "
        onChange={(e)=>setName(e.target.value)}
        />
        <label className="text-emerald-800 mt-6 text-xl">
            Purpose
        </label>
        <textarea value={purpose}
        className="bg-transparent rounded-lg w-[100%] mt-2 text-emerald-800 p-2 sm:text-l border-emerald-700 border-2 resize-y"
                 onChange={(e)=>setPurpose(e.target.value)}/>
        {/* <label className="text-emerald-800 h-18 mt-4 flex flex-row content-between my-auto">
            <p className="mr-2">Collection is {isPrivate?"Private":"Public"}</p> <input type="checkbox"
            className="checkbox border-white ml-28 border"
            checked={isPrivate} onChange={(e)=>setIsPrivate(e.target.checked)}/>
        </label> */}
        <div className="my-4 w-fit max-w-36">
            {isPrivate?<h6 onClick={()=>setIsPrivate(false)} className={"bg-emerald-800  py-3 text-[0.95rem] sm:text-[1rem] w-[9rem]  text-white rounded-full px-4  text-center"}>is Private</h6>:<h6
            className={"bg-emerald-700  text-white rounded-full text-[0.95rem] py-3  border-3 border-emerald-400 sm:text-[1rem] text-center "}
            onClick={()=>setIsPrivate(true)}>is Public</h6>}
        </div>
{/*         
        <label className="text-emerald-800 flex mt-4  flex-row my-auto"> */}
        <div className="my-4">
            {writingIsOpen?<div className={"bg-transparent border-emerald-500 border-4 py-3 text-center w-[14em] text-emerald-800 text-[0.95rem] sm:text-[1rem] rounded-full px-4 "} onClick={()=>setWritingIsOpen(false)}>Open Collaboration</div>:<div
            onClick={()=>setWritingIsOpen(true)}
            className={"bg-transparent border-emerald-800 border-2  rounded-full text-[0.9rem] w-[14em]  sm:text-[1rem] py-3 text-center text-emerald-800 px-4 "}>Close Collaboration</div>}
    </div>
    <div className="text-right">
<button onClick={(e)=>clickCreateCollection(e)} className="bg-emerald-800 px-5  rounded-full text-[1.2rem] text-white">
    Submit
</button>
</div>
    </div>
    </div>
  </form>)
}