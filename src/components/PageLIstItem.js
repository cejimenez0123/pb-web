import { useState } from "react";
import { useDispatch } from "react-redux";
import { setPageInView,setPagesToBeAdded } from "../actions/PageActions";
import { PageType } from "../core/constants";
import { MenuItem } from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base/Dropdown';
import { MenuButton } from '@mui/base/MenuButton'
import { Menu } from '@mui/base/Menu';
import {useNavigate} from 'react-router-dom'
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
            return(<div className='page-list-item'>
                <style>
                    
                </style>
                <div className='title'>
                <a onClick={handleOnClick}> 
                    <h2>{page.title}</h2>
                </a>
                </div> 
                <div className="button-row">
                <Dropdown>
                    <MenuButton>
                        Add
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
                    <MenuButton>
                        Edit
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
                return(<div>

                    Loading...
                </div>)
            }
    
    }
    
  
    export default (PageListItem)
