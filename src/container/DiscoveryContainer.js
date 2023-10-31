import { useSelector} from 'react-redux'
import DashboardItem from '../components/DashboardItem'
import { useState,useLayoutEffect,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import "../styles/Discovery.css"
import ErrorBoundary from '../ErrorBoundary'
function DiscoveryContainer(props){
    const navigate = useNavigate()
    const booksInView = useSelector(state=>state.books.booksInView)   
    const pagesInView = useSelector((state)=>state.pages.pagesInView)
    const profilesInView = useSelector(state=>state.users.profilesInView)
    const librariesInView = useSelector(state=>state.libraries.librariesInView) 
    const [contentItems,setContentItems]=useState([])
    let [pages,setPages] = useState([])
    let [hasMore,setHasMore]=useState(false)
        useEffect(()=>{
            let pList = pagesInView.map((page)=>{return {type:"page",page:page}})
            let bList = booksInView.map((book)=>{return {type:"book",book:book}})
        
            const perChunk = 2 // items per chunk    
            const bArray = bList

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
            let list =[...pList,...bList,...lresult]
            
            let sorted = list.sort((a, b) =>{
                if(Array.isArray(a) || Array.isArray(b)){
                    if(Array.isArray(a) && !Array.isArray(b)){
                        return b.created - a[0].created

                    }else if(!Array.isArray(a) && Array.isArray(b)){
                        return b[0].created - a.created
                    }else{
                        return b[0].created - a[0].created
                    }


                }else{
                if(a.book!=null && b.book!=null){
                    return b.book.updatedAt - a.book.updatedAt
                }else if(a.book!=null && b.page!=null){
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
            } );
            // let content=shuffle(list)

            setContentItems(sorted)
            setHasMore(false)
        
        },[hasMore])

        
        useEffect(()=>{
            props.getPublicLibraries()
        },[])
        useEffect(()=>{        
            props.getPublicPages()
        },[])
        useEffect(()=>{
            props.getPublicBooks()
        },[])
        useEffect(()=>{
            props.fetchAllProfiles()
        },[])
        const fetchContentItems = ()=>{
            setHasMore(true)
            props.getPublicBooks()
            props.getPublicPages()
            props.getPublicLibraries()
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

                        let i = 0
                        let pageId =  hash.book.pageIdList[i]
                        let foundHash = null
                        let page = null
                      
                        while(hash.book.pageIdList.length>i-1 && Boolean(foundHash)){
                            foundHash =  contentItems.find(item=>item.page!=null && item.page.id == pageId)
                            
                            if(!foundHash){
                                pageId =  hash.book.pageIdList[i]
                                foundHash=false
                            }else{
                                i+=1
                            }
                        }
                         if(pagesInView){
                            page = pagesInView.find(page=> page.id == pageId)
                        }
                       
                        if(page && !foundHash){
                        
                            return(
                            <DashboardItem book={hash.book} page={page}/>
                        )
                   
                }else{
                    return(<div></div>)
                }}else{
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
                <div className='content-list dashboard'>
              <div className='content'>

           
                <InfiniteScroll
           dataLength={contentItems.length}
           next={fetchContentItems}
           hasMore={hasMore} // Replace with a condition based on your data source
           loader={<p>Loading...</p>}
           endMessage={<div className='no-more-data'>
           <h6 >No more data to load.</h6>  </div>}
         >  {contentItems.map(content=>{
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