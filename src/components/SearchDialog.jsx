import { useState, useEffect, useRef, useContext } from 'react';
import {
  IonModal,
  IonText,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonList,
  IonGrid,
  IonRow,
  IonItem,
  IonLabel,
  IonBackButton,

} from '@ionic/react';
import { searchMultipleIndexes } from '../actions/UserActions';
import { searchDialogToggle } from '../actions/UserActions';
import { useSelector, useDispatch } from 'react-redux';
import checkResult from '../core/checkResult';
import { useNavigate } from 'react-router-dom';
import Context from '../context';

const SearchDialog = ({ presentingElement }) => {
  const modal = useRef(null);
  const { setError } = useContext(Context);

  const searchDialogOpen = useSelector(state => state.users.searchDialogOpen);

  const currentProfile = useSelector(state => state.users.currentProfile); // needed for "mine"

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const personalStories = useSelector(state=>state.pages.pagesInView??[])
  const personalCols = useSelector(state=>state.books.colelctions??[])
  const [searchContent, setSearchContent] = useState([...personalCols,...personalStories]);
  const includeTypes={cols:"collections",stories:"stories",profiles:"profiles",hashtags:"hashtags"}
  // const [includeType, setIncludeType] = useState(includeTypes.all); 
  const sourceFilters = {personal:"personal"}
  // const [sourceFilter, setSourceFilter] = useState(sourceFilters.all);
  const filters = [sourceFilters.personal,includeTypes.profiles,includeTypes.hashtags,includeTypes.cols,includeTypes.stories]
  const [selectedFilters,setSelectedFilters]=useState([])
  useEffect(() => {
    if (searchText.trim().length === 0) {
      setSearchContent([]);
      return;
    }

    const payload = {
      query: searchText,
      filters: selectedFilters,
      profileId:currentProfile?currentProfile.id:null
    

    };

    // ➜ PLACEHOLDER LAYER FOR SPECIAL PRIVATE ENDPOINTS
    // ---------------------------------------------------
    // if (sourceFilter === "mine") {
    //   if (includeType === "stories") {
    //     dispatch(fetchUserStories(payload));
    //     return;
    //   }
    //   if (includeType === "collections") {
    //     dispatch(fetchUserCollections(payload));
    //     return;
    //   }
    //   if (includeType === "both") {
    //     dispatch(fetchUserStoriesAndCollections(payload));
    //     return;
    //   }
    // }
    // ---------------------------------------------------

    dispatch(searchMultipleIndexes(payload)).then(result => {
      checkResult(
        result,
        returned => {
        
          const { results } = returned;
          setSearchContent(results);
        },
        err => setError(err.message)
      );
    });
  }, [searchText, selectedFilters, dispatch]);
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
    navigate(`/${searchItem.type}/${searchItem.objectID}`);
  };

  return (
    <IonModal
      isOpen={searchDialogOpen}
      title="Search"
      onDidDismiss={() => dispatch(searchDialogToggle({ open: false }))}
      cssClass="modal-fullscreen ion-padding"
      presentingElement={presentingElement}
      style={{ backgroundColor: "white", height: "100vh", overflowY: "scroll" }}
      swipeToClose={true}
    >

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton onClick={() => dispatch(searchDialogToggle({ open:false }))}/>
          </IonButtons>
        </IonToolbar>
</IonHeader>
        {/* INPUT */}
        {/* <IonToolbar> */}
        
          <input
            className="bg-transparent w-[100%] my-3 px-2 h-[2rem] border-emerald-400 rounded-full border-1"
            value={searchText}
            onChange={e => setSearchText(e.target.value ?? '')}
            debounce={300}
            placeholder="Search..."/>
                        <IonGrid>
                          <IonRow className="ion-justify-content-start ion-align-items-center ion-padding-vertical" style={{ gap: '0.5rem' }}>
                        
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
    

      <IonList style={{ overflowY: "scroll" }}>
        {searchContent.length > 0 ? (
          searchContent.map((content, i) => (
            <IonItem
              key={i}
              className="bg-transparent my-2 pb-2 border-emerald-300 border-b border-1"
              onClick={() => handleOnClick(content)}
            >
              <IonText className="text-emerald-800">
                {content.title || content.username || content.name || "Untitled"}
              </IonText>
            </IonItem>
          ))
        ) : (
          <IonItem>
            <IonLabel className="text-emerald-600">No results found</IonLabel>
          </IonItem>
        )}
      </IonList>

    </IonModal>
  );
};

export default SearchDialog;
