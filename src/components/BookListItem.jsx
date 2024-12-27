import { useState } from "react"
import {useNavigate} from "react-router-dom"
import Paths from "../core/paths"
import PropTypes from "prop-types"
import ReactGA from "react-ga4"
import MediaQuery from "react-responsive"
import { clearPagesInView } from "../actions/PageActions"
import { useDispatch } from "react-redux"
import { setCollectionInView} from "../actions/CollectionActions"
function BookListItem({book}){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
 
    const navigateToBook = ()=>{
       
        dispatch(setCollectionInView({collection:book}))
        dispatch(clearPagesInView())
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


<div  onClick={navigateToBook}
className="max-w-48 col-item text-slate-900 min-w-56 h-48 mx-8 bg-green-400 rounded  shadow-lg">
 <div className="px-3 py-3">
    <div className="font-bold text-l mb-2">{book.title}</div>
    <MediaQuery minWidth={"768px"}>
        <div className=" max-h-12 overflow-hidden">
     <h5 className="text-left text-sm  m-1 ">{book.purpose}</h5> 
     </div>
      </MediaQuery>
  </div>

</div>
  
    )
    
}
export default BookListItem