import { useEffect, useState, useContext, useMemo, useLayoutEffect } from 'react';
import "../styles/MyProfile.css";
import { useDispatch, useSelector } from "react-redux";
import { createStory, fetchRecommendedStories, updateStory,  } from '../actions/StoryActions';
import { setCollections} from '../actions/CollectionActions';
import IndexList from '../components/page/IndexList';
import Paths from '../core/paths';
import { debounce, set } from 'lodash';
import calendar from '../images/icons/calendar.svg'
import settings from "../images/icons/settings.svg"
import { setPageInView, setPagesInView, setEditingPage, setHtmlContent } from '../actions/PageActions.jsx';
import { sendGAEvent } from '../core/ga4.js';
import CreateCollectionForm from '../components/collection/CreateCollectionForm';
import checkResult from '../core/checkResult';
import { PageType } from '../core/constants';
import ProfileInfo from '../components/profile/ProfileInfo';
import Context from '../context';
import FeedbackDialog from '../components/page/FeedbackDialog';
import { IonText, IonInput, IonContent, IonSpinner, IonPage,  useIonViewWillEnter, IonImg, useIonRouter, IonList } from '@ionic/react';
import GoogleDrivePicker from '../components/GoogleDrivePicker.jsx';
import { Preferences } from '@capacitor/preferences';
import axios from "axios";
import StoryCollectionTabs from '../components/page/StoryCollectionTabs.jsx';
import ErrorBoundary from '../ErrorBoundary.jsx';

import { getCurrentProfile } from '../actions/UserActions.jsx';
import { useDialog } from '../domain/usecases/useDialog.jsx';
import PageViewItem from '../components/page/PageViewItem.jsx';
import PageDataElement from '../components/page/PageDataElement.jsx';
import ProfileCircle from '../components/profile/ProfileCircle.jsx';
// import requestLocation from '../core/requestLocation.jsx';
import { fetchWorkshopGroups, findWorkshopGroups, registerUser } from '../actions/WorkshopActions.jsx';

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

function MyProfileContainer() {
  const [tab, setTab] = useState("page");
  const router = useIonRouter()
  const dispatch = useDispatch();
  const currentProfile = useSelector(state=>state.users.currentProfile)
  const stories = useSelector(state => state.pages.pagesInView);
  const { seo, setSeo ,setError} = useContext(Context);
  const collections = useSelector(state => state.books.collections);
  const [search, setSearch] = useState("");
  const [isGlobal,setIsGlobal]=useState(true)
    const isNative = Capacitor.isNativePlatform();
  const [filterType, setFilterType] = useState("Filter");
  const [driveToken, setDriveToken] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading,setLoading]=useState(false)
  const [location, setLocation] = useState(null);
  const [whatsHappeningList,setWhatsHappeningList]=useState([])
    const [workshops,setWorkshops]=useState([])

  const filterTypes = {
    filter: "Filter",
    recent: "Recent",
    oldest: "Oldest",
    feedback: "Feedback",
    AZ: "A-Z",
    ZA: "Z-A"
  };
  
  const webRequestLocation=()=>{
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        if(currentProfile&&currentProfile.id){
         location&& registerUser(currentProfile.id,location)
        }
    
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.log("location error")
        setError("We use location to conect with you fellow writers. Reload for access.");
        setLoading(false);
  
      }
    );
  }
  const getPostion = async () => {
    if(isNative){
 const position = await Geolocation.getCurrentPosition();
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      if (currentProfile && currentProfile.id) {
      location&&  registerUser(currentProfile.id, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      
  }}else{
      navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        if(currentProfile&&currentProfile.id){
         location&& registerUser(currentProfile.id,location)
        }
    
        setError(null);
        setLoading(false);
      })}}
