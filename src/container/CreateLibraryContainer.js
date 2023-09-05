import { useNavigate } from "react-router-dom"
import {useState,useEffect} from "react"
import { useDispatch,useSelector } from "react-redux"
import { getProfileBooks } from "../actions/BookActions"
import { getProfilePages } from "../actions/PageActions"
import { createLibrary } from "../actions/LibraryActions"
import InfiniteScroll from "react-infinite-scroll-component"
import "../styles/CreateLibrary.css"

export default function CreateLibraryContainer(props){

    const navigate = useNavigate()
    const [libTitle,setLibTitle]=useState("")
    const [purpose,setPurpose] = useState("")
    const currentProfile = useSelector(state=>{return state.users.currentProfile})
    const booksInView = useSelector(state=>state.books.booksInView)
    const pagesInView = useSelector(state => state.pages.pagesInView)
    const [libIsPrivate,setLibIsPrivate]= useState(false)
    const [writingIsOpen,setWritingIsOpen]= useState(false)
    // const [pagesToBeAdded,setPagesToBeAdded]=useState([])
    // const [booksToBeAdded, setBooksToBeAdded]=useState([])
    const [contentToBeAdded,setContentsToBeAdded]= useState([])
    const [listItems,setListItems]=useState([])
    const dispatch = useDispatch()
    
    const handleLibTitleChange = (e)=>{
        setLibTitle(e.target.value)
    }
    const fetchProfilePages=()=>{
        if(!!currentProfile){
            const params = {profileId:currentProfile.id}
            dispatch(getProfilePages(params)).then(result=>{
                const {payload} = result
                setListItems(prevState=>{
                    const list = payload.pageList.map(page=>{
                        return {type: "page",item: page}
                })
                    const differences = list.filter(item=> {return !listItems.includes(item)})

                    if(differences.length>0){

                        
                        return [...prevState,...differences]
                     }else{
                         return [...prevState]
                     }})
                    
                
                })}}
    
 
    const fetchProfileBooks=()=>{
        if(currentProfile){
            const params = {profileId:currentProfile.id}
            dispatch(getProfileBooks(params)).then(result =>{
                const {payload}= result
            
            setListItems(prevState=>{
            const list = payload.bookList.map(book=>{
                    return {type: "book",item: book}
            })
            const differences = list.filter((item)=>{return !listItems.includes(item)})
            if(differences.length>0){
               
               
               
               return [...prevState,...differences]
            }else{
                return [...prevState]
            }})
            })
    }}
    const getBookmarkLibraryPages=()=>{

    }
    const fetchBooks=()=>{
        fetchProfileBooks()
    }
    const fetchPages=()=>{
        fetchProfilePages()
    }
    const onClickAdd=(hash)=>{
        console.log(`onClickAdd ${JSON.stringify(hash)}`)
        setContentsToBeAdded(prevState=>[...prevState,hash])
    }
        
    
    const onClickRemove=(hash)=>{
        const toBeAdded = [...contentToBeAdded]
        const newContent = toBeAdded.filter(aHash=>{
           return aHash.item.id != hash.item.id
        })
        setContentsToBeAdded(newContent)

    }
    const handleOnSubmit=(e)=>{
        // const pageIdList = pagesToBeAdded.map(p=>p.id)
        const filterPages = contentToBeAdded.filter(hash => hash.type == "page").map(
            hash=> hash.item.id
        )
        const filterBooks = contentToBeAdded.filter(hash => hash.type == "book").map(
            hash=> hash.item.id
        )
        // const bookIdList = booksToBeAdded.map(b=>b.id)
        e.preventDefault()
        const params = {
            name: libTitle,
            purpose: purpose,
            profileId: currentProfile.id,
            pageIdList: filterPages,
            bookIdList: filterBooks,
            writingIsOpen: writingIsOpen,
            privacy:libIsPrivate
        }
        console.log(`parsubmit ${JSON.stringify(params)}`)
        dispatch(createLibrary(params)).then((result) => {
            const {payload} = result
            console.log(`romus ${JSON.stringify(payload)}`)
            navigate(`/library/${payload.library.id}`)
        }).catch((err) => {
            
        });
    
    }
    useEffect(()=>{
        fetchPages()
        fetchBooks()
    },[])
    const pageList = ()=>{
        if(!!listItems && listItems.length > 0){
        return(<div class="list">
            <InfiniteScroll  dataLength={listItems.length} 
   next={fetchPages}
   hasMore={false} // Replace with a condition based on your data source
   loader={<p>Loading...</p>}
   endMessage={<p>No more data to load.</p>}
>
     {listItems.map((hash) =>{

             return(<div className="list-item" key={hash.item.id}>
                <div>
                    {hash.type}
                <h2 className="list-item-title">
                {hash.item.title}
            
                </h2>
                </div>
                <div>
              
                <button onClick={()=>onClickAdd(hash)}>
                    Add
                </button>
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
       console.log(`CONTENT ATO ${JSON.stringify(contentToBeAdded)}`)
       return (<div className="content-to-be-added">
        {contentToBeAdded.map(hash=>{
               return (<div key={hash.item.id} className="item">
               <div>
               <div>
                  {hash.type}
               </div>
               <h6><div>{hash.item.title}</div></h6>
               </div>
               <div>
                   <button onClick={()=>onClickRemove(hash) }>Remove</button>
               </div>
              </div>
              )  
        })}
        </div>)}
        
    
return(<div>
    <div className="container">
        <div className="left-side-bar">
            <div className="add-page-list">
                {contentToBeAddedList()}
            </div>
        </div>
        <div className="main-side-bar">
            {pageList()}
        </div>
        <div className="right-side-bar">
            <div>
            <form id="form" onSubmit={(e) => handleOnSubmit(e)} >
            <div>
                <label>
                Library Name:
                    <input type="text" name="name" className="text-input" placeholder="Library Name" onChange={(e)=>handleLibTitleChange(e)}/>
                </label>
            </div>
            <div> 
            <label>Private:
                <input type="checkbox"  onChange={
                (e)=>{
                    setLibIsPrivate(e.target.checked)
                }} name="privacy" checked={libIsPrivate} className="checkbox"/>
            </label>
            <label>Writing is Open:
                <input type="checkbox" name="writingIsOpen" onChange={
                (e)=>{
                    setWritingIsOpen(e.target.checked)
                }}checked={writingIsOpen} className="checkbox"/></label>
            <label>Purpose:
                <textarea onChange={(e)=>{
                    setPurpose(e.target.value);
                }}id="purpose" name="purpose" rows="5" cols="33"/> 
            </label>
           
            <button type="submit" className="btn btn-primary">
    Save
        </button>
        </div>
            </form>
            </div>
        </div>
    </div>
</div>)
}