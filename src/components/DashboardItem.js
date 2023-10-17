import React, { useState } from 'react'
import "../Dashboard.css"
import { setPageInView } from '../actions/PageActions'
// import {getPagesComments} from "../../actions/PageActions"
import { PageType } from '../core/constants'
import {connect ,useDispatch, useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import theme from '../theme'
// import {useBottomScrollListener} from "react-bottom-scroll-listener"
  let size= {width: window.innerWidth,height: window.innerHeight}

function DashboardItem({page,book}) {
    // const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const profile = useSelector(state=>state.users.profilesInView).find(prof=>{
       return prof.id == page.profileId
    })
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
    let profileDiv = (<div>

    </div>)
    if(profile){
        profileDiv = (<p onClick={()=>{
            navigate(`/profile/${profile.id}`)
        }}>
            {profile.username}
        </p>)

    }
    let bookTitleDiv =  (<div></div>)
    if(book){
        bookTitleDiv = (<p>{book.title} {">"}</p>)
    }
        return(<div className='dashboard-item'>
        
            <div className='dashboard-header'>
                <div>
                {bookTitleDiv}
                <p onClick={()=>{
                    navigate(`/page/${page.id}`)
                }}>{page.title}</p>
                </div>
                {profileDiv}
            </div>
           
                {pageDataElement}
            
            <div className='btn-row'>
                <Button disabled={!currentProfile} 
                     style={{color: theme.palette.info.contrastText,
                        backgroundColor: currentProfile? theme.palette.info.main:theme.palette.info.disabled}}
                  
               
                >
                    Yea
                </Button>
                {/* <button>
                    Nah
                </button> */}
                <Button disabled={!currentProfile}
                        style={{color: theme.palette.info.contrastText,
                            backgroundColor: currentProfile? theme.palette.info.main:theme.palette.info.disabled}}
                        onClick={()=>hanldeClickComment(page)}
                        >
                
                    Comments
                </Button>
                <Button>
                    Info
                </Button>
                <Button>
                    Share
                </Button>
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