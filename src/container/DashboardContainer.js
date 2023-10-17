import React ,{useState,useEffect,useLayoutEffect}from 'react'
import "../App.css"
import { getCurrentProfile } from '../actions/UserActions'
import { useSelector, useDispatch } from 'react-redux'
import DashboardItem from '../components/DashboardItem'
import InfiniteScroll from 'react-infinite-scroll-component'
import { fetchAllProfiles } from '../actions/UserActions'
function DashboardContainer(props){
    const dispatch = useDispatch()
    const pagesInView = useSelector((state)=>state.pages.pagesInView)
        let [loading,setLoading] = useState(false)
        let [pages,setPages] = useState([])
     
        useEffect(()=>{        
        const p = props.getPublicPages()
          dispatch(fetchAllProfiles())

      
            return ()=>p
        },[])
        const contentList =()=>{
            if(pagesInView!=null && pagesInView.length>0){
                return(<div className='content-list'>
                    <InfiniteScroll
                        dataLength={pagesInView.length}
                    >
                        {pagesInView.map((page)=>{
                    return(<DashboardItem page={page}/>)})}
                    </InfiniteScroll>
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