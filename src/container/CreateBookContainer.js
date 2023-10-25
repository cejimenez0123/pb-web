
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
import { FormGroup, TextField,FormControlLabel,Checkbox, Button,TextareaAutosize} from "@mui/material"
import theme from "../theme"
import "../styles/CreateBook.css"
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
                return(<div className="content" >
                    <InfiniteScroll  dataLength={booksInView.length} 
           next={fetchBooks}
           hasMore={false} // Replace with a condition based on your data source
           loader={<p>Loading...</p>}
           endMessage={<p>No more data to load.</p>}
        >
             {booksInView.map(book=>{
                i+=1
                return (<div className="list-item" key={`${book.id}_${i}`} onClick={()=>addUpdateBook(book) }>
                    {book.title}
                </div>)
             })}
    
    
             
                    </InfiniteScroll>
                </div>)
            }

        const pagesToBeAddedList =()=>{
            if(pagesToBeAdded!=null){
        
                if(pagesToBeAdded.length>0){
            return(<div>
                <div>
                <h4>To Be Added:</h4>
                </div>
                {pagesToBeAdded.map(page =>{

                    return (
                        <div key={page.id}>
                            <h6>{page.title}</h6>
                        
                        </div>
                    )
                })}
            </div>)}else{
                return(<div>
                    <div>
                    <h4>To Be Added:</h4>
                    </div>
                    <h6>0 Pages To Be Added</h6>
                </div>)
            }}else{
                return(<div>
                    <div>
                        <h4>To Be Added:</h4>
                    </div>
                    Loading...
                    </div>)
            }
        }
        const inputStyle = {
            width: "90%",
            marginLeft:"1em"
        }
    return(<div className="create">
        <div className="container">
            <div className="left-side-bar">

                <div className="info to-be-added">
                    
                {pagesToBeAddedList()}
                </div>
            </div>
            <div className="main-side-bar">
               <div className="content-list create">
                {bookList()}
                </div>
            </div>
            <div className="right-side-bar">
               
                <FormGroup  className="create-form"  >
                
                    <TextField 
                    style={inputStyle}
                    label="Book Title"
                    placeholder="Title" 
                    onChange={(e)=>handleBookTitleChange(e)}/>
                  <FormControlLabel  style={inputStyle}
                control={<Checkbox checked={bookIsPrivate} onChange={(e)=>{
                    setBookIsPrivate(e.target.checked)
                }}/>} label={bookIsPrivate?"Private":"Public"}
                   value={bookIsPrivate}/>   
               
                <FormControlLabel style={inputStyle}
                control={<Checkbox checked={bookIsOpen} onChange={(e)=>{
                   setBookIsOpen(e.target.checked)
                }}/>} label={`Writing is ${bookIsOpen? "open":"close"}`}
                 />  
                 <div  style={inputStyle} className="purpose">
                <label>Purpose</label></div> 
                <TextareaAutosize
                   
            value={purpose}
            minRows={3} 
            cols={38}
            onChange={(e)=>{
                setPurpose(e.target.value);
        }} />
                <Button variant="outlined" 
                        style={{ width:inputStyle.width,marginLeft:inputStyle.marginLeft,   marginTop:"2em",backgroundColor:theme.palette.secondary.main,
                                    color:theme.palette.secondary.contrastText}}
                        onClick={(e) => handleOnSubmit(e)}>
        Save
            </Button>
           
                </FormGroup>
            
            </div>
        </div>
    </div>)
}