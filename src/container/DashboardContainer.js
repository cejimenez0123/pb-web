import React ,{useState,useEffect,useLayoutEffect}from 'react'
import "../App.css"
import { getPublicPages } from '../actions/PageActions'
import { getCurrentProfile } from '../actions/UserActions'
import { useSelector, useDispatch } from 'react-redux'
import DashboardItem from '../components/DashboardItem'
import InfiniteScroll from 'react-infinite-scroll-component'
import { fetchAllProfiles } from '../actions/UserActions'
import { fetchArrayOfBooks, fetchArrayOfBooksAppened } from '../actions/BookActions'
import { fetchArrayOfPagesAppened } from '../actions/PageActions'
import { fetchArrayOfLibraries } from '../actions/LibraryActions'
function DashboardContainer(props){
    const dispatch = useDispatch()
    const currentProfile = useSelector((state)=>state.users.currentProfile)
    const pagesInView = useSelector((state)=>state.pages.pagesInView)
    const booksInView = useSelector((state)=>state.books.booksInView)
    const librariesInView = useSelector((state)=>state.libraries.librariesInView)
    const followedBooks = useSelector((state)=>state.users.followedBooks)
    const followedLibraries = useSelector((state)=>state.users.followedLibraries)
    const followedProfiles = useSelector((state)=>state.users.followedProfiles)
    const [itemsInView,setItemsInView] = useState([])
    const [hasMore,setHasMore] = useState(false)
    let [pages,setPages] = useState([])
     
        useEffect(()=>{ 
           fetchData()
        },[])
        const fetchData =()=>{
            if(!currentProfile){
                setHasMore(true)
                dispatch(getPublicPages()).then(result=>{
                    if(result.error == null){
                        const {payload }= result
                        if(payload.error == null){
                            const {pageList }= payload
                            let items = pageList.map(page=>{return {type:"page",page: page}})
                            setItemsInView(items)
                        }
                        }
                        setHasMore(false)
                }).catch(error=>{
                    setHasMore(false)
                })
            }else{
                if(followedBooks.length>0){
                    setHasMore(true)
                    let bookIdList = followedBooks.map(fb=>fb.bookId)
                    const params = {
                        bookIdList
                    }
                    dispatch(fetchArrayOfBooks(params)).then(result=>{
                        if(result.error==null){
                            const {payload} = result
                            if(payload.error==null){
                                const {bookList } = payload
                                let bookItems = bookList.map(book=>{return {type:"book",book:book}})
                                setItemsInView(prevState=>{
                                    let newItems = bookItems.filter(bookItem=>{
                                    let found = prevState.find(item=>{
                                        return item.type == "book" && item.book.id == bookItem.book.id
                                    })
                                        if(found){
                                            return false
                                        }else{
                                            return true
                                        }
                                    })
                                    return[...prevState,...newItems]
                                })
                                getBookListContent(bookList)

                            }
                        }
                        setHasMore(false)
                    })
                }
                if(followedLibraries.length>0){
                    let libraryIdList = followedBooks.map(fb=>fb.libraryId)
                    let list = libraryIdList.filter(id=>id)
                    if(list.length>0){
                    const params = {
                        libraryIdList: list
                    }
                    setHasMore(true)
                    dispatch(fetchArrayOfLibraries(params)).then(result=>{
                        if(result.error==null){
                            const {payload} = result
                            if(payload.error==null){
                                const {libraryList} = payload
                                libraryList.forEach(library=>{

                                    const params = { bookIdList:library.bookIdList}
                                    dispatch(fetchArrayOfBooksAppened(params)).then(result=>{
                                        if(result.error==null){
                                            const {payload} = result
                                            if(payload.error==null){
                                                const {bookList } = payload
                                                let bookItems = bookList.map(book=>{return {type:"book",book:book}})
                                            setItemsInView(prevState=>{
                                               let newItems = bookItems.filter(bookItem=>{
                                                let found = prevState.find(item=>{
                                                    return item.type == "book" && item.book.id == bookItem.book.id
                                                })
                                                if(found){
                                                    return false
                                                }else{
                                                    return true
                                                }
                                            })

                                                return[...prevState,...newItems]
                                            })
                                                getBookListContent(bookList)
                                            }
                                        }
                                    })

                                })
                            }
                        }
                        setHasMore(false)
                    })
                }} 
            }        
        }
        const getBookListContent = (bookList)=>{
            let pageIdList = []
            bookList.forEach(book=>[
                book.pageIdList.forEach(id=>{
                    let aFound = pageIdList.find(pId=>pId.id == id)
                    let bFound = itemsInView.find(item=>{
                                    return item.page != null && item.page.id == id
                                })
                    if(!aFound && !bFound){
                        pageIdList.push(id)
                    }
                })
            ])
            const params = {pageIdList: pageIdList}
            dispatch(fetchArrayOfPagesAppened(params)).then(result=>{
                
            })
        }
        const contentList =()=>{
            if(itemsInView!=null && itemsInView.length>0){
                return(<div className='content-list'>
                    <InfiniteScroll
                        dataLength={itemsInView.length}
                        
           next={fetchData}
           hasMore={hasMore} // Replace with a condition based on your data source
           loader={<p>Loading...</p>}
           endMessage={<p>No more data to load.</p>}
                    >
                        {itemsInView.map((item)=>{
                            switch(item.type){
                                case "page":{
                                      return(<DashboardItem page={item.page}/>)
                                }
                                case "book":{

                                        let id = item.book.pageIdList[0]
                                    let page = pagesInView.find(page=>page.id == id)
                                    if(page){
                                        return(<DashboardItem page={page} book={item.book}/>)
                                    }else{
                                        return(<div>
                                            Loading...
                                        </div>)
                                    }
                            }
                        }})}
                    </InfiniteScroll>
                </div>)
            }else if(itemsInView!=null && itemsInView.length==0){
                return(<div className='content-list'>

                </div>)
            }
        }

        return(
            <div className="container" >
               
                <div >
                {contentList()}
                 </div>
                   
               
            </div>
        )
        
}
export default DashboardContainer