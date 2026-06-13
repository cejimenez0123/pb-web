import { useEffect, useState } from "react";
import { useAlert } from "../core/useAlert.jsx";
import AlertType from "../core/AlertType.js";
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
import Enviroment from "../core/Enviroment";
import { useSelector } from "react-redux";
import GoogleMapSearch from "./collection/GoogleMapSearch";
import { Capacitor } from "@capacitor/core";
import Paths from "../core/paths";
import fetchCity from "../core/fetchCity";
import { useDialog } from "../domain/usecases/useDialog";
import { SocialLogin } from "@capgo/capacitor-social-login";
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

    return "";
  }

}
export default function SettingsContainer() {
  const dispatch = useDispatch();
  const router = useIonRouter();
const {openDialog,dialog,closeDialog}=useDialog()
  const { showAlert } = useAlert();
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
   writingSprintSlots: [], // ← ju
  location: {
    latitude: null,
    longitude: null,
     city: currentProfile?.location?.city ?? "",
    writingSprints: currentProfile?.writingSprints ?? []
  }
});

  const [pictureUrl, setPictureUrl] = useState(
    "https://placehold.co/200"
  );

  const [loading, setLoading] = useState(false);
useEffect(() => {
  if (!loading && !currentProfile) {
    router.push(Paths.login, "root"); // replace history
  }
}, [loading, currentProfile]);
  /* --------------------------
     Load profile into form
  ---------------------------*/
