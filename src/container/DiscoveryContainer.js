import Page from '../domain/models/page'
import { useSelector, useDispatch } from 'react-redux'
import DashboardItem from '../components/DashboardItem'
import { useState,useLayoutEffect,useEffect } from 'react'
function DiscoveryContainer(props){
        
    const pagesInView = useSelector((state)=>state.pages.pagesInView)
        // let [loading,setLoading] = useState(false)
        let [pages,setPages] = useState([])
        useLayoutEffect(()=>{
                
                // setPages(pagesInView)
        },[pagesInView])
        useEffect(()=>{        
            props.getPublicPages()
        },[pagesInView])
        
//     console.log(`dashboard ${pagesInView[0].title}`)
//   const display = ()=>{
//    return pagesInView.map((page)=>{<h2>{page.title}</h2>})}

        return(
            <div className="" >
                <div className="homeContainer">
                <div style={{display:"flex",flexDirection:"column",}}>
                {pagesInView.map((page)=>{return(<DashboardItem page={page}/>)})}
                </div>
                </div>
            </div>
        )
        
}
export default DiscoveryContainer