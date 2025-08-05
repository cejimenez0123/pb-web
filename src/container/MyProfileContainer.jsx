import React, { useLayoutEffect, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/MyProfile.css";
import { useDispatch, useSelector } from "react-redux";
import { createStory, updateStory ,getMyStories} from '../actions/StoryActions';
import { getMyCollections, setCollections } from '../actions/CollectionActions';
import notifications from "../images/icons/notifications.svg";
import settings from "../images/icons/settings.svg";
import IndexList from '../components/page/IndexList';
import authRepo from '../data/authRepo.js';
import Paths from '../core/paths';
import { debounce } from 'lodash';
import { setPageInView, setPagesInView, setEditingPage } from '../actions/PageActions.jsx';
import { initGA, sendGAEvent } from '../core/ga4.js';
import Dialog from '../components/Dialog.jsx';
import CreateCollectionForm from '../components/collection/CreateCollectionForm';
import checkResult from '../core/checkResult';
import { PageType } from '../core/constants';
import ProfileInfo from '../components/profile/ProfileInfo';
import usePersistentMyCollectionCache from '../domain/usecases/usePersistentMyCollectionCache';
import Context from '../context';
import FeedbackDialog from '../components/page/FeedbackDialog';
import usePersistentMyStoriesCache from '../domain/usecases/usePersistentMyStoriesCache.jsx';
import ErrorBoundary from '../ErrorBoundary.jsx';
import copyContent from "../images/icons/content_copy.svg";
import DeviceCheck from '../components/DeviceCheck.jsx';
import { IonPage, IonText, IonIcon, IonInput } from '@ionic/react';
import { settings as settingsIcon, notifications as notificationsIcon } from 'ionicons/icons';
import GoogleDrivePicker from '../components/GoogleDrivePicker.jsx';

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

function MyProfileContainer() {
  const isNative = DeviceCheck();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentProfile, seo, setSeo, isPhone, isNotPhone } = useContext(Context);
  const [search, setSearch] = useState("");
  // const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterType, setFilterType] = useState("Filter");
  const [description, setFeedback] = useState("");
  const [referralLink, setReferralLink] = useState(null);
  const [firstLogin, setFirstLogin] = useState(localStorage.getItem("firstTime") === "true");
  const [openDialog, setOpenDialog] = useState(false);
  const [feedbackPage, setFeedbackPage] = useState(null);

  const filterTypes = {
    filter: "Filter",
    recent: "Recent",
    oldest: "Oldest",
    feedback: "Feedback",
    AZ: "A-Z",
    ZA: "Z-A"
  };

  // Load stories and collections
  const stories = usePersistentMyStoriesCache(() => {
    dispatch(setPagesInView({ pages: [] }));
    return dispatch(getMyStories());
  });

  const collections = usePersistentMyCollectionCache(() => {
    dispatch(setCollections({ collections: [] }));
    return dispatch(getMyCollections());
  });

  // Save original collections for filter resets
  const [ogCols, setOgCols] = useState([]);
  useEffect(() => {
    setOgCols(collections);
  }, [collections]);

  // Debounce the search input
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedSearch(search.trim());
  //   }, 10);
  //   return () => clearTimeout(handler);
  // }, [search]);

  // Apply original filterType method on collections
  useEffect(() => {
    switch (filterType) {
      case filterTypes.filter:
        dispatch(setCollections({ collections: ogCols }));
        break;
      case filterTypes.recent:
        handleSortTime(true);
        break;
      case filterTypes.oldest:
        handleSortTime(false);
        break;
      case filterTypes.feedback:
        handleSortFeedback();
        break;
      case filterTypes.AZ:
        handleSortAlpha(false);
        break;
      case filterTypes.ZA:
        handleSortAlpha(true);
        break;
      default:
        dispatch(setCollections({ collections: ogCols }));
        break;
    }
  }, [filterType, ogCols, dispatch]);

  // Filter pages and collections based on debounced search and update redux directly
  useEffect(() => {
    let filteredCols = ogCols;
    let filteredPgs = stories;
    let debouncedSearch = search
    if (debouncedSearch.toLowerCase() === "untitled") {
      filteredPgs = filteredPgs.filter(p => !p.title || p.title.length === 0);
    } else if (debouncedSearch.length > 0) {
      const lowerSearch = debouncedSearch.toLowerCase();
      filteredPgs = filteredPgs.filter(p => p.title.toLowerCase().includes(lowerSearch));
      filteredCols = filteredCols.filter(col => col && col.title.toLowerCase().includes(lowerSearch));
    }
    dispatch(setCollections({ collections: filteredCols }));
    dispatch(setPagesInView({ pages: filteredPgs }));
  }, [search]);

  // Sort handlers (called only from filterType effect)
  const handleSortAlpha = (sortedAsc) => {
    const sorted = [...collections].sort((a, b) =>
      sortedAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );
    const storiesSorted = [...stories].sort((a, b) =>
      sortedAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );
    dispatch(setPagesInView({pages:storiesSorted}));
    dispatch(setCollections({ collections: sorted }));
  };

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



  const copyToClipboard = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink).then(() => {
      localStorage.setItem("firstTime", null);
      setOpenReferral(false);
      setFirstLogin(false);
    });
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
  };

  const generateReferral = () => {
    authRepo.generateReferral().then(data => {
      if (data.referralLink) setReferralLink(data.referralLink);
      if (data.referral) setReferral(data.referral);
    });
  };

  useLayoutEffect(() => {
    if (currentProfile) {
      setSeo(prev => ({ ...prev, title: `Plumbum (${currentProfile.username}) Home` }));
      dispatch(setPagesInView({ pages: currentProfile.stories }));
    }
  }, [currentProfile, setSeo, dispatch]);

  return (
    <IonPage className='py-12 overflow-y-auto'>
      <ErrorBoundary fallback={"error"}>
        {/* Top-right icons */}
        <div className='absolute top-1 right-1 flex flex-row m-3 pr-4 w-36 justify-evenly'>
          {isNotPhone && (
            <>
              <ButtonWrapper aria-label="Edit Profile" onClick={() => navigate(Paths.editProfile.route())}
                className="bg-emerald-500 p-1 rounded-full mx-1">
                <IonIcon icon={settingsIcon} className="text-white" />
              </ButtonWrapper>
              <ButtonWrapper aria-label="Notifications" onClick={() => navigate(Paths.notifications())}
                className="bg-emerald-500 p-1 rounded-full mx-1">
                <IonIcon icon={notificationsIcon} className="text-white" />
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
                <GoogleDrivePicker />
              </div>
            </div>
          </div>
        </div>

        {/* Search and filter inputs */}
        <div className='mx-auto md:mt-8 flex flex-col md:w-page'>
          {isPhone ? (
            <div className="flex items-center mb-4 mx-auto h-9 max-w-[85vw] pr-4 rounded-full bg-transparent">
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
            <span className="flex flex-row items-center gap-1">
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
            <div role="tabpanel" className="tab-content h-[30rem] overflow-y-auto pt-1 lg:py-4 rounded-lg w-[96vw] md:w-page mx-auto rounded-full">
              <IndexList items={useSelector(state => state.pages.pagesInView)} handleFeedback={item => {
                setFeedbackPage(item);
                dispatch(setPageInView({ page: item }));
              }} />
            </div>
            <input type="radio" name="my_tabs_2" role="tab"
              className="tab text-emerald-800 mont-medium rounded-full mx-auto bg-transparent border-3 text-md md:text-xl"
              aria-label="Collections" />
            <div role="tabpanel" className="tab-content h-[30rem] overflow-y-auto pt-1 lg:py-4 rounded-lg w-[96vw] md:w-page mx-auto rounded-full">
              <IndexList items={useSelector(state => state.books.collections)} />
            </div>
          </div>
        </div>

        {/* Feedback & dialogs */}
        <FeedbackDialog page={feedbackPage} open={!!feedbackPage} isFeedback={true}
          handleChange={setFeedback} handleFeedback={handleFeedback} handlePostPublic={() => { }}
          handleClose={() => navigate(Paths.workshop.createRoute(feedbackPage?.id))} />
        <Dialog isOpen={openDialog} onClose={() => setOpenDialog(false)}
          text={<CreateCollectionForm onClose={() => setOpenDialog(false)} />} />
        <Dialog isOpen={firstLogin} onClose={() => {
          localStorage.setItem("firstTime", "false");
          setFirstLogin(false);
        }} disagreeText={"Close"} title={"Welcome to Plumbum! 🎉"}
          text={
            <div className='card bg-emerald-50 px-4 py-8 overflow-x-hidden h-full md:min-w-72 md:min-h-72'>
              <p className="text-lg text-gray-600 mb-4">You’ve just joined a community built for writers like you—a space to share, connect, and grow with fellow creatives.</p>
              <p className="text-lg text-gray-600 mb-4">To get the best experience, invite your friends so they can keep up with your work and be part of your creative journey.</p>
              <div className="text-center">
                <ButtonWrapper onClick={generateReferral} className="mont-medium bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-full px-6 py-3 cursor-pointer inline-block" tabIndex={0} role="button">
                  Create Referral Link
                </ButtonWrapper>
                {referralLink && (
                  <div className='flex flex-row min-h-12 items-center mt-4'>
                    <a onClick={copyToClipboard} className='text-nowrap my-auto overflow-hidden text-ellipsis cursor-pointer' title={referralLink}>{referralLink}</a>
                    <img src={copyContent} alt="copy" onClick={copyToClipboard} className="btn bg-transparent border-none my-auto icon cursor-pointer" />
                  </div>
                )}
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">Share it with the people who inspire and support your writing! ✨</p>
            </div>
          } />
      </ErrorBoundary>
    </IonPage>
  );
}

export default MyProfileContainer;



