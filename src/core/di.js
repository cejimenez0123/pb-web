
import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence,setPersistence, indexedDBLocalPersistence } from "firebase/auth"
import "firebase/compat/firestore"
import {  getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage"

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
// const auth = getAuth(app);
// setPersistence(auth, browserLocalPersistence);
// setPersistence(auth,indexedDBLocalPersistence);

const storage = getStorage(app)
// const db =getFirestore(app)

export {storage}