const toggleSlot = (slotId) => {
  setForm(prev => {
    const current = prev.writingSprintSlots ?? []; // ← fallback
    return {
      ...prev,
      writingSprintSlots: current.includes(slotId)
        ? current.filter(s => s !== slotId)
        : [...current, slotId]
    };
  });
};
  useEffect(() => {

    if (!currentProfile) return;

    const pic = currentProfile.profilePic;
  setForm({
      username: currentProfile.username ?? "",
      selfStatement: currentProfile.selfStatement ?? "",
      isPrivate: currentProfile.isPrivate ?? false,
       writingSprintSlots: currentProfile.writingSprintSlots ?? [], // ← add
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

      handleChange("location", {
        ...coords,
        city: cityCountry || "",
      });

      showAlert({ message: "Location updated!", type: AlertType.success });
    } catch (err) {
      console.error(err);
      showAlert({ message: "Unable to fetch current location.", type: AlertType.error });
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
      showAlert({ message: "Upload a valid image", type: AlertType.error });
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
  
   writingSprintSlots: form.writingSprintSlots,
  selfStatement: form.selfStatement,
  privacy: form.isPrivate,
  location: form.location
})).then(result=>{

      checkResult(
        result,
        () => showAlert({ message: "Profile updated", type: AlertType.success }),
        err => showAlert({ message: err.message, type: AlertType.error })
      );
    })
    } catch (err) {
      showAlert({ message: "Update failed", type: AlertType.error });
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
          showAlert({ message: "Account deleted", type: AlertType.success });
          router.push(Paths.login)
        },err=>{
          showAlert({ message: err.message, type: AlertType.error })
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
  return (
  <IonContent fullscreen>
    <div className="min-h-screen px-4 bg-cream dark:bg-base-bgDark flex justify-center pt-20 pb-32">
      <div className="card w-96 sm:max-w-xl p-6 space-y-6">

        <h2 className="text-2xl font-bold text-center text-soft dark:text-cream">
          Profile Settings
        </h2>

        {/* Log Out */}
        <div
          onClick={async () => {
            await SocialLogin.logout({ provider: "google" });
            dispatch(signOutAction({ profile: currentProfile })).then(res =>
              checkResult(res, (data) => {
                router.push(Paths.login);
              }, err => showAlert({ message: err.message, type: AlertType.error }))
            );
          }}
          className="btn mx-4 bg-base-bg dark:bg-base-surfaceDark border border-soft/20 dark:text-cream text-soft flex w-full"
        >
          <h4 className="mx-auto my-auto">Log Out</h4>
        </div>

        {/* Username */}
        <div className="form-control">
          <label className="label">
            <span className="label-text dark:text-cream">Username</span>
          </label>
          <input
            type="text"
            className="input bg-base-bg dark:bg-base-surfaceDark dark:text-cream text-soft input-bordered border-soft/20"
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center gap-4">
          <div className="avatar">
            <div className="w-24 rounded-xl ring-2 ring-soft/20">
              <img src={pictureUrl} />
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            className="file-input bg-base-bg dark:bg-base-surfaceDark dark:text-cream text-soft file-input-bordered border-soft/20 w-full"
            onChange={handleImage}
          />
        </div>

        {/* Location */}
        <span className="w-fit mx-auto">
          <GoogleMapSearch
            initLocationName={form.location?.city}
            onLocationSelected={(coordinates) => {
              handleChange("location", coordinates);
            }}
          />
        </span>
        <button
          className="btn btn-outline btn-sm mt-2 dark:text-cream dark:border-cream/30 border-soft/30"
          onClick={handleUseCurrentLocation}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Use Current Location"}
        </button>

        {/* Self Statement */}
        <div className="form-control">
          <label className="label">
            <span className="label-text dark:text-cream">Self Statement</span>
          </label>
          <textarea
            className="textarea bg-base-bg dark:bg-base-surfaceDark dark:text-cream text-soft textarea-bordered border-soft/20 h-32"
            value={form.selfStatement}
            onChange={(e) => {
              if (e.target.value.length <= 120) {
                handleChange("selfStatement", e.target.value);
              }
            }}
          />
        </div>

        {/* Privacy */}
        <div className="form-control">
          <label className="cursor-pointer label">
            <span className="label-text dark:text-cream">Private Profile</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={form.isPrivate}
              onChange={() => handleChange("isPrivate", !form.isPrivate)}
            />
          </label>
        </div>
{/* Writing Sprints */}
{(() => {
  const SPRINT_SLOTS = [
    { id: 'morning',   label: 'Morning',   emoji: '🌅', time: '7:00 AM'  },
    { id: 'midday',    label: 'Midday',    emoji: '☀️', time: '12:00 PM' },
    { id: 'afternoon', label: 'Afternoon', emoji: '🌤', time: '3:00 PM'  },
    { id: 'evening',   label: 'Evening',   emoji: '🌆', time: '7:00 PM'  },
    { id: 'night',     label: 'Night',     emoji: '🌙', time: '10:00 PM' },
  ];

  return (
    <div className="form-control space-y-2">
      <label className="label">
        <span className="label-text dark:text-cream">Your Writing Windows</span>
      </label>
      <p className="text-xs text-soft/60 dark:text-cream/50 -mt-1">
        We'll send you a prompt at these times. Show up, write something.
      </p>
      <div className="grid grid-cols-1 gap-2">
        {SPRINT_SLOTS.map((slot) => {
          const selected = form.writingSprintSlots?.includes(slot.id);
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => toggleSlot(slot.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all
                ${selected
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                  : 'border-soft/20 bg-base-bg dark:bg-base-surfaceDark text-soft dark:text-cream/70'
                }`}
            >
              <div className="flex items-center gap-2">
                <span>{slot.emoji}</span>
                <span className="text-sm font-medium">{slot.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-50">{slot.time}</span>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                  ${selected ? 'border-emerald-500 bg-emerald-500' : 'border-soft/30 dark:border-cream/30'}`}>
                  {selected && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
})()}
        {/* Save */}
        <button
          className="btn bg-soft text-white hover:bg-soft/90 w-full border-none"
          onClick={handleSubmit}
        >
          Update Profile
        </button>

        {/* Delete */}
        <button
          className="btn btn-outline border-golden text-golden hover:bg-golden hover:text-white w-full"
          onClick={handleDelete}
        >
          Delete Account
        </button>

      </div>
    </div>
  </IonContent>
);

}
