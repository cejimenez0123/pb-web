import React ,{useState,useEffect,useLayoutEffect}from 'react'
// import {Link} from 'react-router-dom'
// import BookContainer from "./BookContainer"
// import Navbar from './NavbarContainer'
// import Pages from "../components/page/pages"
// import NavbarContainer from './NavbarContainer'
// import { useStore } from 'react-redux'
// import Modal from "../components/modal"
// import ReactDOM,{ render } from 'react-dom'
// import SearchCardIndex from '../components/user/SearchCardIndex'
// import { auth} from "../core/di"
import "../App.css"
// import { getPublicPages } from '../actions/PageActions'
// import SignUpForm from "../components/user/SignUpForm"
// import LogInForm from "../components/user/LogInForm"
// import {BottomScrollListener }from 'react-bottom-scroll-listener';
import Page from '../domain/models/page'
import { getCurrentProfile } from '../actions/UserActions'
import { useSelector, useDispatch } from 'react-redux'
import DashboardItem from '../components/DashboardItem'
function DashboardContainer(props){
    const dispatch = useDispatch()
    const [pagesInView,setPagesInView]= useState([Page])
    // const pagesInView = useSelector((state)=>state.pages.pagesInView)
        // let [loading,setLoading] = useState(false)
        // let [pages,setPages] = useState([])
        // useLayoutEffect(()=>{
                
        //         // setPages(pagesInView)
        // },[pagesInView])
        useEffect(()=>{        
        const p = props.getPublicPages()
          

      
            return ()=>p
        },[])
        

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
export default DashboardContainer