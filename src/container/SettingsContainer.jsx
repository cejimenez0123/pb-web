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
import { IonContent, useIonRouter } from "@ionic/react";

import checkResult from "../core/checkResult";
import Context from "../context";
import Enviroment from "../core/Enviroment";
import { useSelector } from "react-redux";
import GoogleMapSearch from "./collection/GoogleMapSearch";
import { Capacitor } from "@capacitor/core";
import Paths from "../core/paths";
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

  const {  setError, setSuccess } = useContext(Context);
  const {currentProfile}=useSelector(state=>state.users)
  const [file, setFile] = useState(null);

const [form, setForm] = useState({
  username: "",
  selfStatement: "",
  isPrivate: false,
  profilePicture: "",
  location: {
    latitude: null,
    longitude: null,
    address: ""
  }
});

  const [pictureUrl, setPictureUrl] = useState(
    "https://placehold.co/200"
  );

  const [loading, setLoading] = useState(true);

  /* --------------------------
     Load profile into form
  ---------------------------*/
  useEffect(() => {

    if (!currentProfile) return;

    const pic = currentProfile.profilePic;
// if (currentProfile.location) {
//   setForm(prev => ({
//     ...prev,
   
//   }));
// }
    setForm({
      username: currentProfile.username ?? "",
      selfStatement: currentProfile.selfStatement ?? "",
      isPrivate: currentProfile.isPrivate ?? false,
      profilePicture: pic ?? "",
       location: {
      latitude: currentProfile?.location?.latitude??40,
      longitude: currentProfile?.location?.longitude??73,
      address: currentProfile?.location?.address || ""
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




const getPosition = async ()=> {
  if (Capacitor.isNativePlatform()) {
    const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
    return position.coords;
  } else {
    // Browser fallback using Google Geolocation API
    const res = await fetch("https://www.googleapis.com/geolocation/v1/geolocate?key=" + import.meta.env.VITE_GOOGLE_MAPS_API_KEY, {
      method: "POST"
    });
    const data = await res.json();
    return {
      latitude: data.location.lat,
      longitude: data.location.lng
    };
  }
}
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

    dispatch(setDialog({
      title: "Delete account?",
      text: "This cannot be undone.",
      agreeText: "Delete",
      agree: () => dispatch(deleteUserAccounts())
    }));

  };

  if (loading) {
    return (
      <IonContent>
        <div className="flex justify-center mt-20">
          <span className="loading loading-spinner loading-lg text-emerald-600"></span>
        </div>
      </IonContent>
    );
  }

  return (

    <IonContent fullscreen>
      
      <div className="min-h-screen bg-base-200 flex justify-center pt-20 pb-32">

        <div className="card w-96  p-6 space-y-6">

          <h2 className="text-2xl font-bold text-center text-emerald-700">
            Profile Settings
          </h2>
          <div  onClick={()=>{dispatch(signOutAction()).then(res=>{router.push(Paths.login())})

          }}className="btn btn-error btn-outline w-full">
            <h4>Sign Out</h4>
          </div>
          {/* Username */}

          <div className="form-control">

            <label className="label">
              <span className="label-text">Username</span>
            </label>

            <input
              type="text"
              className="input input-bordered"
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
              className="file-input file-input-bordered w-full"
              onChange={handleImage}
            />

          </div>
          <span className="w-fit mx-auto">
<GoogleMapSearch
  initLocationName={form.location?.address}
  onLocationSelected={(coordinates)=>{
    setForm(prev => ({
      ...prev,
      location: coordinates
    })
  ); 
    
  }}
/>
</span>
<button
  className="btn btn-outline btn-sm mt-2"
  onClick={getPosition}
>
  Use Current Location
</button>
          {/* Self Statement */}

          <div className="form-control">

            <label className="label">
              <span className="label-text">
                Self Statement
              </span>
            </label>

            <textarea
              className="textarea textarea-bordered h-32"
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
                className="toggle toggle-primary"
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