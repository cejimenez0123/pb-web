import React ,{useState,useEffect}from 'react'
import "../App.css"
import { useSelector, useDispatch } from 'react-redux'
import DashboardItem from '../components/page/DashboardItem'
import InfiniteScroll from 'react-infinite-scroll-component'
import{ getCurrentProfile } from '../actions/UserActions'
import { fetchRecommendedStories } from '../actions/StoryActions'
import checkResult from '../core/checkResult'
import ReactGA from "react-ga4"
import PageList from '../components/page/PageList'

function DashboardContainer(props){
    ReactGA.send({ hitType: "pageview", page: window.location.pathname+window.location.search, title: "About Page" })

    const dispatch = useDispatch()
    const currentProfile = useSelector((state)=>state.users.currentProfile)
    const pagesInView = useSelector((state)=>state.pages.pagesInView)
    const [itemsInView,setItemsInView] = useState([])
    const [hasMore,setHasMore] = useState(false)
    const [hasError,setHasError] = useState(false)
    useEffect(()=>{
       
           dispatch(getCurrentProfile()).then(result=>{
            checkResult(result,payload=>{
                
          
            })})
     
    
    }
  
   
,[])
        useEffect(()=>{
        if(currentProfile){
        
            dispatch(fetchRecommendedStories())
        }},[currentProfile])
        const contentList =()=>{
            if(itemsInView!=null && itemsInView.length>0){
                return(<div className='content-list dashboard'>
                    <InfiniteScroll
                        dataLength={itemsInView.length}
                        next={fetchData}
                        hasMore={hasMore} 
                        loader={<p>Loading...</p>}
                        endMessage={<div className='no-more-data'><p>Fin</p></div>}
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
                    
                    </div>
                    <div className='max-w-[94vw] mx-auto lg:max-w-[42em] '> 
                    <PageList items={itemsInView}/>
                    </div>
                </div>
            </div>
        )
        
}
export default DashboardContainer