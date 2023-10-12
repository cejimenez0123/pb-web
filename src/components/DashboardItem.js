import React, { useState } from 'react'
import "../Dashboard.css"
import { setPageInView } from '../actions/PageActions'
// import {getPagesComments} from "../../actions/PageActions"
import { PageType } from '../core/constants'
import {connect ,useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom'
// import {useBottomScrollListener} from "react-bottom-scroll-listener"
  let size= {width: window.innerWidth,height: window.innerHeight}

function DashboardItem({page}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
const hanldeClickComment=(pageItem)=>{
    console.log(`fsdwsa ${
    JSON.stringify(pageItem)}`)
    const params = {
        page: pageItem
    }
    dispatch(setPageInView(params))
    navigate(`/page/${pageItem.id}`)
}
let pageDataElement = (<div></div>)
switch(page.type){
    case PageType.text:
        pageDataElement = <div className='dashboard-content' dangerouslySetInnerHTML={{__html:page.data}}></div>
    break;
    case PageType.picture:
        pageDataElement = <img className='' src={page.data} alt={page.title}/>
    break;
    case PageType.video:
        pageDataElement = <video src={page.data}/>
    break;
    default:
        pageDataElement = <div className='dashboard-content' dangerouslySetInnerHTML={{__html:page.data}}/>
    break;
}
        return(<div className='dashboard-item'>
        
            <div className='dashboard-header'>

            </div>
           
                {pageDataElement}
            
            <div className='btn-row'>
                <button>
                    Yea
                </button>
                <button>
                    Nah
                </button>
                <button onClick={()=>hanldeClickComment(page)}>
                
                    Comments
                </button>
                <button>
                    Info
                </button>
                <button>
                    Share
                </button>
            </div>
        </div>)

}


const mapState=(state)=>{
    return{
        // currentUser: state.users.currentUser,
        // comments: state.pages.pageCommentsInView,
        // userLikes: state.users.userLikes
    }
}
const mapDispatch=(dispatch)=>{
    return{
//         getPagesComments: (arr)=>dispatch(getPagesComments(arr)),
//         pageComments: (comments)=>dispatch({type: "PAGE_COMMENTS",comments}),
//      getLikesOfUser: ()=>dispatch(getLikesOfUser())
    }
}
export default connect(mapState,mapDispatch)(DashboardItem)