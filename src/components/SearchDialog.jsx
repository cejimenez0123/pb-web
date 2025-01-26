import { useState,useEffect } from "react";
import {useSelector,useDispatch} from "react-redux";
import {Dialog,TextField,useMediaQuery} from "@mui/material"
import ClearIcon from '@mui/icons-material/Clear';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from "../core/debounce";
import { searchDialogToggle, searchMultipleIndexes } from "../actions/UserActions";
import checkResult from "../core/checkResult";
import { useNavigate } from "react-router-dom";
import AlgoliaIcon from "../images/algolia.svg"
import ProfileCircle from "./profile/ProfileCircle";


export default function SearchDialog(props){
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
                             Object.keys(hit).forEach(key=>{
                                searchItem[key] = hit[key]
                             })
                        
                            return searchItem
                        })
                    
                    })
                    setSearchContent(items.flat())
                    ;
            },err=>{

            })
        })

     }
   ,[searchQuery])
     const handleOnClick = (searchItem)=>{
            dispatch(searchDialogToggle({open:false}))
            navigate(`/${searchItem.type}/${searchItem.objectID}`)
            
     }
   const closeDialog = ()=>{
        dispatch(searchDialogToggle({open:false}))
   }
    return<Dialog  fullScreen={mediaQuery} 
                   open={searchDialogOpen} >
                    <div className="pt-3">
    <div className='header py-3 px-3'>
      <ClearIcon onClick={closeDialog}/>
    </div>
    <div className="flex flex-row px-3">
    <TextField  value={searchQuery}
                style={{flex:"auto"}}
                onChange={(e)=>debounce(setSearchQuery(e.currentTarget.value),10)}
                placeholder='Search...'
               
              
                />
            <img className="my-auto max-h-8" src={AlgoliaIcon}/>
       </div>         
    <InfiniteScroll
        className="scroll max-w-[100%] overflow-hidden"
     dataLength={searchContent.length}
     next={()=>{}}
     hasMore={false}
     loader={<p>Loading...</p>}
     endMessage={<div className="no-more-data"><p>Nothing Found</p></div>}
  > 
       {searchContent.map((content,i)=>{

        return(<div
        key={i}
        className="py-3 border-2 px-4 my-2 w-[94%] mx-auto border-emerald-200 rounded-full"
        onClick={()=>handleOnClick(content)}>
         {content.title?content.title:content.username?content.username:content.name}
        </div>)
   
           
        })}
    </InfiniteScroll>
    <div style={{height:"100%"}}>
    </div>
    </div>
  </Dialog>
}
