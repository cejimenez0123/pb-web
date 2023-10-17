import { useState } from "react";
import { useDispatch } from "react-redux";
import { setPageInView,setPagesToBeAdded } from "../actions/PageActions";
import { PageType } from "../core/constants";
import {useNavigate} from 'react-router-dom'
import { Button } from "@mui/material";
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Add from '@mui/icons-material/Add'
import MoreVert from '@mui/icons-material/MoreVert'
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
function PageListItem({page}) {
    const theme = useTheme()
    const [showPreview,setShowPreview] = useState(false)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const onToggle = ()=>{
        setShowPreview(!showPreview)
    }
    const handleOnClick = ()=>{
        const params = {
            page: page
        }
        setPageInView(params)
        navigate(`/page/${page.id}`)
        
    }
    const handleAddClick = (type)=>{
        if(page){
        let params = {
            pageList: [page]
        }
        dispatch(setPagesToBeAdded(params))
        navigate(`/${type}/new`)
    }
    }
    let pageDataElement = (<div></div>)
    if(page!=null){
    switch(page.type){
        case PageType.text:
            pageDataElement = <div className='text' dangerouslySetInnerHTML={{__html:page.data}}></div>
        break;
        case PageType.picture:
            pageDataElement = <img className='dashboard-data' src={page.data} alt={page.title}/>
        break;
        case PageType.video:
            pageDataElement = <video src={page.data}/>
        break;
        default:
            pageDataElement = <div className='dashboard-data' dangerouslySetInnerHTML={{__html:page.data}}/>
        break;
    }
   let buttonDiv= (<div>
    <Dropdown>
        <MenuButton>
            <MoreVert />
        </MenuButton>
        <Menu>
            <MenuItem>Follow</MenuItem>
            <MenuItem onClick={()=>handleAddClick("book")}>Book</MenuItem>
            <MenuItem onClick={()=>handleAddClick("library")}>Library</MenuItem>
        </Menu>
    </Dropdown>
   </div>)
    if(currentProfile!=null && page.profileId==currentProfile.id){
        buttonDiv = (
            <div >
<Dropdown>
                    <MenuButton
                    
                        >
                    <Add />
                    </MenuButton>
                <Menu>
  <MenuItem onClick={()=>handleAddClick("book")}>
                        Book
                    </MenuItem>
                    <MenuItem onClick={()=>handleAddClick("library")}>
                        Library
                    </MenuItem>
    
  </Menu>
                </Dropdown>
                <Dropdown>
                <MenuButton
    
  
  >
    <MoreVert />
  </MenuButton>
  <Menu>
  <MenuItem onClick={()=>{
                    navigate(`/page/${page.id}/edit`)
                }}>
                    Edit
                </MenuItem>
                <MenuItem>
                    Delete
                </MenuItem>
            </Menu>
                </Dropdown>
                </div>
        )
    }
            return(<div className='list-item'>
                <div>
                <a onClick={handleOnClick}> 
                    <h6>{page.title}</h6>
                </a>
                </div> 
                <div className="button-row">
                

                {buttonDiv}
                   
            
                </div>
            </div>)}else{
                return(<div className="list-item">

                    Loading...
                </div>)
            }
    
    }
    
  
    export default (PageListItem)
