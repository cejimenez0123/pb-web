
import { useContext, useRef, useEffect, useState } from 'react';
import { registerUser, postActiveUser, findWorkshopGroup, findWorkshopGroups, fetchWorkshopGroups } from "../../actions/WorkshopActions";
import { useSelector, useDispatch } from 'react-redux';
import checkResult from '../../core/checkResult';
import Paths from '../../core/paths';
import Context from '../../context';
import check from "../../images/icons/check.svg";
import { Geolocation } from '@capacitor/geolocation';
import DeviceCheck from '../../components/DeviceCheck';
import { IonContent, IonLoading, useIonRouter } from '@ionic/react';
import { setCurrentPage, setPagesInView } from '../../actions/PageActions';
import { getProfileRecommendations, setCollections } from '../../actions/CollectionActions';
import { useParams } from 'react-router';
import GoogleMapSearch from "../collection/GoogleMapSearch";
import ExploreList from '../../components/collection/ExploreList';
import fetchCity from '../../core/fetchCity';
import Enviroment from '../../core/Enviroment';
import { getStory } from '../../actions/StoryActions';
import getBackground from '../../core/getbackground';
import usePaginatedResource from '../../core/usePaginatedResource';

const DEFAULT_LOCATION = { latitude: 40.818622458906425, longitude: -73.8890363605602 };

const WRAP = "  mx-auto px-4";
const WRAPB = "mx-auto bg-cream  max-w-[50em] dark:bg-base-bgDark w-[100%]";
const PAGE_Y = "pt-16 ";
const STACK_LG = "space-y-8";
const STACK_MD = "space-y-6";
const STACK_SM = "space-y-3";
const CARD = "rounded-2xl max-w-2xl  mx-auto shadow-sm bg-base-bg border-1 border border-earth p-6";
const CARD_INNER = "space-y-5 bg-base-bg ";
const ROW_BETWEEN = "flex items-center justify-between";
const INPUT_WRAP = "bg-gray-50 border border-gray-200 rounded-xl p-4";
const INPUT_ROW = "flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2";
const BTN_PRIMARY = "w-full bg-emerald-600 text-white rounded-full py-4 font-semibold shadow-sm hover:bg-emerald-700 dark:bg-transparent border-emerald-600 border-1 border  transition-colors duration-200";
const TITLE = "text-xl font-semibold";

