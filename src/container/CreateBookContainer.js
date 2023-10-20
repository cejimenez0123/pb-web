
import { useState ,useEffect} from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { getProfileBooks, updateBook } from "../actions/BookActions"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import {  useSelector } from "react-redux/es/hooks/useSelector"
import { getCurrentProfile } from "../actions/UserActions"
import { createBook} from "../actions/BookActions"
import { appendSaveRolesForPage } from "../actions/PageActions"
import PageListItem from "../components/PageLIstItem"
export default function CreateBookContainer({pagesInView,booksInView}){
        const navigate = useNavigate()
        const [bookTitle,setBookTitle]=useState("")
        const [purpose,setPurpose] = useState("")
        const currentProfile = useSelector(state=>state.users.currentProfile)
       const [bookIsPrivate,setBookIsPrivate]= useState(false)
        const [bookIsOpen,setBookIsOpen]= useState(false)
        const pagesToBeAdded = useSelector(state=>{return state.pages.pagesToBeAdded})
        // const [pagesToBeAdded,setPagesToBeAdded]=useState([])
        const dispatch = useDispatch()
        
        const handleBookTitleChange = (e)=>{
            setBookTitle(e.target.value)
        }
   
    

        const handleOnSubmit=(e)=>{
         
        e.preventDefault()
            
            const pageIdList = pagesToBeAdded.map(page=>{
                return page.id
            })
            const params = {
                title: bookTitle,
                purpose: purpose,
                profileId: currentProfile.id,
                pageIdList: pageIdList,
                writingIsOpen: bookIsOpen,
                privacy: bookIsPrivate,
                commenters:[],
                editors:[],
                readers:[],
                writers:[]
            }
        
            dispatch(createBook(params)).then(result=>{
                
                const {payload} = result
                if(result !=null && result.error==null){
                    navigate(`/book/${payload.book.id}`)
                    
                }
            })
        }
    
    const fetchBooks = ()=>{
        const params = {profile: currentProfile}
        dispatch(getProfileBooks(params))
    }
    const addUpdateBook=(book)=>{
        
    pagesToBeAdded.forEach(async page=>{
        let readers = [...page.readers,...book.readers]
        let commenters = [...page.commenters,...book.commenters]
        let pageIdList = book.pageIdList
        pageIdList.push(page.id)
        const roleParams = {
            pageIdList,
            readers,
            commenters,
         
        }
        dispatch(appendSaveRolesForPage(roleParams))
        
       
        const params ={
            book,
            title:book.title,
            purpose:book.purpose,
            pageIdList,
            privacy:book.
            privacy,
            writingIsOpen:book.writingIsOpen
        } 
        dispatch(updateBook(params))
        .then(result => {
            if(result.error==null){
                navigate(`/book/${book.id}`)
            }
        }).catch(error =>{

        })
    })
    }
    const bookList = ()=>{
            let i = 0
                return(<div>
                    <InfiniteScroll  dataLength={booksInView.length} 
           next={fetchBooks}
           hasMore={false} // Replace with a condition based on your data source
           loader={<p>Loading...</p>}
           endMessage={<p>No more data to load.</p>}
        >
             {booksInView.map(book=>{
                i+=1
                return (<div key={`${book.id}_${i}`} onClick={()=>addUpdateBook(book) }>
                    {book.title}
                </div>)
             })}
    
    
             
                    </InfiniteScroll>
                </div>)
            }

        const pagesToBeAddedList =()=>{
            if(pagesToBeAdded!=null && pagesToBeAdded.length>0){
            return(<div>
                {pagesToBeAdded.map(page =>{

                    return (
                        <div key={page.id}>
                            <h6>{page.title}</h6>
                        
                        </div>
                    )
                })}
            </div>)}else{
                return(<div>
                    Loading...
                    </div>)
            }
        }
    return(<div>
        <div className="container">
            <div className="left-side-bar">
                <div className="add-page-list">
                {pagesToBeAddedList()}
                </div>
            </div>
            <div className="main-side-bar">
                {bookList()}
            </div>
            <div className="right-side-bar">
                <div>
                <form onSubmit={(e) => handleOnSubmit(e)} >
                <label>
                    Book Title:
                    <input type="text" name="title" className="text-input" placeholder="Book Name" onChange={(e)=>handleBookTitleChange(e)}/>
                </label>
                <label>Private:
                    <input type="checkbox"  onChange={
                    (e)=>{
                        setBookIsPrivate(e.target.checked)
                    }} name="privacy" checked={bookIsPrivate} className="checkbox"/>
                </label>
                <label>Writing is Open:
                    <input type="checkbox" name="writingIsOpen" onChange={
                    (e)=>{
                        setBookIsOpen(e.target.checked)
                    }}checked={bookIsOpen} className="checkbox"/></label>
                <label>Purpose:
                    <textarea onChange={(e)=>{
                        setPurpose(e.target.value);
                    }}id="purpose" name="purpose" rows="5" cols="33"/> 
                </label>
                <button type="submit" className="btn btn-primary">
        Save
            </button>
                </form>
                </div>
            </div>
        </div>
    </div>)
}