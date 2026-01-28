import { IonPage,IonBackButton,IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, useIonRouter } from '@ionic/react';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../../actions/UserActions';
import ProfileCard from '../../components/ProfileCard';
import checkResult from '../../core/checkResult';
import IndexList from '../../components/page/IndexList';
import { useMemo } from 'react';
import {
  getProtectedProfilePages,
  getPublicProfilePages,
  setPagesInView,
} from '../../actions/PageActions.jsx';
import { createFollow, deleteFollow } from '../../actions/FollowAction';
import {
  getProtectedProfileCollections,
  getPublicProfileCollections,
} from '../../actions/CollectionActions';
import { debounce } from 'lodash';
import { setCollections } from '../../actions/CollectionActions';
import { useMediaQuery } from 'react-responsive';
import Context from '../../context';
import { initGA, sendGAEvent } from '../../core/ga4.js';
import Enviroment from '../../core/Enviroment.js';
import ErrorBoundary from '../../ErrorBoundary.jsx';
import PageList from '../../components/page/PageList.jsx';
import sortItems from '../../core/sortItems.js';
import { Preferences } from '@capacitor/preferences';
import StoryCollectionTabs from '../../components/page/StoryCollectionTabs.jsx';
import { useParams } from 'react-router';
import ExploreList from '../../components/collection/ExploreList.jsx';

function ProfileContainer() {
  const { seo, setSeo, setError, setSuccess, currentProfile } = useContext(Context);

const profile = useSelector((state) => state.users.profileInView);
  const dispatch = useDispatch();
  const[tab,setTab]=useState("page")
  const isPhone = useMediaQuery({ query: '(max-width: 600px)' });
  const router = useIonRouter()
  const handleTabChange=(tab)=>{
      setTab(tab)

  sendGAEvent("profile_tab_change", {
    tab: tab,
    profile_id: profile.id,
  });
  }
  const [search, setSearch] = useState('');

  const [following, setFollowing] = useState(null);
const [canUserSee, setCanUserSee] = useState(false);
  const { id } = useParams()

useEffect(() => {
  if (!profile) return;

  sendGAEvent("profile_view", {
    profile_id: profile.id,
    username: profile.username,
    is_owner: currentProfile?.id === profile.id,
    privacy: profile.isPrivate ? "private" : "public",
  });
}, [profile?.id]);



const collectionsRaw = useSelector((state) => state.books.collections
);

const pagesRaw = useSelector((state) => state.pages.pagesInView ?? []);
const collections = useMemo(() => {
  const filtered = collectionsRaw 
    .filter((col) => col)
    .filter((col) =>
      search.length > 0
        ? col.title.toLowerCase().includes(search.toLowerCase())
        : true
    );
  return sortItems([], filtered);
}, [collectionsRaw, search]);

const pages = useMemo(() => {
  const filtered = pagesRaw
    .filter((page) => page)
    .filter((page) =>
      search.length > 0
        ? page.title.toLowerCase().includes(search.toLowerCase())
        : true
    );
  return sortItems(filtered, []);
}, [pagesRaw, search]);

  const debounceDelay = 10;

  const handleSortTime = debounce(() => {
    setSortTime((prev) => {
      const newSortTime = !prev;
      let sortedCollections = [...collections].sort((a, b) =>
        newSortTime
          ? new Date(a.created) - new Date(b.created)
          : new Date(b.created) - new Date(a.created)
      );
      dispatch(setCollections({ collections: sortedCollections }));

      let sortedPages = [...pages].sort((a, b) =>
        newSortTime
          ? new Date(a.created) - new Date(b.created)
          : new Date(b.created) - new Date(a.created)
      );
      dispatch(setPagesInView({ pages: sortedPages }));

      return newSortTime;
    });
  }, debounceDelay);

  const handleSortAlpha = debounce(() => {
    setSortAlpha((prev) => {
      const newSortAlpha = !prev;
      let sortedCollections = [...collections].sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        if (aTitle < bTitle) return newSortAlpha ? -1 : 1;
        if (aTitle > bTitle) return newSortAlpha ? 1 : -1;
        return 0;
      });
      dispatch(setCollections({ collections: sortedCollections }));

      let sortedPages = [...pages].sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        if (aTitle < bTitle) return newSortAlpha ? -1 : 1;
        if (aTitle > bTitle) return newSortAlpha ? 1 : -1;
        return 0;
      });
      dispatch(setPagesInView({ pages: sortedPages }));

      return newSortAlpha;
    });
  }, debounceDelay);

  const getContent = async () => {
    dispatch(setPagesInView({ pages: [] }));
    dispatch(setCollections({ collections: [] }));

    const token = (await Preferences.get({key:'token'})).value
    if (token && currentProfile?.id === id) {
      dispatch(getProtectedProfilePages({ profile: { id } }));
      dispatch(getProtectedProfileCollections({ profile: { id } }));
    } else {
      dispatch(getPublicProfilePages({ profile: { id } }));
      dispatch(getPublicProfileCollections({ profile: { id } }));
    }
  };

  useLayoutEffect(() => {
    dispatch(fetchProfile({ id })).then((result) => {
      checkResult(
        result,
        () => {
          checkIfFollowing();
          // getContent();
        },
        (err) => {
          setError(err.message);
        }
      );
    });
  },[id]);

  useEffect(() => {
   getContent();
  }, []);

  useLayoutEffect(() => {
    checkIfFollowing();
  }, [currentProfile, profile]);

  const handleSearch = (value) => {
   profile && sendGAEvent("profile_search", {
  profile_id: profile.id,
  query_length: value.length,
});
    setSearch(value);
  };

  const checkIfFollowing = () => {
    if (!currentProfile || !profile) return;
    if (!profile.isPrivate) {
      setCanUserSee(true);
    }
    if (currentProfile.id === profile.id) {
      setCanUserSee(true);
      setFollowing(true);
      return;
    }
    if (profile.followers) {
      const found = profile.followers.find((f) => f.followerId === currentProfile.id);
      setCanUserSee(true);
      setFollowing(found);
    } else {
      setFollowing(null);
    }
  };

  const onClickFollow = debounce(() => {
    if (!currentProfile) {
      setSuccess(null);
      setError('Please login first!');
      return;
    }
    if (profile && currentProfile.id !== profile.id) {
      if (following) {

        dispatch(deleteFollow({ follow: following })).then(() => {
          // follow deleted
          sendGAEvent( "profile_unfollow", {
  profile_id: profile.id,
  username: profile.username,
  source: "profile_page",
});

          
        });
      } else {
        const params = { follower: currentProfile, following: profile };
        dispatch(createFollow(params));
        sendGAEvent("profile_follow", {
  profile_id: profile.id,
  username: profile.username,
  source: "profile_page",
});

      }
    } else {
      setSuccess(null);
      setError('This is you silly');
    }
    
  }, debounceDelay);

