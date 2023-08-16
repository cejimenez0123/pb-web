import Page from '../domain/models/page'
import { useSelector, useDispatch } from 'react-redux'
import DashboardItem from '../components/DashboardItem'
import { useState,useLayoutEffect,useEffect } from 'react'
import BookBanner from "../components/BookBanner"
import "../styles/Discovery.css"
function DiscoveryContainer(props){
    const booksInView = useSelector(state=>state.books.booksInView)   
    const pagesInView = useSelector((state)=>state.pages.pagesInView)
        // let [loading,setLoading] = useState(false)
        let [pages,setPages] = useState([])
        useLayoutEffect(()=>{
                
                // setPages(pagesInView)
        },[pagesInView])
        useEffect(()=>{        
            props.getPublicPages()
        },[])
        useEffect(()=>{
            props.getPublicBooks()
        },[])
//     console.log(`dashboard ${pagesInView[0].title}`)
//   const display = ()=>{
//    return pagesInView.map((page)=>{<h2>{page.title}</h2>})}

        return(
            <div className="" >
                <div className="homeContainer">
                <div style={{display:"flex",flexDirection:"column",}}>
                <BookBanner books={booksInView}/>
                {pagesInView.map((page)=>{return(<DashboardItem page={page}/>)})}
                </div>
                </div>
            </div>
        )
        
}
export default DiscoveryContainer