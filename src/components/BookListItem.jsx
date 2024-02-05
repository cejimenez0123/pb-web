import { useState } from "react"
import {useNavigate} from "react-router-dom"
import Paths from "../core/paths"
import PropTypes from "prop-types"
function BookListItem({book}){
    const navigate = useNavigate()
    const [page,setPage]=useState(null)
    BookListItem.propTypes={
        book: PropTypes.object.isRequired
    }
    const navigateToBook = ()=>{
        navigate(Paths.book.createRoute(book.id))
    }
    return (<div 
                    onClick={()=>navigateToBook()} 
                    className="book-list-item">
        <h6 className="title">{book.title}</h6>
       <p className="purpose">{book.purpose}</p> 
    </div>)
    
}
export default BookListItem