
import { useState } from "react"
import { createBook } from "../actions/BookActions"
import { useDispatch , useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
//import { FormGroup,List,ListItem, TextField,FormControlLabel,Checkbox, Button,TextareaAutosize} from "@mui/material"
import theme from "../theme"
import "../styles/CreateBook.css"
import "../styles/CreateLibrary.css"
import { textareaStyle } from "../styles/styles"
import Paths from "../core/paths"
import { setHtmlContent, setPageInView } from "../actions/PageActions.jsx"
const inputStyle = {
    width: "100%",
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
    value={bookTitle}
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
style={{width: '100%',padding:"1em",borderRadius: textareaStyle.borderRadius}}
   
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
<List>
    {pagesToBeAdded.map(page =><ListItem key={page.id} onClick={()=>{
        dispatch(setHtmlContent(page.data))
        dispatch(setPageInView({page}))
        navigate(Paths.page.createRoute(page.id))
    }}>{page.title.length>0?page.title:"Untitled"}</ListItem>)}
</List>
</FormGroup>)
}
export default CreateForm