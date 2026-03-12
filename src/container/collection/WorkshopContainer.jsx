import { useContext, useEffect, useState } from 'react';
import { registerUser, postActiveUser, findWorkshopGroup } from "../../actions/WorkshopActions";
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
import { IonContent, useIonRouter } from '@ionic/react';
import { setPagesInView } from '../../actions/PageActions';
import { setCollections } from '../../actions/CollectionActions';
import { useParams } from 'react-router';
import GoogleMapSearch from "../collection/GoogleMapSearch";

const DEFAULT_LOCATION = { latitude: 40.818622458906425, longitude: -73.8890363605602 };

const WorkshopContainer = () => {
  const dispatch   = useDispatch();
  const router     = useIonRouter();
  const pathParams = useParams();
  const isNative   = DeviceCheck();

  const { currentProfile } = useSelector(state => state.users);
  const page                = useSelector(state => state.pages.pageInView);
  const { error, setError, setSuccess, setSeo } = useContext(Context);

  const [loading,  setLoading]  = useState(false);
  const [radius,   setRadius]   = useState(50);
  const [isGlobal, setIsGlobal] = useState(true);
  const [location, setLocation] = useState(DEFAULT_LOCATION);

  // ─── Location ────────────────────────────────────────────────────────────────

  const applyLocation = (coords) => {
    setLocation(coords);
    if (currentProfile?.id) registerUser(currentProfile.id, coords);
  };

  const webRequestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        applyLocation({ latitude: coords.latitude, longitude: coords.longitude });
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
        applyLocation({ latitude: coords.latitude, longitude: coords.longitude });
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
    setLocation(isGlobal ? null : DEFAULT_LOCATION);
  }, [isGlobal]);

  useEffect(() => {
    if (!isGlobal) {
      isNative ? requestLocation() : webRequestLocation();
    }
  }, [isGlobal]);

  useEffect(() => {
    const timer = setTimeout(() => { setError(null); setSuccess(null); }, 4001);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (currentProfile) {
      dispatch(postActiveUser({ story: page, profile: currentProfile, location })).then(res => {
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
  }, [page, currentProfile]);

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
    if (currentProfile) registerUser(currentProfile.id, location);
  }, [currentProfile, location]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleGlobal = () => setIsGlobal(prev => !prev);

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
    <IonContent style={{ "--background": "#f4f4e0" }} fullscreen className=''>
      <div className='h-[100vh] overflow-hidden'>
        {currentProfile ? (
          <div className="text-emerald-800 mx-auto w-full shadow-sm sm:min-h-[30em] mt-12 flex flex-col text-left sm:w-80 p-4 rounded-lg">

            {/* Header */}
            <span className='flex my-8 flex-row justify-between'>
              <h2 className='text-xl font-bold ml-2'>{currentProfile.username}</h2>
              <span className={`${isLocationReady ? "bg-emerald-600" : "bg-yellow-500"} rounded-full w-8 max-h-6 flex`}>
                <img className="mx-auto my-auto" src={check} alt="status" />
              </span>
            </span>

            {/* Global / Local toggle */}
            <div className='flex flex-row mb-8 justify-start'>
              <InfoTooltip text="Do you want to find users local to your area or around the world?" />
              <label className='flex w-full flex-row justify-between'>
                <h6 className='text-xl'>{isGlobal ? "Global" : "Local"}</h6>
                <input
                  type="checkbox"
                  checked={isGlobal}
                  onChange={handleGlobal}
                  className={`toggle border-2 border-emerald-800 border-opacity-50 my-auto
                    ${isGlobal ? 'toggle-success bg-emerald-600' : 'toggle-success bg-slate-400'}`}
                />
              </label>
            </div>

            {/* Local-only controls */}
            {!isGlobal && (
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
            )}

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
      </div>
    </IonContent>
  );
};

export default WorkshopContainer;

// import { useContext, useEffect, useState } from 'react';
// import {registerUser,postActiveUser,findWorkshopGroup} from "../../actions/WorkshopActions"
// import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
// import checkResult from '../../core/checkResult';
// import Paths from '../../core/paths';
// import { getStory } from '../../actions/StoryActions';
// import PageWorkshopItem from '../page/PageWorkshopItem';
// import loadingAnimation from "../../images/loading.gif"
// import InfoTooltip from '../../components/InfoTooltip';
// import Context from '../../context';
// // import GoogleMapSearch from './GoogleMapSearch';
// // import { LoadScript } from '@react-google-maps/api';
// import check from "../../images/icons/check.svg"
// import { Geolocation } from '@capacitor/geolocation';
// import DeviceCheck from '../../components/DeviceCheck';
// import { IonContent, useIonRouter } from '@ionic/react';
// import { setPagesInView } from '../../actions/PageActions';
// import { setCollections } from '../../actions/CollectionActions';
// import { useParams } from 'react-router';
// import GoogleMapSearch from "../collection/GoogleMapSearch"
// const WorkshopContainer = (props) => {

//   const dispatch = useDispatch()
//   const router = useIonRouter()
//     const pathParams = useParams()
//       const {currentProfile} = useSelector(state=>state.users)
//   const page = useSelector(state=>state.pages.pageInView)
//   const [loading,setLoading]=useState(false)
//   const {error,setError,setSuccess,setSeo}=useContext(Context)
//   const isNative = DeviceCheck()
//   const [radius,setRadius]=useState(50)
//   const [location,setLocation]=useState({latitude:40.818622458906425,longitude:-73.8890363605602})

//   const [isGlobal,setIsGlobal]=useState(true)
 
  
  
//   useEffect(()=>{
//    if(isGlobal){
//     setLocation(null)
//    }
  
//   },[isGlobal])
//   useEffect(()=>{
// setTimeout(()=>{

//     setError(null)
//   setSuccess(null)
  
 
// },4001)
//   },[error])

//   useEffect(()=>{
//     if(currentProfile){

//       dispatch(postActiveUser({story:page,profile:currentProfile,location})).then(res=>{
//           checkResult(res,payload=>{
//             if(payload.profiles){
//               setError(null)

//               setSuccess(payload.profiles.length+" Users Active")
//               setLoading(false)
//             }
//           },err=>{
//             setSuccess(null) 
//             setError("Error getting active users")
//           setLoading(false)
//           })
//       })

//     }
//   },[page,currentProfile])
//   useEffect(()=>{
//     const {pageId}=pathParams
//     if(pageId){
//       dispatch(getStory({id:pageId}))
//     }
//       setSeo({title:"Plumbum (Workshop) - Your Writing, Your Community", description:"Explore events, workshops, and writer meetups on Plumbum.", name:"Plumbum", type:""})

//   },[pathParams.pageId])

//   useEffect(()=>{
//     if(currentProfile){
//       registerUser(currentProfile.id,location)
//     }

//   },[currentProfile,location])

//   const webRequestLocation=()=>{
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//         if(currentProfile&&currentProfile.id){
//           registerUser(currentProfile.id,location)
//         }
    
//         setError(null);
//         setLoading(false);
//       },
//       (err) => {
//         console.log("location error")
//         setError("We use location to conect with you fellow writers. Reload for access.");
//         setLoading(false);
  
//       }
//     );
//   }


//     useEffect(() => {
//       if(!isGlobal){
//       if (isNative) {
//         requestLocation();
//       } else {
//         webRequestLocation();
//       }}
//     }, [isGlobal]);
   


//  const requestLocation = async () => {
//   setLoading(true);
//   try {
//     // Check current geolocation permission state
//     const permStatus = await Geolocation.checkPermissions();

//     if (permStatus.location === 'granted') {
//       // Permission already granted, get location
//       const position = await Geolocation.getCurrentPosition();
//       setLocation({
//         latitude: position.coords.latitude,
//         longitude: position.coords.longitude,
//       });
//       if (currentProfile && currentProfile.id) {
//         registerUser(currentProfile.id, {
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//       }
//       setError(null);
//     } else if (permStatus.location === 'prompt' || permStatus.location === 'denied') {
//       // Request permission explicitly, triggers iOS popup if needed
//       const requestResult = await Geolocation.requestPermissions();
//       if (requestResult.location === 'granted') {
//         const position = await Geolocation.getCurrentPosition();
//         setLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//         if (currentProfile && currentProfile.id) {
//           registerUser(currentProfile.id, {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         }
//         setError(null);
//       } else {
//         setError("Location permission denied. Please enable location permissions in your device settings.");
//       }
//     } else {
//       setError("Unable to determine location permission state.");
//     }
//   } catch (err) {
//     console.error("Error requesting location or getting position:", err);
//     setError("Could not get location. Please try again.");
//   } finally {
//     setLoading(false);
//   }
// };


//   const handleGlobal = () => {
//    setIsGlobal(!isGlobal)
  
//   };
//   const handleGroupClick=()=>{
//     setLoading(true)
//     setError(null)
//     setSuccess(null)
//     // if(currentProfile){
//     if( page){
//       dispatch(setPagesInView({pages:[]}))
//       dispatch(setCollections({collections:[]}))
//       dispatch(findWorkshopGroup({profile:currentProfile,story:page,isGlobal,location,radius})).then(res=>{
//       checkResult(res,payload=>{
       
//         if(payload && payload.collection){
//           setLoading(false)
//           router.push(Paths.collection.createRoute(payload.collection.id))
//         }
//         if(payload.error){
//           setError(payload.error.message)
//           setSuccess(null)
//           setLoading(false)
//         }
         
//       },err=>{
//         setLoading(false)
//         setError(err.message)
//         setSuccess(null)
//       })
//     })
//   }else{
//     dispatch(findWorkshopGroup({profile:currentProfile,story:null,isGlobal,location})).then(res=>{
//       checkResult(res,payload=>{
         
//         if(payload && payload.collection){
//           setLoading(false)
//           router.push(Paths.collection.createRoute(payload.collection.id))
//         }
//         if(payload.error){
//           setError(payload.error.message)
//           setSuccess(null)
//           setLoading(false)
//         }
         
//       },err=>{
//         setLoading(false)
//         setError(err.message)
//         setSuccess(null)
//       })
//     })
//   }}


  
// const localCheck=()=>{
//   return(<label className=' mb-4 mt-8 border-2 border-emerald-800 flex flex-row p-2 number border-opacity-50 rounded-full   '>
        
//           <h6 className='text-xl my-auto ml-4'>Radius:</h6>
     
    
//         <input type={"number"} 
//         value={radius}
//         onChange={(e)=>{
//           setRadius(e.target.value)
//         }}
//         className="input my-auto max-w-36 text-xl text-emerald-800 bg-transparent "/>mi</label>)
// }

//   return (
//     <IonContent style={{"--background":"#f4f4e0"}} fullscreen={true} className=''>
//     <div>
 
// {/*   
//    <div className='h-[100vh] overflow-hidden'>
//       {currentProfile?(
//         <div className="text-emerald-800 mx-auto w-[100%] shadow-sm sm:min-h-[30em] mt-12 flex flex-col  text-left sm:w-[20rem]  p-4    rounded-lg ">
//        <div>
//         <span className='flex my-8 flex-row justify-between'>
//      <h2 className='text-xl  font-bold ml-2'> {currentProfile.username}</h2>{<span className={`${location&& location.longitude && location.latitude||isGlobal?"bg-emerald-600":"bg-yellow-500" } rounded-full w-8 max-h-6 flex`}>
//       <img  className="mx-auto my-auto" src={check}/></span>}</span></div>
//      <div className='flex flex-row mb-8  justify-start'>
//      <InfoTooltip text="Do you want to find users local to your area or around the world?" />


// </div> */}


//       {!isGlobal ? (
//   <>
//     <GoogleMapSearch onLocationSelected={(coordinates) => setLocation(coordinates)} />
//     {localCheck()}
//   </>
// ) : null}
//   {page?<PageWorkshopItem page={page}/>:null}
  
   
//       <div  className="bg-soft flex bg-blueSea text-white mt-8 rounded-full"
//       onClick={handleGroupClick} ><h6 className='mx-auto text-xl   p-6 my-auto'>Join a Workshop</h6>
//     </div>       <div className='w-fit flex justify-center p-8'>     
//   {loading?<img src={loadingAnimation} className='max-w-24 mx-auto p-6 max-h-24 '/>:null}
//   </div>
//   </div>

// ):<div className='text-emerald-800 mx-auto w-[92vw] shadow-sm sm:h-[30em] mt-20 flex flex-col  text-left sm:w-[20rem] 0 p-4  skeleton bg-slate-100  rounded-lg '/>}

    
   
//     {/* </div> */}

// {/* </div> */}
// </IonContent>
//   );
// };
// export default WorkshopContainer