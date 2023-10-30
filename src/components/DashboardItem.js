import React, { useState } from 'react'
import "../Dashboard.css"
import { setPageInView, setPagesToBeAdded } from '../actions/PageActions'
// import {getPagesComments} from "../../actions/PageActions"
import { PageType } from '../core/constants'
import {useDispatch, useSelector} from 'react-redux'
import { Dropdown,Menu ,MenuItem} from '@mui/joy'
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
    const [anchorEl,setAnchorEl]= useState(null)
    const anchorRef = React.useRef(null);
    const handleToggle = (e) => {
     setAnchorEl(prevState=>{
        if(prevState==null){
            return e.currentTarget
        }else{
            return null
        }
     })
      };
 

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
                {/* <Button>
                    Info
                </Button> */}
                
                <Dropdown>
                        <Button onClick={(e)=>{
                            handleToggle(e)
                        }}
                        aria-controls={anchorEl ? 'menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={anchorEl ? 'true' : undefined}
          
          >
        Share
          </Button>
          <Menu 
              id="menu"
          anchorEl={anchorEl}
          onClose={()=>setAnchorEl(null)}
          open={Boolean(anchorEl)}>
          <MenuItem disabled={!currentProfile} onClick={()=>{
            const params = {pageList:[page]}
            dispatch(setPagesToBeAdded(params))
            navigate("/book/new")
            }}> 
                            Add to Book
            </MenuItem>
            <MenuItem disabled={!currentProfile} onClick={()=>{
                 const params = {pageList:[page]}
                 dispatch(setPagesToBeAdded(params))
                 navigate("/book/new")
            }}>
                Add to Library
                        </MenuItem>
                        <MenuItem onClick={()=>{
                            navigator.clipboard.writeText(`plumbum.app/page/${page.id}`)
                            .then(() => {
                                // Successfully copied to clipboard
                                alert('Text copied to clipboard');
                              })
                        }}
                    >
                          Copy Share Link
                        </MenuItem>
            
          </Menu>
        </Dropdown>
            </div>
        </div>)

}

export default DashboardItem