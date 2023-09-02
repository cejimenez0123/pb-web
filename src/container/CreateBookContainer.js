
import { useState ,useEffect} from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { getProfilePages,fetchArrayOfPages } from "../actions/PageActions"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import Page from "../domain/models/page"
import { UseSelector, useSelector } from "react-redux/es/hooks/useSelector"
import { getCurrentProfile } from "../actions/UserActions"
import { createBook } from "../actions/BookActions"
import PageListItem from "../components/PageLIstItem"
export default function CreateBookContainer({pagesInView}){
        const navigate = useNavigate()
        const [bookTitle,setBookTitle]=useState("")
        const [purpose,setPurpose] = useState("")
        const currentProfile = useSelector(state=>{return state.users.currentProfile})
        const [bookIsPrivate,setBookIsPrivate]= useState(false)
        const [bookIsOpen,setBookIsOpen]= useState(false)
        const [pagesToBeAdded,setPagesToBeAdded]=useState([])
        const dispatch = useDispatch()
        
        const handleBookTitleChange = (e)=>{
            setBookTitle(e.target.value)
        }
        const fetchProfilePages=()=>{
            if(!!currentProfile){
                const params = {profileId:currentProfile.id}
                dispatch(getProfilePages(params))
        }
        }
        const getBookmarkLibraryPages=()=>{

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
                privacy: bookIsPrivate
            }
        
            dispatch(createBook(params)).then(result=>{
                console.log(`CreateBookParmas ${JSON.stringify(result)}`)
                const {payload} = result
                if(result.error==null){
                    navigate(`/book/${payload.book.id}`)
                    
                }
            })
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