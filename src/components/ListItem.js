import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setPageInView } from "../actions/PageActions";
import { PageType } from "../core/constants";
import Book from "../domain/models/book";
import Library from "../domain/models/library";
import { MenuItem } from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base/Dropdown';
import { MenuButton } from '@mui/base/MenuButton'
import { Menu } from '@mui/base/Menu';
import {useNavigate} from 'react-router-dom'
function ListItem({type,id,title}) {
    const [showPreview,setShowPreview] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const onToggle = ()=>{
        setShowPreview(!showPreview)
    }

    const handleOnClick = ()=>{
        
                navigate(`/${type}/${id}`)
            }
    
    const dropDown=()=>{
       
        if(type!="library"){
        return(<div>
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
           <MenuItem onClick={handleEditClick}>
               Edit
           </MenuItem>
           <MenuItem>
           Delete
           </MenuItem>
           </Menu>
           </Dropdown>
           </div>)}else{
            return (<div>
                <button onClick={()=>{
                    navigate(`/${type}/${id}/edit`)}
                } type="button">
                    Update
                </button>
                <button type="button">
                    Delete
                </button>
            </div>)
           }
    }
    const handleEditClick=()=>{
       
        navigate(`/${type}/${id}/edit`)       
        }
            return(<div className='list-item'>
                
                <div className='title'>
                <a onClick={handleOnClick}> 
                    <div>
                        {title}
                    </div>
                </a>
                </div> 
                <div className="button-row">
         
               
            {dropDown()}

                <div >
            
                </div>
            </div>
            </div>)
    
        
}

    export default ListItem