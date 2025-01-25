import React ,{useState,useEffect}from 'react'
import "../App.css"
import { useSelector, useDispatch } from 'react-redux'
import{ getCurrentProfile } from '../actions/UserActions'
import { fetchRecommendedStories } from '../actions/StoryActions'
import checkResult from '../core/checkResult'
import ReactGA from "react-ga4"
import PageList from '../components/page/PageList'
import ExploreList from '../components/collection/ExploreList'
import { getRecommendedCollectionsProfile } from '../actions/CollectionActions'

function DashboardContainer(props){
    ReactGA.send({ hitType: "pageview", page: window.location.pathname+window.location.search, title: "About Page" })

    const dispatch = useDispatch()
    const currentProfile = useSelector((state)=>state.users.currentProfile)
   
    const collections = useSelector(state=>state.books.collections)
    // const [itemsInView,setItemsInView] = useState([])
    const [hasMore,setHasMore] = useState(false)
    const [recommendedCols,setRecommendedCols]=useState([])
    const [hasError,setHasError] = useState(false)
    useEffect(()=>{
       
           dispatch(getCurrentProfile()).then(result=>{
            checkResult(result,payload=>{
                
                    
            })})
     
    
    }
  
   
,[])
        useEffect(()=>{
        if(currentProfile){
            dispatch(getRecommendedCollectionsProfile())
           dispatch(fetchRecommendedStories())
        }},[currentProfile])
      

        return(
            <div id="dashboard" >
                <div>
                    <div   style={{padding:"2em",textAlign:"center"}}>
                        <h2 className="lora-bold text-2xl">Recommendations</h2>
                    </div>
                    <div className='max-w-[94vw] mx-auto sm:w-page '> 
                    <PageList />
                    </div>
                </div>
                <ExploreList items={collections}/>
            </div>
        )
        
}
export default DashboardContainer