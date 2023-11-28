
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { getProfileBooks, updateBook,createBook } from "../actions/BookActions"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import {  useSelector } from "react-redux/es/hooks/useSelector"
import { appendSaveRolesForPage } from "../actions/PageActions"
import { FormGroup, TextField,FormControlLabel,Checkbox, Button,TextareaAutosize, IconButton} from "@mui/material"
import theme from "../theme"
import "../styles/CreateBook.css"
import "../styles/CreateLibrary.css"
import { Add } from "@mui/icons-material"
import MediaQuery from "react-responsive"
import checkResult from "../core/checkResult"
const inputStyle = {
    width: "100%",
}
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
        
    pagesToBeAdded.forEach(page=>{
        let readers = [...book.commenters,...book.writers,...book.editors,...book.readers]
        let list = pagesToBeAdded.map(page=>page.id)
        let pageIdList = [...book.pageIdList,...list]
        pageIdList.push(page.id)
        const roleParams = {
            pageIdList,
            readers,
        }
        dispatch(appendSaveRolesForPage(roleParams)).then(result=>{
            checkResult(result,payload=>{
                window.alert("Book contributors added to page readers")
            },(err)=>{
                window.alert("Error others may not be able to read page. Check roles")
            })
        })   
    })
    
    let list = pagesToBeAdded.map(page=>page.id)
    let pageIdList = [...book.pageIdList,...list]
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
        checkResult(result,payload=>{
            navigate(`/book/${book.id}`)
        },()=>{})
    }).catch(error =>{

    })
    }
    const bookList = ()=>{
            let i = 0
                return(<div >
                    <InfiniteScroll  dataLength={books.length} 
           next={fetchBooks}
           hasMore={false} // Replace with a condition based on your data source
           loader={<p>Loading...</p>}
           endMessage={<p className="no-more-data">No more data to load.</p>}
        >
             {books.map(book=>{
                i+=1
                return (<div className="list-item" key={`${book.id}_${i}`}>
                    {book.title}
                    <IconButton onClick={()=>addUpdateBook(book)}>
                    <Add/>
                    </IconButton>
                 
                </div>)
             })}
    
    
             
                    </InfiniteScroll>
                </div>)
            }

        const pagesToBeAddedList =()=>{
            if(pagesToBeAdded!=null){
        
             
            return(<div className="content-to-be-added-list">
                <div>
                <h4>Pages to be Added</h4>
                </div>
                {pagesToBeAdded.length>0?pagesToBeAdded.map(page =>{

                    return (
                        <div key={page.id}>
                            <h6>{page.title}</h6>
                        
                        </div>
                    )
                }):<h6>0 items being added</h6>}
            </div>)}
            
        }
      
    return(<div >
        <div className="container">
            <div className="left-bar">

              
                <MediaQuery maxWidth={"1000px"}>
                    <CreateForm/>
                    </MediaQuery> 
                    <div className="info to-be-added">
                
                {pagesToBeAddedList()}
                </div>
            </div>
            <div className="main-bar">
              <div className="content-list">
                {bookList()}
                </div>
            </div>
            <div className="right-bar">
               
               <MediaQuery minWidth={"1000px"}>
                <CreateForm/>
                </MediaQuery> 
            
            </div>
        </div>
    </div>)
}


function CreateForm (props){
    const [bookTitle,setBookTitle]=useState("")
    const [purpose,setPurpose] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [bookIsPrivate,setBookIsPrivate]= useState(false)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [bookIsOpen,setBookIsOpen]= useState(false)
    const pagesToBeAdded = useSelector(state=>{return state.pages.pagesToBeAdded})     
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
    return(<FormGroup  className="create-form"  >
                
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
style={{width: '100%',padding:"1em"}}
   
value={purpose}
minRows={3} 
onChange={(e)=>{
setPurpose(e.target.value);
}} />
<Button variant="outlined" 
        style={{ width:inputStyle.width,
            marginLeft:inputStyle.marginLeft, 
            padding:"1em" ,
             marginTop:"2em",backgroundColor:theme.palette.secondary.main,
                    color:theme.palette.secondary.contrastText}}
        onClick={(e) => handleOnSubmit(e)}>
Save
</Button>

</FormGroup>)
}