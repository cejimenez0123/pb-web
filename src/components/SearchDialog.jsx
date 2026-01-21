import { useState, useEffect, } from 'react';
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
import { useMemo } from 'react';
import { searchMultipleIndexes } from '../actions/UserActions';
import { searchDialogToggle } from '../actions/UserActions';
import { useSelector, useDispatch } from 'react-redux';
import checkResult from '../core/checkResult';
import { useCallback } from 'react';
import { getMyCollections, getPublicCollections } from '../actions/CollectionActions';
import { getMyStories } from '../actions/StoryActions';
import { getPublicStories } from '../actions/PageActions';


const SearchDialog = ({ presentingElement }) => {


  const searchDialogOpen = useSelector(state => state.users.searchDialogOpen??false);

  const currentProfile = useSelector(state => state.users.currentProfile); // needed for "mine"

  const dispatch = useDispatch();
const router = useIonRouter()

  const [searchText, setSearchText] = useState('');
  const personalStories = useSelector(state=>state.pages.pagesInView??[])
  const personalCols = useSelector(state=>state.books.colelctions??[])
  const [searchContent, setSearchContent] = useState([...personalCols,...personalStories]);
  
 
  const [selectedFilters,setSelectedFilters]=useState([])
  useEffect(()=>{
    if(currentProfile){
    dispatch(getMyCollections())
    dispatch(getMyStories())
    }else{
      dispatch(getPublicStories())
      dispatch(getPublicCollections())
      
    }

  },[currentProfile])
  useEffect(()=>{
  let list = [...personalCols,...personalStories].map(item=>{return{title:item.title,objectID:item.id,type:item.colList?"collection":"story"}})
    setSearchContent([...list]);


},[])
  

  const filters = useMemo(() => {
    const includeTypes = { cols: "collections", stories: "stories", profiles: "profiles", hashtags: "hashtags" };
    const base = [includeTypes.profiles, includeTypes.hashtags, includeTypes.cols, includeTypes.stories];
    return currentProfile ? ["personal", ...base] : base;
  }, [currentProfile]);
const searchAction = useCallback(() => {
    // PREVENT 400 ERROR: Don't search if text is empty
    if (!searchText.trim()) {
      setSearchContent([...personalCols, ...personalStories]);
      return;
    }

    const payload = {
      query: searchText,
      filters: selectedFilters,
      profileId: currentProfile ? currentProfile.id : null
    };

    dispatch(searchMultipleIndexes(payload)).then(result => {
      checkResult(
        result,
        returned => {

          const { results } = returned;
          console.log("Search Results:", results);
          setSearchContent(results);
        },
        err => console.error("Search Error:", err.message)
      );
    });
  }, [searchText, selectedFilters, currentProfile, dispatch, personalCols, personalStories]);
  useEffect(() => {
 
searchAction()

  }, [searchText, selectedFilters]);



    const toggleFilters = (genre) => {
      // let newSelectedGenres;
      if (selectedFilters.includes(genre)) {
        setSelectedFilters(selectedFilters.filter(g => g !== genre))
      } else {
        setSelectedFilters([...selectedFilters, genre])
      }
      // updateFormData({ selectedGenres: newSelectedGenres });
    };
  const handleOnClick = (searchItem) => {
    dispatch(searchDialogToggle({ open: false }));
router.push(`/${searchItem.type}/${searchItem.objectID}/view`);
  };

  return (
//     <IonModal
     
//  isOpen={searchDialogOpen}
//   onDidDismiss={() => dispatch(searchDialogToggle({ open: false }))} presentingElement={presentingElement} canDismiss={true} swipeToClose={true} mode="ios"


//   breakpoints={[0, 1]} // This enables the drag-to-close behavior effectively
//   initialBreakpoint={1}
 
//     // mode='ios'

//     // ref={presentingElement}
//       // isOpen={searchDialogOpen}
//       title="Search"
//       handle={true}
      // onDidDismiss={() => dispatch(searchDialogToggle({ open: false }))}
      // cssClass="modal-fullscreen ion-padding"
      // presentingElement={presentingElement}
      // style={{ backgroundColor: "white", height: "100vh", overflowY: "scroll" }}
      // swipeToClose={true}
    // >
<IonContent fullscreen scrollY={true}className='ion-padding' style={{"--background":"#f4f4e0"}}>
         <IonSearchbar
         
         onIonInput={(e) =>setSearchText(e.target.value ?? '')}/>

        
                        <IonGrid>
                          <IonRow className="ion-justify-content-start gap-x-2 gap-y-2 ion-align-items-center ion-padding-vertical" style={{ "--background":"#f4f4e0" }}>
                        
      {filters.filter(filter=>filter).map((genre, i) => {
                  // const selected = selectedGenres.includes(genre);
                     const selected = selectedFilters.includes(genre);
                  return (
                    <div
                      key={i}
                      className={`
                        cursor-pointer 
                        rounded-full 
                        border 
                        bg-cream
                        border-emerald-500 
                        py-1 px-4 

                        text-center 
                        transition-colors duration-300 
                        ${selected ? 'bg-emerald-500 text-white' : 'bg-transparent text-emerald-600 hover:bg-emerald-200'}
                      `}
                      
                      onClick={() => toggleFilters(genre)}
                    >
                      <IonText className="open-sans-medium select-none">{genre}</IonText>
                    </div>
                  );
                })}

                </IonRow>
                </IonGrid>
    {/* </IonToolbar> */}
    

      <IonList style={{ overflowY: "scroll","--background":"#f4f4e0",}}>
        {searchContent.length > 0 ? (
          searchContent.map((content, i) => (
            <IonItem
              key={i}
              style={{"--background":"#f4f4e0" }}
               
              onClick={() => handleOnClick(content)}
            >
              <IonText className="text-emerald-800">
                {content.title || content.username || content.name || "Untitled"}
              </IonText>
            </IonItem>
          ))
        ) : (
          <IonItem style={{"--background":"#f4f4e0" }}>
            <IonLabel className="text-emerald-600">No results found</IonLabel>
          </IonItem>
        )}
      </IonList>
</IonContent>
    // </IonModal>
  );
};

export default SearchDialog;
