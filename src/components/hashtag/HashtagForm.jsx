
// import { useContext, useEffect ,useLayoutEffect,useState} from "react";
// import { useSelector } from "react-redux";
// import { createHashtagCollection, createHashtagPage, deleteHashtagCollection, deleteHashtagStory, fetchCollectionHashtags, fetchStoryHashtags,  } from "../../actions/HashtagActions";
// import { useDispatch } from "react-redux";
// import checkResult from "../../core/checkResult";
// import clear from "../../images/icons/close.svg"

// import Context from "../../context";
// import { IonImg, IonLabel, IonTextarea } from "@ionic/react";
// import { ErrorBoundary } from "@sentry/react";
// export function HashtagForm({item,type="story"}){

//     const {setError}=useContext(Context)
//     const isStory = type == "story"
//     const [inputValue, setInputValue] = useState('');
//     const dispatch = useDispatch()
//     const [hashtags, setHashtags] = useState([]);
  
//     const currentProfile = useSelector(state=>state.users.currentProfile)


//     const handleInputChange = (e) => {
//       setInputValue(e.target.value.trim());
//     };

// const fetchHashtags=(item)=>{

//         if(!isStory){
//           dispatch(fetchCollectionHashtags({profile:currentProfile,colId:item.id})).then(res=>{
//                 checkResult(res,payload=>{

//                     setHashtags(payload.hashtags)
                  
            
//                 },err=>{
                  
//                 })})

//         }else{
//           dispatch(fetchStoryHashtags({profile:currentProfile,storyId:item.id})).then(res=>{
//             checkResult(res,payload=>{
//               setHashtags(payload.hashtags)
//             },err=>{

//             })
//           })
//         }
//       // }
// }
//     const deleteHashtag =  (hash) =>{
    
//    const {hashtag}=hash
//       if(!isStory){
//         dispatch(deleteHashtagCollection({colId:item.id,hashId:hash.id})).then(res=>{
//           checkResult(res,payload=>{
//             fetchHashtags(item)

//           },err=>{

//           })
//       })
//       }else{

//         dispatch(deleteHashtagStory({hashtagStoryId:hash.id})).then(res=>{
//           checkResult(res,payload=>{
//           fetchHashtags(item)


// },err=>{

// })})
     
//       }
      
//     }
//     useLayoutEffect(()=>{
//       fetchHashtags(item)
//     },[])
//     const handleKeyDown = (e) => {
   
// try{
//         // if(item && currentProfile){
//       if (e.key === 'Enter' && inputValue.trim()) {
//         if(!isStory){
   
//           dispatch(createHashtagCollection({name:inputValue.trim().toLocaleLowerCase(),colId:item.id,profile:currentProfile})
//         ).then(res=>{
         
//          if(res && res.payload){ 
//           setHashtags(prev=>[...prev,res.payload.hashtag])
//               setInputValue('');
//         e.preventDefault(); 

//          }else{
//           setError("Reached the max on hashtags")
//          }    
       
        
          
//         })
//     }else{
   
//     dispatch(createHashtagPage({name:inputValue.trim().toLocaleLowerCase(),storyId:item.id,profile:currentProfile})
//   ).then(res=>checkResult(res,(payload)=>{
//    if(res && payload){ 
//           setHashtags(prev=>[...prev,payload.hashtag])
//    }
//         setInputValue('');
//         e.preventDefault(); 
//       }))
//     }}}catch(err){}finally{
//       fetchHashtags(item)
//     }}
//       useEffect(()=>{
   
//     },[])
//     return (
//       <ErrorBoundary>
//        <form className="  w-full flex flex-col mt-2 ">
     
//         <textarea
//           value={inputValue}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyDown}
//           placeholder="Type a hashtag and press Enter"
//           rows={4}
//           cols={12}
//          className="my-1 w-[90%] p-2 rounded-xl md:w-[48em] bg-base-bg mx-auto border border-soft text-soft placeholder:text-soft/50 focus:outline-none focus:ring-2 focus:ring-button-secondary-bg"  />
//       <button type="submit"  className="hidden">Submit</button>
//       <div className="text-left my-1">
//         <IonLabel className="text-soft text-sm">Hashtags:</IonLabel>
//         <ul className="flex flex-wrap p-4">
//           {hashtags.map((hash, index) => (
  
//             <li  className="p-1 flex flex-row m-1 text-sm rounded-lg bg-button-secondary-bg text-white dark:bg-button-secondary-bg dark:text-white" key={index}>
//               <h6 className="my-auto mx-2">#{hash.hashtag.name}</h6><IonImg 
//             className=" my-auto" 
//             onClick={()=>deleteHashtag(hash)}
//             src={clear}/></li>
//           ))}
//         </ul>
//       </div>
   
//     </form>
//     </ErrorBoundary>
  
//   );
// };