useEffect(()=>{


   isGlobal && (currentProfile && (isNative ? requestLocation() : webRequestLocation()))
  },[])
 const requestLocation = async () => {
  setLoading(true);
  try {
    // Check current geolocation permission state
    const permStatus = await Geolocation.checkPermissions();

    if (permStatus.location === 'granted') {
      // Permission already granted, get location
     getPostion()
      
      setError(null);
    }else if (permStatus.location === 'prompt' || permStatus.location === 'denied') {
      // Request permission explicitly, triggers iOS popup if needed
      const requestResult = await Geolocation.requestPermissions();
      if (requestResult.location === 'granted') {
        const position = await Geolocation.getCurrentPosition();
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        if (currentProfile && currentProfile.id) {
            location&&  registerUser(currentProfile.id, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
        setError(null);
      } else {
        setError("Location permission denied. Please enable location permissions in your device settings.");
      }
    } else {
      setError("Unable to determine location permission state.");
    }
  } catch (err) {
    console.error("Error requesting location or getting position:", err);
    setError("Could not get location. Please try again.");
  } finally {
    setLoading(false);
  }
};
useEffect(()=>{
  async function handleLocation() {
    
  
  isGlobal && currentProfile && (isNative ? requestLocation() : webRequestLocation())
  }

handleLocation()

},[location])

 useEffect(() => {
  if (currentProfile) {
    setSeo(prev => ({
      ...prev,
      title: `Plumbum (${currentProfile.username}) Home`,
      description: `Welcome to ${currentProfile.username}'s home on Plumbum.`,
      url: `https://plumbum.app/${currentProfile.username}`,
    }));
  }
}, [currentProfile, setSeo]);

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


// const [checkingAuth, setCheckingAuth] = useState(true);
 const {openDialog,closeDialog,dialog,resetDialog}=useDialog()
// useEffect(() => {
//   const syncProfile = async () => {
//     if (currentProfile) {
//       // setCheckingAuth(false);
//       return;
//     }

//     dispatch(getCurrentProfile())
    
    
//   };

//  return ()=> syncProfile();
// }, []);



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

  },[])

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
        router.push(Paths.editPage.createRoute(payload.story.id),'forward', 'push');
        }else{
          windowl.alert("COULD NOT CREATE STORY")
        }
      },err=>{
        setErrorLocal(err.message)
      }));
    }
  }, 5);


  const ClickCreateACollection = () => {
     try {
    sendGAEvent("create_collection_open", {
      area: "collections",
      modal_type: "create_collection",
      user_id: currentProfile?.id || null, // optional, if you want to track
    });
  } catch (e) {
    console.warn("GA event failed", e);
  }

openDialog({
...dialog,
disagree:null,
scrollY: false,
  text: <CreateCollectionForm onClose={resetDialog} />,
  disagreeText: "Close", // optional button
  onClose: closeDialog,
  breakpoint: 1, // if you want a half-sheet style
});

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
    
        if (story) {
          
          dispatch(setEditingPage({ page:story }));
          dispatch(setPageInView({ page:story }));
          dispatch(setHtmlContent({ html:story.data })); 
          router.push(Paths.editPage.createRoute(story.id),'forward', 'push');
  
        }
  
      }, err => setErrorLocal(err.message)));
    } catch (error) {
      console.error("Error fetching Google Doc:", error);
      setErrorLocal(error.message);
    }
  };

const openFeedback=(item,isFeedback)=>{
   openDialog({...dialog,disagree:null,agree:null,disagreeText:null,scrollY:false,text:
    <FeedbackDialog
  
      page={item}
      // open={!!feedbackPage}
      isFeedback={isFeedback}
      handleChange={setFeedback}
      handleFeedback={(item) => {
      
           closeDialog()
        const params = { ...item, description:feedback, page: item, id: item.id, needsFeedback: true };
        dispatch(updateStory(params)).then(res => {
          checkResult(res, payload => {
         
      if (payload.story) router.push(Paths.workshop.createRoute(payload.story.id,"foward"));
          });
        });
      }}
      handlePostPublic={() => {}}
      handleClose={() => setFeedback(null)}
    />})
              dispatch(setPageInView({ page: item }));
            }
const fetchStories = () => {
    dispatch(fetchRecommendedStories()).then(res=>{
      checkResult(res,payload=>{
        if(payload.stories){

          setWhatsHappeningList(payload.stories);
          dispatch(setPagesInView({ pages: payload.stories }));
        }else{
          dispatch(setPagesInView({ pages: currentProfile.stories }));
        }
    })})
}
 const fetchWorkshops = async () => {
  let locale = null
  if(!location){
   if(isNative){
    const position = await Geolocation.getCurrentPosition();


   locale = {latitude: position.coords.latitude,
        longitude: position.coords.longitude,}
      
      dispatch(findWorkshopGroups({location:location,radius:50,global:isGlobal})).then(res=>{
      checkResult(res,payload=>{
              
        if(payload.groups){
    
         setWorkshops(payload.groups)
        }},err=>console.log(err))
    })
      }else{
        navigator.geolocation.getCurrentPosition(
      (position) => {
        // setLocation({
       locale = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        dispatch(findWorkshopGroups({location:location,radius:50,global:isGlobal})).then(res=>{
      checkResult(res,payload=>{
              
        if(payload.groups){
    
         setWorkshops(payload.groups)
        }},err=>console.log(err))
    })
      })
    
    }
  }
   
  
  }
  useEffect(()=>{
      !currentProfile && dispatch(getCurrentProfile())
        fetchWorkshops()
  },[currentProfile])
  // useEffect(()=>{
  //   fetchStories()

  // },[isGlobal,location])
const handleGlobal=()=>{ setIsGlobal(!isGlobal)}

  if (!currentProfile) {
    return (
      <IonContent fullscreen={true} className='pt-12' style={{'--background': '#f4f4e0'}}>
        <div>
        <IonSpinner />
        </div>
        </IonContent>
    );
  }
return<IonContent fullscreen={true} className='pt-12' style={{'--background': '#f4f4e0'}}><ErrorBoundary>

                    <div className='flex mt-4  pt-16 px-4 flex-row justify-between'>
                         <IonImg  onClick={()=> router.push(Paths.editProfile)} className="bg-soft s mr-4 max-w-10 max-h-10 rounded-full p-2 " src={settings}/> 
     
                            <img src={calendar}  className=''  style={{
    filter:
      "invert(35%) sepia(86%) saturate(451%) hue-rotate(118deg) brightness(85%) contrast(92%)",
  }}
