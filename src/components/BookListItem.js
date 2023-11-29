import {useDispatch} from "react-redux"
import { fetchPage } from "../actions/PageActions"
import { useState } from "react"
import {useNavigate} from "react-router-dom"
import Paths from "../core/paths"
function BookListItem({book}){
    const navigate = useNavigate()
    const [page,setPage]=useState(null)
    return (<div onClick={()=>{
        navigate(Paths.book.createRoute(book.id))
    }} className="book-list-item">
        <h6 className="title">{book.title}</h6>
       <p className="purpose">{book.purpose}</p> 
    </div>)
}
export default BookListItem