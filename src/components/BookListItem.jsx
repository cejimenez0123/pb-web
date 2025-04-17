import {useNavigate} from "react-router-dom"
import Paths from "../core/paths"

import { clearPagesInView } from "../actions/PageActions.jsx"
import { useDispatch } from "react-redux"
import { setCollectionInView } from "../actions/CollectionActions"
import { setCollections } from "../actions/CollectionActions"
import { useLayoutEffect } from "react"
import { initGA, sendGAEvent } from "../core/ga4.js"
function BookListItem({book}){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useLayoutEffect(()=>{
        initGA()
    })
    const navigateToBook = ()=>{  
        dispatch(clearPagesInView())
        dispatch(setCollections({collections:[]}))
        dispatch(setCollectionInView({collection:book}))
        navigate(Paths.collection.createRoute(book.id))
        sendGAEvent("Navigate",`Navigate to Collection:${book.title}`)
  
    }
    return (

<div onClick={navigateToBook} className=" h-[10rem] hover:h-[12rem] text-left shadow-md min-w-[12rem] max-w-[13rem] mx-8  rounded-lg  bg-emerald-700">
<div  
className=" text-white h-48 bg-transparent ">
 <div className="px-3 py-3">
    <div className="font-bold text-l lora-bold b-2">{book.title}</div>
    
        <div className=" p-2 overflow-hidden max-h-[6rem] hover:max-h-[10rem] open-sans-medium text-ellipsis ">
     <h6 className="text-left  text-white text-sm  p-1 ">{book.purpose}</h6> 
     </div>
   
  </div>
  </div>
</div>
  
    )
    
}
export default BookListItem