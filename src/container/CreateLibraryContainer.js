import { useNavigate } from "react-router-dom"
import {useState,useEffect} from "react"
import { useDispatch,useSelector } from "react-redux"
import { appendSaveRolesFoBook,  } from "../actions/BookActions"
import theme from "../theme"
import {  appendSaveRolesForPage} from "../actions/PageActions"
import { createLibrary,getProfileLibraries,updateLibraryContent } from "../actions/LibraryActions"
import InfiniteScroll from "react-infinite-scroll-component"
import "../styles/CreateLibrary.css"
import {    FormGroup,
            Button,
            FormControlLabel,
            TextField, 
            TextareaAutosize,
            Checkbox } from "@mui/material"
import { Add } from "@mui/icons-material"
import MediaQuery from "react-responsive"
export default function CreateLibraryContainer(props){
    const booksToBeAdded = useSelector(state => state.books.booksToBeAdded)
    const pagesToBeAdded = useSelector(state => state.pages.pagesToBeAdded)
    
    const navigate = useNavigate()
    
    const currentProfile = useSelector(state=>{return state.users.currentProfile})
    const librariesInView = useSelector(state => state.libraries.librariesInView)
   
    const dispatch = useDispatch()
    
    
    const onClickAdd=(hash)=>{  
        
        let pIdList = pagesToBeAdded.map(page=>{ return page.id; });
        let bIdList = booksToBeAdded.map(book=>{ return book.id; });
        let pageIdList = [...hash.pageIdList]
        if(pIdList!=null && pIdList.length > 0){
            pageIdList = [...hash.pageIdList,...pIdList]
        }
        let bookIdList = [...hash.bookIdList]
        
        if(bIdList!=null &&bIdList.length>0){
            bookIdList = [...bookIdList,...bIdList]
        }
        let params = {
            library:hash,
            pageIdList:pageIdList,
            bookIdList:bookIdList
        }
        const bookRoleParams = {
            bookIdList,
            readers: hash.readers,
            commenters: hash.commenters
        }

        const pageRoleParams = {
            pageIdList,
            reader: hash.readers,
            commenters: hash.commenters
        }
        dispatch(appendSaveRolesFoBook(bookRoleParams))
        dispatch(appendSaveRolesForPage(pageRoleParams))
        dispatch(updateLibraryContent(params)).then(result=>{
            if(result.error==null){
                navigate(`/library/${hash.id}`)
            }
        })  
    }
    
    
    const fetchLibraries = ()=>{
        if(currentProfile){
            const params = {profile:currentProfile}
            dispatch(getProfileLibraries(params))
        }
    }
    useEffect(()=>{
        fetchLibraries()
    },[])


        const libraryList = ()=>{
        if(!!librariesInView && librariesInView.length > 0){
        return(<div class="content">
            <InfiniteScroll dataLength={librariesInView.length} 
                            next={fetchLibraries}
                            hasMore={false} 
                            loader={<p>Loading...</p>}
                            endMessage={<div className="empty">
                                    <p>No more data to load.</p>
                                    </div>}
            >
     {librariesInView.map((hash) =>{

             return(<div className="list-item" key={hash.id}>
                <div>
                    
                <h2 className="list-item-title">
                {hash.name}
            
                </h2>
                </div>
                <div>
              
                <Button onClick={()=>onClickAdd(hash)}>
                    <Add />
                </Button>
                </div>
            </div>)
        })}
            </InfiniteScroll>
        </div>)}else{
            return (<div>
                Loading...
            </div>)
        }
    }
    const contentToBeAddedList = ()=>{

        return (<div >
            <div>
                <h4>Things that'll be added</h4>
            </div>
            <div className="content-to-be-added-list">
            {addedItems("Book",booksToBeAdded)}
            {addedItems("Page",pagesToBeAdded)}
            </div>
        </div>)
    }
    const addedItems = (label,items)=>{
        if(items!=null && items.length>0){
        return(<div className="info to-be-added">
           <div>
           <h5> {label}</h5>
           </div>
     {items.map((hash) =>{

             return(<div className="list-item" key={hash.id}>
                <div>
                    
                <h6 className="list-item-title">
                {hash.title}
            
                </h6>
                </div>
                <div>
    
                </div>
            </div>)
        })}

        </div>)}else{
            return(<div>
                0 items to add
            </div>)
        }
    }
   
        
    
return(<div >
    <div className="container">
        <div className="left-side-bar">
                <MediaQuery maxWidth={"1000px"}>
                    <LibraryCreateForm/>
                </MediaQuery>
                {contentToBeAddedList()}
        
        </div>
        <div className="main-side-bar">
          <div className="content-list" >
            {libraryList()}
            </div>
        </div>
        <div className="right-side-bar">
            <MediaQuery minWidth={"1000px"}>
                <LibraryCreateForm/>
            </MediaQuery>
           
        
        </div>
    </div>
</div>)
}
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
    const [contentToBeAdded,setContentsToBeAdded]= useState([])
    const handleOnSubmit=(e)=>{
        const bookIdList = booksToBeAdded.map(book=>book.id)
        const pageIdList = pagesToBeAdded.map(page=>page.id)
        // const filterPages = contentToBeAdded.filter(hash => hash.type == "page").map(
        //     hash=> hash.item.id
        // )
        // const filterBooks = contentToBeAdded.filter(hash => hash.type == "book").map(
        //     hash=> hash.item.id
        // )
    
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
        }}id="purpose" name="purpose" rows="5" cols="33"/> 
    
   
    <Button variant="outlined" style={{marginTop:"2em",backgroundColor:theme.palette.secondary.main,color:theme.palette.secondary.contrastText}}type="submit" onClick={(e) => handleOnSubmit(e)}>
Save
</Button>
    </FormGroup>)
}