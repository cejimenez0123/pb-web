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
function PageListItem({page}) {
    const [showPreview,setShowPreview] = useState(false)
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
            return(<div className='list-item'>
                <div>
                <a onClick={handleOnClick}> 
                    <h6>{page.title}</h6>
                </a>
                </div> 
                <div className="button-row">
                <Dropdown>
                    <MenuButton
                        slots={{ root: IconButton }}
                        slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
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
    slots={{ root: IconButton }}
    slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
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

                <div >
                   
                </div>
            </div>
            </div>)}else{
                return(<div className="list-item">

                    Loading...
                </div>)
            }
    
    }
    
  
    export default (PageListItem)
