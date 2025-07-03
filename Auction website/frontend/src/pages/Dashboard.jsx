import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getWatchlistItems } from "../utils/watchlistUtils";
import { Clock, Filter, Tag, Heart, Package, Award, Eye, BarChart } from "lucide-react";
import { toast } from "sonner";

// Custom checkbox component to replace the imported one
const CustomCheckbox = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center space-x-2">
      <div 
        className={`h-4 w-4 rounded-sm border cursor-pointer flex items-center justify-center ${
          checked ? 'bg-primary border-primary' : 'border-primary'
        }`}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-3 w-3 text-primary-foreground"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userListings, setUserListings] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [biddingHistory, setBiddingHistory] = useState([]);
  const [activeBids, setActiveBids] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("userAuth") || "null");
    
    // Load data
    const loadDashboardData = () => {
      setIsLoading(true);
      
      setTimeout(() => {
        if (userData) {
          setUser(userData);
          
          // Get all listings from localStorage
          const allListings = JSON.parse(localStorage.getItem("auctionListings") || "[]");
          
          // Filter listings created by the current user
          const userItems = allListings.filter(listing => 
            listing.seller === userData.id || listing.seller === userData.email
          );
          
          setUserListings(userItems.map(listing => ({
            ...listing,
            image: listing.images && listing.images.length > 0 ? listing.images[0] : "/placeholder.svg",
            bids: listing.bids?.length || 0,
          })));
          
          // Get real watchlist items
          setWatchlist(getWatchlistItems(userData.id).map(item => ({
            ...item,
            image: item.images && item.images.length > 0 ? item.images[0] : "/placeholder.svg",
            timeLeft: item.timeLeft || "2d",
          })));
          
          // Mock bidding history (keeping this as mock for now)
          setBiddingHistory([
            { id: 201, title: "Art Deco Wall Clock", bidAmount: 85, bidDate: "2023-07-15", status: "outbid", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format" },
            { id: 202, title: "Victorian Silver Bracelet", bidAmount: 175, bidDate: "2023-07-10", status: "won", image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format" },
          ]);
          
          // Mock active bids (keeping this as mock for now)
          setActiveBids([
            { id: 301, title: "Vintage Camera Lens", bidAmount: 220, currentBid: 220, timeLeft: "6h 15m", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format" },
            { id: 302, title: "First Edition Book", bidAmount: 95, currentBid: 110, timeLeft: "1d 12h", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&auto=format" },
          ]);
        }
        
        setIsLoading(false);
      }, 1000);
    };
    
    loadDashboardData();
  }, []);

  const removeFromWatchlist = (listingId) => {
    if (!user) return;
    
    // Import the function dynamically to avoid circular dependencies
    import("../utils/watchlistUtils").then(({ removeFromWatchlist }) => {
      if (removeFromWatchlist(user.id, listingId)) {
        // Update the local state to reflect the change
        setWatchlist(prev => prev.filter(item => item.id !== listingId));
        toast.success("Removed from watchlist");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted w-1/4 rounded mb-6"></div>
          <div className="h-32 bg-muted rounded-lg mb-6"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-6">You need to log in to view your dashboard</h2>
        <button 
          onClick={() => navigate("/login")}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-3 px-4 font-medium text-sm transition-colors ${
            activeTab === "overview" 
              ? "border-b-2 border-primary text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("listings")}
          className={`py-3 px-4 font-medium text-sm transition-colors ${
            activeTab === "listings" 
              ? "border-b-2 border-primary text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Your Listings
        </button>
        <button
          onClick={() => setActiveTab("watchlist")}
          className={`py-3 px-4 font-medium text-sm transition-colors ${
            activeTab === "watchlist" 
              ? "border-b-2 border-primary text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Watchlist
        </button>
        <button
          onClick={() => setActiveTab("bids")}
          className={`py-3 px-4 font-medium text-sm transition-colors ${
            activeTab === "bids" 
              ? "border-b-2 border-primary text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Bids
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`py-3 px-4 font-medium text-sm transition-colors ${
            activeTab === "history" 
              ? "border-b-2 border-primary text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          History
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Summary Cards */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 col-span-1 flex flex-col items-center justify-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-center text-muted-foreground mb-1">Your Listings</h3>
              <p className="text-3xl font-bold text-center">{userListings.length}</p>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 col-span-1 flex flex-col items-center justify-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-center text-muted-foreground mb-1">Active Bids</h3>
              <p className="text-3xl font-bold text-center">{activeBids.length}</p>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 col-span-1 flex flex-col items-center justify-center">
              <div className="bg-rose-100 p-3 rounded-full mb-3">
                <Heart className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="font-medium text-center text-muted-foreground mb-1">Watchlist</h3>
              <p className="text-3xl font-bold text-center">{watchlist.length}</p>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 col-span-1 flex flex-col items-center justify-center">
              <div className="bg-amber-100 p-3 rounded-full mb-3">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-medium text-center text-muted-foreground mb-1">Won Auctions</h3>
              <p className="text-3xl font-bold text-center">1</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="p-6">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className={`flex items-start gap-4 ${i < 2 ? "pb-4 mb-4 border-b" : ""}`}>
                    <div className={`p-2 rounded-full ${
                      i === 0 ? "bg-green-100" : i === 1 ? "bg-blue-100" : "bg-amber-100"
                    }`}>
                      {i === 0 ? (
                        <Heart className="h-4 w-4 text-green-600" />
                      ) : i === 1 ? (
                        <Eye className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Award className="h-4 w-4 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {i === 0 
                          ? "Added a new item to your watchlist" 
                          : i === 1 
                          ? "You placed a bid on Vintage Camera" 
                          : "You won the auction for Victorian Silver Bracelet"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 0 ? "2 hours ago" : i === 1 ? "1 day ago" : "3 days ago"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link 
                    to="/sell" 
                    className="flex items-center p-3 rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="bg-primary/10 p-2 rounded mr-3">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <span>Create New Listing</span>
                  </Link>
                  <Link 
                    to="/listings" 
                    className="flex items-center p-3 rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="bg-blue-100 p-2 rounded mr-3">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>Browse Auctions</span>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Ending Soon</h3>
                {watchlist.slice(0, 2).map(item => (
                  <Link
                    key={item.id}
                    to={`/listings/${item.id}`}
                    className="flex items-start gap-3 p-3 rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="h-12 w-12 rounded overflow-hidden bg-muted flex-shrink-0">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.title}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          Current: ${item.currentBid}
                        </span>
                        <span className="text-xs text-primary font-medium flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.timeLeft}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Your Listings Tab */}
      {activeTab === "listings" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Your Listings</h2>
            <Link 
              to="/sell"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
            >
              Add New Listing
            </Link>
          </div>
          
          {userListings.length === 0 ? (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't created any auction listings yet.
              </p>
              <Link 
                to="/sell"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
              >
                Create Your First Listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userListings.map(listing => (
                <div key={listing.id} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {listing.timeLeft || listing.duration + "d left"}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                      {listing.status || "Active"}
                    </div>
                  </div>
                  <div className="p-4">
                    <Link to={`/listings/${listing.id}`} className="text-lg font-medium hover:text-primary line-clamp-1">
                      {listing.title}
                    </Link>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Bid:</span>
                        <span className="font-semibold">${listing.currentBid}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Bids:</span>
                        <span>{listing.bids}</span>
                      </div>
                    </div>
                    <Link
                      to={`/listings/${listing.id}`}
                      className="w-full mt-3 inline-block text-center bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Watchlist Tab */}
      {activeTab === "watchlist" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Watchlist</h2>
          
          {watchlist.length === 0 ? (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
              <p className="text-muted-foreground mb-4">
                Browse our auctions and add items to your watchlist.
              </p>
              <Link 
                to="/listings"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
              >
                Browse Auctions
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {watchlist.map(item => (
                <div key={item.id} className="rounded-lg border bg-card p-4 flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-20 h-20 rounded overflow-hidden bg-muted flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0 w-full">
                    <Link to={`/listings/${item.id}`} className="text-lg font-medium hover:text-primary line-clamp-1">
                      {item.title}
                    </Link>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Current Bid:</span>
                        <span className="ml-1 text-sm font-semibold">${item.currentBid}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Time Left:</span>
                        <span className="ml-1 text-sm font-medium">{item.timeLeft}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Bids:</span>
                        <span className="ml-1 text-sm">{item.bids?.length || 0}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Status:</span>
                        <span className="ml-1 text-sm text-green-600">Active</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end items-center">
                    <Link
                      to={`/listings/${item.id}`}
                      className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => removeFromWatchlist(item.id)}
                      className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Bids Tab */}
      {activeTab === "bids" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Active Bids</h2>
          <div className="overflow-x-auto rounded-lg border bg-card shadow-sm">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left border-b bg-muted/40">
                  <th className="py-3 px-4 font-semibold text-sm text-muted-foreground">Item</th>
                  <th className="py-3 px-4 font-semibold text-sm text-muted-foreground">Your Bid</th>
                  <th className="py-3 px-4 font-semibold text-sm text-muted-foreground">Current Bid</th>
                  <th className="py-3 px-4 font-semibold text-sm text-muted-foreground">Time Left</th>
                  <th className="py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                  <th className="py-3 px-4 font-semibold text-sm text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {activeBids.map(bid => (
                  <tr key={bid.id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded overflow-hidden bg-muted mr-3">
                          <img src={bid.image} alt={bid.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="truncate max-w-xs">
                          <Link to={`/listings/${bid.id}`} className="hover:text-primary">
                            {bid.title}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">${bid.bidAmount}</td>
                    <td className="py-3 px-4 font-medium">${bid.currentBid}</td>
                    <td className="py-3 px-4">{bid.timeLeft}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        bid.bidAmount >= bid.currentBid 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {bid.bidAmount >= bid.currentBid ? "Winning" : "Outbid"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link 
                        to={`/listings/${bid.id}`}
                        className="text-primary hover:text-primary/80 text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bidding History Tab */}
      {activeTab === "history" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Bidding History</h2>
          <div className="overflow-x-auto rounded-lg border bg-card shadow-sm">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left border-b bg-muted/40">
                  <th className="py-3 px-4 font-semibold text-sm text-muted-foreground">Item</th>
                  <th className="py-3 px-4 font-semibold text-sm text-muted-foreground">Bid Amount</th>
                  <th className="py-3 px-4 font-semibold text-sm text-muted-foreground">Date</th>
                  <th className="py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                  <th className="py-3 px-4 font-semibold text-sm text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {biddingHistory.map(history => (
                  <tr key={history.id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded overflow-hidden bg-muted mr-3">
                          <img src={history.image} alt={history.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="truncate max-w-xs">
                          <Link to={`/listings/${history.id}`} className="hover:text-primary">
                            {history.title}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">${history.bidAmount}</td>
                    <td className="py-3 px-4">{history.bidDate}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        history.status === "won" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {history.status === "won" ? "Won" : "Outbid"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link 
                        to={`/listings/${history.id}`}
                        className="text-primary hover:text-primary/80 text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;