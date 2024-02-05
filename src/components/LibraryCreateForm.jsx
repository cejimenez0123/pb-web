import theme from "../theme"
import { createLibrary } from "../actions/LibraryActions"
import "../styles/CreateLibrary.css"
import {    FormGroup,
            Button,
            FormControlLabel,
            TextField, 
            TextareaAutosize,
            Checkbox } from "@mui/material"
import { useNavigate } from "react-router-dom"
import {useState} from "react"
import { useDispatch,useSelector } from "react-redux"
function LibraryCreateForm(props){
    const booksToBeAdded = useSelector(state => state.books.booksToBeAdded)
    const pagesToBeAdded = useSelector(state => state.pages.pagesToBeAdded)
    const currentProfile = useSelector(state => state.users.currentProfile)
    const [libTitle,setLibTitle]=useState("")
    const [purpose,setPurpose] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [libIsPrivate,setLibIsPrivate]= useState(false)
    const [writingIsOpen,setWritingIsOpen]= useState(false)
    const handleOnSubmit=(e)=>{
        const bookIdList = booksToBeAdded.map(book=>book.id)
        const pageIdList = pagesToBeAdded.map(page=>page.id)
      
    
        e.preventDefault()
        const params = {
            name: libTitle,
            purpose: purpose,
            profileId: currentProfile.id,
            pageIdList: pageIdList,
            bookIdList: bookIdList,
            writingIsOpen: writingIsOpen,
            privacy:libIsPrivate,
            commenters:[],
            readers:[],
            editors:[],
            writers:[]

        }
        
        dispatch(createLibrary(params)).then((result) => {
            const {payload} = result
          
            navigate(`/library/${payload.library.id}`)
        }).catch((err) => {
            
        });
    
    }
    const handleLibTitleChange = (e)=>{
        setLibTitle(e.target.value)
    }
    return( <FormGroup style={{

    }}className="create-form"  >
        
        <TextField  type="text"
                    label="Library Name" 
                    placeholder="Library Name" 
                    className="text-input" 
                    value={libTitle}
                    onChange={(e)=>handleLibTitleChange(e)}/>
        <FormControlLabel 

            control={<Checkbox 
                        onChange={
                            (e)=>{
                setLibIsPrivate(e.target.checked)
                }
            } 
            name="privacy" 
            checked={libIsPrivate} 
            className="checkbox"/> 
        }   label={`${libIsPrivate? "Private":"Public"}`}/>
    <FormControlLabel 
        control={<Checkbox onChange={
            (e)=>{
                setWritingIsOpen(e.target.checked)
            }}checked={writingIsOpen} 
           /> 
        } label={`Writing is ${writingIsOpen? "open":"close"}`}/>
    <label>Purpose:</label>
        <TextareaAutosize
            onChange={(e)=>{
                setPurpose(e.target.value);
            }}
            id="purpose"
            name="purpose" 
            style={{padding:"1em",borderRadius:"16px"}}
            rows="5" cols="33"/> 
    
   
    <Button variant="outlined" style={{marginTop:"2em",backgroundColor:theme.palette.secondary.main,color:theme.palette.secondary.contrastText}}type="submit" onClick={(e) => handleOnSubmit(e)}>
Save
</Button>
    </FormGroup>)
}
export default LibraryCreateForm