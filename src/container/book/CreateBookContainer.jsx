
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { getProfileBooks, updateBook,createBook, updateBookContent } from "../../actions/BookActions"
import { useDispatch,useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { appendSaveRolesForPage } from "../../actions/PageActions"
import {IconButton} from "@mui/material"
import "../../styles/CreateBook.css"
import "../../styles/CreateLibrary.css"
import { Add } from "@mui/icons-material"
import checkResult from "../../core/checkResult"
import CreateForm from "../../components/CreateForm"
import { iconStyle } from "../../styles/styles"

export default function CreateBookContainer({pagesInView}){
        const navigate = useNavigate()
        const [books,setBooks]=useState([])
        const currentProfile = useSelector(state=>state.users.currentProfile)
        const pagesToBeAdded = useSelector(state=>{return state.pages.pagesToBeAdded})
        const dispatch = useDispatch()
    useEffect(
        ()=>{
            fetchBooks()
        },[]
    )
    
    const fetchBooks = ()=>{
        if(currentProfile){
        const params = {profile: currentProfile}
        dispatch(getProfileBooks(params)).then(result=>
            checkResult(result,(payload)=>{
                const {bookList}=payload
                setBooks(bookList)
            },err=>{

            }))}
    }
    const addUpdateBook=(book)=>{
        let list = pagesToBeAdded.map(page=>page.id)

        
        dispatch(updateBookContent({book,pageIdList:list})).then(result=>
            checkResult(result,payload=>{
                    navigate(`/book/${book.id}`)
                },()=>{}))
    }
    const bookList = ()=>{
            let i = 0
                return(<div >
                    <InfiniteScroll style={{maxHeight:"90vh"}}className="create-list" dataLength={books.length} 
           next={fetchBooks}
           hasMore={false} // Replace with a condition based on your data source
           loader={<p>Loading...</p>}
           endMessage={<p className="no-more-data">No more data to load.</p>}
        >
             {books.map(book=>{
            
                return (<div className={`list-item rounded ${false? "add":""}`} key={`${book.id}_${i}`}>
                    <h6>{book.title}</h6>
                    <div className="button-row">
                    <IconButton onClick={()=>addUpdateBook(book)}>
                    <Add style={iconStyle}/>
                    </IconButton>
                    </div>
                </div>)
             })}
    
    
             
                    </InfiniteScroll>
                </div>)
            }
      
    return(
        <div className="two-panel">
            <div className="left-bar">         
                {bookList()}    
            </div>
            <div className="right-bar">
                <CreateForm/>
            </div>
        </div>
    )
}