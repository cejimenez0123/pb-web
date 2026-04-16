import { useContext, useRef,useEffect, useState } from 'react';
import { registerUser, postActiveUser, findWorkshopGroup,  findWorkshopGroups, fetchWorkshopGroups } from "../../actions/WorkshopActions";
import { useSelector, useDispatch } from 'react-redux';
import checkResult from '../../core/checkResult';
import Paths from '../../core/paths';
import loadingAnimation from "../../images/loading.gif";
import Context from '../../context';
import check from "../../images/icons/check.svg";
import { Geolocation } from '@capacitor/geolocation';
import DeviceCheck from '../../components/DeviceCheck';
import { IonContent, IonInput, IonLoading, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { setPagesInView } from '../../actions/PageActions';
import { setCollections } from '../../actions/CollectionActions';
import { useParams } from 'react-router';
import GoogleMapSearch from "../collection/GoogleMapSearch";
import ExploreList from '../../components/collection/ExploreList';
import fetchCity from '../../core/fetchCity';
import Enviroment from '../../core/Enviroment';
import { getStory } from '../../actions/StoryActions';

const DEFAULT_LOCATION = { latitude: 40.818622458906425, longitude: -73.8890363605602 };
// ── Layout ──────────────────────────────────────
const WRAP = "max-w-[50em] mx-auto px-4";
const WRAPB ="mx-auto w-[100%]"
const PAGE_Y = "pt-16 pb-10";
const STACK_LG = "space-y-8";
const STACK_MD = "space-y-6";
const STACK_SM = "space-y-3";

// ── Card ────────────────────────────────────────
const CARD = "rounded-2xl shadow-sm bg-base-bg border-1 border border-earth p-6";
const CARD_INNER = "space-y-5 bg-base-bg ";

// ── Rows / alignment ────────────────────────────
const ROW_BETWEEN = "flex items-center justify-between";
const ROW_CENTER = "flex items-center gap-2";

// ── Inputs / controls ───────────────────────────
const INPUT_WRAP = "bg-gray-50 border border-gray-200 rounded-xl p-4";
const INPUT_ROW = "flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2";

// ── Buttons ─────────────────────────────────────
const BTN_PRIMARY = "w-full bg-emerald-600 text-white rounded-full py-4 font-semibold shadow-sm hover:bg-emerald-700 transition-colors duration-200";

// ── Text ────────────────────────────────────────
const TITLE = "text-xl font-semibold";
const SUBTLE = "text-sm text-gray-500";
const WorkshopContainer = () => {
  const dispatch   = useDispatch();
  const router     = useIonRouter();
  const { storyId } = useParams();
  // const pathParams = useParams();
  const isNative   = DeviceCheck();

  const { currentProfile } = useSelector(state => state.users);
  const page = useSelector(state => state.pages.pageInView);
  
  const { error, setError, setSuccess, setSeo } = useContext(Context);
  const [workshops,setWorkshops]=useState([])
  const [communities,setCommunities]=useState([])
  const [loading,  setLoading]  = useState(false);
  const [radius,   setRadius]   = useState(50);
  const [isGlobal, setIsGlobal] = useState(true);
  const [location, setLocation] = useState(DEFAULT_LOCATION);

  // ─── Location ────────────────────────────────────────────────────────────────
useEffect(() => {
  if (!storyId) return;

  dispatch(getStory({ id: storyId })).then(res =>
    checkResult(res,
      (payload) => {
        dispatch(setPagesInView({ page: payload.story }));
      },
      (err) => setError(err.message)
    )
  );
}, [storyId]);
  const applyLocation = (coords) => {

    setLocation(coords);
    if (currentProfile?.id) 
      {registerUser(currentProfile.id, coords)
        setLoading(false)
      }
 
  };

  const webRequestLocation = () => {
    navigator.geolocation.getCurrentPosition(
     async ({ coords }) => {
        const name =await fetchCity({ latitude: coords.latitude, longitude: coords.longitude })
        applyLocation({ latitude: coords.latitude, longitude: coords.longitude,city:name });
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
         const name =await fetchCity({ latitude: coords.latitude, longitude: coords.longitude })
          setLoading(false)
         applyLocation({ latitude: coords.latitude, longitude: coords.longitude,city:name });
        // applyLocation({ latitude: coords.latitude, longitude: coords.longitude,city:name });
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

  // ─── Effects ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    setLocation(DEFAULT_LOCATION);
  }, [isGlobal]);
  useIonViewWillEnter(() => {
  setError(null);

  if (!currentProfile?.id) return;

  // wait for profile + optionally page hydration
  fetchWorkshops();
});


const isMounted = useRef(true);
useEffect(() => {
  return () => { isMounted.current = false; };
}, []);


    const fetchWorkshops = async () => {
   
    try {
      const res = await dispatch(findWorkshopGroups({
        location: currentProfile?.location,
        radius: 50,
        global: isGlobal
      }));
      checkResult(res, ({ groups }) => {
         if (!isMounted.current) return;
         let sort = [...groups].sort((a,b)=>new Date(b.updated)-new Date(a.updated))
        setWorkshops(prev => ({ ...prev, workshops: sort|| [] }));
      });
    } catch (err) {
      console.error("Failed fetching workshops:", err);
    }
  };
  useEffect(() => {
    if (!isGlobal) {
      isNative ? requestLocation() : webRequestLocation();
      
    }
 
  }, [isGlobal]);

  useEffect(() => {
    dispatch(fetchWorkshopGroups())
      
async function activeUser(params) {
  


   currentProfile &&   dispatch(postActiveUser({ story: page, profile: currentProfile, location:location })).then(res => {
        checkResult(res,
          payload => {

            if (payload.profiles) {
              setError(null);
              setSuccess(`${payload.profiles.length} Users Active`);
            }
          },
          () => { 
            // setSuccess(null); setError("Error getting active users"); 
          }
        );
        setLoading(false);
      });
    }
  
  activeUser()
    // }
  }, [currentProfile]);



  useEffect(() => {
    // console.log("DSSDXXCWQ",location)
    async function fetch (){
    const city = await fetchCity(location)
   
      if (currentProfile) registerUser(currentProfile.id, {longitude:location.longitude,latitude:location.latitude,city});
 

    }
    fetch()
   }, [currentProfile, location]);


  {/* Toggle */}

const clickGlobal = () => {
  
  setIsGlobal(prev=>!prev);

};




const handleGroupClick = () => {
  // Don't proceed if location is missing
  if (!location?.latitude || !location?.longitude) return;

  setLoading(true);
  setError(null);
  // setSuccess(null);

  // Clear any stale state if needed
  dispatch(setPagesInView({ pages: [] }));
  dispatch(setCollections({ collections: [] }));

  // Fetch or create the workshop group
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
          // Navigate directly using Ionic router
          router.push(Paths.collection.createRoute(payload.collection.id), 'forward', 'push');
        }
        if (payload?.error) {
          setError(payload.error.message);
          // setSuccess(null);
        }
      },
      err => setError(err.message)
    ).finally(() => setLoading(false));
  });
};


  const isLocationReady = isGlobal || (location?.latitude && location?.longitude);