const WorkshopContainer = () => {
  const dispatch = useDispatch();
  const router = useIonRouter();
  const { storyId } = useParams();
  const isNative = DeviceCheck();
  const isMounted = useRef(true);
    const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(50);
  const [isGlobal, setIsGlobal] = useState(true);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
    const { currentProfile } = useSelector(state => state.users);
  const page = useSelector(state => state.pages.pageInView);
  // Public — viewing a collection


// Protected — for logged in user
const { items: communities, page: communityPage, setPage: setCommunityPage, totalPages:comTotalPage, totalCount: communityTotal } = usePaginatedResource({
    cacheKey: "profile:recommendations",
    fetcher: getProfileRecommendations,
    pageSize: 10,
    enabled: !!currentProfile?.id,
    select: (res) => ({ items: res.groups, totalCount: res.totalCount }),
});
const { items: workshops, page: workshopPage,totalPages:workshopPages, setPage: setWorkshopPage, totalCount: workshopTotal } = usePaginatedResource({
    cacheKey: "collections:workshops",
    fetcher: findWorkshopGroups,
    pageSize: 10,
    enabled: !!currentProfile?.id,
    params: { 
        type: "feedback", 
        location: isGlobal ? null : location, 
        global: isGlobal, 
        radius 
    },
    select: (res) => ({ items: res.groups, totalCount: res.totalCount }),
});



console.log("COMMEN",communities)
console.log("WOROK",workshops)

  const { error, setError, setSuccess, setSeo } = useContext(Context);
 


  // ── unmount cleanup ──
  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  // ── fetch story if storyId in params ──
  useEffect(() => {
    if (!storyId) return;
    dispatch(getStory({ id: storyId })).then(res =>
      checkResult(res,
        (payload) => { dispatch(setPagesInView({ page: payload.story })); },
        (err) => setError(err.message)
      )
    );
  }, [storyId]);

 
  // ── reset location when toggling global ──
  useEffect(() => {
    setLocation(DEFAULT_LOCATION);
  }, [isGlobal]);

  // ── request location when switching to local ──
  useEffect(() => {
    if (!isGlobal) {
      isNative ? requestLocation() : webRequestLocation();
    }
  }, [isGlobal]);

  // ── register user location only when location actually changes ──
  useEffect(() => {
    if (!currentProfile?.id) return;
    const register = async () => {
      const city = await fetchCity(location);
      registerUser(currentProfile?.id, { longitude: location.longitude, latitude: location.latitude, city });
    };
    register();
  }, [location]);

  // const fetchWorkshops = async () => {
  //   try {
  //     const res = await dispatch(findWorkshopGroups({
  //       location: isGlobal ? null : location,
  //       radius: 50,
  //       global: isGlobal
  //     }));
  //     checkResult(res, ({ groups }) => {
  //       if (!isMounted.current) return;
  //       const sort = [...groups].sort((a, b) => new Date(b.updated) - new Date(a.updated));
   
  //       setLoading(false);
  //     });
  //   } catch (err) {
  //     console.error("Failed fetching workshops:", err);
  //   }
  // };

  const applyLocation = (coords) => {
    setLocation(coords);
    if (currentProfile?.id) {
      registerUser(currentProfile?.id, coords);
      setLoading(false);
    }
  };

  const webRequestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const name = await fetchCity({ latitude: coords.latitude, longitude: coords.longitude });
        applyLocation({ latitude: coords.latitude, longitude: coords.longitude, city: name });
        setError(null);
        setLoading(false);
      },
      () => {
        setError("We use location to connect with your fellow writers. Reload for access.");
        setLoading(false);
      }
    );
  };

  const requestLocation = async () => {
    setLoading(true);
    try {
      let permStatus = await Geolocation.checkPermissions();
      if (permStatus.location === 'prompt' || permStatus.location === 'denied') {
        permStatus = await Geolocation.requestPermissions();
      }
      if (permStatus.location === 'granted') {
        const { coords } = await Geolocation.getCurrentPosition();
        const name = await fetchCity({ latitude: coords.latitude, longitude: coords.longitude });
        setLoading(false);
        applyLocation({ latitude: coords.latitude, longitude: coords.longitude, city: name });
        setError(null);
      } else {
        setError("Location permission denied. Please enable it in your device settings.");
      }
    } catch (err) {
      console.error("Error requesting location:", err);
      setError("Could not get location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clickGlobal = () => setIsGlobal(prev => !prev);

  const handleGroupClick = () => {
    if (!location?.latitude || !location?.longitude) return;
    setLoading(true);
    setError(null);
    dispatch(setPagesInView({ pages: [] }));
    dispatch(setCollections({ collections: [] }));
    dispatch(findWorkshopGroup({
      profile: currentProfile,
      story: page ?? null,
      isGlobal,
      location,
      radius
    })).then(res => {
      checkResult(
        res,
        payload => {
          if (payload?.collection) {
            router.push(Paths.collection.createRoute(payload.collection.id), 'forward', 'push');
          }
        },
        err => setError(err.message)
      );
      setLoading(false);
    });
  };
useEffect(() => {
  dispatch(setCurrentPage({ key: "workshops", page: 1 }));
  dispatch(setCurrentPage({ key: "communities", page: 1 }));
}, [isGlobal, location, radius]);
  const isLocationReady = isGlobal || (location?.latitude && location?.longitude);

  return (
    <IonContent

className='page-content'
      fullscreen
    
    >
  
   
        <div className={`page-content dark:bg-base-bgDark  ${PAGE_Y} ${STACK_LG}`}>
          <div className={WRAP}>
            <div className={`${CARD} ${CARD_INNER}`}>
              {page?.id && <WorkshopContextCard page={page} />}

              <div className={`${ROW_BETWEEN}`}>
                <h2 className={`${TITLE} dark:text-cream`}>
                  {currentProfile?.username.toLowerCase()}
                </h2>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLocationReady ? "bg-emerald-600" : "bg-yellow-500"}`}>
                  <img src={check} alt="status" className="w-5 h-5" />
                </div>
              </div>

              <div className={ROW_BETWEEN}>
                <span className="text-lg dark:text-emerald-200 font-medium">{isGlobal ? "Global" : "Local"}</span>
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={isGlobal}
                  onChange={clickGlobal}
                />
              </div>

              {!isGlobal && (
                <div className={STACK_MD}>
                  <div className={`${INPUT_WRAP} ${STACK_SM}`}>
                    <h3 className="font-medium dark:text-cream text-lg">Choose Location</h3>
                    <GoogleMapSearch onLocationSelected={setLocation} />
                    <div className={INPUT_ROW}>
                      <span className="text-sm  dark:text-cream  text-gray-600">Radius</span>
                      <input
                        type="number"
                        value={radius}
                        onChange={(e) => setRadius(e.target.value)}
                        className="w-16 bg-transparent  dark:text-cream text-sm outline-none"
                      />
                      <span className="text-sm  dark:text-cream  text-gray-500">mi</span>
                    </div>
                  </div>
                </div>
              )}

              <button onClick={handleGroupClick} className={BTN_PRIMARY}>
                Join a Workshop
              </button>

              {loading && (
                <IonLoading isOpen={loading} message={"Loading your space..."} spinner="crescent" />
              )}
             </div>   
                  </div>             
  <ExploreList 
    label={"Communities"} 
    items={communities}
    page={communityPage}
  
  totalPages={comTotalPage}
    setPage={setCommunityPage}
    totalCount={communityTotal}
    pageSize={10}
  />
  <ExploreList 
    label={"Workshops"} 
    items={workshops}
    totalPages={workshopPages}
    page={workshopPage}
    setPage={setWorkshopPage}
    totalCount={workshopTotal}
    pageSize={10}
  />

       

     

    

   
      </div>
    </IonContent>
  );
};

export default WorkshopContainer;


const WorkshopContextCard = ({ page }) => {
  if (!page) return null;
  return (
    <div className={`${CARD} ${CARD_INNER} border-l-4 border-base-soft`}>
      <span className="text-xs uppercase tracking-wide text-text-secondary">
        Workshop Context
      </span>
      <h3 className="text-lg font-semibold text-text-primary leading-snug">
        {page.title.length > 40 ? page.title.slice(0, 47) + "..." : page.title.length > 0 ? page.title : "Untitled Story"}
      </h3>
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-text-secondary">Bring your voice into this space</span>
        <span className="text-xs font-medium text-text-brand">Active Workshop</span>
      </div>
    </div>
  );
};