// export default HashtagForm;
import { useContext, useLayoutEffect, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createHashtagCollection, createHashtagPage,
  deleteHashtagCollection, deleteHashtagStory,
  fetchCollectionHashtags, fetchStoryHashtags,
  searchHashtags, // <-- new action (see note below)
} from "../../actions/HashtagActions";
import checkResult from "../../core/checkResult";
import clear from "../../images/icons/close.svg";
import Context from "../../context";
import { IonImg, IonLabel } from "@ionic/react";
import { ErrorBoundary } from "@sentry/react";

export function HashtagForm({ item, type = "story" }) {
  const { setError } = useContext(Context);
  const isStory = type === "story";
  const dispatch = useDispatch();
  const currentProfile = useSelector(state => state.users.currentProfile);

  const [inputValue, setInputValue] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => setInputValue(e.target.value);

  const fetchHashtags = (item) => {
    const action = isStory
      ? fetchStoryHashtags({ profile: currentProfile, storyId: item.id })
      : fetchCollectionHashtags({ profile: currentProfile, colId: item.id });
    dispatch(action).then(res =>
      checkResult(res, payload => setHashtags(payload.hashtags), () => {})
    );
  };

  // Single path used by both Enter and suggestion clicks
  const addHashtag = (name) => {
    const clean = (name || "").trim().toLowerCase();
    if (!clean) return;
    // already on this item? just clear and bail
    if (hashtags.some(h => h.hashtag?.name === clean)) {
      setInputValue("");
      setSuggestions([]);
      return;
    }

    if (!isStory) {
      dispatch(createHashtagCollection({ name: clean, colId: item.id, profile: currentProfile }))
        .then(res => {
          if (res && res.payload) {
            setHashtags(prev => [...prev, res.payload.hashtag]);
            setInputValue("");
            setSuggestions([]);
          } else {
            setError("Reached the max on hashtags");
          }
        });
    } else {
      dispatch(createHashtagPage({ name: clean, storyId: item.id, profile: currentProfile }))
        .then(res => checkResult(res, payload => {
          if (payload) setHashtags(prev => [...prev, payload.hashtag]);
          setInputValue("");
          setSuggestions([]);
        }));
    }
  };

  const deleteHashtag = (hash) => {
    const action = isStory
      ? deleteHashtagStory({ hashtagStoryId: hash.id })
      : deleteHashtagCollection({ colId: item.id, hashId: hash.id });
    dispatch(action).then(res =>
      checkResult(res, () => fetchHashtags(item), () => {})
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addHashtag(inputValue);
    }
  };

  // Debounced suggestion lookup against existing platform tags
  useEffect(() => {
    const q = inputValue.trim().toLowerCase();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(() => {
      dispatch(searchHashtags({ query: q, profile: currentProfile })).then(res =>
        checkResult(res, payload => setSuggestions(payload.hashtags || []), () => setSuggestions([]))
      );
    }, 250);
    return () => clearTimeout(t);
  }, [inputValue, currentProfile, dispatch]);

  useLayoutEffect(() => {
    fetchHashtags(item);
  }, []);

  // hide ones already added, cap at 3
  const visibleSuggestions = suggestions
    .filter(s => !hashtags.some(h => h.hashtag?.name === s.name))
    .slice(0, 3);

  return (
    <ErrorBoundary>
      <form className="w-full flex flex-col mt-2">
        {visibleSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 px-1 mx-auto w-[90%] md:w-[48em]">
            {visibleSuggestions.map((s) => (
              <button
                type="button"
                key={s.id ?? s.name}
                onClick={() => addHashtag(s.name)}
                className="px-2 py-1 text-sm rounded-lg border border-soft text-soft hover:bg-button-secondary-bg hover:text-white transition-colors"
              >
                #{s.name}
              </button>
            ))}
          </div>
        )}

        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a hashtag and press Enter"
          rows={4}
          cols={12}
          className="my-1 w-[90%] p-2 rounded-xl md:w-[48em] bg-base-bg mx-auto border border-soft text-soft placeholder:text-soft/50 focus:outline-none focus:ring-2 focus:ring-button-secondary-bg"
        />
        <button type="submit" className="hidden">Submit</button>

        <div className="text-left my-1">
          <IonLabel className="text-soft text-sm">Hashtags:</IonLabel>
          <ul className="flex flex-wrap p-4">
            {hashtags.map((hash, index) => (
              <li className="p-1 flex flex-row m-1 text-sm rounded-lg bg-button-secondary-bg text-white" key={index}>
                <h6 className="my-auto mx-2">#{hash.hashtag.name}</h6>
                <IonImg className="my-auto" onClick={() => deleteHashtag(hash)} src={clear} />
              </li>
            ))}
          </ul>
        </div>
      </form>
    </ErrorBoundary>
  );
}

export default HashtagForm;