onClick={()=>{
      sendGAEvent("navigation_click", {
      destination: "calendar",
      source: "discovery_header",
    });

  router.push(Paths.calendar())}}

          />
          
                  
                    </div>
  <div >

  <div className="relative flex flex-col md:flex-row justify-around mx-auto p-6 mt-2 max-w-[60rem] rounded-lg gap-6">
{/* 
    <div className="md:w-1/3 max-w-[60em] h-[16em] mb-[4em] flex justify-center md:justify-start">
      <ProfileInfo profile={currentProfile} />
    </div> */}
    

    {/* Right: Buttons */}
    <div>
    <h4 className='text-[1rem] text-emerald-800 font-bold mb-4'>
      What's happening in your communities?
    </h4>
  <IonList><div className='flex flex-row gap-4 bg-cream overflow-x-auto overflow-y-hidden py-4 px-2 w-full'>
    {whatsHappeningList.map((item, index) =><div className='mx-4 px-2 rounded-lg bg-blue-100 min-w-40 max-h-[18em] overflow-hidden flex flex-col'> <div className='my-2'><ProfileCircle profile={item.author}/></div><span onClick={()=>router.push(Paths.page.createRoute(item.id),"forward")}><PageDataElement truncateNumber={48} page={item}/></span></div>)}
    </div></IonList>
    </div>
   <span className=''><div className='flex flex-row'><h4 className='text-xl'>
     Workshops near you 
    </h4>
   <input 
  type="checkbox" 
  checked={isGlobal} 
  onChange={handleGlobal} 
  className={`
    toggle 
    mx-4
    border-2 border-emerald-800 border-opacity-50 my-auto
    ${!isGlobal ? 'toggle-success bg-emerald-600' : 'toggle-success bg-slate-400'} 
    
  `} 
/><h4> {isGlobal?"Global":"Local"}</h4></div>
<IonList>
  <div className='flex flex-row'>
    {workshops.map((item, index) =><div onClick={() => router.push(Paths.collection.createRoute(item.id), "forward")} className='px-4 bg-cream'> 
      <h2 >{item.title}</h2>
      </div>)}

  </div>
</IonList>

</span> 
     <h4 className='text-xl'>
     Writing Prompts for you
    </h4>
    <div className="flex flex-col items-center justify-cetner h-[15em] bottom-0  mt-4 sbg-red-100 md:items-start gap-4 w-full md:w-2/3  ">

      {/* Row 1: Write a Story + Create Collection */}
      <div className="flex flex-row mx-auto flex-wrap sm:justify-center md:justify-start gap-4">
        <ButtonWrapper
          onClick={ClickWriteAStory}
          className="bg-soft hover:bg-emerald-500  border-emerald-700 border-opacity-80 text-white rounded-xl h-[3rem] w-[8.5rem]"
        >
          <IonText className='text-[1.2em]'>Write a Story</IonText>
        </ButtonWrapper>
        <ButtonWrapper
          onClick={ClickCreateACollection}
          className="bg-soft hover:bg-emerald-500  border-emerald-700 border-opacity-80 text-white rounded-xl h-[3rem] w-[8.5rem]"
        >
          <IonText className="text-white text-[1.2em]">Create Collection</IonText>
        </ButtonWrapper>
      </div>

      {/* Row 2: Join a Workshop */}
      <div className="flex justify-center md:justify-start w-full">
        <ButtonWrapper
          onClick={() => router.push(Paths.workshop.reader())}
          className="font-bold mx-auto bg-blueSea hover:bg-opacity-70 border-blueSea border-opacity-80 mx-4 rounded-xl h-[3rem] w-[90vw] sm:w-[21rem]"
        >
          <IonText className="text-white text-[1.2em]">Join a Workshop</IonText>
        </ButtonWrapper>
      </div>

      {/* Row 3: Google Drive Picker */}
      {/* <div className="flex justify-center mx-auto md:justify-start w-full"> */}
        {/* <GoogleDrivePicker
          getToken={getDriveToken}
          accessToken={driveToken}
          onFilePicked={getFile}
        /> */}
      {/* </div> */}

    </div>
  </div>

  {/* Search + Tabs stay unchanged */}
  <div className='mx-auto md:mt-8 flex flex-col md:w-page'>
    {/* <div className="flex items-center mb-8 mx-auto h-9 max-w-[85vw] pr-4 rounded-full bg-transparent"> */}

      {/* <select
        onChange={e => setFilterType(e.target.value)}
        value={filterType}
        className="select w-24 text-emerald-800 rounded-full bg-transparent"
      >
        {Object.entries(filterTypes).map(([, val]) => (
          <option key={val} value={val}>{val}</option>
        ))}
      </select> */}
    {/* </div> */}

    {/* <div className='h-fit min-h-[55rem] mx-auto'> */}
      {/* <StoryCollectionTabs
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
              openFeedback(item,true)
            }}
          />
        )}
      /> */}
    {/* </div> */}

  </div>
</div>
</ErrorBoundary>
</IonContent>
}

export default MyProfileContainer;
