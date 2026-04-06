import { useContext, useRef,useEffect, useState } from 'react';
import { registerUser, postActiveUser, findWorkshopGroup,  findWorkshopGroups } from "../../actions/WorkshopActions";
import { useSelector, useDispatch } from 'react-redux';
import checkResult from '../../core/checkResult';
import Paths from '../../core/paths';
import loadingAnimation from "../../images/loading.gif";
import Context from '../../context';
import check from "../../images/icons/check.svg";
import { Geolocation } from '@capacitor/geolocation';
import DeviceCheck from '../../components/DeviceCheck';
import { IonContent, IonInput, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { setPagesInView } from '../../actions/PageActions';
import { setCollections } from '../../actions/CollectionActions';
import { useParams } from 'react-router';
import GoogleMapSearch from "../collection/GoogleMapSearch";
import ExploreList from '../../components/collection/ExploreList';
import fetchCity from '../../core/fetchCity';
import Enviroment from '../../core/Enviroment';

const DEFAULT_LOCATION = { latitude: 40.818622458906425, longitude: -73.8890363605602 };

const WorkshopContainer = () => {
  const dispatch   = useDispatch();
  const router     = useIonRouter();
  // const pathParams = useParams();
  const isNative   = DeviceCheck();

  const { currentProfile } = useSelector(state => state.users);
  const page                = useSelector(state => state.pages.pageInView);
  const { error, setError, setSuccess, setSeo } = useContext(Context);
  const [workshops,setWorkshops]=useState([])
  const [loading,  setLoading]  = useState(false);
  const [radius,   setRadius]   = useState(50);
  const [isGlobal, setIsGlobal] = useState(true);
  const [location, setLocation] = useState(DEFAULT_LOCATION);

  // ─── Location ────────────────────────────────────────────────────────────────

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
  // setSuccess(null);

  setSeo({
    title: "Plumbum (Workshop) - Your Writing, Your Community",
    description: "Explore events, workshops, and writer meetups on Plumbum.",
    name: "Plumbum",
    type: ""
  });

  if (currentProfile?.id) fetchWorkshops();
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

  // useEffect(() => {
  //   const timer = setTimeout(() => { setError(null); setSuccess(null); }, 4001);
  //   return () => clearTimeout(timer);
  // }, [error]);
console.log(isGlobal)
  useEffect(() => {

      
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

// const [navigateTo, setNavigateTo] = useState(null);

// useEffect(() => {
//   if (navigateTo) {
//     router.push(navigateTo);
//     setNavigateTo(null);
//   }
// }, [navigateTo]);


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
    <div className="flex justify-center items-center h-full w-full">
      <img src={loadingAnimation} alt="Loading..." className="w-24 h-24" />
    </div>
  ) : (
    <div className=" mt-12  flex flex-col gap-6">
      
      {/* Profile Card */}
      <div className="bg-white rounded-xl w-[36em] max-w-[90%] mx-auto shadow-md p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{currentProfile.username.toLowerCase()}</h2>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLocationReady ? "bg-emerald-600" : "bg-yellow-500"}`}>
            <img src={check} alt="status" className="w-5 h-5" />
          </div>
        </div>

        {/* Global / Local Toggle using DaisyUI */}
        <div className="flex justify-between items-center">
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
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-4">
              <h3 className="font-medium text-lg">Choose Location</h3>
              <GoogleMapSearch onLocationSelected={setLocation} />
              <div className="flex items-center gap-2 border border-gray-300 rounded-full p-2 px-4">
                <span className="text-lg">Radius:</span>
                <input
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="w-20 bg-transparent text-lg text-gray-800 outline-none"
                />
                <span>mi</span>
              </div>
            </div>
          </div>
        )}

        {/* Join Workshop Button */}
        <button
          onClick={handleGroupClick}
          className="w-full bg-emerald-600 text-white rounded-full py-4 font-semibold shadow-md hover:bg-emerald-700 transition-colors duration-200 mt-4"
        >
          Join a Workshop
        </button>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center py-4">
            <img src={loadingAnimation} alt="Loading..." className="w-20 h-20" />
          </div>
        )}
      </div>

      {/* Workshops List */}
      <div className=" mt-6">
        <ExploreList items={workshops} />
      </div>
    </div>
  )}
</IonContent>
};


export default WorkshopContainer;
