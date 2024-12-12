import { useState } from "react"
import {useNavigate} from "react-router-dom"
import Paths from "../core/paths"
import PropTypes from "prop-types"
import ReactGA from "react-ga4"
import MediaQuery from "react-responsive"
function BookListItem({book}){
    const navigate = useNavigate()
    const [page,setPage]=useState(null)
    BookListItem.propTypes={
        book: PropTypes.object.isRequired
    }
    const navigateToBook = ()=>{
        
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
//         <div 
//         onClick={()=>navigateToBook()} 
//         className="card 
//         bg-green-600"
//         // border-white border-2 
//         // lg:my-8 lg:max-w-96 overflow-clip text-white mx-2 
//          >
//         <div className="card-body h-24  lg:h-36 min-w-36 hover:h-full   max-w-96 ">
// <div className=" py-0.5 px-1 w-full h-full">
//         <h6 className=" text-left font-extrabold">{book.title}</h6>
//         <MediaQuery minWidth={"768px"}>
//       <p className="text-left text-ellipsis">{book.purpose}</p> 
//       </MediaQuery>
//         </div>
//       </div>
    
    // </div>

<div class="max-w-48 min-w-56 h-48 mx-8 bg-green-600 rounded overflow-hidden shadow-lg">
 <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">{book.title}</div>
    <MediaQuery minWidth={"768px"}>
     <p className="text-left text-ellipsis">{book.purpose}</p> 
      </MediaQuery>
  </div>
  {/* <div class="px-6 pt-4 pb-2">
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
  </div> */}
</div>
  
    )
    
}
export default BookListItem