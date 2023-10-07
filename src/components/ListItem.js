import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setPageInView } from "../actions/PageActions";
import { PageType } from "../core/constants";
import Book from "../domain/models/book";
import Library from "../domain/models/library";
import { setBooksToBeAdded } from "../actions/BookActions";
import { MenuItem } from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base/Dropdown';
import { MenuButton } from '@mui/base/MenuButton'
import { Menu } from '@mui/base/Menu';
import {useNavigate} from 'react-router-dom'
import { Button } from "@mui/material";
function ListItem({type,id,title,item}) {
    const [showPreview,setShowPreview] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const onToggle = ()=>{
        setShowPreview(!showPreview)
    }

    const handleOnClick = ()=>{
        
                navigate(`/${type}/${id}`)
            }
    const handleEditClick=()=>{
       
                navigate(`/${type}/${id}/edit`)       
                }
    const dropDown=()=>{
       
        if(type=="book"){
        return(<div className="list-item">
            

          
            <Dropdown>
                <MenuButton>
                    ...
                </MenuButton>
                <Menu>
                <MenuItem onClick={()=>{
                    let params = { bookList: [item]}
                    dispatch(setBooksToBeAdded(params))
                    navigate(`/library/new`)
                    }
                    }> 
                    Add to Library
                </MenuItem>
                <MenuItem onClick={handleEditClick}>
                    Edit
                </MenuItem>
                <MenuItem>
                    Delete
                </MenuItem>
                </Menu>
            </Dropdown>
            </div>
           )
        }else{
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