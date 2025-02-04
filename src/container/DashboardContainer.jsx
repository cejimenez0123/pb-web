import React ,{useState,useEffect,useLayoutEffect, useContext}from 'react'
import "../App.css"
import { useSelector, useDispatch } from 'react-redux'
import { fetchRecommendedStories } from '../actions/StoryActions'
import ReactGA from "react-ga4"
import PageList from '../components/page/PageList'
import ExploreList from '../components/collection/ExploreList'
import { getRecommendedCollectionsProfile } from '../actions/CollectionActions'
import { useLocation } from 'react-router-dom'
import {  setPagesInView } from '../actions/PageActions'
import { setCollections } from '../actions/CollectionActions'

function DashboardContainer(props){
    const location = useLocation()
    ReactGA.send({ hitType: "pageview", page: location.pathname+window.location.search, title: "About Page" })
    const dispatch = useDispatch()
    const collections = useSelector(state=>state.books.collections)
   
    const [hasMore,setHasMore] = useState(false)
    const getContent=()=>{

        dispatch(setPagesInView({pages:[]}))
        dispatch(setCollections({collections:[]}))
  
            dispatch(fetchRecommendedStories())
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