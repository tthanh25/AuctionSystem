// services/FirebaseService.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, getDocs, query, runTransaction } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
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

  // Get current user ID
  getCurrentUserId() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log(user)
        return user.uid;
      }
    });
    return null;
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

  async getItemById(itemId) {
    try {
      const itemDoc = await getDoc(doc(this.db, "items", itemId));
      if (itemDoc.exists()) {
        const itemData = itemDoc.data();
        const imageUrl = await this.getImageUrl(itemData.img);
        return { id: itemDoc.id, ...itemData, imageUrl };
      } else {
        throw new Error("Item not found");
      }
    } catch (error) {
      console.error("Error fetching item by ID:", error);
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

  // Auciton Services
  async placeBid(itemId, bidderId, bidAmount) {
    try {
      const itemRef = doc(this.db, "items", itemId);
      const bidCollectionRef = collection(this.db, "bids");

      await runTransaction(this.db, async (transaction) => {
        const itemDoc = await transaction.get(itemRef);
        if (!itemDoc.exists()) {
          throw new Error("Item does not exist");
        }

        const itemData = itemDoc.data();
        if (bidAmount <= itemData.currentPrice) {
          throw new Error("Bid amount must be higher than current price");
        }

        const bidData = {
          itemId,
          bidderId,
          bidAmount,
          timestamp: new Date(),
        };
        // console.log(bidData)

        transaction.update(itemRef, {
          currentPrice: bidAmount,
        });

        // Use addDoc to add a new document to the bids collection
        await addDoc(bidCollectionRef, bidData);
      });
    } catch (error) {
      console.error("Error placing bid:", error);
      throw error;
    }
  }

  async getBidHistory(itemId) {
    try {
      const bidRef = collection(this.db, "bids");
      const querySnapshot = await getDocs(query(bidRef.where("itemId", "==", itemId).orderBy("timestamp", "desc")));

      const bidHistory = [];
      querySnapshot.forEach((doc) => {
        bidHistory.push(doc.data());
      });

      return bidHistory;
    } catch (error) {
      console.error("Error fetching bid history:", error);
      throw error;
    }
  }

  // async getBidHistory(itemId, onUpdate) {
  //   try {
  //     const bidRef = collection(this.db, "bids");
  //     const querySnapshot = await getDocs(query(bidRef.where("itemId", "==", itemId).orderBy("timestamp", "desc")));

  //     const bidHistory = [];
  //     querySnapshot.forEach((doc) => {
  //       bidHistory.push(doc.data());
  //     });

  //     // Real-time listener for new bids
  //     const unsubscribe = onSnapshot(query(bidRef.where("itemId", "==", itemId).orderBy("timestamp", "desc")), (snapshot) => {
  //       const newBids = [];
  //       snapshot.forEach((doc) => {
  //         newBids.push(doc.data());
  //       });
  //       onUpdate(newBids);
  //     });

  //     return unsubscribe; // Return unsubscribe function
  //   } catch (error) {
  //     console.error("Error fetching bid history:", error);
  //     throw error;
  //   }
  // }
}

const firebaseService = new FirebaseService();

export default firebaseService;
