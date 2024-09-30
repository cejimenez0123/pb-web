import { useState } from "react"
import {useNavigate} from "react-router-dom"
import Paths from "../core/paths"
import PropTypes from "prop-types"
import ReactGA from "react-ga4"
function BookListItem({book}){
    const navigate = useNavigate()
    const [page,setPage]=useState(null)
    BookListItem.propTypes={
        book: PropTypes.object.isRequired
    }
    const navigateToBook = ()=>{
        
        navigate(Paths.book.createRoute(book.id))
        ReactGA.event({
            category: "Book",
            action: "Navigate to Book",
            label: book.title, 
            value: book.id,
            nonInteraction: false
          });
    }
    return (
        <div 
        onClick={()=>navigateToBook()} 
        className="card bg-dark  overflow-clip text-white mx-2 ">
        <div className="card-body h-36 hover:h-full   w-48 ">
<div className=" py-0.5 px-1 w-full h-full">
        <h6 className=" text-left font-extrabold">{book.title}</h6>
      <p className="text-left text-ellipsis">{book.purpose}</p> 
        </div>
      </div>
    
    </div>
    
    // <div 
    //    onClick={()=>navigateToBook()} 
    //     className="bg-white text-black h-24 w-24 rounded-md mx-4 px-2 py-2">
    //     <h6 className="title">{book.title}</h6>
    //    <p className="purpose">{book.purpose}</p> 
    // </div>
    )
    
}
export default BookListItem