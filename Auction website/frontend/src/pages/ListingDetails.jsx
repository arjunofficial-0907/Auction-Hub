import { useState, useEffect } from "react";
import { useParams, Link, parsePath } from "react-router-dom";
import { toast } from "sonner";
import { Clock, User, Tag, Shield, Info, Star, Heart } from "lucide-react";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "../utils/watchlistUtils";


const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [isBidding, setIsBidding] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication
    const userData = JSON.parse(localStorage.getItem("userAuth") || "null");
    setUser(userData);

    //Checking if listing in is watching list
    if(userData){
      setIsWatchlisted(isInWatchlist(userData.id, parseInt(id)));
    }
    // Load listing data
    const loadListing = () => {
      setIsLoading(true);
      console.log("Loading Listing with :",id)
      
      setTimeout(() => {
        // Get listings from localStorage or use demo data
        const allListings = JSON.parse(localStorage.getItem("auctionListings") || "[]");
        console.log("All listings from localStorage:", allListings);
        const foundListing = allListings.find(item => item.id === parseInt(id));
        console.log("Found listing:", foundListing);
        
        if (foundListing) {
          setListing(foundListing);
          setBidAmount(foundListing.currentBid + 5); // Default bid = current + 5
        } else {
          // Demo data if not found
          console.log("Using demo data for listing ID:", id);
          setListing({
            id: parseInt(id),
            title: "Vintage Polaroid SX-70 Camera",
            description: "This is an original Polaroid SX-70 Land Camera in excellent condition. The camera has been fully tested and works perfectly. The leather is in great condition with minimal wear. This iconic folding SLR camera was revolutionary when it was released in the 1970s and continues to be a favorite among photographers and collectors.",
            currentBid: 250.00,
            startingPrice: 150.00,
            reservePrice: 300.00,
            seller: "vintage_collector",
            sellerId: "user123",
            bids: [
              { id: 1, user: "photo_enthusiast", amount: 180, date: "2023-06-21T15:30:00Z" },
              { id: 2, user: "retro_lover", amount: 210, date: "2023-06-22T09:15:00Z" },
              { id: 3, user: "camera_collector", amount: 250, date: "2023-06-23T14:45:00Z" }
            ],
            images: [
              "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&auto=format",
              "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=800&auto=format",
              "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=800&auto=format",
              "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=800&auto=format"
            ],
            category: "Collectibles",
            condition: "Excellent",
            timeLeft: "2d 6h",
            endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            shippingCost: 12.50,
            location: "San Francisco, CA",
            returns: "No returns accepted",
            createdAt: "2023-06-20T10:00:00Z"
          });
          setBidAmount(255);
        }
        
        setIsLoading(false);
      }, 1000);
    };
    
    loadListing();
    
    // Update time left counter
    const interval = setInterval(() => {
      if (listing && listing.endDate) {
        const end = new Date(listing.endDate);
        const now = new Date();
        const diff = end - now;
        
        if (diff <= 0) {
          setTimeLeft("Ended");
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        }
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [id]);

  const handleBidAmountChange = (e) => {
    setBidAmount(e.target.value);
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to place a bid");
      return;
    }
    
    if (isNaN(bidAmount) || bidAmount <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }
    
    if (bidAmount <= listing.currentBid) {
      toast.error(`Your bid must be higher than the current bid of $${listing.currentBid}`);
      return;
    }
    
    setIsBidding(true);
    
    // Simulate bid processing
    setTimeout(() => {
      // In a real app, you'd send this to the server
      const newBid = {
        id: Date.now(),
        user: user.email,
        userId: user.id,
        amount: parseFloat(bidAmount),
        date: new Date().toISOString()
      };
      
      // Update listing in local state
      setListing(prev => ({
        ...prev,
        currentBid: parseFloat(bidAmount),
        bids: [...prev.bids, newBid]
      }));
      
      // In a real app, you'd also update the listing in your database
      
      setIsBidding(false);
      toast.success("Your bid has been placed successfully!");
    }, 1500);
  };

  const toggleWatchlist = () => {
    if (!user) {
      toast.error("Please log in to add items to your watchlist");
      return;
    }
    
    setIsWatchlisted(prev => !prev);
    const listingId = parseInt(id);
    
    if (isWatchlisted) {
      if (removeFromWatchlist(user.id, listingId)) {
        setIsWatchlisted(false);
        toast.success("Removed from watchlist");
      }
    } else {
      if (addToWatchlist(user.id, listingId)) {
        setIsWatchlisted(true);
        toast.success("Added to watchlist");
      }
    }  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted w-1/3 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-[400px] bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-10 bg-muted w-3/4 rounded"></div>
              <div className="h-4 bg-muted w-1/2 rounded"></div>
              <div className="h-4 bg-muted w-1/3 rounded"></div>
              <div className="h-20 bg-muted w-full rounded mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Listing Not Found</h2>
        <p className="text-muted-foreground mb-6">The auction listing you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/listings"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
        >
          Browse Auctions
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-4">
        <Link to="/listings" className="text-sm text-muted-foreground hover:text-primary flex items-center">
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Listings
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden border bg-card aspect-square">
            <img 
              src={listing.images[activeImage]} 
              alt={listing.title} 
              className="w-full h-full object-contain" 
            />
          </div>
          
          <div className="flex overflow-x-auto space-x-3 pb-2">
            {listing.images.map((image, index) => (
              <button 
                key={index}
                onClick={() => setActiveImage(index)}
                className={`rounded border overflow-hidden h-16 w-16 flex-shrink-0 ${activeImage === index ? 'ring-2 ring-primary' : ''}`}
              >
                <img 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Right Column - Details */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{listing.title}</h1>
          
          <div className="flex items-center space-x-2 mb-4">
            <Link to="#" className="text-sm text-primary hover:underline">
              {listing.category}
            </Link>
            <span className="text-muted-foreground">•</span>
            <div className="text-sm text-muted-foreground flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {listing.timeLeft || timeLeft}
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Current Bid:</span>
              <span className="font-bold text-lg">${listing.currentBid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Starting Price:</span>
              <span>${listing.startingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Number of Bids:</span>
              <span>{listing.bids.length}</span>
            </div>
          </div>
          
          <form onSubmit={handleBidSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-muted-foreground">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min={listing.currentBid + 0.01}
                  value={bidAmount}
                  onChange={handleBidAmountChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-7 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Enter your bid amount"
                />
              </div>
              <button
                type="submit"
                disabled={isBidding || !user}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
              >
                {isBidding ? "Placing Bid..." : "Place Bid"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter ${(listing.currentBid + 0.01).toFixed(2)} or more
            </p>
          </form>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={toggleWatchlist}
              className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 ${
                isWatchlisted ? "text-primary border-primary" : ""
              }`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isWatchlisted ? "fill-primary" : ""}`} />
              {isWatchlisted ? "Watchlisted" : "Add to Watchlist"}
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.68377 11.7988L11.3762 14.4013L19.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 12V17.5C19 18.0523 18.5523 18.5 18 18.5H6C5.44772 18.5 5 18.0523 5 17.5V5.5C5 4.94772 5.44772 4.5 6 4.5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Share
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              <Info className="w-4 h-4 mr-2" />
              Report
            </button>
          </div>
          
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-3">Item Details</h2>
            <div className="grid grid-cols-2 gap-y-3 text-sm mb-6">
              <div className="text-muted-foreground">Condition</div>
              <div>{listing.condition}</div>
              <div className="text-muted-foreground">Location</div>
              <div>{listing.location}</div>
              <div className="text-muted-foreground">Shipping</div>
              <div>${listing.shippingCost.toFixed(2)}</div>
              <div className="text-muted-foreground">Returns</div>
              <div>{listing.returns}</div>
            </div>
            
            <h2 className="text-lg font-semibold mb-3">Item Description</h2>
            <p className="text-sm mb-6">{listing.description}</p>
            
            <h2 className="text-lg font-semibold mb-3">Seller Information</h2>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium">{listing.seller}</div>
                <div className="flex items-center text-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span>4.9</span>
                  <span className="mx-1 text-muted-foreground">•</span>
                  <span className="text-muted-foreground">98 reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bid History */}
      <div className="mt-8 border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">Bid History</h2>
        {listing.bids.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Bidder</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {listing.bids
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map(bid => (
                    <tr key={bid.id} className="border-b">
                      <td className="py-3 px-4">
                        {bid.user}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ${bid.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(bid.date).toLocaleString()}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No bids yet. Be the first to bid!
          </div>
        )}
      </div>
      
      {/* Similar Items */}
      <div className="mt-8 border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">Similar Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-muted relative">
                <img 
                  src={`https://images.unsplash.com/photo-${1580000000 + (i * 10000)}?w=800&auto=format`} 
                  alt={`Similar item ${i}`} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  1d {i * 3}h left
                </div>
              </div>
              <div className="p-4">
                <Link to={`/listings/${1000 + i}`} className="text-lg font-medium hover:text-primary line-clamp-1">
                  Similar Vintage Item {i}
                </Link>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="font-bold text-foreground">${(150 + i * 25).toFixed(2)}</span>
                  <span className="text-muted-foreground">{5 + i} bids</span>
                </div>
                <Link 
                  to={`/listings/${1000 + i}`}
                  className="w-full mt-3 inline-block text-center bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md text-sm font-medium"
                >
                  Bid Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;