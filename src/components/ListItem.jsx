// import React from "react";
// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {deleteBook, setBookInView} from "../actions/BookActions"
// import {setLibraryInView,deleteLibrary} from "../actions/LibraryActions"
// import { useNavigate } from "react-router-dom";
// import { setBooksToBeAdded } from "../actions/BookActions";
// import Dropdown from '@mui/joy/Dropdown';
// import Menu from '@mui/joy/Menu';
// import MenuButton from '@mui/joy/MenuButton';
// import MenuItem from '@mui/joy/MenuItem';
// import MoreVert from '@mui/icons-material/MoreVert'
// import { createFollowBook } from "../actions/UserActions";
// import theme from "../theme";
// import checkResult from "../core/checkResult";

// function ListItem({type,id,title,item,onDelete}) {
//     const [showPreview,setShowPreview] = useState(false)
//     const currentProfile = useSelector(state => state.users.currentProfile)
//     const navigate = useNavigate()
//     const dispatch = useDispatch()
//     const onToggle = ()=>{
//         setShowPreview(!showPreview)
//     }

//     const handleOnClick = ()=>{
        
//                 navigate(`/${type}/${id}`)
//                 switch(type){
//                     case 'book':{
//                         setBookInView(item)
//                     }
//                     case 'library': {
//                         setLibraryInView(item)
//                     }
//                     default:{
                        
//                     }
//                 }
//             }
//     const handleEditClick=()=>{
       
//                 navigate(`/${type}/${id}/edit`) 
//                 switch(type){
//                     case 'book':{
//                         setBookInView(item)
//                     }
//                     case 'library': {
//                         setLibraryInView(item)
//                     }
//                     default:{

//                     }
//                 }     
//                 }
//     const handleDelete = ()=>{
//         switch(type){
//             case 'book':{
//                 const params = { book:item}
//                 dispatch(deleteBook(params)).then(result=>{
//                     checkResult(result,payload=>{
//                         onDelete()
//                     },err=>{

//                     })
//                 })
//             }
//             case 'library':{
//                 const params = { library:item}
//                 dispatch(deleteLibrary(params)).then(result=>checkResult(result,
//                     payload=>{
//                         onDelete()
//                     },err=>{

//                     }))
//             }
//         }
//     }
//     const iconStyle = {color:theme.palette.primary.main,fontSize:"2rem"}
//     const menuBtnStyle= {border:"none",marginLeft:"1em"}
//     const dropDown=()=>{
//        switch(type){
//         case "book":{
//             if(currentProfile!=null && item.profileId==currentProfile.id){
//                 return(<div >
                    
        
                  
//                     <Dropdown>
//                         <MenuButton
//                        style={menuBtnStyle}
//             // slots={{ root: IconButton }}
//             //slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
//           >
//             <MoreVert style={iconStyle}/>
//           </MenuButton>
//           <Menu>
//           <MenuItem onClick={()=>{
//                             let params = { bookList: [item]}
//                             dispatch(setBooksToBeAdded(params))
//                             navigate(`/library/new`)
//                             }
//                             }> 
//                             Add to Library
//                         </MenuItem>
//                         <MenuItem onClick={handleEditClick}>
//                             Edit
//                         </MenuItem>
//                         <MenuItem onClick={()=>{
//                                 if(window.confirm("Are you sure you want to delete this")){
//                                     handleDelete()
//                                 }
//                         }}>
//                             Delete
//                         </MenuItem>
            
//           </Menu>
//         </Dropdown>
        
                    
//                     </div>
//                    )}else{
//                        return( <Dropdown>
//                                 <MenuButton style={menuBtnStyle}> 
//                                 <MoreVert
//                                     style={iconStyle}
//                                 /></MenuButton>
//                                 <Menu>
//                                     <MenuItem onClick={()=>{
//                                          let params = { bookList: [item]}
//                                         dispatch(setBooksToBeAdded(params))
//                                         navigate(`/library/new`)
//                                     }}>Add To Library</MenuItem>
//                                     <MenuItem onClick={()=>{
//                                         const params = {
//                                             book: item,
//                                             profile: currentProfile
//                                         }
//                                         dispatch(createFollowBook(params))


//                                     }}>Follow</MenuItem>
//                                 </Menu>
//                         </Dropdown> )
//                    }
//         }
//         case "library":{
//             if(currentProfile!=null && item.profileId==currentProfile.id){
//             return (<div>
//                 <Dropdown>
//   <MenuButton style={menuBtnStyle}
//  //   slots={{ root: IconButton }}
//    // slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
//   >
//     <MoreVert style={iconStyle}/>
//   </MenuButton>
//   <Menu>
//     <MenuItem onClick={()=>{
//                     navigate(`/${type}/${id}/edit`)}
//                 } type="button">
//                     Edit</MenuItem>
//     <MenuItem onClick={()=>{
//                 if(window.confirm("Are you sure you want to delete this")){
//                     handleDelete()
//                 }else{

//                 }
//     }}type="button">
//                     Delete</MenuItem>
    
//   </Menu>
// </Dropdown>
//             </div>)}else{
//                 return(<Dropdown>
//                     <MenuButton style={menuBtnStyle}>
//                         <MoreVert style={iconStyle}/>
//                     </MenuButton>
//                     <Menu>
//                         <MenuItem onClick={()=>{

//                         }}>Follow</MenuItem>
//                     </Menu>
//                 </Dropdown>)
//             }
//         }
//         default:{

//         }
//        }
      
//     }

//             return(<div className='list-item'>
               
//                 <div className='title'>
//                 <a onClick={handleOnClick}> 
                
//                {title.length>0? <h6>  {title}</h6>:<h6>Untitled</h6>}
                    
//                 </a>
//                 </div> 
//                 <div className="button-row">
         
               
//             {dropDown()}

//                 <div >
            
//                 </div>
//             </div>
//             </div>)
    
        
// }

//     export default ListItem