import { useState } from "react";
import { useDispatch } from "react-redux";
import { setPageInView } from "../actions/PageActions";
import { PageType } from "../core/constants";
import { MenuItem } from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base/Dropdown';
import { MenuButton } from '@mui/base/MenuButton'
import { Menu } from '@mui/base/Menu';
import {useNavigate} from 'react-router-dom'
function PageListItem({page}) {
    const [showPreview,setShowPreview] = useState(false)
    const dispatch = useDispatch()
    const onToggle = ()=>{
        setShowPreview(!showPreview)
    }
    const handleOnClick = ()=>{
        const params = {
            page: page
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
                <MenuItem>
                    Book
                </MenuItem>
                <MenuItem>
                Library
                </MenuItem>
                </Menu>
                </Dropdown>
                 
                    <Dropdown>
                <MenuButton>
                   Edit
                </MenuButton>
                <Menu>
                <MenuItem>
                    Edit
                </MenuItem>
                <MenuItem>
                Delete
                </MenuItem>
                </Menu>
                </Dropdown>

                <div >
                    {/* {pageDataElement} */}
                </div>
            </div>
            </div>)}else{
                return(<div>

                    Loading...
                </div>)
            }
    
    }
    
  
    export default (PageListItem)
