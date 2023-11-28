import { useSelector,useDispatch} from 'react-redux'
import DashboardItem from '../components/DashboardItem'
import { useState,useLayoutEffect,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import "../styles/Discovery.css"
import ErrorBoundary from '../ErrorBoundary'
import { clearPagesInView, fetchPage, getPublicPages } from '../actions/PageActions'
import { clearBooksInView, getPublicBooks } from '../actions/BookActions'
import { getPublicLibraries } from '../actions/LibraryActions'
import checkResult from '../core/checkResult'
function DiscoveryContainer(props){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const booksInView = useSelector(state=>state.books.booksInView)   
    const pagesInView = useSelector((state)=>state.pages.pagesInView)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const librariesInView = useSelector(state=>state.libraries.librariesInView) 

    const [contentItems,setContentItems]=useState([])
    let [hasMore,setHasMore]=useState(false)
    useEffect(()=>{
       
        setContentItems([])
        fetchContentItems()
    },[])
    useEffect(()=>{sortContent()},[pagesInView])
    const sortContent = ()=>{
        
        let pList =[]
        let bList = []
        if(pagesInView){
            pList = pagesInView.map((page)=>{return {type:"page",page:page}})
        }
        if(booksInView){
            bList = []
            booksInView.forEach(book=>{
                book.pageIdList.forEach(id=>{
                    const params = {id}
                
                    dispatch(fetchPage(params)).then((result)=>{
                        checkResult(result,payload=>{
                            const { page}= payload
                            let item = { type:"book",book,page}
                            bList.push(item)
                        },(err)=>{

                        })
                    })})
            })
        } 
   
    
        const perChunk = 2 // items per chunk    
        
        let lList = librariesInView.map((library)=>{return {type:"library",library:library}})
        // items per chunk    
        const lArray = lList
        const lresult = lArray.reduce((resultArray, item, index) => { 
        const chunkIndex = Math.floor(index/perChunk)
        if(!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }
            resultArray[chunkIndex].push(item)

            return resultArray
        }, [])
        let list = [...pList,...bList,...lresult]
        
        let sorted = list.sort((a, b) =>{
            if(a && b && (Array.isArray(a) || Array.isArray(b))){
                if(a && b && (Array.isArray(a) && !Array.isArray(b))){
                    
                    let aUpdatedAt = a[0].library.updatedAt
                    if(a[1] ){
                        aUpdatedAt = a[0].library.updatedAt>a[1].library.updatedAt?a[0].library.updatedAt:a[1].library.updatedAt
                   }
                   if(b.book){
                    return   b.book.updatedAt - aUpdatedAt  
                   }else{
                    return   aUpdatedAt  -  b.page.created
                   }

                }else if(a && b &&(!Array.isArray(a) && Array.isArray(b))){
                    let bUpdatedAt = b[0].library.updatedAt
                    if(b[1]){
                        bUpdatedAt = b[0].library.updatedAt<b[1].updatedAt?b[0].library.updatedAt:b[1].library.updatedAt
                    }
                    if(a.book){
                        return      a.book.updatedAt-bUpdatedAt
                       }else{
                        return      a.page.created-bUpdatedAt 
                       }
                   
                }else if(a && b &&(Array.isArray(a) && Array.isArray(b))){
                    let aUpdatedAt = a[0].library.updatedAt
                    if(a[1] ){
                     aUpdatedAt = a[0].library.updatedAt>a[1].library.updatedAt?a[1].library.updatedAt:a[0].library.updatedAt
                }
                let bUpdatedAt = b[0].library.updatedAt
                if(b[1]){
                    bUpdatedAt = b[0].library.updatedAt>b[1].updatedAt?b[1].library.updatedAt:b[0].library.updatedAt
                }
                    return  bUpdatedAt - aUpdatedAt
                }


            }else{
            if(a && b &&(a.book!=null && b.book!=null)){
                return b.book.updatedAt - a.book.updatedAt
            }else if(a && b &&(a.book!=null && b.page!=null)){
                return b.page.created - a.book.updatedAt
            }else if(a.page!=null && b.book!=null){
                return b.book.updatedAt - a.page.created
            }else if(
                a.page!=null && a.page!=null
            ){
                return b.page.created - a.page.created 
            }else{
               
            } 
        }
        });
        setContentItems(sorted)
    }  
    const fetchContentItems = ()=>{
            setHasMore(true) 
            dispatch(getPublicPages()).then(result=>checkResult(
                result,payload=>{
                    
                    const {pageList} = payload
                    dispatch(getPublicBooks()).then(result=>checkResult(result,
                        payload=>{
                            const {bookList}=payload
                            let bList = []
                            bookList.forEach(book=>{
                                book.pageIdList.forEach(id=>{
                                    const params = {id}
                                
                                    dispatch(fetchPage(params)).then((result)=>{
                                        checkResult(result,payload=>{
                                            const { page}= payload
                                            let item = { type:"book",book,page}
                                            bList.push(item)
                                        },(err)=>{
                
                                        })
                                    })})
                                   
                                })
                                
                            setHasMore(false)
                            dispatch(getPublicLibraries()).then(result=>checkResult(result,payload=>{
                                const {libraryList}=payload
                               
                            
                            },err=>{

                            }))
                        },err=>{

                        })
                    )   
                })
                ,err=>{
                    setHasMore(false)
                }
            )
            sortContent()
        }
        const dashboardItem=(hash)=>{
            if(Array.isArray(hash)){
                return (<div className='discover-pair'>
                    {hash.map(aItem=>{
                        switch(aItem.type){
                           case "book":{
                            
                                return(<div className='pair-item'>
                                    <div className='pair-inner'>
                                    <a onClick={()=>{
                                    navigate(`/book/${aItem.book.id}`)
                                }}><h3>{aItem.book.title}</h3></a>
                                <p>{aItem.book.purpose}</p>
                                </div>
                                </div>)
                            }
                            case "library":{
                                return(<div className='pair-item'>
                                    <div className='pair-inner'>                                <a onClick={()=>{
                                    navigate(`/library/${aItem.library.id}`)
                                }}><h3>{aItem.library.name}</h3></a>
                                <p>{aItem.library.purpose}</p>
                                </div>
                                </div>)
                            }
                            default:{
                                return(<h2>Nothing</h2>)
                            }
                        }
                    })}
                </div>)
            }else{
                
            switch(hash.type){
                case 'page':{
                    
                    return (
                      
                       
                        <DashboardItem page={hash.page}/>
                       
                    )
                }
                case 'book':{
                    if(hash.book!=null){
                        let i = 1
                
                        if(hash.page!=null){
                            let foundItem =  contentItems.find(item=>item.page!=null && item.page.id == hash.page.id)
                            if(!Boolean(foundItem)){
                                return(<DashboardItem book={hash.book} page={hash.page}/>)
                            }else{

                                return(<div></div>)
                            }
                            
                        }
                     
                        if(hash.page){
                        
                            return(
                            <DashboardItem book={hash.book} page={hash.page}/>
                        )
                   
                        }else{
                    return(<div></div>)
                        }
                    }else{
                    return(<div></div>)
                }
                }
                case 'library':{
                    // return(<div>

                    // </div>)
                }
                    default:{
                        return (<div>
                            </div>)
                    }
          
        }}}
        return(
            <ErrorBoundary>
            <div id="discover"  >
            <div style={{paddingTop:"3em",textAlign:"center"}}>
                <h1 >Discovery</h1>
                </div>
                <div className='content-list dashboard'>
              <div >

           
                <InfiniteScroll
           dataLength={contentItems.length}
           next={fetchContentItems}
           hasMore={hasMore} // Replace with a condition based on your data source
           loader={<p>Loading...</p>}
           endMessage={<div className='no-more-data'>
           <h6 >No more data to load.</h6>  </div>}>
                {contentItems.map(content=>{
                    return dashboardItem(content)
                })}
                            </InfiniteScroll>
                        </div>
                    </div>
                </div>
            </ErrorBoundary>
        )

}

export default DiscoveryContainer