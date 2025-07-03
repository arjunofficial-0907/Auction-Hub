
// Get watchlist from localStorage
export const getWatchlist = (userId) => {
    try {
      const watchlistData = JSON.parse(localStorage.getItem("userWatchlist") || "{}");
      return watchlistData[userId] || [];
    } catch (error) {
      console.error("Error getting watchlist:", error);
      return [];
    }
  };
  
  // Add item to watchlist
  export const addToWatchlist = (userId, listingId) => {
    try {
      if (!userId) return false;
      
      const watchlistData = JSON.parse(localStorage.getItem("userWatchlist") || "{}");
      const userWatchlist = watchlistData[userId] || [];
      
      // Check if item is already in watchlist
      if (!userWatchlist.includes(listingId)) {
        userWatchlist.push(listingId);
        watchlistData[userId] = userWatchlist;
        localStorage.setItem("userWatchlist", JSON.stringify(watchlistData));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      return false;
    }
  };
  
  // Remove item from watchlist
  export const removeFromWatchlist = (userId, listingId) => {
    try {
      if (!userId) return false;
      
      const watchlistData = JSON.parse(localStorage.getItem("userWatchlist") || "{}");
      const userWatchlist = watchlistData[userId] || [];
      
      const index = userWatchlist.indexOf(listingId);
      if (index !== -1) {
        userWatchlist.splice(index, 1);
        watchlistData[userId] = userWatchlist;
        localStorage.setItem("userWatchlist", JSON.stringify(watchlistData));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      return false;
    }
  };
  
  // Check if item is in watchlist
  export const isInWatchlist = (userId, listingId) => {
    try {
      if (!userId) return false;
      
      const watchlistData = JSON.parse(localStorage.getItem("userWatchlist") || "{}");
      const userWatchlist = watchlistData[userId] || [];
      
      return userWatchlist.includes(listingId);
    } catch (error) {
      console.error("Error checking watchlist:", error);
      return false;
    }
  };
  
  // Get full watchlist items with details
  export const getWatchlistItems = (userId) => {
    try {
      const watchlistIds = getWatchlist(userId);
      const allListings = JSON.parse(localStorage.getItem("auctionListings") || "[]");
      
      return allListings.filter(listing => watchlistIds.includes(listing.id));
    } catch (error) {
      console.error("Error getting watchlist items:", error);
      return [];
    }
  };
  