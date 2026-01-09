import { useEffect, useState, useContext, useMemo, useLayoutEffect } from 'react';
import "../styles/MyProfile.css";
import { useDispatch, useSelector } from "react-redux";
import { createStory, updateStory,  } from '../actions/StoryActions';
import { setCollections} from '../actions/CollectionActions';
import IndexList from '../components/page/IndexList';
import Paths from '../core/paths';
import { debounce } from 'lodash';
import calendar from '../images/icons/calendar.svg'
import settings from "../images/icons/settings.svg"
import { setPageInView, setPagesInView, setEditingPage } from '../actions/PageActions.jsx';
import { sendGAEvent } from '../core/ga4.js';
import CreateCollectionForm from '../components/collection/CreateCollectionForm';
import checkResult from '../core/checkResult';
import { PageType } from '../core/constants';
import ProfileInfo from '../components/profile/ProfileInfo';
import Context from '../context';
import FeedbackDialog from '../components/page/FeedbackDialog';
import { IonText, IonInput, IonContent, IonSpinner, IonPage,  useIonViewWillEnter, IonImg, useIonRouter } from '@ionic/react';
import GoogleDrivePicker from '../components/GoogleDrivePicker.jsx';
import { setDialog } from '../actions/UserActions.jsx';
import { Preferences } from '@capacitor/preferences';
import axios from "axios";
import StoryCollectionTabs from '../components/page/StoryCollectionTabs.jsx';
import ErrorBoundary from '../ErrorBoundary.jsx';



