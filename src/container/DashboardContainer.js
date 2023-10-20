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
                                                fixSetItems()
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
           
            bookList.forEach(book=>{
                let pageIdList = []
                book.pageIdList.forEach(id=>{
                    // let aFound = pageIdList.find(pId=>pId.id == id)
                    let bFound = itemsInView.find(item=>{
                                    return item.page != null && item.page.id == id
                                })
                    if(!bFound){
                        pageIdList.push(id)
                    }
                })
            
            const params = {pageIdList: pageIdList}
            if(pageIdList.length>0){
            dispatch(fetchArrayOfPagesAppened(params)).then(result=>{
                if(result.error==null){
                    const {payload} = result
                    if(payload.error==null){
                        const {pageList }= payload
                        const items = pageList.map(page=>{
                            return { type: 'page', page, book}
                        })
                        setItemsInView(prevState=>{
                            // let list = [...prevState,...items]
                        
                            // const newState = list.sort((a, b) =>{
            
                
                            //     if(b.page!=null && a.page!=null){
                           
                            //         return b.page.created - a.page.created
                            //     }else if(a.book!=null && a.book!=null){ 
                            //         return b.book.updatedAt - a.book.updatedAt
                            //     }else if(a.page == null && b.book ==null){ 
                            //           return  b.page.created-a.book.updatedAt 
                            //     }else if(a.book==null && b.page==null){
                            //         return b.book.updatedAt - a.page.created
                            //     }else{
                            //         return -1
                            //     }
                            // } );
                            return [...prevState,...items]
                        })
                        
                    }
                }
                
            })}
        })
        }
        const fixSetItems = ()=>{
            setItemsInView(prevState=>{
                let list = []
                prevState.forEach(item=>{
                    let found = list.find(aItem=>{
                    if(aItem.page!=null && item.page!=null){
                      return aItem.page.id == item.page.id
                    }else if(aItem.book!=null && item.book != null){
                        return aItem.book.id == item.book.id
                    }})
                    if(!found){
                        list.push(item)
                    }

                })
                const newState = list.sort((a, b) =>{
            
                
                    if(b.page!=null && a.page!=null){
               
                        return b.page.created - a.page.created
                    }else if(a.book!=null && a.book!=null){ 
                        return b.book.updatedAt - a.book.updatedAt
                    }else if(a.page == null && b.book ==null){ 
                          return  b.page.created-a.book.updatedAt 
                    }else if(a.book==null && b.page==null){
                        return b.book.updatedAt - a.page.created
                    }else{
                        return -1
                    }
                } );
                return newState
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
                                      return(<DashboardItem page={item.page} book={item.book}/>)
                                }
                                case "book":{

                                        let id = item.book.pageIdList[0]
                                        if(item.book.pageIdList.length>1){

                                        }
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