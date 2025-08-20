import { IonPage,IonBackButton,IonButtons, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import { useLocation, useParams } from 'react-router-dom';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../../actions/UserActions';
import ProfileCard from '../../components/ProfileCard';
import checkResult from '../../core/checkResult';
import IndexList from '../../components/page/IndexList';
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

function ProfileContainer({ profile }) {
  const { seo, setSeo, setError, setSuccess, currentProfile } = useContext(Context);
  const { id } = useParams();

  const dispatch = useDispatch();
  const isPhone = useMediaQuery({ query: '(max-width: 600px)' });

  const [search, setSearch] = useState('');
  const [sortAlpha, setSortAlpha] = useState(true);
  const [sortTime, setSortTime] = useState(true);
  const [following, setFollowing] = useState(null);
  const [canUserSee, setCanUserSee] = useState(false);
  const [activeTab, setActiveTab] = useState('pages'); // "pages" or "collections"

  useLayoutEffect(() => {
    initGA();
    if (profile) {
      sendGAEvent(
        'View Profile',
        `View Profile ${JSON.stringify({ id: profile.id, username: profile.username })}`
      );
    }
  }, [profile]);

  const collections = sortItems(
    [],
    useSelector((state) =>
      state.books.collections
        .filter((col) => col)
        .filter((col) => (search.length > 0 ? col.title.toLowerCase().includes(search.toLowerCase()) : true))
    )
  );

  const pages = sortItems(
    useSelector((state) =>
      state.pages.pagesInView
        .filter((page) => page)
        .filter((page) => (search.length > 0 ? page.title.toLowerCase().includes(search.toLowerCase()) : true))
    ),
    []
  );

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
          getContent();
        },
        (err) => {
          setError(err.message);
        }
      );
    });
  }, [id]);

  useEffect(() => {
    if (profile) getContent();
  }, [profile]);

  useLayoutEffect(() => {
    checkIfFollowing();
  }, [currentProfile, profile]);

  const handleSearch = (value) => {
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
        });
      } else {
        const params = { follower: currentProfile, following: profile };
        dispatch(createFollow(params));
      }
    } else {
      setSuccess(null);
      setError('This is you silly');
    }
  }, debounceDelay);

  useLayoutEffect(() => {
    if (!profile) return;
    const newSeo = { ...seo };
    newSeo.title = `Plumbum Writer Check Out(${profile.username})`;
    newSeo.description = profile.selfStatement;
    newSeo.url = Enviroment.domain + `/profile/${profile.id}`;
    setSeo(newSeo);
  }, [profile]);

  return (
    <ErrorBoundary>
      <IonPage>
      <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              {/* defaultHref is the fallback if no navigation history */}
              <IonBackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>{profile ? `${profile.username}'s Profile` : 'Profile'}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen scrollY>
          <div className="pt-2 md:pt-8 mb-8 mx-2">
            <ProfileCard profile={profile} following={following} onClickFollow={onClickFollow} />
          </div>

          {isPhone && (
            <span className="flex flex-row">
              <label className="flex my-1 border-emerald-400 border-2 border-opacity-70 w-[100%] rounded-full mt-8 flex-row mx-2">
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

          {/* Tabs container with original Tailwind styling */}
          <div role="tablist" className="tabs mb-36 rounded-lg w-[100vw] mx-auto md:w-page tabs-boxed bg-transparent">
            <input type="radio" name="my_tabs_2" role="tab" defaultChecked
              className="tab hover:min-h-10 mb-4 rounded-full mont-medium text-emerald-800 border-3 w-[90vw] md:w-page text-md md:text-xl"
              aria-label="Pages" />
            <div role="tabpanel" className="tab-content h-[100%] overflow-y-auto pt-1 lg:py-4 rounded-lg w-[96vw] md:w-page mx-auto rounded-full">
           
              <PageList items={pages} />
            </div>
            <input type="radio" name="my_tabs_2" role="tab"
              className="tab text-emerald-800 mb-4   mont-medium rounded-full mx-auto bg-transparent  border-3 text-md md:text-xl"
              aria-label="Collections" />
            <div role="tabpanel" className="tab-content h-[30rem] overflow-y-auto pt-1 lg:py-4 rounded-lg w-[96vw] md:w-page mx-auto rounded-full">
              <IndexList items={useSelector(state => state.books.collections)} />
            </div>
          </div>
        
          
        </IonContent>
      </IonPage>
    </ErrorBoundary>
  );
}

export default ProfileContainer;

