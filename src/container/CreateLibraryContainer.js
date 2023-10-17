import { useNavigate } from "react-router-dom"
import {useState,useEffect} from "react"
import { useDispatch,useSelector } from "react-redux"
import { appendSaveRolesFoBook,  } from "../actions/BookActions"

import {  appendSaveRolesForPage} from "../actions/PageActions"
import { createLibrary,getProfileLibraries,updateLibraryContent } from "../actions/LibraryActions"
import InfiniteScroll from "react-infinite-scroll-component"
import "../styles/CreateLibrary.css"

export default function CreateLibraryContainer(props){

    const navigate = useNavigate()
    const [libTitle,setLibTitle]=useState("")
    const [purpose,setPurpose] = useState("")
    const currentProfile = useSelector(state=>{return state.users.currentProfile})
    // const booksInView = useSelector(state=>state.books.booksInView)
    // const pagesInView = useSelector(state => state.pages.pagesInView)
    const librariesInView = useSelector(state => state.libraries.librariesInView)
    const booksToBeAdded = useSelector(state => state.books.booksToBeAdded)
    const pagesToBeAdded = useSelector(state => state.pages.pagesToBeAdded)
    const [libIsPrivate,setLibIsPrivate]= useState(false)
    const [writingIsOpen,setWritingIsOpen]= useState(false)
    const [contentToBeAdded,setContentsToBeAdded]= useState([])
    const [listItems,setListItems]=useState([])
    const dispatch = useDispatch()
    
    const handleLibTitleChange = (e)=>{
        setLibTitle(e.target.value)
    }
  
   
  
    
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
        
    
    // const onClickRemove=(hash)=>{
    //     const toBeAdded = [...contentToBeAdded]
    //     const newContent = toBeAdded.filter(aHash=>{
    //        return aHash.item.id != hash.item.id
    //     })
    //     setContentsToBeAdded(newContent)

    // }
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
        
        dispatch(createLibrary(params)).then((result) => {
            const {payload} = result
          
            navigate(`/library/${payload.library.id}`)
        }).catch((err) => {
            
        });
    
    }
    const fetchLibraries = ()=>{
        if(currentProfile){
            const params = {profile:currentProfile}
            dispatch(getProfileLibraries(params))
        }
    }
    useEffect(()=>{
        fetchLibraries()
        // fetchPages()
        // fetchBooks()
    },[])
//     const pageList = ()=>{
//         if(!!listItems && listItems.length > 0){
//         return(<div class="list">
//             <InfiniteScroll  dataLength={listItems.length} 
//    next={fetchPages}
//    hasMore={false} // Replace with a condition based on your data source
//    loader={<p>Loading...</p>}
//    endMessage={<p>No more data to load.</p>}
// >
//      {listItems.map((hash) =>{

//              return(<div className="list-item" key={hash.item.id}>
//                 <div>
//                     {hash.type}
//                 <h2 className="list-item-title">
//                 {hash.item.title}
            
//                 </h2>
//                 </div>
//                 <div>
              
//                 <button onClick={()=>onClickAdd(hash)}>
//                     Add
//                 </button>
//                 </div>
//             </div>)
//         })}
//             </InfiniteScroll>
//         </div>)}else{
//             return (<div>
//                 Loading...
//             </div>)
//         }
//     }

        const libraryList = ()=>{
        if(!!librariesInView && librariesInView.length > 0){
        return(<div class="list">
            <InfiniteScroll  dataLength={librariesInView.length} 
   next={fetchLibraries}
   hasMore={false} // Replace with a condition based on your data source
   loader={<p>Loading...</p>}
   endMessage={<p>No more data to load.</p>}
>
     {librariesInView.map((hash) =>{

             return(<div className="list-item" key={hash.id}>
                <div>
                    
                <h2 className="list-item-title">
                {hash.name}
            
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

        return (<div className="content-to-be-added-list">
            {addedItems("Book",booksToBeAdded)}
            {addedItems("Page",pagesToBeAdded)}
        </div>)
    }
    const addedItems = (label,items)=>{
        if(items!=null && items.length>0){
        return(<div>
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
            return(<div></div>)
        }
    }
   
        
    
return(<div>
    <div className="container">
        <div className="left-side-bar">
            <div className="add-page-list">
                {contentToBeAddedList()}
            </div>
        </div>
        <div className="main-side-bar">
          
            {libraryList()}
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