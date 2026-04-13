import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateProfile,
  deleteUserAccounts,
  deletePicture,
  setDialog,
  signOutAction
} from "../actions/UserActions";
import { uploadProfilePicture } from "../actions/ProfileActions";
import { Geolocation } from "@capacitor/geolocation";
import { IonContent, IonLoading, useIonRouter } from "@ionic/react";

import checkResult from "../core/checkResult";
import Context from "../context";
import Enviroment from "../core/Enviroment";
import { useSelector } from "react-redux";
import GoogleMapSearch from "./collection/GoogleMapSearch";
import { Capacitor } from "@capacitor/core";
import Paths from "../core/paths";
import fetchCity from "../core/fetchCity";
import { useDialog } from "../domain/usecases/useDialog";
// List of countries (can be expanded)
const COUNTRIES = [
  "United States",
  "Canada",
  "Mexico",
  "United Kingdom",
  "France",
  "Germany",
  "Spain",
  "Italy",
  // ...add more countries as needed
];


async function reverseGeocode(lat, lng) {

  try {

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );

    const data = await res.json();

    return data?.display_name || "";

  } catch (err) {
    console.log("Reverse geocode error:", err);
    return "";
  }

}
export default function SettingsContainer() {
  const dispatch = useDispatch();
  const router = useIonRouter();
const {openDialog,dialog,closeDialog}=useDialog()
  const {  setError, setSuccess } = useContext(Context);
  const {currentProfile}=useSelector(state=>state.users)
  const [file, setFile] = useState(null);
// Helper: extract city from full address
// List of countries (expand as needed)
const COUNTRIES = [
  "United States",
  "Canada",
  "Mexico",
  "United Kingdom",
  "France",
  "Germany",
  "Spain",
  "Italy",
  // add more
];

const [form, setForm] = useState({
  username: "",
  selfStatement: "",
  isPrivate: false,
  profilePicture: "",
  location: {
    latitude: null,
    longitude: null,
     city: currentProfile?.location?.city ?? ""

  }
});

  const [pictureUrl, setPictureUrl] = useState(
    "https://placehold.co/200"
  );

  const [loading, setLoading] = useState(false);
useEffect(() => {
  if (!loading && !currentProfile) {
    router.push(Paths.login(), "root"); // replace history
  }
}, [loading, currentProfile]);
  /* --------------------------
     Load profile into form
  ---------------------------*/
  useEffect(() => {

    if (!currentProfile) return;

    const pic = currentProfile.profilePic;

// console.log("Current profile location in settings useEffect:", currentProfile.location)
    setForm({
      username: currentProfile.username ?? "",
      selfStatement: currentProfile.selfStatement ?? "",
      isPrivate: currentProfile.isPrivate ?? false,
      profilePicture: pic ?? "",
       location: {
      latitude: currentProfile?.location?.latitude??40,
      longitude: currentProfile?.location?.longitude??73,
      city: currentProfile?.location?.city || ""
    }
    });

    if (pic) {
      if (pic.includes("http")) {
        setPictureUrl(pic);
      } else {
        setPictureUrl(Enviroment.imageProxy(pic));
      }
    }

    setLoading(false);

  }, [currentProfile]);




const handleUseCurrentLocation = async () => {
    try {
      const coords = await getPosition(); // your helper to get lat/lng
      if (!coords) throw new Error("Could not get location");

      // Use fetchCity helper to get city + state
      const cityCountry = await fetchCity(coords);

      console.log("Fetched city for current location:", cityCountry);
      handleChange("location", {
        ...coords,
        city: cityCountry || "",
      });

      setSuccess("Location updated!");
    } catch (err) {
      console.error(err);
      setError("Unable to fetch current location.");
    } finally {
      setLoading(false);
    }
};
// Returns { latitude, longitude } for both native and browser
const getPosition = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      // Native mobile (iOS/Android)
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } else {
      // Browser fallback: try navigator first
      if (navigator.geolocation) {
        return await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
            (err) => {
              console.warn("Navigator geolocation failed, falling back to Google API:", err);
              reject(err);
            },
            { enableHighAccuracy: true, timeout: 5000 }
          );
        });
      }

      // If navigator fails, fallback to Google Geolocation API
      const res = await fetch(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`,
        { method: "POST" }
      );
      const data = await res.json();
      return {
        latitude: data.location.lat,
        longitude: data.location.lng,
      };
    }
  } catch (err) {
    console.error("Unable to get location:", err);
    return null;
  }
};
    // Reverse geocode to get human-readable address
   
  


  /* --------------------------
     Form update
  ---------------------------*/
  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  /* --------------------------
     Image upload preview
  ---------------------------*/
  const handleImage = (e) => {

    const selected = e.target.files?.[0];

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Upload a valid image");
      return;
    }

    setFile(selected);
    setPictureUrl(URL.createObjectURL(selected));
  };

  /* --------------------------
     Submit update
  ---------------------------*/
  const handleSubmit = async () => {

    if (!currentProfile) return;

    try {

      let profilePicture = form.profilePicture;

      if (file) {

        await dispatch(deletePicture({
          fileName: currentProfile.profilePic
        }));

        const upload = await dispatch(
          uploadProfilePicture({ file })
        );

        checkResult(upload, payload => {
          profilePicture = payload.fileName;
        });
      }

dispatch(updateProfile({
  profile: currentProfile,
  username: form.username,
  profilePicture,
  selfStatement: form.selfStatement,
  privacy: form.isPrivate,
  location: form.location
})).then(result=>{

      checkResult(
        result,
        () => setSuccess("Profile updated"),
        err => setError(err.message)
      );
    })
    } catch (err) {
      setError("Update failed");
    }
  };

  /* --------------------------
     Delete account
  ---------------------------*/
  const handleDelete = () => {

    openDialog({
      title: "Delete account?",
      text: "This cannot be undone.",
      agreeText: "Delete",
      agree: () => dispatch(deleteUserAccounts()).then(res=>{
        checkResult(res,()=>{
          setSuccess("Account deleted");
          router.push(Paths.login())
        },err=>{
          setError(err.message)
      })

    })})}

  if (loading) {
    return (
      <IonContent>
        <div className="flex justify-center mt-20">
         <IonLoading
  isOpen={loading}
  message={"Loading your space..."}
  spinner="crescent"
/>
          <span className="loading loading-spinner loading-lg text-emerald-600"></span>
        </div>
      </IonContent>
    );
  }
// console.log("Current profile in settings:", form.location)
  return (

    <IonContent fullscreen>
      
      <div className="min-h-screen  px-4 bg-base-surface flex justify-center pt-20 pb-32">

        <div className="card w-96  sm:max-w-xl p-6 space-y-6">

          <h2 className="text-2xl font-bold text-center text-emerald-700">
            Profile Settings
          </h2>
          <div  onClick={()=>{dispatch(signOutAction({profile:currentProfile})).then(res=>
          
          checkResult(res,(data)=>{
            console.log("sign out",data)
            router.push(Paths.login())},err=>{
setError(err.message)
          }))}}

         className="btn mx-4 bg-base-bg btn-error flex btn-outline w-full">
            <h4 className="mx-auto my-auto">Log Out</h4>
          </div>
          {/* Username */}

          <div className="form-control">

            <label className="label">
              <span className="label-text">Username</span>
            </label>

            <input
              type="text"
              className="input bg-base-bg text-soft input-bordered"
              value={form.username}
              onChange={(e)=>handleChange("username",e.target.value)}
            />

          </div>

          {/* Profile Image */}

          <div className="flex flex-col items-center gap-4">

            <div className="avatar">

              <div className="w-24 rounded-xl">

                <img src={pictureUrl} />

              </div>

            </div>

            <input
              type="file"
              accept="image/*"
              className="file-input bg-base-bg text-soft file-input-bordered w-full"
              onChange={handleImage}
            />

          </div>
          <span className="w-fit mx-auto">
<GoogleMapSearch
  initLocationName={form.location?.city}
  onLocationSelected={(coordinates)=>{
    console.log("Selected location from GoogleMapSearch:", coordinates);
     handleChange("location", coordinates);
  }}

/>
</span>
<button
  className="btn btn-outline btn-sm mt-2"
  onClick={handleUseCurrentLocation}
  disabled={loading}
>
  {loading ? "Fetching..." : "Use Current Location"}
</button>
          {/* Self Statement */}

          <div className="form-control">

            <label className="label">
              <span className="label-text">
                Self Statement
              </span>
            </label>

            <textarea
              className="textarea bg-base-bg text-soft textarea-bordered h-32"
              value={form.selfStatement}
              onChange={(e)=>{
                if(e.target.value.length <= 120){
                  handleChange("selfStatement",e.target.value)
                }
              }}
            />

          </div>

          {/* Privacy */}

          <div className="form-control">

            <label className="cursor-pointer label">

              <span className="label-text">
                Private Profile
              </span>

              <input
                type="checkbox"
                className="toggle bg-base-bg text-soft toggle-primary"
                checked={form.isPrivate}
                onChange={()=>handleChange("isPrivate",!form.isPrivate)}
              />

            </label>

          </div>

          {/* Buttons */}

          <button
            className="btn btn-primary w-full"
            onClick={handleSubmit}
          >
            Update Profile
          </button>

          <button
            className="btn btn-error btn-outline w-full"
            onClick={handleDelete}
          >
            Delete Account
          </button>

        </div>

      </div>

    </IonContent>
  );
}
