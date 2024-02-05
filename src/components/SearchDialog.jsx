import { useState,useEffect } from "react";
import {useSelector,useDispatch} from "react-redux";
import {Dialog,TextField,useMediaQuery} from "@mui/material"
import ClearIcon from '@mui/icons-material/Clear';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from "../core/debounce";
import { searchDialogToggle, searchMultipleIndexes } from "../actions/UserActions";
import checkResult from "../core/checkResult";
import { useNavigate } from "react-router-dom";
export default function SearchDialog({open}){
    const navigate = useNavigate()
    const searchDialogOpen = useSelector(state=>state.users.searchDialogOpen)
    const searchResults = useSelector(state=>state.users.searchResults)
    const [searchQuery,setSearchQuery] = useState("");
    const dispatch = useDispatch()
    const [searchContent,setSearchContent] = useState([]);
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const mediaQuery = useMediaQuery('(max-width:850px)')
    useEffect(()=>{
      setSearchContent(pagesInView)
     
    },[])
    useEffect(()=>{
  
        dispatch(searchMultipleIndexes({query:searchQuery})).then(result=>{
            checkResult(result,payload=>{
                    const {results}=payload
                    let items = results.map(element => {
                        let index = element.index
                       return element.hits.map(hit=>{
                           let searchItem = {type:index}
                           console.log(JSON.stringify(hit))
                             Object.keys(hit).forEach(key=>{
                                searchItem[key] = hit[key]
                             })
                        
                            return searchItem
                        })
                    
                    })
                    console.log("SDSS"+JSON.stringify(items.flat()))
                    setSearchContent(items.flat())
                    ;
            },err=>{

            })
        })
    //  setSearchContent(pages)
     }
   ,[searchQuery])
     const handleOnClick = (searchItem)=>{
            dispatch(searchDialogToggle({open:false}))
            navigate(`/${searchItem.type}/${searchItem.objectID}`)
            
     }
   const closeDialog = ()=>{
        dispatch(searchDialogToggle({open:false}))
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
              return(<div onClick={()=>handleOnClick(content)}key={i} className='search-return'>
                <h6 className='text'>{content.title}</h6></div>)
            }else if(content.name){
              return(<div onClick={()=>handleOnClick(content)} key={i} 
                className='search-return'>
                    
                    <h6 className='text'>
                        {content.name}
                    </h6></div>)
            }else if(content.username){
                return(<div key={i} 
                    onClick={()=>handleOnClick(content)}
                    className='search-return'>
                        <h6 className='text'>
                            {content.username}
                        </h6></div>)
            }
        })}
    </InfiniteScroll>
  </Dialog>
  }