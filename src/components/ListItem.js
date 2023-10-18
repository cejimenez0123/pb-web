import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageInView } from "../actions/PageActions";
import {deleteBook, setBookInView} from "../actions/BookActions"

import {setLibraryInView,deleteLibrary} from "../actions/LibraryActions"
import { useNavigate } from "react-router-dom";
import { setBooksToBeAdded } from "../actions/BookActions";
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import useAuth from "../core/useAuth";
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import MoreVert from '@mui/icons-material/MoreVert'
import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
function ListItem({type,id,title,item}) {
    const [showPreview,setShowPreview] = useState(false)
    const currentProfile = useSelector(state => state.users.currentProfile)
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
    const handleDelete = ()=>{
        switch(type){
            case 'book':{
                const params = { book:item}
                dispatch(deleteBook(params))
            }
            case 'library':{
                const params = { library:item}
                dispatch(deleteLibrary(params))
            }
        }
    }
    const dropDown=()=>{
       switch(type){
        case "book":{
            if(currentProfile!=null && item.profileId==currentProfile.id){
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
                   )}else{
                       return( <Dropdown>
                                <MenuButton> <MoreVert/></MenuButton>
                                <Menu>
                                    <MenuItem onClick={()=>{}}>Add To Library</MenuItem>
                                    <MenuItem onClick={()=>{}}>Follow</MenuItem>
                                </Menu>
                        </Dropdown> )
                   }
        }
        case "library":{
            if(currentProfile!=null && item.profileId==currentProfile.id){
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
            </div>)}else{
                return(<Dropdown>
                    <MenuButton>
                        <MoreVert/>
                    </MenuButton>
                    <Menu>
                        <MenuItem onClick={()=>{}}>Follow</MenuItem>
                    </Menu>
                </Dropdown>)
            }
        }
        default:{

        }
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