useLayoutEffect(() => {
  if (!profile) return;

  setSeo({
    title: `${profile.username} on Plumbum`,
    description:
      profile.selfStatement ||
      `Read stories and collections by ${profile.username} on Plumbum.`,
    url: `${Enviroment.domain}/profile/${profile.id}`,
    type: "profile",
  });
}, [profile?.id]);

let books = useSelector(state => state.books.collections)
  return (
    <ErrorBoundary>
    
      
        
        <IonContent fullscreen={true} style={{"--background":"#f4f4e0"}}className='ion-padding-top' >
          <div className='pt-12 '>
       
          <div className="pt-2 md:pt-8 mb-8 mx-2 ">
            <ProfileCard profile={profile} following={following} onClickFollow={onClickFollow} />
          </div>

          {isPhone && (
            <span className="flex flex-row">
              <label className="flex my-1  w-[100%] rounded-full mt-8 flex-row mx-2">
                <span className="my-auto text-emerald-800 ml-3 mr-1 w-full mont-medium"> Search:</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="px-2 w-[100%] py-1 text-sm bg-transparent my-1 rounded-full text-emerald-800"
                />
              </label>
            </span>
          )}
          <div className=" rounded-lg w-[100%] max-w-[100vw] justify-center flex mx-auto sm:w-[50em] bg-transparent">
       <StoryCollectionTabs 
        tab={tab}
        setTab={handleTabChange} 
        colList={()=> books.length>0?<IndexList type="collection" items={books} />:<p>There will be something soon</p>
           }
        storyList={()=>pages.length>0?<PageList items={pages} />:<p>Nothing for now</p>}/>
        </div>
    
        
          </div>
          <ExploreList/>
        </IonContent>
    </ErrorBoundary>
  );
}

export default ProfileContainer;

