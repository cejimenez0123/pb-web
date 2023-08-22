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
function ListItem(props) {
    const [showPreview,setShowPreview] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const onToggle = ()=>{
        setShowPreview(!showPreview)
    }
    const handleOnClick = ()=>{
        // switch (props.type) {
        //    case Book.className():{
                navigate(`/${props.type}/${props.id}`)
            }
            // case Library.className():{
            //     navigate(`/library/${props.id}`)
            // }
            // default : {

            
      

  
    const handleEditClick=()=>{
        console.log(`props type${props.type}`)
        navigate(`/${props.type}/${props.id}/edit`)
             
         }
    

    

            return(<div className='list-item'>
                
                <div className='title'>
                <a onClick={handleOnClick}> 
                    <div>
                        <h2>{props.title}</h2>
                    </div>
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
                <MenuItem onClick={handleEditClick}>
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
            </div>)
    
        
}
    
    // const mapState=(state)=>{
    //     return{
    //         // currentUser: state.users.currentUser,
    //         // comments: state.pages.pageCommentsInView,
    //         // userLikes: state.users.userLikes
    //     }
    // }
    // const mapDispatch=(dispatch)=>{
    //     return{
    // //         getPagesComments: (arr)=>dispatch(getPagesComments(arr)),
    // //         pageComments: (comments)=>dispatch({type: "PAGE_COMMENTS",comments}),
    // //      getLikesOfUser: ()=>dispatch(getLikesOfUser())
    //     }
    // }
    export default ListItem