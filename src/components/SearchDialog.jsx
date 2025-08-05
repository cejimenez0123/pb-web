import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dialog from "./Dialog";
import { searchDialogToggle, searchMultipleIndexes } from "../actions/UserActions";
import checkResult from "../core/checkResult";
import { useNavigate } from "react-router-dom";
import AlgoliaIcon from "../images/icons/algolia.png";
import DeviceCheck from "./DeviceCheck";
import { IonInput, IonSpinner, IonList, IonItem, IonLabel } from "@ionic/react";

export default function SearchDialog() {
  const isNative = DeviceCheck();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchDialogOpen = useSelector((state) => state.users.searchDialogOpen);
  const pagesInView = useSelector((state) => state.pages.pagesInView);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchContent, setSearchContent] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounceTimeout = useRef(null);

  useEffect(() => {
    setSearchContent(pagesInView);
  }, [pagesInView]);

  // Debounce search input
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(debounceTimeout.current);
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchContent(pagesInView);
      setLoading(false);
      return;
    }
    setLoading(true);
    dispatch(searchMultipleIndexes({ query: debouncedQuery })).then((result) => {
      checkResult(
        result,
        (payload) => {
          const { results } = payload;
          const items = results.flatMap((element) => {
            const index = element.index;
            return element.hits.map((hit) => {
              const searchItem = { type: index };
              Object.keys(hit).forEach((key) => {
                searchItem[key] = hit[key];
              });
              return searchItem;
            });
          });
          setSearchContent(items);
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    });
  }, [debouncedQuery, dispatch, pagesInView]);

  const handleOnClick = (searchItem) => {
    dispatch(searchDialogToggle({ open: false }));
    navigate(`/${searchItem.type}/${searchItem.objectID}`);
  };

  const closeDialog = () => {
    dispatch(searchDialogToggle({ open: false }));
  };

  return (
    <Dialog
      onClose={closeDialog}
      isOpen={searchDialogOpen}
      text={
        <div className="pt-3">
          <div className="flex flex-row mb-8 px-3 mt-8 items-center gap-2">
            <IonInput
              value={searchQuery}
              onIonChange={(e) => setSearchQuery(e.detail.value)}
              placeholder="Search..."
              clearInput
              className="flex-auto bg-transparent"
              debounce={300} // optional Ionic debounce prop
              spellCheck={false}
              autocorrect="off"
              autocapitalize="off"
              type="search"
            />
            <img
              className="my-auto max-h-8 select-none pointer-events-none"
              src={AlgoliaIcon}
              alt="Search Icon"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-4">
              <IonSpinner name="crescent" color="success" />
            </div>
          ) : searchContent.length === 0 ? (
            <p className="text-center text-emerald-400 mont-medium">No results found.</p>
          ) : (
            <IonList style={{
              maxHeight: '24em',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {searchContent.map((content, i) => (
                <IonItem
                  key={i}
                  button
                  detail={false}
                  lines="none"
                  className="border-2 border-emerald-200 rounded-full my-2"
                  onClick={() => handleOnClick(content)}
                >
                  <IonLabel className="mont-medium text-ellipsis" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {content.title?.trim().length === 0
                      ? 'Untitled'
                      : content.title || content.username || content.name || 'Untitled'}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          )}
         
        </div>
      }
    />
  );
}

// import { useState,useEffect } from "react";
// import {useSelector,useDispatch} from "react-redux";
// import Dialog from "./Dialog";
// import InfiniteScroll from 'react-infinite-scroll-component';
// import debounce from "../core/debounce";
// import { searchDialogToggle, searchMultipleIndexes } from "../actions/UserActions";
// import checkResult from "../core/checkResult";
// import { useNavigate } from "react-router-dom";
// import AlgoliaIcon from "../images/icons/algolia.png"
// import DeviceCheck from "./DeviceCheck";
// import { IonInput } from "@ionic/react";

// export default function SearchDialog(props){
//   const isNative = DeviceCheck()
//     const navigate = useNavigate()
//     const searchDialogOpen = useSelector(state=>state.users.searchDialogOpen)
//     const searchResults = useSelector(state=>state.users.searchResults)
//     const [searchQuery,setSearchQuery] = useState("");
//     const dispatch = useDispatch()
//     const [searchContent,setSearchContent] = useState([]);
//     const pagesInView = useSelector(state=>state.pages.pagesInView)
   
 
//     useEffect(()=>{
//       setSearchContent(pagesInView)
     
//     },[])
//     useEffect(()=>{
//         dispatch(searchMultipleIndexes({query:searchQuery})).then(result=>{
//             checkResult(result,payload=>{
//                     const {results}=payload
//                     let items = results.map(element => {
//                         let index = element.index
//                        return element.hits.map(hit=>{
//                            let searchItem = {type:index}        
//                              Object.keys(hit).forEach(key=>{
//                                 searchItem[key] = hit[key]
//                              })
                        
//                             return searchItem
//                         })
                    
//                     })
//                     setSearchContent(items.flat())
//                     ;
//             },err=>{

//             })
//         })

//      }
//    ,[searchQuery])
//      const handleOnClick = (searchItem)=>{
//             dispatch(searchDialogToggle({open:false}))
//             navigate(`/${searchItem.type}/${searchItem.objectID}`)
            
//      }
//    const closeDialog = ()=>{
//         dispatch(searchDialogToggle({open:false}))
//    }
//     return<Dialog  
//     onClose={closeDialog}
//                    isOpen={searchDialogOpen} 
//                    text={
//                     <div className="pt-3  ">
   
//     <div className="flex flex-row mb-8 px-3 mt-8">
//     {isNative?<IonInput value={searchQuery}
//                 style={{flex:"auto",backgroundColor:"transparent"}}
//                 onChange={(e)=>debounce(setSearchQuery(e.currentTarget.value),10)}
//                 placeholder='Search...'
               
             
//                 />:
//     <input value={searchQuery}
//                 style={{flex:"auto"}}
//                 onChange={(e)=>debounce(setSearchQuery(e.currentTarget.value),10)}
//                 placeholder='Search...'
               
              
//                 />}
//             <img className="my-auto max-h-8" src={AlgoliaIcon}/>
//        </div>         
//     <InfiniteScroll
//         className="scroll max-w-[100%] max-h-[24em] overflow-hidden"
//      dataLength={searchContent.length}
//      next={()=>{}}
//      hasMore={false}
//      loader={<p>Loading...</p>}
   
//   > 
//        {searchContent.map((content,i)=>{

//         return(<div
//         key={i}
//         className="border-2 px-4 w-[94%] my-2 mx-auto h-[3em] flex border-emerald-200 rounded-full"
//         onClick={()=>handleOnClick(content)}>
//          <h6 className="my-auto mont-medium text-nowrap max-w-[90%] text-ellipsis overflow-hidden">{content.title?content.title.trim().length==0?"Untitled":content.title:content.username?content.username:content.name?content.name:"Untitled"
//          }   </h6>     </div>)
   
           
//         })}
//     </InfiniteScroll>
  
//     <div style={{height:"100%"}}>
//     </div>
//     </div>
//   }/>
// }
