import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  IonModal,
  IonText,
  IonHeader,
  IonToolbar,
  IonList,
  IonGrid,
  IonRow,
  IonItem,
  IonLabel,
  useIonRouter,
  IonTitle,
  IonSearchbar,
  IonContent,
} from '@ionic/react';
import { useSelector, useDispatch } from 'react-redux';
import {
  searchMultipleIndexes,
  searchDialogToggle,
} from '../actions/UserActions';
import { getMyCollections, getPublicCollections } from '../actions/CollectionActions';
import { getMyStories } from '../actions/StoryActions';
import { getPublicStories } from '../actions/PageActions';
import checkResult from '../core/checkResult';

const SearchDialog = ({ presentingElement }) => {
  const dispatch = useDispatch();
  const router = useIonRouter();

  const currentProfile = useSelector(state => state.users.currentProfile);
  const collectionsFromStore = useSelector(
    state => state.books.collections ?? []
  );
  const storiesFromStore = useSelector(
    state => state.pages.pagesInView ?? []
  );

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchContent, setSearchContent] = useState([]);

 
  const personalCols = useMemo(
    () =>
      collectionsFromStore
        .filter(col => !!col)
        .map(col => ({
          item: { ...col },
          objectID: col.id,
          type: 'collection'
        })),
    [collectionsFromStore]
  );

  const personalStories = useMemo(
    () =>
      storiesFromStore.map(story => ({
        item: { ...story },
        objectID: story.id,
        type: 'story' 
      })),
    [storiesFromStore]
  );

  // Filters list
  const filters = useMemo(() => {
    const includeTypes = {
      cols: 'collection',
      stories: 'story',
      profiles: 'profile',
      hashtags: 'hashtag',
    };
    const base = [
      includeTypes.profiles,
      includeTypes.hashtags,
      includeTypes.cols,
      includeTypes.stories,
    ];
    return currentProfile ? ['personal', ...base] : base;
  }, [currentProfile]);

  // Load initial collections/stories depending on auth
  useLayoutEffect(() => {
    if (currentProfile) {
      dispatch(getMyCollections());
      dispatch(getMyStories());
    } else {
      dispatch(getPublicStories());
      dispatch(getPublicCollections());
    }
  }, [currentProfile, dispatch]);

  // Helper: local text filter
  const searchList = useCallback((searchQ, list) => {
    const q = searchQ.toLowerCase();
    return list.filter(content => {
      const item = content.item || {};
      const titleMatch =
        item?.title && item?.title.toLowerCase().includes(q);
      const usernameMatch =
        item?.username && item?.username.toLowerCase().includes(q);
      const nameMatch =
        item?.name && item?.name.toLowerCase().includes(q);
      return !!(titleMatch || usernameMatch || nameMatch);
    });
  }, []);
