import { useNavigate } from "react-router-dom"
import {useState,useEffect} from "reeact"
import { useDispatch,useSelector } from "react-redux"
import { getProfileBooks } from "../actions/BookActions"
import { createLibrary } from "../actions/LibraryActions"

export default function CreateLibraryContainer(props){

    const navigate = useNavigate()
    const [bookTitle,setBookTitle]=useState("")
    const [purpose,setPurpose] = useState("")
    const currentProfile = useSelector(state=>{return state.users.currentProfile})
    const [bookIsPrivate,setBookIsPrivate]= useState(false)
    const [bookIsOpen,setBookIsOpen]= useState(false)
    const [pagesToBeAdded,setPagesToBeAdded]=useState([])
    const [booksToBeAdded, setBooksToBeAdded]=useState({})
    const dispatch = useDispatch()
    
    // const handleBookTitleChange = (e)=>{
    //     setBookTitle(e.target.value)
    // }
    const fetchProfilePages=()=>{
        if(!!currentProfile){
            const params = {profileId:currentProfile.id}
            dispatch(getProfilePages(params))
    }
    }
    const fetchProfileBooks=()=>{
        if(!!currentProfile){
            const params = {profileId:currentProfile.id}
            dispatch(getProfileBooks(params))
            }
    }
    const getBookmarkLibraryPages=()=>{

    }
    const fetchBooks=()=>{
        fetchProfileBooks()
    }
    const fetchPages=()=>{
        fetchProfilePages()
    }
    const onClickAdd=(page)=>{
        setPagesToBeAdded(prevState=>[...prevState,page])
    }
    const onClickRemove=(page)=>{
        const pages = [...pagesToBeAdded]
        const newPages = pages.filter(p=>p.id!=page.id)
        setPagesToBeAdded(newPages)

    }
    const handleOnSubmit=(e)=>{
     
        console.log("TOUCH")
        const pageIdList = pagesToBeAdded.map(page=>{
            return page.id
        })
        const params = {
            title: bookTitle,
            purpose: purpose,
            profileId: currentProfile.id,
            pageIdList: pagesToBeAdded,
            bookIdList: booksToBeAdded,

            writingIsOpen: bookIsOpen,
            privacy: bookIsPrivate
        }
        dispatch(createLibrary(params))
                

        
    }
    useEffect(()=>{
        fetchPages()
    },[])
    const pageList = ()=>{
        return(<div>
            <InfiniteScroll  dataLength={pagesInView.length} 
   next={fetchPages}
   hasMore={false} // Replace with a condition based on your data source
   loader={<p>Loading...</p>}
   endMessage={<p>No more data to load.</p>}
>
     {pagesInView.map(page =>{
             return(<div>
                <div>
                    <h2>
                {page.title}
                </h2>
                </div>
                <button onClick={()=>onClickAdd(page)}>
                    Add
                </button>
             </div>)


     })}
            </InfiniteScroll>
        </div>)
    }
 
    const pagesToBeAddedList =()=>{
        return(<div>
            {pagesToBeAdded.map(page =>{

                return (
                    <div>
                        <h6>{page.title}</h6>
                        <div>
                            <button onClick={()=>onClickRemove(page) }>Remove</button>
                        </div>
                    </div>
                )
            })}
        </div>)
    }
return(<div>
    <div className="container">
        <div className="left-side-bar">
            <div className="add-page-list">
            {pagesToBeAddedList()}
            </div>
        </div>
        <div className="main-side-bar">
            {pageList()}
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