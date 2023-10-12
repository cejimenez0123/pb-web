import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setPageInView } from "../actions/PageActions";
import {setBookInView} from "../actions/BookActions"
import {setLibraryInView} from "../actions/LibraryActions"
import { PageType } from "../core/constants";
import Book from "../domain/models/book";
import Library from "../domain/models/library";
import { useNavigate } from "react-router-dom";
import { setBooksToBeAdded } from "../actions/BookActions";
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import MoreVert from '@mui/icons-material/MoreVert'
function ListItem({type,id,title,item}) {
    const [showPreview,setShowPreview] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const onToggle = ()=>{
        setShowPreview(!showPreview)
    }

    const handleOnClick = ()=>{
        
                navigate(`/${type}/${id}`)
                switch(type){
                    case 'book':{
                        setBookInView(item)
                    }
                    case 'library': {
                        setLibraryInView(item)
                    }
                    default:{
                        
                    }
                }
            }
    const handleEditClick=()=>{
       
                navigate(`/${type}/${id}/edit`) 
                switch(type){
                    case 'book':{
                        setBookInView(item)
                    }
                    case 'library': {
                        setLibraryInView(item)
                    }
                    default:{

                    }
                }     
                }
    const dropDown=()=>{
       
        if(type=="book"){
        return(<div >
            

          
            <Dropdown>
                <MenuButton
    slots={{ root: IconButton }}
    slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
  >
    <MoreVert />
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
                <Dropdown>
  <MenuButton
    slots={{ root: IconButton }}
    slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
  >
    <MoreVert />
  </MenuButton>
  <Menu>
    <MenuItem onClick={()=>{
                    navigate(`/${type}/${id}/edit`)}
                } type="button">
                    Edit</MenuItem>
    <MenuItem type="button">
                    Delete</MenuItem>
    
  </Menu>
</Dropdown>
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