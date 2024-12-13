import { useState } from "react"
import {useNavigate} from "react-router-dom"
import Paths from "../core/paths"
import PropTypes from "prop-types"
import ReactGA from "react-ga4"
import MediaQuery from "react-responsive"
import { setPageInView } from "../actions/PageActions"
import { setBookInView } from "../actions/BookActions"
import { useDispatch } from "react-redux"
function BookListItem({book}){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [page,setPage]=useState(null)
    BookListItem.propTypes={
        book: PropTypes.object.isRequired
    }
    const navigateToBook = ()=>{
        dispatch(setBookInView({book}))
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


<div  onClick={navigateToBook}className="max-w-48 shine hover:animation-pulse text-slate-900 min-w-56 h-48 mx-8 bg-green-400 rounded overflow-hidden shadow-lg">
 <div className="px-6 py-4">
    <div className="font-bold text-xl mb-2">{book.title}</div>
    <MediaQuery minWidth={"768px"}>
     <h5 className="text-left  text-ellipsis">{book.purpose}</h5> 
      </MediaQuery>
  </div>

</div>
  
    )
    
}
export default BookListItem