useEffect(()=>{
    const payload = {
      query: "",
      filters: selectedFilters,
      profileId: currentProfile ? currentProfile.id : null,
    };
 dispatch(searchMultipleIndexes(payload)).then(result => {
      checkResult(
        result,
        returned => {
          const { results } = returned;
          const list =
            (results ?? []).map(item => ({
              item,
              objectID: item.objectID,
              type: item.type,
            })) || [];
          setSearchContent(list);
        },
        err => console.error('Search Error:', err?.message)
      );
    });
},[])
  // Remote search action (Algolia or similar)
  const searchAction = useCallback(() => {
    const trimmed = searchText.trim();
    // Do not hit remote search if empty or personal-only filter is active.
    if (!trimmed || selectedFilters.includes('personal')) {
      return;
    }

    const payload = {
      query: trimmed,
      filters: selectedFilters,
      profileId: currentProfile ? currentProfile.id : null,
    };

    dispatch(searchMultipleIndexes(payload)).then(result => {
      checkResult(
        result,
        returned => {
          const { results } = returned;
          const list =
            (results ?? []).map(item => ({
              item,
              objectID: item.id,
              type: item.type,
            })) || [];
          setSearchContent(list);
        },
        err => console.error('Search Error:', err?.message)
      );
    });
  }, [searchText, selectedFilters, currentProfile]);

  // Trigger remote search when search text or filters change
  useEffect(() => {
    searchAction();
  }, [searchAction]);

  // Derived filtered content (memoized)
  const filteredContent = useMemo(() => {
    const isPersonal = selectedFilters.includes('personal');
    const inCol = selectedFilters.includes('collection');
    const inStory = selectedFilters.includes('story');

    // Personal: only use local data
    if (isPersonal) {
      if (inCol && !inStory) {
        return searchList(searchText, personalCols);
      }
      if (inStory && !inCol) {
        return searchList(searchText, personalStories);
      }
      // Both or none specified -> search across both
      return searchList(searchText, [...personalStories, ...personalCols]);
    }

    // Non-personal: start from remote results, filter by type
    const list =
      searchContent?.filter(content => {
        const hasItem = !!content.item;
        const passesTypeFilter =
          selectedFilters.length === 0 ||
          selectedFilters.includes(content.type);
        return hasItem && passesTypeFilter;
      }) ?? [];

    // If there is a search text, also apply local text filtering on that set
    if (searchText.trim()) {
      return searchList(searchText, list);
    }

    return list;
  }, [
    selectedFilters,
    searchText,
    personalCols,
    personalStories,
    searchContent,
    searchList,
  ]);

  const toggleFilters = (genre) => {
    setSelectedFilters(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleOnClick = (searchItem) => {
    console.log("Searchccs",searchItem)
    router.push(`/${searchItem.type}/${searchItem.objectID}/view`);
  };

  return (
    <IonContent
      fullscreen
      scrollY={true}
      className="ion-padding"

      style={{'--padding-top':"12rem", '--background': '#f4f4e0' }}
    >
      <div className='flex flex-row'>
     
      <IonSearchbar
        value={searchText}
        onIonInput={e => setSearchText(e.detail.value ?? '')}
      />
       <h6 className='my-auto text-emerald-700 text-[2rem]'>Pb</h6>
</div>
      <IonGrid>
        <IonRow
          className="ion-justify-content-start gap-x-2 gap-y-2 ion-align-items-center ion-padding-vertical"
          style={{ '--background': '#f4f4e0' }}
        >
          {filters
            .filter(filter => !!filter)
            .map((genre, i) => {
              const selected = selectedFilters.includes(genre);
              return (
                <div
                  key={genre ?? i}
                  className={`
                    cursor-pointer 
                    rounded-full 
                    border 
                    bg-cream
                    border-emerald-500 
                    py-1 px-4 
                    text-center 
                    transition-colors duration-300 
                    ${
                      selected
                        ? 'bg-emerald-500 text-white'
                        : 'bg-transparent text-emerald-600 hover:bg-emerald-200'
                    }
                  `}
                  onClick={() => toggleFilters(genre)}
                >
                  <IonText className="open-sans-medium select-none">
                    {genre}
                  </IonText>
                </div>
              );
            })}
        </IonRow>
      </IonGrid>

      <IonList
        style={{
          overflowY: 'scroll',
          '--background': '#f4f4e0',
        }}
      >
        {filteredContent?.length
          ? filteredContent.map((content, i) => (
              <IonItem
                key={content.objectID ?? i}
                style={{ '--background': '#f4f4e0' }}
                onClick={() => handleOnClick(content)}
              >
                <IonText className="text-emerald-800">
                  {content.item?.title ||
                    content.item?.username ||
                    content.item?.name ||
                    'Untitled'}
                </IonText>
              </IonItem>
            ))
          : null}
      </IonList>
    </IonContent>
  );
};

export default SearchDialog;

// import { useState, useEffect, useLayoutEffect, } from 'react';
// import {
//   IonModal,
//   IonText,
//   IonHeader,
//   IonToolbar,
//   IonList,
//   IonGrid,
//   IonRow,
//   IonItem,
//   IonLabel,
//   useIonRouter,
//   IonTitle,
//   IonSearchbar,
//   IonContent,

// } from '@ionic/react';
// import { useMemo } from 'react';
// import { searchMultipleIndexes } from '../actions/UserActions';
// import { searchDialogToggle } from '../actions/UserActions';
// import { useSelector, useDispatch } from 'react-redux';
// import checkResult from '../core/checkResult';
// import { useCallback } from 'react';
// import { getMyCollections, getPublicCollections } from '../actions/CollectionActions';
// import { getMyStories } from '../actions/StoryActions';
// import { getPublicStories } from '../actions/PageActions';


// const SearchDialog = ({ presentingElement }) => {




//   const currentProfile = useSelector(state => state.users.currentProfile); // needed for "mine"
//   const personalStories = useSelector(state=>state.pages.pagesInView??[]).map(story=>{return{item:{...story},objectID:story.id,type:"story"}})
//   const personalCols = useSelector(state=>state.books.collections??[]).filter(col=>col).map(col=>{return{item:{...col},objectID:col.id,type:"collection"}})
//       const [selectedFilters,setSelectedFilters]=useState([])
//   const dispatch = useDispatch();
// const router = useIonRouter()

//   const [searchText, setSearchText] = useState('');
//     const [searchContent, setSearchContent] = useState([])
//      const [filteredContent, setFilteredContent] = useState()

//   useEffect(()=>{

//     setFilteredContent([...personalCols,...personalStories])
//   },[searchContent])
  
//   useLayoutEffect(()=>{
//     if(currentProfile){
//     dispatch(getMyCollections())
//     dispatch(getMyStories())
//     }else{
//       dispatch(getPublicStories())
//       dispatch(getPublicCollections())
      
//     }

//   },[currentProfile])
//   useLayoutEffect(()=>{
//     searchAction("")
//   },[])
//   const searchList=(searchQ,list)=>{
//    return list.filter(content=>{
//       return content.item && (content.item.title && content.item.title.toLowerCase().includes(searchQ.toLowerCase()))||
//       (content.item.username && content.item.username.toLowerCase().includes(searchQ.toLowerCase()))||
//       (content.item.name && content.item.name.toLowerCase().includes(searchQ.toLowerCase()))
//     })
//   }
//   useEffect(()=>{
//     let isPersonal = selectedFilters.includes("personal")
//     let inCol = selectedFilters.includes("collection")
//   let inStory = selectedFilters.includes("story") 
//     if(!searchContent)return
 
//     if(isPersonal){
//       console.log("PERSONAL SEARCH")
    
//       if(inCol){
//       setFilteredContent(searchList(searchText,[...personalCols]))
//           // setFilteredContent([...personalCols])
//          return
  
//       }
//        if(inStory){
//         setFilteredContent(searchList(searchText,[...personalStories]))

//       return
//        }

//        setFilteredContent(searchList(searchText,[...personalStories,...personalCols]))
//       return
       
//     }

//     let list = searchContent.filter(content=>{
       
//    return content.item && (selectedFilters.length==0 || selectedFilters.includes(content.type))})
  
  
//    setFilteredContent(list)
 
    
//   },[searchContent,selectedFilters,searchText])
  
//   const filters = useMemo(() => {
//     const includeTypes = { cols: "collection", stories: "story", profiles: "profile", hashtags: "hashtag" };
//     const base = [includeTypes.profiles, includeTypes.hashtags, includeTypes.cols, includeTypes.stories];
//     return currentProfile ? ["personal", ...base] : base;
//   }, [currentProfile]);

// const searchAction = useCallback(() => {
//     // PREVENT 400 ERROR: Don't search if text is empty
//     if (!searchText.trim()||selectedFilters.includes("personal")) {
     
//       return;
//     }

//     const payload = {
//       query: searchText,
//       filters: selectedFilters,
//       profileId: currentProfile ? currentProfile.id : null
//     };

//     dispatch(searchMultipleIndexes(payload)).then(result => {
//       checkResult(
//         result,
//         returned => {

//           const { results } = returned;
//         let list = results.map(item=>{return{item,objectID:item.id,type:item.type}})

//           setSearchContent(list);
//         },
//         err => console.error("Search Error:", err.message)
//       );
//     });
//   }, [searchText, selectedFilters, currentProfile, dispatch, personalCols, personalStories]);
//   useEffect(() => {
 
// searchAction()

//   }, [searchText, selectedFilters]);



//     const toggleFilters = (genre) => {
//       // let newSelectedGenres;
//       if (selectedFilters.includes(genre)) {
//         setSelectedFilters(selectedFilters.filter(g => g !== genre))
//       } else {
//         setSelectedFilters([...selectedFilters, genre])
//       }
      
//     };

//   const handleOnClick = (searchItem) => {
// console.log("CLICK ITEM",searchItem)
// router.push(`/${searchItem.type}/${searchItem.objectID}/view`);
//   };

//   return (

// <IonContent fullscreen scrollY={true}className='ion-padding' style={{"--background":"#f4f4e0"}}>
//          <IonSearchbar
         
//          onIonInput={(e) =>setSearchText(e.target.value ?? '')}/>

        
//                         <IonGrid>
//                           <IonRow className="ion-justify-content-start gap-x-2 gap-y-2 ion-align-items-center ion-padding-vertical" style={{ "--background":"#f4f4e0" }}>
                        
//       {filters.filter(filter=>filter).map((genre, i) => {
//                   // const selected = selectedGenres.includes(genre);
//                      const selected = selectedFilters.includes(genre);
//                   return (
//                     <div
//                       key={i}
//                       className={`
//                         cursor-pointer 
//                         rounded-full 
//                         border 
//                         bg-cream
//                         border-emerald-500 
//                         py-1 px-4 

//                         text-center 
//                         transition-colors duration-300 
//                         ${selected ? 'bg-emerald-500 text-white' : 'bg-transparent text-emerald-600 hover:bg-emerald-200'}
//                       `}
                      
//                       onClick={() => toggleFilters(genre)}
//                     >
//                       <IonText className="open-sans-medium select-none">{genre}</IonText>
//                     </div>
//                   );
//                 })}

//                 </IonRow>
//                 </IonGrid>
//     {/* </IonToolbar> */}
    

//       <IonList style={{ overflowY: "scroll","--background":"#f4f4e0",}}>

//         {(filteredContent && filteredContent.length) ? filteredContent.map((content, i) => {


//             return(<IonItem
//               key={i}
//               style={{"--background":"#f4f4e0" }}
               
//               onClick={() => handleOnClick(content)}
//             >
//               <IonText className="text-emerald-800">
//                 {content.item.title || content.item.username || content.item.name || "Untitled"}
//               </IonText>
//             </IonItem>)}):null}

//       </IonList>
// </IonContent>

//   );
// };

// export default SearchDialog;
