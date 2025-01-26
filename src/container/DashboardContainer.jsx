import React ,{useState,useEffect,useLayoutEffect, useContext}from 'react'
import "../App.css"
import { useSelector, useDispatch } from 'react-redux'
import{ getCurrentProfile } from '../actions/UserActions'
import { fetchRecommendedStories } from '../actions/StoryActions'
import checkResult from '../core/checkResult'
import ReactGA from "react-ga4"
import PageList from '../components/page/PageList'
import ExploreList from '../components/collection/ExploreList'
import { getRecommendedCollectionsProfile } from '../actions/CollectionActions'
import Context from '../context'
import { useLocation } from 'react-router-dom'
import { setPageInView, setPagesInView } from '../actions/PageActions'
import { setCollections } from '../actions/BookActions'

function DashboardContainer(props){
    ReactGA.send({ hitType: "pageview", page: window.location.pathname+window.location.search, title: "About Page" })
    // const {setError}=useContext(Context)
    const dispatch = useDispatch()
    const currentProfile = useSelector((state)=>state.users.currentProfile)
   const hashtags=useSelector(state=>state.hashtags.hashtags)
    const collections = useSelector(state=>state.books.collections)
    const pages = useSelector(state=>state.pages.pagesInView)
    const [hasMore,setHasMore] = useState(true)
    const getContent=()=>{

        dispatch(setPagesInView({pages:[]}))
        dispatch(setCollections({collections:[]}))
  
            dispatch(fetchRecommendedStories()).then(res=>{
                setHasMore(false)
            })
        
    
        
            dispatch(getRecommendedCollectionsProfile())
           
        
    }

useEffect(()=>{
    setHasMore(true)
getContent()
   
},[])


        return(
            <div id="dashboard" >
                <div>
                    <div   style={{padding:"2em",textAlign:"center"}}>
                        <h2 className="lora-bold text-2xl">Recommendations</h2>
                    </div>
                    <div className='max-w-[94vw] mx-auto sm:w-page '> 
                    <PageList hasMore={hasMore} getMore={getContent}/>
                    </div>
                </div>
                <ExploreList items={collections}/>
            </div>
        )
        
}
export default DashboardContainer