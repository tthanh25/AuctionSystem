// services/FirebaseService.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query } from "firebase/firestore";
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

  async getItems() {
    try {
      const q = query(collection(this.db, "items"));
      const querySnapshot = await getDocs(q);
      const items = [];

      for (const doc of querySnapshot.docs) {
        const itemData = doc.data();
        const imageUrl = await this.getImageUrl(itemData.img); // Get image URL from Firebase Storage
        items.push({ id: doc.id, ...itemData, imageUrl });
      }

      return items;
    } catch (error) {
      console.error("Error fetching items:", error);
      throw error;
    }
  }

  async getImageUrl(imagePath) {
    try {
      const storageRef = ref(this.storage, imagePath);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error fetching image URL:", error);
      throw error;
    }
  }

  // Storage Services
  async getDownloadUrl(storagePath) {
    const fileRef = ref(this.storage, storagePath);
    return getDownloadURL(fileRef);
  }
}

const firebaseService = new FirebaseService();

export default firebaseService;