return<IonContent
  style={{ "--background": Enviroment.palette.cream }}
  fullscreen
  className="flex flex-col items-center pb-8"
>
  {!currentProfile ? (
    // Loading State
   <div className="flex items-center justify-center h-full">
      <IonLoading
  isOpen={!currentProfile}
  message={"Loading your space..."}
  spinner="crescent"
/>
    </div>
  ) : (
   <div className={`${WRAPB} ${PAGE_Y} ${STACK_LG}`}>
      
      <div className={WRAP+""}>
      <div className={`${CARD}  bg-base-bg   ${CARD_INNER}`}>
        {page?.id && <WorkshopContextCard page={page} />}
        {/* Header */}
   <div className={ROW_BETWEEN+"  "}>
       <h2 className={TITLE}>
  {currentProfile.username.toLowerCase()}
</h2>

          <div className={`w-8 h-8  rounded-full flex items-center justify-center ${isLocationReady ? "bg-emerald-600" : "bg-yellow-500"}`}>
            <img src={check} alt="status" className="w-5 h-5" />
          </div>
        </div>

        {/* Global / Local Toggle using DaisyUI */}
       <div className={ROW_BETWEEN}>
          <span className="text-lg font-medium">{isGlobal ? "Global" : "Local"}</span>
          <input
            type="checkbox"
            className="toggle toggle-success"
            checked={isGlobal}
            onChange={clickGlobal}
          />
        </div>

        {/* Google Map Search + Radius (only show for Local) */}
        {!isGlobal && (
        <div className={STACK_MD}>
  <div className={`${INPUT_WRAP} ${STACK_SM}`}>
              <h3 className="font-medium text-lg">Choose Location</h3>
              <GoogleMapSearch onLocationSelected={setLocation} />
              <div className={INPUT_ROW}>
  <span className="text-sm text-gray-600">Radius</span>
  <input
    type="number"
    value={radius}
    onChange={(e) => setRadius(e.target.value)}
    className="w-16 bg-transparent text-sm outline-none"
  />
  <span className="text-sm text-gray-500">mi</span>
</div>
         
            </div>
          </div>
        )}

        {/* Join Workshop Button */}
        <button
          onClick={handleGroupClick}
          className={BTN_PRIMARY}  >
          Join a Workshop
        </button>

        {/* Loading Indicator */}
        {loading && (
         <div className="flex justify-center pt-2">
            <IonLoading
  isOpen={loading}
  message={"Loading your space..."}
  spinner="crescent"
/>
          </div>
        )}
      </div>
    <div>
</div>
    </div>
<div className='flex flex-col space-y-4 pb-24'>
        <ExploreList label={"Communities"} collection={communities} />
     
   
        <ExploreList label={"Workshops"}collection={workshops} />
      </div>
   </div>
  )}
</IonContent>
};


export default WorkshopContainer;

 const WorkshopContextCard = ({ page }) => {
  if (!page) return null;

  return (
    <div className={`${CARD} ${CARD_INNER} border-l-4 border-emerald-500`}>
      
      {/* Label */}
      <span className="text-xs uppercase tracking-wide text-gray-400">
        Workshop Context
      </span>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 leading-snug">
        {page.title.length > 40 ? page.title.slice(0, 47) + "..." : page.title.length > 0 ? page.title : "Untitled Story"}
      </h3>

   

      {/* Meta row */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-gray-400">
          Bring your voice into this space
        </span>

        <span className="text-xs font-medium text-emerald-600">
          Active Workshop
        </span>
      </div>
    </div>
  );
};