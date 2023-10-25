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
        bookTitleDiv = (<a onClick={
            ()=>{
                navigate(`/book/${book.id}`)
            }
        }><p>{book.title} {">"}</p></a>)
    }
        return(<div className='dashboard-item content-item'>
        
            <div className='dashboard-header'>
                <div className='titles'>
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
                <Button 
                        style={{color: theme.palette.info.contrastText,
                            backgroundColor: theme.palette.info.main}}
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

export default DashboardItem