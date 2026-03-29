import { useContext, useEffect, useState } from 'react';
import { registerUser, postActiveUser, findWorkshopGroup, fetchWorkshopGroups, findWorkshopGroups } from "../../actions/WorkshopActions";
import { useSelector, useDispatch } from 'react-redux';
import checkResult from '../../core/checkResult';
import Paths from '../../core/paths';
import { getStory } from '../../actions/StoryActions';
import PageWorkshopItem from '../page/PageWorkshopItem';
import loadingAnimation from "../../images/loading.gif";
import InfoTooltip from '../../components/InfoTooltip';
import Context from '../../context';
import check from "../../images/icons/check.svg";
import { Geolocation } from '@capacitor/geolocation';
import DeviceCheck from '../../components/DeviceCheck';
import { IonContent, IonInput, useIonRouter } from '@ionic/react';
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
  const pathParams = useParams();
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
    if (currentProfile?.id) registerUser(currentProfile.id, coords)
 
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
  useEffect(()=>{
fetchWorkshops()
  },[isGlobal,currentProfile])
    const fetchWorkshops = async () => {
    if (!currentProfile) return;
    try {
      const res = await dispatch(findWorkshopGroups({
        location: currentProfile.location,
        radius: 50,
        global: isGlobal
      }));
      checkResult(res, ({ groups }) => {
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
    const timer = setTimeout(() => { setError(null); setSuccess(null); }, 4001);
    return () => clearTimeout(timer);
  }, [error]);
console.log(isGlobal)
  useEffect(() => {
    // if (currentProfile) {
      
async function activeUser(params) {
  
console.log("DSDSXC",location)

   currentProfile &&   dispatch(postActiveUser({ story: page, profile: currentProfile, location:location })).then(res => {
        checkResult(res,
          payload => {

            if (payload.profiles) {
              setError(null);
              setSuccess(`${payload.profiles.length} Users Active`);
            }
          },
          () => { setSuccess(null); setError("Error getting active users"); }
        );
        setLoading(false);
      });
    }
  
  activeUser()
    // }
  }, [currentProfile]);

  useEffect(() => {
    const { pageId } = pathParams;
    if (pageId) dispatch(getStory({ id: pageId }));
    setSeo({
      title: "Plumbum (Workshop) - Your Writing, Your Community",
      description: "Explore events, workshops, and writer meetups on Plumbum.",
      name: "Plumbum",
      type: ""
    });
  }, [pathParams.pageId]);

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
useEffect(()=>{
  console.log("FUSDH",isGlobal)
},[isGlobal])
  const handleGroupClick = () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    dispatch(setPagesInView({ pages: [] }));
    dispatch(setCollections({ collections: [] }));
    dispatch(findWorkshopGroup({
      profile: currentProfile,
      story: page ?? null,
      isGlobal,
      location,
      radius
    })).then(res => {
      checkResult(res,
        payload => {
          console.log("WORKSHOP PAYLOAD", payload);
          if (payload?.collection) {
            router.push(Paths.collection.createRoute(payload.collection.id));
          }
          if (payload?.error) {
            setError(payload.error.message);
            setSuccess(null);
          }
        },
        err => setError(err.message)
      );
      setLoading(false);
    });
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  const isLocationReady = isGlobal || (location?.latitude && location?.longitude);

  return (
    <IonContent style={{ "--background": Enviroment.palette.cream }} fullscreen className=''>
      {/* <div className=' overflow-hidden'> */}
        {currentProfile ? (
          <div className="text-emerald-800 max-w-[40em] mx-auto w-full shadow-sm sm:min-h-[30em] mt-12 flex flex-col text-left sm:w-80 p-4 rounded-lg">

            {/* Header */}
            <span className='flex my-8 flex-row justify-between'>
              <h2 className='text-xl font-bold ml-2'>{currentProfile?.username?.toLowerCase()}</h2>
              <span className={`${isLocationReady ? "bg-emerald-600" : "bg-yellow-500"} rounded-full w-8 max-h-6 flex`}>
                <img className="mx-auto my-auto" src={check} alt="status" />
              </span>
            </span>

            {/* Global / Local toggle */}
            <div className='flex flex-row mb-8 justify-start'>
              {/* <InfoTooltip text="Do you want to find users local to your area or around the world?" /> */}
              {/* <label className='flex w-full flex-row justify-between'>
                <h6 className='text-xl'>{isGlobal ? "Global" : "Local"}</h6> */}
                {/* <input
  type="checkbox"
  // checked={isGlobal}
  onClick={(e)=>{
    console.log("DSDX")
}}

                  // className={`toggle border-2 mx-4 border-emerald-800 border-opacity-50 my-auto
                  //   ${isGlobal ? 'toggle-success bg-emerald-600' : 'toggle-success bg-slate-400'}`}
                /> */}
              {/* </label> */}
           <label className='flex w-full flex-row justify-between'>
  <h6 className='text-xl'>{isGlobal ? "Global" : "Local"}</h6></label>
                <div/>
 <input
    type="checkbox"
    checked={isGlobal}
    onChange={(e=>{
      clickGlobal()
      // console.log("DSDx",e.target.value)
      
    })}
    // onChange={(e) => {console.log(e.target.checked)
    //   setIsGlobal(e.target.checked)}}
    className="toggle toggle-success mx-4"
  /> 
    {/* <div className='py-8 max-w-40'> */}
    {/* <label>Global</label> */}
   {/* <button
onClick={clickGlobal}
className={` w-20 h-20  rounded-full ${isGlobal?"bg-soft":"bg-blue-200"}  `}
  
  >Global</button>
  </div> */}
  {/* <GlobalRadio handleGlobal={clickGlobal} />
   */}
{/* // </label> */}
            </div>
            {/* {!isGlobal && ( */}
  <div className="space-y-4">

    {/* Collapse container */}
    <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-box">
      
      <input type="checkbox" defaultChecked /> 

      <div className="collapse-title text-lg font-medium">
        Choose Location
      </div>

      <div className={`${isGlobal?"collapse-content":""} space-y-4`}>
        
        {/* Search */}
        <GoogleMapSearch onLocationSelected={setLocation} />

        {/* Radius */}
        <div className="flex items-center border-2 border-emerald-800 border-opacity-50 rounded-full p-2">
          <h6 className="text-xl ml-4">Radius:</h6>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="input max-w-24 text-xl bg-transparent ml-4"
          />
          <span className="ml-2">mi</span>
        </div>

      </div>
    </div>

  </div>
{/* )} */}
{/* <div
  style={{
    maxHeight: isGlobal ? "0px" : "500px",
    opacity: isGlobal ? 0 : 1,
    overflow: "hidden",
    transition: "all 0.3s ease"
  }}
>
  <GoogleMapSearch onLocationSelected={setLocation} />

  <label className='mb-4 mt-8 border-2 border-emerald-800 flex flex-row p-2 border-opacity-50 rounded-full'>
    <h6 className='text-xl my-auto ml-4'>Radius:</h6>
    <input
      type="number"
      value={radius}
      onChange={e => setRadius(e.target.value)}
      className="input my-auto max-w-36 text-xl text-emerald-800 bg-transparent"
    />
    mi
  </label>
</div> */}
            {/* Local-only controls */}
            {/* {!isGlobal && (
              <>
                <GoogleMapSearch onLocationSelected={setLocation} />
                <label className='mb-4 mt-8 border-2 border-emerald-800 flex flex-row p-2 border-opacity-50 rounded-full'>
                  <h6 className='text-xl my-auto ml-4'>Radius:</h6>
                  <input
                    type="number"
                    value={radius}
                    onChange={e => setRadius(e.target.value)}
                    className="input my-auto max-w-36 text-xl text-emerald-800 bg-transparent"
                  />
                  mi
                </label>
              </>
            )} */}

            {page && <PageWorkshopItem page={page} />}

            {/* CTA */}
            <div className="bg-soft flex bg-blueSea text-white mt-8 rounded-full cursor-pointer" onClick={handleGroupClick}>
              <h6 className='mx-auto text-xl p-6 my-auto'>Join a Workshop</h6>
            </div>

            {loading && (
              <div className='w-fit flex justify-center p-8'>
                <img src={loadingAnimation} className='max-w-24 mx-auto p-6 max-h-24' alt="loading" />
              </div>
            )}
          </div>
        ) : (
          <div className='text-emerald-800 mx-auto w-[92vw] shadow-sm sm:h-[30em] mt-20 flex flex-col text-left sm:w-80 p-4 skeleton bg-slate-100 rounded-lg' />
        )}
      {/* </div> */}
      <div className='mt-8'>
         <ExploreList items={workshops} />
         </div>
    </IonContent>
  );
};

export default WorkshopContainer;
