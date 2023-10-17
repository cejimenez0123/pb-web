import Page from '../domain/models/page'
import { useSelector, useDispatch } from 'react-redux'
import DashboardItem from '../components/DashboardItem'
import { useState,useLayoutEffect,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BookBanner from "../components/BookBanner"
import InfiniteScroll from 'react-infinite-scroll-component'
import "../styles/Discovery.css"
import { Dashboard } from '@mui/icons-material'
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
            let pList = pagesInView.map((page)=>{return {type:"page",item:page}})
            let bList = booksInView.map((book)=>{return {type:"book",item:book}})
        
            const perChunk = 2 // items per chunk    
            const bArray = bList
            const bresult = bArray.reduce((resultArray, item, index) => { 
            const chunkIndex = Math.floor(index/perChunk)
            if(!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = [] // start a new chunk
            }
                resultArray[chunkIndex].push(item)

                return resultArray
            }, [])
            let lList = librariesInView.map((library)=>{return {type:"library",item:library}})
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
            let list =[...pList,...bList,...lresult,...bresult]
            let content=shuffle(list)
            console.log("THIS X"+content.length)
            setContentItems(content)
        
        },[pagesInView,booksInView, librariesInView])
        useLayoutEffect(()=>{
        
        },[pagesInView])
        
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
                            
                                return(<a onClick={()=>{
                                    navigate(`/book/${aItem.item.id}`)
                                }}><h2>{aItem.item.title}</h2></a>)
                            }
                            case "library":{
                                return(
                                <a onClick={()=>{
                                    navigate(`/library/${aItem.item.id}`)
                                }}><h2>{aItem.item.name}</h2></a>)
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
                    // let profile = profilesInView.find(profile=>profile.id == hash.item.profileId).username
                    // let username =(<div></div>)
                    // if(profile){
                    //     username = (<h6>{profile.username}</h6>)
                    // }
                    return (
                        <div className='content-item'>
                        {/* <div className='item-row '>
                           <h6>{hash.item.title}</h6>
                           {username} 
                        </div> */}
                        <DashboardItem page={hash.item}/>
                        </div>
                    )
                }
                case 'book':{
            
                        let id =  hash.item.pageIdList[0]
                        let page  = null
                         if(pagesInView){
                            page = pagesInView.find(page=> page.id == id)
                        }
                        let profile = null
                        if(profilesInView){
                            profile = profilesInView.find(profile => profile.id == hash.item.profileId)
                        }
                        
                        if(page){
                       let title = (
                            <div>
                                <a onClick={
                                    ()=>{
                                        navigate(`/book/${hash.item.id}`)
                                        }
                                    }>
                            {hash.item.title} 
                            </a>{` > `} <a
                                    onClick={()=>{
                                        navigate(`/page/${page.id}`)
                                    }}
                            >{hash.item.title}</a>
                        </div>)
                        // let profileDiv = (<div>
                                
                        // </div>)
                        // if(profile){
                        //     profileDiv=(<div>
                        //         <h6>
                        //         {profile.username}
                        //         </h6>
                        //     </div>)
                        // }
                        
                            return(<div className="content-item" key={hash.item.id}>
                                {/* <div className="item-row">
                                    <h6 id="title">
                                    {title}
                                    </h6>
                                    {profileDiv}
                            </div> */}
                            <DashboardItem book={hash.item} page={page}/>
                        </div>)
                   
                }}
                case 'library':{
                    return(<div>

                    </div>)
                }
                    default:{
                        return (<div>
                            </div>)
                    }
          
        }}}
        return(
            <div id="discover" className="" >
        
                <div className="content">
                <InfiniteScroll
           dataLength={contentItems.length}
           next={fetchContentItems}
           hasMore={hasMore} // Replace with a condition based on your data source
           loader={<p>Loading...</p>}
           endMessage={<p>No more data to load.</p>}
         >  {contentItems.map(content=>{
                return dashboardItem(content)
         })}
        
         </InfiniteScroll>
                </div>
               
            </div>
        )

}
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
export default DiscoveryContainer