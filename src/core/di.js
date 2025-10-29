
import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence,setPersistence } from "firebase/auth"
import "firebase/compat/firestore"
import {  getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage"
import {algoliasearch }from "algoliasearch";


const client = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_SEARCH_API)
  
const config = { apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID}
const firebaseConfig = config
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);


const storage = getStorage(app)
const db =getFirestore(app)

export {db,app,auth,storage,client}