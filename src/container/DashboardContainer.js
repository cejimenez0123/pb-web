import React ,{useState,useEffect}from 'react'
import "../App.css"
import { getPublicPages,fetchArrayOfPagesAppened  } from '../actions/PageActions'
import { useSelector, useDispatch } from 'react-redux'
import DashboardItem from '../components/DashboardItem'
import InfiniteScroll from 'react-infinite-scroll-component'
import {  fetchArrayOfBooksAppened } from '../actions/BookActions'
import { fetchFollowBooksForProfile, fetchHomeCollection } from '../actions/UserActions'
import { fetchArrayOfLibraries } from '../actions/LibraryActions'
import ErrorBoundary from '../ErrorBoundary'
import { clickMe } from '../actions/UserActions'

function DashboardContainer(props){
    const dispatch = useDispatch()
    const currentProfile = useSelector((state)=>state.users.currentProfile)
    const pagesInView = useSelector((state)=>state.pages.pagesInView)
    const followedBooks = useSelector((state)=>state.users.followedBooks)
    const followedLibraries = useSelector((state)=>state.users.followedLibraries)
    const homeCollection = useSelector((state)=>state.users.homeCollection)
    const booksInView = useSelector((state)=>state.books.booksInView)
    const librariesInView = useSelector((state)=>state.users.librariesInView)
    const [itemsInView,setItemsInView] = useState([])
    const [hasMore,setHasMore] = useState(false)
    const [hasError,setHasError] = useState(false)
    const [initialState,setInitialState] = useState(true)
    useEffect(()=>{
        const params = {
            profile:currentProfile
        }
        dispatch(fetchHomeCollection(params))
    },[])
    // useEffect(()=>{

    //     if((currentProfile && followedBooks==null) || (followedBooks.length==0 && initialState && currentProfile)){
    //         const params = {
    //             profile: currentProfile
    //         }
    //         dispatch(fetchFollowBooksForProfile(params)).then(result=>{
    //             if(result.error == null){
    //                 const {payload }=result
    //                 if(payload.error == null){
    //                     fetchData()
    //                 }
    //             }
    //         })
    //     }else{
    //         fetchData()
    //     }
        
    // },[currentProfile])
   
    useEffect(()=>{fetchData()},[homeCollection])
    const fetchPublicContent =()=>{
        setHasMore(true)
        dispatch(getPublicPages()).then(result=>{
            if(result.error == null){
                const {payload }= result
                if(payload.error == null){
                    const {pageList }= payload
                    let items = pageList.map(page=>{return {type:"page",page: page}})
                    setItemsInView(prevState=>[...prevState,...items])
                }else{
                    setHasError(true)
                }
                }else{
                    setHasMore(true)
                }
                setHasMore(false)
        }).catch(error=>{
            setHasMore(false)
        })
    }
    const fetchData =()=>{
            if(!currentProfile){
              fetchPublicContent()
            }else{
            
            if(homeCollection && homeCollection.books){
                    setHasMore(true)
                    // let bookIdList = followedBooks.map(fb=>fb.bookId)
                    const params = {
                        bookIdList:homeCollection.books,
                        profile: currentProfile
                    }
                    if(homeCollection.books.length>0){
                        dispatch(fetchArrayOfBooksAppened(params)).then(result=>{
                            if(result.error==null){
                            const {payload} = result
                        
                            if(payload.error==null){
                                const {bookList}=payload
                                getBookListContent(bookList)
                            }
                        }else{
                            setHasError(true)
                        }})
                }}
                if(homeCollection && homeCollection.libraries){
                    
                    if(homeCollection.libraries.length>0){
                    const params = {
                        libraryIdList: homeCollection.libraries
                    }
                    setHasMore(true)
                    dispatch(fetchArrayOfLibraries(params)).then(result=>{
                        if(result.error==null){
                            const {payload} = result
                            if(payload.error==null){
                                const {libraryList} = payload
                                libraryList.forEach(library=>{

                                    const params = { bookIdList:library.bookIdList,
                                    profile: currentProfile}
                                    dispatch(fetchArrayOfBooksAppened(params)).then(result=>{
                                      
                                            })

                                        
                                    
                                    })}}

                                
                                    setHasMore(false)
                    })
                    
                }} 
                
                    
        }
    }
    const getBookListContent = (bookList)=>{
           
            bookList.forEach(book=>{
                let pageIdList = []
                book.pageIdList.forEach(id=>{
                
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
                            return [...prevState,...items]
                        })
                        fixSetItems()
                        
                    }else{
                        setHasError(true)
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
                    }else if(a.page!=null && b.book!=null){ 
                        return b.book.updatedAt - a.page.created
                    }else if(a.book!= null && b.page !=null){ 
                          return  b.page.created-a.book.updatedAt 
                    }else if(a.book!=null && b.book!=null){
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
                return(<div className='content-list dashboard'>
                    <InfiniteScroll
                        dataLength={itemsInView.length}
                        next={fetchData}
                        hasMore={hasMore} 
                        loader={<p>Loading...</p>}
                        endMessage={<p>No more data to load.</p>}
                    >
                        {itemsInView.map((item,i)=>{
                            switch(item.type){
                                case "page":{
                                    return(<DashboardItem key={`${item.page.id}_`
                                +i}page={item.page} book={item.book}/>)
                                }
                                case "book":{
                                    let id = item.book.pageIdList[0]
                                    if(item.book.pageIdList.length>1){

                                    
                                    let page = pagesInView.find(page=>page.id == id)
                                    if(page){
                                        return(<DashboardItem key={`${item.page.id}_`+i}page={page} book={item.book}/>)
                                    }else{
                                    
                                            return(<div></div>)
                                        
                                        
                                    }}
                            }
                        }})}
                    </InfiniteScroll>
                </div>)
            }  else if(itemsInView!=null && itemsInView.length==0 && currentProfile){
                return(
                    <div className='content-list dashboard'>
                    <div className="content">
                        <div className='no-more-data'>
                        <h3>Follow Some Books and Libraries</h3>
                        </div>
                    </div>
                </div>
                )
            }
            else if(itemsInView!=null && itemsInView.length==0){
                return(<div className='content-list dashboard'>
                    <div className="content">
                        <div className='no-more-data'>
                        <h3>0 Data</h3>
                        </div>
                    </div>
                </div>)
            }else{
                return(<div className='content-list dashboard'>
                    <div className="content">
                        <div className='no-more-data'>
                            <h3>Check your contection</h3>
                            </div>
                    </div>
                </div>)
            }
        }
        let intro = (<div></div>)
            if(!currentProfile){
                intro =(
                    <div className='intro'>

                <p><strong>Welcome to Plumbum</strong>, this is a place for creatives.
                Plumbum is made for writers to help recreate the writers' workshop online.
                Writers' workshop are a place to receive feedback on your work from people 
                with the same goal as you of getting better at their craft.</p>
                <p>
                It's a creative sanctuary. A place to receive feedback, control privacy,
                and build community.</p>

               <p> 📝 Tired of oversharing your work?
                Plumbum allows you to control the visibility of your writing,
                whether you want it to be a private diary or a public masterpiece.
                </p>
                <p>💬 Need constructive feedback to refine your craft?
                    Join a community of fellow writers eager to share their insights and support your journey.
                </p>
                <p>🌟 Create or join groups that resonate with your writing style,
                    genre, or interests, connect with like-minded individuals who 
                    appreciate your unique voice.
                </p>
                <p>
                📚 Whether you're a seasoned novelist or just beginning your literary adventure.
                Plumbum is great place to begin work and find support to complete work.
                </p>
                <p>
                Ready to start your writing journey? 
                Sign up today, start a page and write anything.
                It's the place for your story on Plumbum.</p>
                </div>)
            }
        

        return(
            <ErrorBoundary hasError={hasError} fallback={<div>
                Error 
            </div>}>
            <div id="dashboard" >
               
                <div >
                {intro}
                {contentList()}
                 </div>
                   
               
            </div>
            </ErrorBoundary>
        )
        
}
export default DashboardContainer