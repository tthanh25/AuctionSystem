import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGbaNjmoqflVWFcm3iSn1Hxp8X8TGAVQQ",
  authDomain: "catbid-cc5ae.firebaseapp.com",
  databaseURL: "https://catbid-cc5ae-default-rtdb.firebaseio.com",
  projectId: "catbid-cc5ae",
  storageBucket: "catbid-cc5ae.appspot.com",
  messagingSenderId: "1003892773947",
  appId: "1:1003892773947:web:3ea80a4e301cff03aff81e",
  measurementId: "G-WMFH4MMH5H",
};

// init firebase
const app = initializeApp(firebaseConfig);

// init services
export const db = getFirestore(app);