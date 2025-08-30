import React, { useLayoutEffect, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/MyProfile.css";
import { useDispatch, useSelector } from "react-redux";
import { createStory, updateStory ,getMyStories} from '../actions/StoryActions';
import { getMyCollections, setCollections } from '../actions/CollectionActions';
import { useMemo } from 'react';
import IndexList from '../components/page/IndexList';
import authRepo from '../data/authRepo.js';
import Paths from '../core/paths';
import { debounce } from 'lodash';
import { setPageInView, setPagesInView, setEditingPage } from '../actions/PageActions.jsx';
import {  sendGAEvent } from '../core/ga4.js';
import CreateCollectionForm from '../components/collection/CreateCollectionForm';
import checkResult from '../core/checkResult';
import { PageType } from '../core/constants';
import ProfileInfo from '../components/profile/ProfileInfo';
import Context from '../context';
import FeedbackDialog from '../components/page/FeedbackDialog';
import ErrorBoundary from '../ErrorBoundary.jsx';
import copyContent from "../images/icons/content_copy.svg";
import DeviceCheck from '../components/DeviceCheck.jsx';
import { IonPage, IonText, IonIcon, IonInput,IonContent } from '@ionic/react';
import GoogleDrivePicker from '../components/GoogleDrivePicker.jsx';
import { setDialog } from '../actions/UserActions.jsx';
import { Preferences } from '@capacitor/preferences';
import axios from "axios"
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

function MyProfileContainer({currentProfile,presentingElement}) {

  const isNative = DeviceCheck();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stories = useSelector(state => state.pages.pagesInView)
  const dialog = useSelector(state=>state.users.dialog)
  const {  seo, setSeo, isPhone, isNotPhone } = useContext(Context);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Filter");
  const [driveToken,setDriveToken]=useState(null)
  const [description, setFeedback] = useState("")
  const [openDialog, setOpenDialog] = useState(false);
  const collections = useSelector(state => state.books.collections)
  // const [ogStories, setOgStories] = useState();
  // const [ogCols, setOgCols] = useState([]);
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
    let result = stories;
  
    // Apply feedback filter first if selected
    if (filterType === filterTypes.feedback) {
      result = result.filter(s => s.needsFeedback); // adjust condition to your logic
    }else{
  
    // Apply sorts for other filterTypes
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
    
      // filter type and default: show unsorted
      default:
        break;
    }}
  
    // Apply search on top of filtering/sorting
    if (search.trim().length > 0) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(s => s.title && s.title.toLowerCase().includes(lowerSearch));
    }
    
    return result;
  }, [stories, filterType, search]);
  
  const filteredSortedCollections = useMemo(() => {
    let result = collections;

  
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
      // other sorts as needed
      default:
        break;
    }
  
    if (search.trim().length > 0) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(c => c.title && c.title.toLowerCase().includes(lowerSearch));
    }
    return result;
  }, [collections, filterType, search]);
  
  useLayoutEffect(()=>{
   const getItems=async ()=> {
      let value = await Preferences.get({key:"token"})
       let token = value.value
       dispatch(getMyCollections({token}))
       dispatch(getMyStories({token}))
    } 
getItems()
 

    
  },[])
 

  useEffect(()=>{
 getDriveToken()
},[currentProfile])
  const getDriveToken=async ()=>{
    const driveTokenKey = "googledrivetoken";
    const accessToken = (await Preferences.get({key:driveTokenKey})).value
  
     setDriveToken(accessToken)
   }
  
  const handleSortTime = (sortedRecentFirst) => {
    const sorted = [...collections].sort((a, b) =>
      sortedRecentFirst ? new Date(b.updated) - new Date(a.updated) : new Date(a.updated) - new Date(b.updated)
    );
    dispatch(setCollections({ collections: sorted }));
    const storiesSorted = [...stories].sort((a, b) =>
      sortedRecentFirst ? new Date(b.updated) - new Date(a.updated) : new Date(a.updated) - new Date(b.updated)
    );
    dispatch(setPagesInView({pages:storiesSorted}));
  };

  const handleSortFeedback = () => {
    const filtered = collections.filter(col => col.type === "feedback");
    dispatch(setCollections({ collections: filtered }));
  };

  const handleFeedback = () => {
    const params = { ...feedbackPage, description, needsFeedback: true, page: feedbackPage };
    dispatch(updateStory(params)).then(res => {
      checkResult(res, payload => {
        if (payload.story) navigate(Paths.workshop.createRoute(payload.story.id));
      });
    });
  };

  const ClickWriteAStory = debounce(() => {
    if (currentProfile) {
      sendGAEvent("Create", "Write a Story", "Click Write Story");
      dispatch(createStory({
        profileId: currentProfile.id,
        privacy: true,
        type: PageType.text,
        title: "",
        commentable: true
      })).then(res => checkResult(res, payload => {
        dispatch(setEditingPage({ page: payload.story }));
        dispatch(setPageInView({ page: payload.story }));
        navigate(Paths.editPage.createRoute(payload.story.id));
      }));
    }
  }, 5);

  const ClickCreateACollection = () => {
    sendGAEvent("Create", "Create Collection", "Create A Collection");
    setOpenDialog(true);
       let dia = {...dialog}
      dia.isOpen = openDialog
     dia.onClose = () => setOpenDialog(false)
    dia.text=<CreateCollectionForm onClose={() => setOpenDialog(false)} />
    dia.title = "Create Collection"
    setDialog(dia)
  };

  const generateReferral = () => {
    authRepo.generateReferral().then(data => {
      if (data.referralLink) setReferralLink(data.referralLink);
      if (data.referral) setReferral(data.referral);
    });
  };
 
