// services/AuctionService.js
import FirebaseService from "./FirebaseService";

class AuctionService {
  constructor() {
    this.firebaseService = new FirebaseService();
  }

  // Create a new auction listing
  async createAuctionListing(listingData) {
    try {
      // Add the auction listing to Firestore
      const docRef = await this.firebaseService.db.collection("auctions").add(listingData);
      return docRef.id; // Return the ID of the newly created listing
    } catch (error) {
      console.error("Error creating auction listing:", error);
      throw error;
    }
  }

  // Fetch all auction listings
  async getAllAuctionListings() {
    try {
      // Get all auction listings from Firestore
      const querySnapshot = await this.firebaseService.db.collection("auctions").get();
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching auction listings:", error);
      throw error;
    }
  }

  // Place a bid on an auction listing
  async placeBid(listingId, bidAmount) {
    try {
      // Update the bid amount for the specified listing
      await this.firebaseService.db.collection("auctions").doc(listingId).update({
        currentBid: bidAmount,
      });
    } catch (error) {
      console.error("Error placing bid:", error);
      throw error;
    }
  }

  // Search for auction listings based on criteria
  async searchListings(criteria) {
    try {
      let query = this.firebaseService.db.collection("auctions");

      // Apply filters based on search criteria
      if (criteria.dogName) {
        query = query.where("dogName", "==", criteria.dogName);
      }

      // Add more filters for other criteria as needed

      // Execute the query
      const querySnapshot = await query.get();
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error searching auction listings:", error);
      throw error;
    }
  }
}

export default AuctionService;
