import {useNavigate} from "react-router-dom"
import Paths from "../core/paths"
import ReactGA from "react-ga4"
import MediaQuery from "react-responsive"
import { clearPagesInView } from "../actions/PageActions"
import { useDispatch } from "react-redux"
import { setCollectionInView } from "../actions/CollectionActions"
function BookListItem({book}){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const navigateToBook = ()=>{  
        dispatch(clearPagesInView())
        dispatch(setCollectionInView({collection:book}))
        navigate(Paths.collection.createRoute(book.id))
        ReactGA.event({
            category: "Collection",
            action: "Navigate to Collection",
            label: book.title, 
            value: book.id,
            nonInteraction: false
          });
    }
    return (

<div onClick={navigateToBook} className=" h-[10rem] hover:h-[12rem] shadow-md min-w-[12rem] max-w-[13rem] mx-8  rounded-lg  bg-emerald-700">
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