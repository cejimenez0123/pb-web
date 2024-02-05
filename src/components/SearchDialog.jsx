import { useState,useEffect } from "react";
import {useSelector,useDispatch} from "react-redux";
import {Dialog,TextField,useMediaQuery} from "@mui/material"
import ClearIcon from '@mui/icons-material/Clear';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from "../core/debounce";
import { searchDialogToggle } from "../actions/UserActions";

export default function SearchDialog({open}){
    const searchDialogOpen = useSelector(state=>state.users.searchDialogOpen)
    const [searchQuery,setSearchQuery] = useState("");
    const dispatch = useDispatch()
    const [searchContent,setSearchContent] = useState([]);
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const mediaQuery = useMediaQuery('(max-width:850px)')
    useEffect(()=>{
      setSearchContent(pagesInView)
    },[])
    useEffect(()=>{
  
   
      let pages = pagesInView.filter(page=>page.title.includes(searchQuery))
     setSearchContent(pages)
     }
   ,[searchQuery])

   const closeDialog = ()=>{
        dispatch(searchDialogToggle())
   }
    return<Dialog  fullScreen={mediaQuery} className="search-dialog"
                   open={searchDialogOpen} >
    <div className='header'>
      <ClearIcon onClick={closeDialog}/>
    </div>
    <TextField  value={searchQuery}
                onChange={(e)=>debounce(setSearchQuery(e.currentTarget.value),10)}
                placeholder='Search...'/>
    <InfiniteScroll
     dataLength={searchContent.length}
     next={()=>{}}
     hasMore={false}
     loader={<p>Loading...</p>}
     endMessage={<div className="no-more-data"><p>Nothing Found</p></div>}
  >
        {searchContent.map((content,i)=>{
            if(content.title){
              return(<div key={i} className='search-return'><h6 className='text'>{content.title}</h6></div>)
            }else if(content.name){
              return(<div key={i} 
                className='search-return'>
                    <h6 className='text'>
                        {content.name}
                    </h6></div>)
            }
        })}
    </InfiniteScroll>
  </Dialog>
  }