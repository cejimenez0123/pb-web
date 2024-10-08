import React ,{useState,useEffect}from 'react'
import "../App.css"
import {  fetchAppendPagesOfProfile,
    fetchPagesWhereProfileCommenters, 
    getPublicStories  } from '../actions/PageActions'
import { useSelector, useDispatch } from 'react-redux'
import DashboardItem from '../components/page/DashboardItem'
import InfiniteScroll from 'react-infinite-scroll-component'
import {  fetchArrayOfBooksAppened, fetchBooksWhereProfileEditor, fetchBooksWhereProfileWriter } from '../actions/BookActions'
import { clickMe, fetchHomeCollection, getCurrentProfile } from '../actions/UserActions'
import { fetchArrayOfLibraries } from '../actions/LibraryActions'
import checkResult from '../core/checkResult'
import ReactGA from "react-ga4"

function DashboardContainer(props){
    ReactGA.send({ hitType: "pageview", page: window.location.pathname+window.location.search, title: "About Page" })

    const dispatch = useDispatch()
    const currentProfile = useSelector((state)=>state.users.currentProfile)
    const pagesInView = useSelector((state)=>state.pages.pagesInView)
    const homeCollection = useSelector((state)=>state.users.homeCollection)
    const [itemsInView,setItemsInView] = useState([])
    const [hasMore,setHasMore] = useState(false)
    const [hasError,setHasError] = useState(false)
    useEffect(()=>{
        // if(currentProfile){
        //     const params = {
        //         profile:currentProfile
        //     }
        // fetchData()
        
        // }else if(currentProfile==null){
           dispatch(getCurrentProfile()).then(result=>{
            checkResult(result,payload=>{
                const {profile}=payload
                const params = {
                            profile:profile
                        }
                dispatch(fetchHomeCollection(params))
                fetchData()
                },err=>{
                    fetchData()
                console.log(err)
            })})
        // }else{
        //     fetchData()
        // }
    
    }
  
   
,[])
    useEffect(()=>{
        if(currentProfile){
            const params = {
                profile:currentProfile
                
            }
   
        dispatch(fetchHomeCollection(params)).then(result=>{
            checkResult(result,payload=>{
                fetchData()
            },err=>{

            })
        })
        }},[])
   
    const fetchPublicContent =()=>{
        setHasMore(true)
        setItemsInView([])
        dispatch(getPublicStories()).then(result=>{
            checkResult(result,payload=>{
                setHasError(false)
                const {pageList }= payload
                    let items = pageList.map(page=>{return {type:"page",page: page}})
                    items = items.filter(item=>{return item.page!==null})
                    setItemsInView(items)
                    setHasError(false)
                },err=>{
                    console.log(err)
                })})
    
    }
    const getLibraries=()=>{
        if(currentProfile){
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
                    if(library.bookIdList.length>0){
                        const params = { bookIdList:library.bookIdList,
                        profile: currentProfile}
                        dispatch(fetchArrayOfBooksAppened(params)).then(result=>{
                          checkResult(result,payload=>{
                                const {bookList}=payload
                                getBookListContent(bookList)
                                
                          },err=>{

                          })
                                })
                            }

                            
                        
                        })}}

                    
                        setHasMore(false)
        })
        
    }}

    const fetchData =()=>{
            if(currentProfile && homeCollection){
                setHasMore(true)
                if(homeCollection.books){
                   
                    const params = {
                        bookIdList:homeCollection.books,
                        profile: currentProfile
                    }
                    if(homeCollection.books.length>0){
                        dispatch(fetchArrayOfBooksAppened(params)).then(result=>
                            checkResult(result,payload=>{
                                setHasMore(false)
                                const {bookList}=payload
                                getBookListContent(bookList)
                            },err=>{

                            }))
                            
        
                }
                if(homeCollection.libraries){
                    
                    if(homeCollection.libraries.length>0){
                        getLibraries()
                    }}
                if(homeCollection.profiles){
                    homeCollection.profiles.forEach(id=>
                        {
                            const params ={
                                id
                            }
                        dispatch(fetchAppendPagesOfProfile(params)).then(result=>
                            checkResult(result,(payload)=>{
                                setHasMore(false)
                                        const {pageList} = payload
                                        let list = pageList.map(page=>{return {type:"page",page}})
                                        list.forEach(page=>{
                                        if(!itemsInView.includes(page)){
                                            setItemsInView(prevState=>[page,...prevState])
                                        }
                                        })
                                      
                        },error=>{

                        }))
                    }
                ) 
            }
            dispatch(fetchBooksWhereProfileEditor()).then((result)=>checkResult(result,payload=>{
                const {bookList}=payload

                getBookListContent(bookList)
            },err=>{

            }))
            dispatch(fetchBooksWhereProfileWriter()).then(result=>checkResult(result,payload=>{
                const {bookList}=payload
                getBookListContent(bookList)
            },err=>{}))
            dispatch(fetchPagesWhereProfileCommenters()).then(result=>checkResult(result,payload=>{
                const {pageList}=payload
                let items = pageList.map(page=>{return {type:"page",page: page}})
                items.forEach(item=>{
                   if(!itemsInView.includes(item)){
                    setItemsInView(prevState=>[...prevState,item])
                   }
                })
            },err=>{

            })

            )
        }
    }else{
        fetchPublicContent()
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
            
            const params = {pageIdList: pageIdList,profile:currentProfile}
            if(pageIdList.length>0){
            dispatch(fetchArrayOfPagesAppened(params)).then(result=>checkResult(
                result,payload=>{
                        const {pageList }= payload
                        const items = pageList.map(page=>{
                            return { type: 'page', page, book}
                        })
                        items.forEach(item=>{
                            if(!itemsInView.includes(item)){
                            setItemsInView(prevState=>{
                                return [...prevState,item]
                            })}
                        })
                        
                        fixSetItems()

                }))
        }})
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
                        endMessage={<div className='no-more-data'><p>No more data to load.</p></div>}
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

        return(
            <div id="dashboard" >
                <div>
                    <div style={{padding:"2em",textAlign:"center"}}>
                        <h1 >HOME</h1>
                    </div>
                    {contentList()}
                </div>
            </div>
        )
        
}
export default DashboardContainer