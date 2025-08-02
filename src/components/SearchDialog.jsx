import { useState,useEffect } from "react";
import {useSelector,useDispatch} from "react-redux";
import Dialog from "./Dialog";
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from "../core/debounce";
import { searchDialogToggle, searchMultipleIndexes } from "../actions/UserActions";
import checkResult from "../core/checkResult";
import { useNavigate } from "react-router-dom";
import AlgoliaIcon from "../images/icons/algolia.png"
import DeviceCheck from "./DeviceCheck";
import { IonInput } from "@ionic/react";

export default function SearchDialog(props){
  const isNative = DeviceCheck()
    const navigate = useNavigate()
    const searchDialogOpen = useSelector(state=>state.users.searchDialogOpen)
    const searchResults = useSelector(state=>state.users.searchResults)
    const [searchQuery,setSearchQuery] = useState("");
    const dispatch = useDispatch()
    const [searchContent,setSearchContent] = useState([]);
    const pagesInView = useSelector(state=>state.pages.pagesInView)
   
 
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
    return<Dialog  
    onClose={closeDialog}
                   isOpen={searchDialogOpen} 
                   text={
                    <div className="pt-3  ">
   
    <div className="flex flex-row mb-8 px-3 mt-8">
    {isNative?<IonInput value={searchQuery}
                style={{flex:"auto",backgroundColor:"transparent"}}
                onChange={(e)=>debounce(setSearchQuery(e.currentTarget.value),10)}
                placeholder='Search...'
               
             
                />:
    <input value={searchQuery}
                style={{flex:"auto"}}
                onChange={(e)=>debounce(setSearchQuery(e.currentTarget.value),10)}
                placeholder='Search...'
               
              
                />}
            <img className="my-auto max-h-8" src={AlgoliaIcon}/>
       </div>         
    <InfiniteScroll
        className="scroll max-w-[100%] max-h-[24em] overflow-hidden"
     dataLength={searchContent.length}
     next={()=>{}}
     hasMore={false}
     loader={<p>Loading...</p>}
   
  > 
       {searchContent.map((content,i)=>{

        return(<div
        key={i}
        className="border-2 px-4 w-[94%] my-2 mx-auto h-[3em] flex border-emerald-200 rounded-full"
        onClick={()=>handleOnClick(content)}>
         <h6 className="my-auto mont-medium text-nowrap max-w-[90%] text-ellipsis overflow-hidden">{content.title?content.title.trim().length==0?"Untitled":content.title:content.username?content.username:content.name?content.name:"Untitled"
         }   </h6>     </div>)
   
           
        })}
    </InfiniteScroll>
  
    <div style={{height:"100%"}}>
    </div>
    </div>
  }/>
}
