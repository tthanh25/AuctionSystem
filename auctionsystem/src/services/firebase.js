// services/FirebaseService.js
import { initializeApp } from "firebase/app";
import { where, orderBy, getFirestore, doc, getDoc, setDoc, addDoc, deleteDoc, collection, getDocs, query, runTransaction, Timestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import _ from 'lodash';

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
  async createAccount(email, password) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async signIn(email, password) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async signOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  // Firestore Services
  async getCurrentUser() {
    const user = this.auth.currentUser;
    if (user) {
      return user.uid;
    } else {
      return null;
    }
  }

  async getUserData(uid) {
    const userData = await getDoc(doc(this.db, "users", uid));
    return userData.exists() ? userData.data() : null;
  }

  async setUserDocument(uid, data) {
    return await setDoc(doc(this.db, "users", uid), data);
  }

  async getAllUsers() {
    try {
      const querySnapshot = await getDocs(collection(this.db, "users"));
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      console.log(users);
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async deleteUser(uid) {
    try {
      await deleteDoc(doc(this.db, "users", uid));
      return true; // Deletion successful
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  //Image
  async getImageUrl(imagePath) {
    try {
      const storageRef = ref(this.storage, imagePath);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error fetching image URL:", error);
      throw error;
    }
  }

  async getDownloadUrl(storagePath) {
    const fileRef = ref(this.storage, storagePath);
    return getDownloadURL(fileRef);
  }

  async uploadImage(file) {
    try {
      // Create a storage reference
      const storageRef = ref(this.storage, `images/${file.name}`);

      // Upload file to the storage reference
      await uploadBytes(storageRef, file);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  //Items
  async getItems() {
    try {
      const q = query(collection(this.db, "items"));
      const querySnapshot = await getDocs(q);
      const items = [];

      for (const doc of querySnapshot.docs) {
        const itemData = doc.data();
        // const imageUrl = await this.getImageUrl(itemData.img); // Get image URL from Firebase Storage
        items.push({ id: doc.id, ...itemData });
      }
      console.log(items);
      return items;
    } catch (error) {
      console.error("Lỗi fetching:", error);
      throw error;
    }
  }

  async getItemById(itemId) {
    try {
      const itemDoc = await getDoc(doc(this.db, "items", itemId));
      if (itemDoc.exists()) {
        const itemData = itemDoc.data();
        // const imageUrl = await this.getImageUrl(itemData.img);
        return { id: itemDoc.id, ...itemData };
      } else {
        throw new Error("Không tìm thấy bé cún");
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm bằng ID:", error);
      throw error;
    }
  }

  async deleteItem(itemId) {
    try {
      await deleteDoc(doc(this.db, "items", itemId));
      return true; // Deletion successful
    } catch (error) {
      console.error("Lỗi xóa:", error);
      throw error;
    }
  }

  async addItem(itemData) {
    console.log(itemData);
    try {
      const newItemRef = await addDoc(collection(this.db, "items"), itemData);
      return newItemRef.id; // Return the ID of the newly added item
    } catch (error) {
      console.error("Lỗi thêm:", error);
      throw error;
    }
  }

  async updateItem(itemId, newData) {
    try {
      await setDoc(doc(this.db, "items", itemId), newData, { merge: true });
      return true; // Update successful
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      throw error;
    }
  }

  // Auciton Services
  async placeBid(itemId, bidderId, bidAmount) {
    try {
      const itemRef = doc(this.db, "items", itemId);
      const bidCollectionRef = collection(this.db, "bids");
      const userRole = await this.getUserRole(); // Get current user's role
      if (_.isEqual(userRole, 1)) {
        throw new Error("Bạn không thể đấu giá");
      }
      await runTransaction(this.db, async (transaction) => {
        const itemDoc = await transaction.get(itemRef);
        if (!itemDoc.exists()) {
          throw new Error("Không tồn tại bé cún");
        }

        const itemData = itemDoc.data();
        if (parseFloat(bidAmount) <= parseFloat(itemData.currentPrice)) {
          throw new Error("Giá đặt phải lớn hơn giá hiện tại");
        }

        if (parseFloat(bidAmount) - parseFloat(itemData.currentPrice) < parseFloat(itemData.priceIncrement)) {
          throw new Error("Chênh lệch phải lớn hơn bước giá");
        }

        if (Timestamp.now() > itemData.auctionEnd) {
          throw new Error("Hết thời gian đấu giá");
        }

        if (Timestamp.now() < itemData.auctionStart) {
          throw new Error("Chưa bắt đầu thời gian đấu giá");
        }

        const bidData = {
          itemId,
          bidderId,
          bidAmount,
          timestamp: Timestamp.now(),
        };
        // console.log(bidData)

        transaction.update(itemRef, {
          currentPrice: bidAmount,
        });

        // Use addDoc to add a new document to the bids collection
        await addDoc(bidCollectionRef, bidData);
      });
    } catch (error) {
      console.error("Lỗi đấu giá:", error);
      throw error;
    }
  }
  async getUserRole() {
    const uid = await this.getCurrentUser();
    if (uid) {
      const userData = await this.getUserData(uid);
      return userData ? userData.role : null;
    }
    return null; // User not authenticated
  }
  async getBidHistory(userId) {
    try {
      const q = query(collection(this.db, "bids"), where("bidderId", "==", userId));
      const querySnapshot = await getDocs(q);
      const bidHistory = [];

      for (const doc of querySnapshot.docs) {
        const bidData = doc.data();
        bidHistory.push({ id: doc.id, ...bidData });
      }

      console.log(bidHistory);
      return bidHistory;
    } catch (error) {
      console.error("Error fetching bid history:", error);
      throw error;
    }
  }

  // async getBidHistory(itemId) {
  //   try {
  //     const bidRef = query(this.db, "bids");
  //     const querySnapshot = await getDocs(query(bidRef.where("itemId", "==", itemId).orderBy("timestamp", "desc")));

  //     const bidHistory = [];
  //     querySnapshot.forEach((doc) => {
  //       bidHistory.push(doc.data());
  //     });

  //     return bidHistory;
  //   } catch (error) {
  //     console.error("Error fetching bid history:", error);
  //     throw error;
  //   }
  // }

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
