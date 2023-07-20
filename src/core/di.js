
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import { getAuth, signInAnonymously } from "firebase/auth"
import "firebase/compat/firestore"
import { getFirestore,Firestore,initializeFirestore} from "firebase/firestore";
// import { firebaseConfig } from '../fire';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

signInAnonymously(auth)

.then(() =>{})
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
   console.error(errorMessage, errorCode)
  });

const db =getFirestore(app)


  export {db,app,auth}