function ButtonWrapper({ onClick, children, className = "", style = {}, tabIndex = 0, role = "button" }) {
  return (
    <span
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`rounded-full flex btn items-center justify-center ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}

function MyProfileContainer({ presentingElement }) {
  const [tab, setTab] = useState("page");
  const router = useIonRouter()
  const dispatch = useDispatch();
  const currentProfile = useSelector(state=>state.users.currentProfile)
  const stories = useSelector(state => state.pages.pagesInView);
  const dialog = useSelector(state => state.users.dialog);
  const { seo, setSeo ,setError} = useContext(Context);
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
          result = [...result].sort((a, b) => new Date(b.updated) - new Date(a.updated));
          break;
        case filterTypes.oldest:
          result = [...result].sort((a, b) => new Date(a.updated) - new Date(b.updated));
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
    if(filterType==filterTypes.feedback){
      result = collections.filter(col=>col.type=="feedback"||col.purpose.toLowerCase().includes("feedback"))
    }
    switch (filterType) {
      case filterTypes.AZ:
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case filterTypes.ZA:
        result = [...result].sort((a, b) => b.title.localeCompare(a.title));
        break;
      case filterTypes.recent:
        result = [...result].sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      case filterTypes.oldest:
        result = [...result].sort((a, b) => new Date(a.updated) - new Date(b.updated));
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

// Add this effect to MyProfileContainer
useEffect(() => {
  const syncProfile = async () => {
    if (!currentProfile) {
      const { value } = await Preferences.get({ key: "token" });
      if (value) {
        // This will fill the 'currentProfile' in Redux
        dispatch(getCurrentProfile());
      } else {
        // No token and no profile? Send them home/login
        router.push("/");
      }
    }
  };
  syncProfile();
}, [currentProfile, dispatch, router]);

  const getDriveToken = async () => {
    try {
      const accessToken = (await Preferences.get({ key: "googledrivetoken" })).value;
      setDriveToken(accessToken);
    } catch (error) {
      console.error("Error fetching drive token:", error);
      setErrorLocal(error.message);
    }
  };
  
    useIonViewWillEnter(() => {
  const init = async () => {
    try {
     
      await getDriveToken();
    } catch (err) {
      console.error("Initialization error:", err);
      setErrorLocal(err.message);
    }
  };
  init();

  },[router])

  const ClickWriteAStory = debounce(() => {
    if (currentProfile?.id) {
      sendGAEvent("Create", "Write a Story", "Click Write Story");
      dispatch(createStory({
        profileId: currentProfile.id,
        privacy: true,
        type: PageType.text,
        title: "Unititled",
        commentable: true
      })).then(res => checkResult(res, payload => {
        if (payload.story) {
          dispatch(setEditingPage({ page: payload.story }));
          dispatch(setPageInView({ page: payload.story }));
        router.push  (Paths.editPage.createRoute(payload.story.id));
        }else{
          windowl.alert("COULD NOT CREATE STORY")
        }
      },err=>{
        setErrorLocal(err.message)
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
        if (story) router.push(Paths.editPage.createRoute(story.id));
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
     
      }
    };
    return seSeo()
  }, [])
  
  useEffect(()=>{
  
  
    if(currentProfile){
      console.log("FDDF",currentProfile.stories)
        currentProfile.stories&& dispatch(setPagesInView({ pages: currentProfile.stories }))
      currentProfile.collections  &&  dispatch(setCollections({collections:currentProfile.collections}))
    }else{
      dispatch(setPagesInView({ pages: []}))
      dispatch(setCollections({collections:[]}))
    }
      }
       ,[currentProfile,router])
  if (!currentProfile) {
    return (
        <div>
        <IonSpinner />
        </div>
        
    );
  }
return<IonContent fullscreen={true} className='pt-12'><ErrorBoundary>

                    <div className='flex  md:pt-12 mt-12   px-12 flex-row justify-between'>
                         <IonImg  onClick={()=> router.push(Paths.editProfile)} className="bg-soft mr-4 max-w-10 max-h-10 rounded-full p-2 " src={settings}/> 
     
                           <div>
      <img src={calendar}    style={{
        
    filter:
      "invert(35%) sepia(86%) saturate(451%) hue-rotate(118deg) brightness(85%) contrast(92%)",
  }}
onClick={()=>{router.push(Paths.calendar())}}
          className={` in-w-18 max-h-20 max-w-20 min-h-18  sm:right-12   `+
          `md::min-w-20 md:max-h-20 md:max-w-20 md:min-h-20 `}/>
          
                    </div>
                  
                    </div>
  <div >

  <div className="relative flex flex-col md:flex-row justify-around mx-auto sm:border-4 sm:border-emerald-300 p-6 mt-2 max-w-[60rem] rounded-lg gap-6">

    <div className="md:w-1/3 max-w-[60em] h-[16em] mb-6 flex justify-center md:justify-start">
      <ProfileInfo profile={currentProfile} />
    </div>
    

    {/* Right: Buttons */}
    <div className="flex flex-col items-center justify-cetner h-[15em] bottom-0  mt-4 sbg-red-100 md:items-start gap-4 w-full md:w-2/3  ">

      {/* Row 1: Write a Story + Create Collection */}
      <div className="flex flex-row mx-auto flex-wrap sm:justify-center md:justify-start gap-4">
        <ButtonWrapper
          onClick={ClickWriteAStory}
          className="bg-soft hover:bg-emerald-500 text-white rounded-xl h-[3rem] w-[8.5rem]"
        >
          <IonText className='text-[1.2em]'>Write a Story</IonText>
        </ButtonWrapper>
        <ButtonWrapper
          onClick={ClickCreateACollection}
          className="bg-emerald-800 hover:bg-emerald-500 text-white rounded-xl h-[3rem] w-[8.5rem]"
        >
          <IonText className="text-white text-[1.2em]">Create Collection</IonText>
        </ButtonWrapper>
      </div>

      {/* Row 2: Join a Workshop */}
      <div className="flex justify-center md:justify-start w-full">
        <ButtonWrapper
          onClick={() => router.push(Paths.workshop.reader())}
          className="font-bold mx-auto bg-sky-600 hover:bg-sky-400  mx-4 rounded-xl h-[3rem] w-[90vw] sm:w-[21rem]"
        >
          <IonText className="text-white text-[1.2em]">Join a Workshop</IonText>
        </ButtonWrapper>
      </div>

      {/* Row 3: Google Drive Picker */}
      {/* <div className="flex justify-center mx-auto md:justify-start w-full"> */}
        <GoogleDrivePicker
          getToken={getDriveToken}
          accessToken={driveToken}
          onFilePicked={getFile}
        />
      {/* </div> */}

    </div>
  </div>

  {/* Search + Tabs stay unchanged */}
  <div className='mx-auto md:mt-8 flex flex-col md:w-page'>
    <div className="flex items-center mb-8 mx-auto h-9 max-w-[85vw] pr-4 rounded-full bg-transparent">

      <select
        onChange={e => setFilterType(e.target.value)}
        value={filterType}
        className="select w-24 text-emerald-800 rounded-full bg-transparent"
      >
        {Object.entries(filterTypes).map(([, val]) => (
          <option key={val} value={val}>{val}</option>
        ))}
      </select>
    </div>

    <div className='h-fit min-h-[55rem] mx-auto overflow-auto'>
      <StoryCollectionTabs
        tab={tab}
        setTab={setTab}
        colList={() => <IndexList type="collection" 
        items={filteredSortedCollections} 
        
        />}
        storyList={() => (
          <IndexList
            type="story"
            items={filteredSortedStories}
            handleFeedback={item => {
              setFeedbackPage(item);
              dispatch(setPageInView({ page: item }));
            }}
          />
        )}
      />
    </div>

    <FeedbackDialog
      presentingElement={presentingElement}
      page={feedbackPage}
      open={!!feedbackPage}
      isFeedback
      handleChange={setFeedback}
      handleFeedback={() => {
        if (!feedbackPage) return;
        const params = { ...feedbackPage, description, page: feedbackPage, id: feedbackPage.id, needsFeedback: true };
        dispatch(updateStory(params)).then(res => {
          checkResult(res, payload => {
            if (payload.story) navigate(Paths.workshop.createRoute(payload.story.id));
          });
        });
      }}
      handlePostPublic={() => {}}
      handleClose={() => setFeedbackPage(null)}
    />
  </div>
</div>
</ErrorBoundary></IonContent>
}

export default MyProfileContainer;
