
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import { getAuth, signInAnonymously,setPersistence,browserSessionPersistence, browserLocalPersistence } from "firebase/auth"
import "firebase/compat/firestore"
import { getFirestore,Firestore,initializeFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage"
// import { firebaseConfig } from '../fire';


// const testConfig = {
//   apiKey: `${process.env.TEST_FIREBASE_API_KEY}`,
//   authDomain:`${process.env.TEST_AUTH_DOMAIN}`,
//   databaseURL:`${process.env.TEST_DATABASE_URL}`,
//   projectId:`${process.env.TEST_PROJECT_ID}`,
//   storageBucket:`${process.env.TEST_STORAGE_BUCKET}`,
//   messagingSenderId:`${process.env.TEST_MESSAGING_SENDER_ID}`,
//   appId:`${process.env.TEST_APP_ID}`,
//   measurementId: `${process.env.TEST_MEASUREMENT_ID}`
// }
const config = { apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID}
const firebaseConfig = config
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
setPersistence(auth,browserLocalPersistence)
.then(() => {
  return signInAnonymously(auth)

.then(() =>{})
.catch((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
 console.error(errorMessage, errorCode)
});
})
const storage = getStorage(app)


const db =getFirestore(app)


  export {db,app,auth,storage}