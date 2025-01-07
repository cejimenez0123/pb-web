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
            category: "Book",
            action: "Navigate to Book",
            label: book.title, 
            value: book.id,
            nonInteraction: false
          });
    }
    return (

<div onClick={navigateToBook} className="max-w-48  min-w-56 mx-8  rounded  shadow-sm bg-emerald-700">
<div  
className=" text-white h-48 bg-transparent ">
 <div className="px-3 py-3">
    <div className="font-bold text-l mb-2">{book.title}</div>
    
        <div className=" p-1">
     <h5 className="text-left text-white text-sm text-ellipsis overflow-hidden m-1 ">{book.purpose}</h5> 
     </div>
   
  </div>
  </div>
</div>
  
    )
    
}
export default BookListItem