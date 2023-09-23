import { useParams } from "react-router-dom"
import { useDispatch,useSelector } from "react-redux"
import { useState,useEffect } from "react"
import { fetchBook } from "../actions/BookActions"
import Page from "../domain/models/page"
import { fetchArrayOfPages } from "../actions/PageActions"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { SortableList } from '@thaddeusjiang/react-sortable-list';
import '@thaddeusjiang/react-sortable-list/dist/index.css';
function EditBookContainer({book,pages}){
    const pathParams = useParams()
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const bookLoading = useSelector(state=>state.books.loading)
    const pageLoading = useSelector(state=>state.pages.loading)
    const [bookTitle,setBookTitle] = useState("")
    const [bookIsPrivate,setBookPrivacy]= useState(false)
    const [writingIsOpen,setWritingIsOpen]= useState(false)
    const [hasMore,setHasMore]=useState(false)
    const [page,setPage] = useState(1)
    const [listItems, setListItems] = useState([
    ]);
    const getBook=()=>{
      
      const bookId =pathParams["id"]
      console.log(bookId)
      const parameters = {
        id: bookId,
      }
        // const id =  pathParams["id"]
        // console.log(`PageViewContainer ${JSON.stringify(pathParams)}`)
        dispatch(fetchBook(parameters)).then((result) => {
            const {payload} = result
            const {book} = payload
            setBookTitle(book.title)
            setBookPrivacy(book.privacy)
            setWritingIsOpen(book.writingIsOpen)
           dispatch(fetchArrayOfPages(book.pageIdList))

        }).catch((err) => {
            
        });
              
    }
    const getPages = (pageIdList)=>{
        const params = {pageIdList:pageIdList}
    
        dispatch(fetchArrayOfPages(params)).then((result) => {
            console.log(JSON.stringify(result));
            if(!result.error){
                // result.payload.pageList
                setListItems(pages)
               
            }else{
            
            }
        }).catch((err) => {
            setHasMore(false)
        });

    }
    
    useEffect(()=>{
     
            getBook()
        
    },[])
    useEffect(()=>{

        if(!!book){
            setHasMore(true)
            getPages(book.pageIdList)
        }

    },[book])
    

const sortableList = ()=>{
    if(!!listItems && listItems.length>0){
        return(  <SortableList
            items={listItems}
            setItems={setListItems}
            itemRender={({item}) => (
               
              <div className="w-1/2 h-10 m-8 bg-blue-400 text-center">
                <h1>{item.title}</h1>
              </div>
            )}/>)
    }else{
        return(<div>
            Loading...
        </div>)
    }
}
    const handleTitleChange = (e)=>{
        setBookTitle(e.target.value)
    }

    if(!bookLoading && book!=null){
        
    

    return(<div className="container">
         
        <div className="left-side-bar">
            <h5> {book.title}</h5>
            <h6> {book.purpose}</h6>
        
            
        </div>
        <div className="main-bar">
        <div>
        <div>

      
            {sortableList()}
    </div>

    </div>
        </div>
        <div className="right-side-bar">
            <form>
                <input onChange={(e)=>handleTitleChange(e)} type="text" className="form-control" value={bookTitle}/>
                <input onChange={()=>{
                    setBookPrivacy(!bookIsPrivate)
                }}type="checkbox" name="privacy" value={bookIsPrivate}/>
                <input onChange={()=>{
                    setWritingIsOpen(!writingIsOpen)
                }
                }type="checkbox" name="writingIsOpen" value={writingIsOpen}/>
                <button type="submit">Save</button>
            </form>
        </div>

    </div>)}else{
        
        return(<div>
            Loading...
        </div>)
}}



export default EditBookContainer