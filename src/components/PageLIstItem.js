import { useState } from "react";
import { useDispatch } from "react-redux";
import { deletePage, setPageInView,setPagesToBeAdded } from "../actions/PageActions";
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
import theme from "../theme";
import checkResult from "../core/checkResult";
function PageListItem({page,onDelete}) {
    
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
    const menuBtnStyle ={border:"none",marginLeft:"1em"}
    const iconStyle = {fontSize:"2rem",color:theme.palette.primary.main}
   let buttonDiv= (<div>
    <Dropdown>
        <MenuButton style={menuBtnStyle}>
            <MoreVert style={iconStyle}/>
        </MenuButton>
        <Menu>
            <MenuItem onClick={()=>handleAddClick("book")}>Book</MenuItem>
            <MenuItem onClick={()=>handleAddClick("library")}>Library</MenuItem>
        </Menu>
    </Dropdown>
   </div>)
    if(currentProfile!=null && page.profileId==currentProfile.id){
        buttonDiv = (
            <div >
                <Dropdown>
                    <MenuButton style={menuBtnStyle}>
                        <Add style={iconStyle}/>
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
                    <MenuButton  style={menuBtnStyle}>
                    <MoreVert style={iconStyle}/>
  </MenuButton>
  <Menu>
  <MenuItem onClick={()=>{
                    navigate(`/page/${page.id}/edit`)
                }}>
                    Edit
                </MenuItem>
                <MenuItem onClick={()=>{
                    const params = {
                        page
                    }
                    dispatch(deletePage(params)).then(result=>checkResult(result,payload=>{
                     onDelete()       
                    },err=>{

                    }))}
                }>
                    Delete
                </MenuItem>
            </Menu>
                </Dropdown>
                </div>
        )
    }
            return(<div className='list-item'>
                <div>
                <a className="title" onClick={handleOnClick}> 
                   {page.title.length>0? <h6>{page.title}</h6>:<h6>Unititled</h6>}
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
