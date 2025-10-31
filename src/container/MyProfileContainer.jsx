import { useEffect, useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/MyProfile.css";
import { useDispatch, useSelector } from "react-redux";
import { createStory, updateStory, getMyStories } from '../actions/StoryActions';
import { getMyCollections} from '../actions/CollectionActions';
import IndexList from '../components/page/IndexList';
import Paths from '../core/paths';
import { debounce } from 'lodash';
import { setPageInView, setPagesInView, setEditingPage } from '../actions/PageActions.jsx';
import { sendGAEvent } from '../core/ga4.js';
import CreateCollectionForm from '../components/collection/CreateCollectionForm';
import checkResult from '../core/checkResult';
import { PageType } from '../core/constants';
import ProfileInfo from '../components/profile/ProfileInfo';
import Context from '../context';
import FeedbackDialog from '../components/page/FeedbackDialog';
import ErrorBoundary from '../ErrorBoundary.jsx';
import { IonText, IonInput, IonContent, IonSpinner, IonPage } from '@ionic/react';
import GoogleDrivePicker from '../components/GoogleDrivePicker.jsx';
import { setDialog } from '../actions/UserActions.jsx';
import { Preferences } from '@capacitor/preferences';
import axios from "axios";

function ButtonWrapper({ onClick, children, className = "", style = {}, tabIndex = 0, role = "button" }) {
  return (
    <div
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`cursor-pointer select-none rounded-full flex items-center justify-center ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function MyProfileContainer({ presentingElement }) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentProfile = useSelector(state=>state.users.currentProfile)
  const stories = useSelector(state => state.pages.pagesInView);
  const dialog = useSelector(state => state.users.dialog);
  const { seo, setSeo } = useContext(Context);
  const collections = useSelector(state => state.books.collections);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Filter");
  const [driveToken, setDriveToken] = useState(null);
  const [description, setFeedback] = useState("");
  const [errorLocal, setErrorLocal] = useState(null);
  const [feedbackPage, setFeedbackPage] = useState(null);

  const filterTypes = {
    filter: "Filter",
    recent: "Recent",
    oldest: "Oldest",
    feedback: "Feedback",
    AZ: "A-Z",
    ZA: "Z-A"
  };

  const filteredSortedStories = useMemo(() => {
    let result = stories || [];

    if (filterType === filterTypes.feedback) {
      result = result.filter(s => s.needsFeedback);
    } else {
      switch (filterType) {
        case filterTypes.recent:
          result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case filterTypes.oldest:
          result = [...result].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case filterTypes.AZ:
          result = [...result].sort((a, b) => a.title.localeCompare(b.title));
          break;
        case filterTypes.ZA:
          result = [...result].sort((a, b) => b.title.localeCompare(a.title));
          break;
        default:
          break;
      }
    }

    if (search.trim().length > 0) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(s => s.title && s.title.toLowerCase().includes(lowerSearch));
    }

    return result;
  }, [stories, filterType, search]);

  const filteredSortedCollections = useMemo(() => {
    let result = collections || [];

    switch (filterType) {
      case filterTypes.AZ:
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case filterTypes.ZA:
        result = [...result].sort((a, b) => b.title.localeCompare(a.title));
        break;
      case filterTypes.recent:
        result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case filterTypes.oldest:
        result = [...result].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        break;
    }

    if (search.trim().length > 0) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(c => c && c.title && c.title.toLowerCase().includes(lowerSearch));
    }

    return result;
  }, [collections, filterType, search]);

  const getItems = async () => {
    try {
      const token = (await Preferences.get({ key: "token" })).value;
      if (!token) throw new Error("No auth token found");
      await Promise.all([
        dispatch(getMyCollections({ token })),
        dispatch(getMyStories({ token }))
      ]);
    } catch (error) {
      console.error("Error fetching items:", error);
      setErrorLocal(error.message);
    }
  };

  const getDriveToken = async () => {
    try {
      const accessToken = (await Preferences.get({ key: "googledrivetoken" })).value;
      setDriveToken(accessToken);
    } catch (error) {
      console.error("Error fetching drive token:", error);
      setErrorLocal(error.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        // if (isNative) Capacitor.isPluginAvailable('Preferences');
        await getItems();
        await getDriveToken();
      } catch (err) {
        console.error("Initialization error:", err);
        setErrorLocal(err.message);
      }
    };
    init();
  }, []);

  const ClickWriteAStory = debounce(() => {
    if (currentProfile?.id) {
      sendGAEvent("Create", "Write a Story", "Click Write Story");
      dispatch(createStory({
        profileId: currentProfile.id,
        privacy: true,
        type: PageType.text,
        title: "",
        commentable: true
      })).then(res => checkResult(res, payload => {
        if (payload.story) {
          dispatch(setEditingPage({ page: payload.story }));
          dispatch(setPageInView({ page: payload.story }));
          navigate(Paths.editPage.createRoute(payload.story.id));
        }
      }));
    }
  }, 5);

  const ClickCreateACollection = () => {
    sendGAEvent("Create", "Create Collection", "Create A Collection");
    // setOpenDialog(true);
    const newDialog = {
      ...dialog,
      isOpen: true,
      onClose: () => dispatch(setDialog({...dialog,isOpen:false})),
      text: <CreateCollectionForm onClose={() => dispatch(setDialog({...dialog,isOpen:false}))} />,
      title: "Create Collection"
    };
    dispatch(setDialog(newDialog));
  };

  const getFile = async (file) => {
    try {
      const accessToken = (await Preferences.get({ key: "googledrivetoken" })).value;
      if (!file?.id || !accessToken) return;

      const url = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/html`;
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        responseType: 'text'
      });

      const htmlContent = response.data;
      dispatch(createStory({
        profileId: currentProfile.id,
        data: htmlContent,
        isPrivate: true,
        approvalScore: 0,
        type: PageType.text,
        title: file.name,
        commentable: false
      })).then(res => checkResult(res, ({ story }) => {
        if (story) navigate(Paths.editPage.createRoute(story.id));
        dispatch(setEditingPage({ page: story }));
        dispatch(setDialog({ isOpen: false }));
      }, err => setErrorLocal(err.message)));
    } catch (error) {
      console.error("Error fetching Google Doc:", error);
      setErrorLocal(error.message);
    }
  };

  useEffect(() => {
    let seSeo = () => {
      if (currentProfile) {
        setSeo(prev => ({ ...prev, title: `Plumbum (${currentProfile.username}) Home` }));
        dispatch(setPagesInView({ pages: currentProfile.stories }));
      }
    };
    return seSeo()
  }, [currentProfile]);
  if (!currentProfile) {
    return (
      <IonContent>
        <IonSpinner />
      </IonContent>
    );
  }

  return (
    <IonPage>
   <ErrorBoundary>

      <IonContent className="ion-padding" fullscreen >
        <div className="sm:pt-16 "style={{ paddingBottom: "5rem" }}>
          {/* Top Section */}
          <div className='flex flex-col md:flex-row justify-between sm:border-4 sm:border-emerald-300 p-4 mt-2 rounded-lg gap-4'>
            <div className='my-4 py-4 h-[16em] md:w-1/3'>
              <ProfileInfo profile={currentProfile} />
            </div>

            <div className='md:w-2/3 flex flex-col gap-4'>
              <div className='flex flex-row gap-4 justify-center md:justify-start'>
                <ButtonWrapper onClick={ClickWriteAStory} className='bg-emerald-600 text-white rounded-full h-[3rem] w-[10rem]'>
                  <IonText>Write a Story</IonText>
                </ButtonWrapper>
                <ButtonWrapper onClick={ClickCreateACollection} className='bg-emerald-700 text-white rounded-full  h-[3rem] w-[10rem]'>
                  <IonText>Create Collection</IonText>
                </ButtonWrapper>
              </div>

              <div className='flex flex-col gap-4 items-center'>
                <ButtonWrapper onClick={() => navigate(Paths.workshop.reader())}
                  className='border-2 border-emerald-600 mx-4 rounded-full text-emerald-900 h-[3rem] w-[90vw] sm:w-[21rem]'>
                  <IonText>Join a Workshop</IonText>
                </ButtonWrapper>
                <GoogleDrivePicker getToken={getDriveToken} accessToken={driveToken} onFilePicked={getFile} />
              </div>
            </div>
          </div>

          {/* Search + Tabs */}
          <div className='mx-auto md:mt-8 flex flex-col md:w-page'>
            {/* {isPhone ? ( */}
              <div className="flex items-center mb-8 mx-auto h-9 max-w-[85vw] pr-4 rounded-full bg-transparent">
                <IonInput value={search} label="Search" labelPlacement="floating" placeholder="Search..."
                  onIonChange={e => setSearch(e.detail.value ?? '')}
                  className="text-emerald-800 flex-grow" />
                <select onChange={e => setFilterType(e.target.value)} value={filterType}
                  className="select w-24 text-emerald-800 rounded-full bg-transparent">
                  {Object.entries(filterTypes).map(([, val]) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
            {/* ) : ( */}
              {/* <label className="flex items-center border-2 border-emerald-600 rounded-full px-3 py-1 w-[20rem]">
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  className="bg-transparent rounded-full text-lg text-emerald-800 outline-none"
                  placeholder="Search..." />
              </label>
            )} */}

            <div role="tablist" className="tabs mx-auto w-full">
              <input type="radio" name="my_tabs" role="tab" defaultChecked className="tab text-emerald-800" aria-label="Pages" />
              <div role="tabpanel" className="tab-content w-[96vw] sm:w-[50em] pt-4">
                <IndexList type="story" items={filteredSortedStories} handleFeedback={item => {
                  setFeedbackPage(item);
                  dispatch(setPageInView({ page: item }));
        
                }} />
              </div>

              <input type="radio" name="my_tabs" role="tab" className="tab text-emerald-800" aria-label="Collections" />
              <div role="tabpanel" className="tab-content w-[96vw] sm:w-[50em] pt-4">
                <IndexList type="collection" items={filteredSortedCollections} />
              </div>
            </div>
          </div>

          <FeedbackDialog
            presentingElement={presentingElement}
            page={feedbackPage}
            open={!!feedbackPage}
            isFeedback
            handleChange={setFeedback}
            handleFeedback={() => {
              
              if (!feedbackPage) return;
              const params = { ...feedbackPage, description, page:feedbackPage,id:feedbackPage.id,needsFeedback: true };
            
              dispatch(updateStory(params)).then(res => {
                checkResult(res, payload => {
                  console.log("Submitting feedback for page:", feedbackPage);
                  if (payload.story) navigate(Paths.workshop.createRoute(payload.story.id));
                });
              });
            }}
            handlePostPublic={() => {}}
            handleClose={() => setFeedbackPage(null)}
          />
        </div>
      </IonContent>
    </ErrorBoundary>
    </IonPage>
  );
}

export default MyProfileContainer;
