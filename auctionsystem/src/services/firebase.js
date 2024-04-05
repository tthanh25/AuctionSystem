// services/FirebaseService.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import firebaseConfig from "./config";

class FirebaseService {
  constructor() {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Firestore
    this.db = getFirestore(app);

    // Initialize Authentication
    this.auth = getAuth(app);

    // Initialize Storage
    this.storage = getStorage(app);
  }

  // Authentication Services
  createAccount(email, password) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signIn(email, password) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Firestore Services
  async getUserData(uid) {
    const userData = await getDoc(doc(this.db, "users", uid));
    return userData.exists() ? userData.data() : null;
  }

  async setUserDocument(uid, data) {
    return await setDoc(doc(this.db, "users", uid), data);
  }

  // Storage Services
  async getDownloadUrl(storagePath) {
    const fileRef = ref(this.storage, storagePath);
    return getDownloadURL(fileRef);
  }
}

const firebaseService = new FirebaseService();

export default firebaseService;