async function getFile(file){

      
try{
  console.log("FDd",file)
    const driveTokenKey = "googledrivetoken";
    const accessToken = (await Preferences.get({key:driveTokenKey})).value
        // if(window && window.gapi && window.gapi.client && window.gapi.client.files){
          const url = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/html`;

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      responseType: 'text', // Get the response as plain text
    });

 
          // await window.gapi.client.init({
          //   apiKey: import.meta.env.VITE_GOOGLE_DEV_KEY, // 🔑 Your API Key
          //   clientId:import.meta.env.VITE_IOS_CLIENT_ID, // 🆔 Your Client ID
          //   discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'], // 🔎 Discover the Drive API
          //   scope: 'https://www.googleapis.com/auth/drive.readonly',}) // 🔐 Define the required scope
         
          //   const response = await window.gapi.client.drive.files.export({
          //       fileId: file.id,
          //       mimeType: 'text/html',
          //       access_token: accessToken
          //   });
console.log(response)
            const htmlContent = response.data;
            console.log('Google Doc HTML Content:', htmlContent);

            dispatch(createStory({
                profileId: currentProfile.id,
                data: htmlContent,
                isPrivate: true,
                approvalScore: 0,
                type: PageType.text,
                title: file.name,
                commentable: false
            })).then(res => checkResult(res, ({ story }) => {
                navigate(Paths.editPage.createRoute(story.id));
                dispatch(setDialog({isOpen:false}))
                dispatch(setEditingPage({page:story}))
            }, err => {
                console.error("Error creating story:", err);
            }));

        } catch (error) {
            console.error('Error fetching Google Doc content:', error);
            if (error.result && error.result.error) {
                console.error('API Error details:', error.result.error.message);
            }
        }}
    
  useLayoutEffect(() => {
   return ()=>{ if (currentProfile) {
      setSeo(prev => ({ ...prev, title: `Plumbum (${currentProfile.username}) Home` }));
      dispatch(setPagesInView({ pages: currentProfile.stories }));
    }}
  }, [currentProfile, setSeo, dispatch]);

  return (
    <IonContent className="ion-padding" fullscreen={true} scrollY>
      <ErrorBoundary fallback={"error"}>
        {/* Top-right icons */}
        <div className='absolute top-1 right-1 flex flex-row m-3 pr-4 w-36 justify-evenly'>
          {isNotPhone && (
            <>
              <ButtonWrapper aria-label="Edit Profile" onClick={() => navigate(Paths.editProfile.route())}
                className="bg-emerald-500 p-1 rounded-full mx-1">
                {/* <IonIcon icon={settingsIcon} className="text-white" /> */}
              </ButtonWrapper>
              <ButtonWrapper aria-label="Notifications" onClick={() => navigate(Paths.notifications())}
                className="bg-emerald-500 p-1 rounded-full mx-1">
                {/* <IonIcon icon={notificationsIcon} className="text-white" /> */}
              </ButtonWrapper>
            </>
          )}
        </div>

        {/* Profile info and action buttons */}
        <div className='flex flex-col max-w-[100vw] relative overflow-x-clip justify-start md:flex-row md:justify-between md:border-4 md:border-emerald-300 pb-4 max-w-[94vw] mx-auto sm:h-info sm:w-info mt-2 rounded-lg p-4 gap-4'>
          <div className='my-4 h-[15em] md:w-1/3'>
            <ProfileInfo profile={currentProfile} />
          </div>

          <div className='md:w-2/3 flex flex-col gap-4'>
            {/* Write a Story & Create Collection buttons */}
            <div className='flex flex-row gap-4 w-full justify-center md:justify-start'>
              <ButtonWrapper aria-label="Write a Story" onClick={ClickWriteAStory}
                className='bg-emerald-600 text-white rounded-full h-[5rem] w-[10rem] mont-medium'>
                <IonText className='text-center text-[1rem] my-auto'>Write a Story</IonText>
              </ButtonWrapper>
              <ButtonWrapper aria-label="Create Collection" onClick={ClickCreateACollection}
                className='bg-emerald-700 text-white rounded-full h-[5rem] w-[10rem] mont-medium'>
                <IonText className='text-center text-[1rem] my-auto'>Create Collection</IonText>
              </ButtonWrapper>
            </div>

            {/* Join Workshop & Google Drive Picker */}
            <div className='flex flex-col gap-4 w-full justify-center md:justify-start items-center'>
              <ButtonWrapper aria-label="Join a Workshop" onClick={() => navigate(Paths.workshop.reader())}
                className='bg-transparent border-2 border-emerald-600 mont-medium rounded-full text-emerald-900 h-[3rem] w-[21rem] text-center'>
                <IonText className='my-auto'>Join a Workshop</IonText>
              </ButtonWrapper>
              <div className='flex-shrink-0'>
       <GoogleDrivePicker getToken={()=>{
getDriveToken()
       }

       }accessToken={driveToken} onFilePicked={getFile} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and filter inputs */}
        <div className='mx-auto md:mt-8 flex flex-col md:w-page'>
          {isPhone ? (
            <div className="flex items-center mb-8 mx-auto h-9 max-w-[85vw] pr-4 rounded-full bg-transparent">
              <IonInput value={search} label="Search" labelPlacement="floating" placeholder="Search..."
                onIonChange={e => setSearch(e.detail.value ?? '')}
                className="h-9 open-sans-medium px-2 text-sm bg-transparent border-none text-emerald-800 flex-grow min-w-0" />
              <div className='w-fit'>
                <select onChange={e => setFilterType(e.target.value)} value={filterType}
                  className="select w-24 text-emerald-800 rounded-full bg-transparent">
                  {Object.entries(filterTypes).map(([, val]) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <span className="flex flex-row items-center mb-4 gap-1">
              <label className={`flex items-center border-2 border-emerald-600 rounded-full px-3 py-1 ${search.length === 0 ? 'w-[19rem]' : 'w-[20rem]'}`}>
                <span className="text-emerald-800 mr-2 whitespace-nowrap mont-medium">Search:</span>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  className="w-[9rem] overflow-ellipsis bg-transparent rounded-full text-lg text-emerald-800 outline-none"
                  placeholder="Search..." />
              </label>
              <span className={`${search.length === 0 ? '' : 'hidden'} w-[10rem]`}>
                <select onChange={e => setFilterType(e.target.value)} value={filterType}
                  className="w-full px-3 py-2 border-2 border-emerald-600 text-emerald-800 bg-transparent rounded-full text-sm">
                  {Object.entries(filterTypes).map(([, val]) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </span>
            </span>
          )}

          {/* Tabs */}
          <div role="tablist" className="tabs mx-auto  max-w-[100vw] items-start">
            <input type="radio" name="my_tabs_2" role="tab" defaultChecked
              className="tab hover:min-h-10 rounded-full mont-medium text-emerald-800 border-3 w-[90vw] md:w-page text-md md:text-xl"
              aria-label="Pages" />
            <div role="tabpanel" className="tab-content pt-8 overflow-y-auto pt-1 lg:py-4 rounded-lg w-[96vw] md:w-page mx-auto rounded-full">
              <IndexList items={filteredSortedStories} handleFeedback={item => {
                setFeedbackPage(item);
                dispatch(setPageInView({ page: item }));
              }} />
            </div>
            <input type="radio" name="my_tabs_2" role="tab"
              className="tab text-emerald-800 mont-medium rounded-full mx-auto bg-transparent border-3 text-md md:text-xl"
              aria-label="Collections" />
            <div role="tabpanel" className="tab-content   pt-8 overflow-y-auto  lg:py-4 rounded-lg w-[96vw] md:w-page mx-auto rounded-full">
              <IndexList items={filteredSortedCollections} />
            </div>
          </div>
        </div>

        {/* Feedback & dialogs */}
        <FeedbackDialog presentingElement={presentingElement} page={feedbackPage} open={!!feedbackPage} isFeedback={true}
          handleChange={setFeedback} handleFeedback={handleFeedback} handlePostPublic={() => { }}
          handleClose={() => navigate(Paths.workshop.createRoute(feedbackPage?.id))} />

        
      </ErrorBoundary>
    </IonContent>
  );
}

export default MyProfileContainer;



