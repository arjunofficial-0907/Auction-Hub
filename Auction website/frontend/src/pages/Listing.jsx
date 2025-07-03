import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Filter, Search, X, Sparkles, Clock, ArrowUpDown, Tag } from "lucide-react";

const Listings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("featured");
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    condition: ""
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category) {
      setFilters(prev => ({ ...prev, category }));
    }
  }, [location.search]);

  const OrderBySelect = ({ value, onChange, options }) => {
    return (
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="appearance-none bg-background border border-input rounded-md pl-3 pr-10 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    );
  };

  useEffect(() => {
    const loadListings = () => {
      setIsLoading(true);
      
      setTimeout(() => {
        const storedListings = JSON.parse(localStorage.getItem("auctionListings") || "[]");
        
        let data;
        if (storedListings.length > 0) {
          data = storedListings;
        } else {
          data = [
            { id: 1, title: "Vintage Camera Collection", currentBid: 350, bids: 12, images: ["https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format"], timeLeft: "2 days", category: "electronics", condition: "used" },
            { id: 2, title: "Antique Pocket Watch", currentBid: 780, bids: 18, images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format"], timeLeft: "5 hours", category: "collectibles", condition: "good" },
            { id: 3, title: "Limited Edition Vinyl Records", currentBid: 120, bids: 7, images: ["https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format"], timeLeft: "1 day", category: "collectibles", condition: "mint" },
            { id: 4, title: "Handcrafted Leather Bag", currentBid: 230, bids: 9, images: ["https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format"], timeLeft: "3 days", category: "fashion", condition: "new" },
            { id: 5, title: "Vintage Typewriter", currentBid: 190, bids: 5, images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format"], timeLeft: "4 days", category: "collectibles", condition: "fair" },
            { id: 6, title: "Mechanical Wristwatch", currentBid: 450, bids: 15, images: ["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format"], timeLeft: "6 hours", category: "jewelry", condition: "excellent" },
            { id: 7, title: "Mid-Century Modern Chair", currentBid: 340, bids: 11, images: ["https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format"], timeLeft: "2 days", category: "home", condition: "good" },
            { id: 8, title: "Oil Painting Landscape", currentBid: 520, bids: 14, images: ["https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format"], timeLeft: "1 day", category: "art", condition: "fair" },
            { id: 9, title: "Vintage Comic Book Collection", currentBid: 670, bids: 22, images: ["https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format"], timeLeft: "12 hours", category: "collectibles", condition: "good" },
            { id: 10, title: "Professional DSLR Camera", currentBid: 890, bids: 19, images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format"], timeLeft: "3 days", category: "electronics", condition: "like-new" },
            { id: 11, title: "First Edition Book Collection", currentBid: 410, bids: 8, images: ["https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format"], timeLeft: "5 days", category: "books", condition: "good" },
            { id: 12, title: "Handmade Ceramic Vase", currentBid: 85, bids: 6, images: ["https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format"], timeLeft: "2 days", category: "home", condition: "new" }
          ];
        }
        
        setListings(data);
        setFilteredListings(data);
        setIsLoading(false);
      }, 1000);
    };
    
    loadListings();
  }, []);

  useEffect(() => {
    if (listings.length === 0) return;
    
    let results = [...listings];
    
    if (filters.category) {
      results = results.filter(item => 
        item.category && item.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    if (filters.condition) {
      results = results.filter(item => 
        item.condition && item.condition.toLowerCase() === filters.condition.toLowerCase()
      );
    }
    
    if (filters.minPrice) {
      results = results.filter(item => item.currentBid >= parseFloat(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      results = results.filter(item => item.currentBid <= parseFloat(filters.maxPrice));
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      results = results.filter(item => 
        (item.title && item.title.toLowerCase().includes(search)) ||
        (item.description && item.description.toLowerCase().includes(search)) ||
        (item.category && item.category.toLowerCase().includes(search))
      );
    }
    
    switch(orderBy) {
      case "price-asc":
        results.sort((a, b) => a.currentBid - b.currentBid);
        break;
      case "price-desc":
        results.sort((a, b) => b.currentBid - a.currentBid);
        break;
      case "ending-soon":
        results.sort((a, b) => {
          const aTime = a.timeLeft.split(" ");
          const bTime = b.timeLeft.split(" ");
          
          const aHours = aTime[0] === "hours" || aTime[1] === "hours" ? 
                        parseInt(aTime[0]) : parseInt(aTime[0]) * 24 + parseInt(aTime[1]);
          const bHours = bTime[0] === "hours" || bTime[1] === "hours" ? 
                        parseInt(bTime[0]) : parseInt(bTime[0]) * 24 + parseInt(bTime[1]);
          
          return aHours - bHours;
        });
        break;
      case "most-bids":
        results.sort((a, b) => b.bids - a.bids);
        break;
      default: // "featured" - no specific sort, use default order
        break;
    }
    
    setFilteredListings(results);
  }, [listings, filters, searchTerm, orderBy]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      condition: ""
    });
    setSearchTerm("");
    navigate("/listings");
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const categories = [
    { value: "", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "collectibles", label: "Collectibles" },
    { value: "fashion", label: "Fashion" },
    { value: "home", label: "Home & Garden" },
    { value: "art", label: "Art" },
    { value: "jewelry", label: "Jewelry & Watches" },
    { value: "books", label: "Books & Media" },
    { value: "toys", label: "Toys & Hobbies" },
    { value: "sports", label: "Sports" },
    { value: "other", label: "Other" }
  ];

  const conditions = [
    { value: "", label: "All Conditions" },
    { value: "new", label: "New" },
    { value: "like-new", label: "Like New" },
    { value: "excellent", label: "Excellent" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" }
  ];

  const orderOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "ending-soon", label: "Ending Soon" },
    { value: "most-bids", label: "Most Bids" }
  ];

  return (
    <div className="container py-8">
      <div className="relative pb-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Discover Auctions</h1>
        <p className="text-muted-foreground mt-2">Find unique items from sellers around the world</p>
        <div className="absolute bottom-0 left-0 h-1 w-24 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={toggleFilter}
          className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-secondary hover:bg-secondary/80 text-secondary-foreground h-9 px-4 py-2"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className={`${isFilterOpen ? 'fixed inset-0 z-50 bg-background p-6 md:relative md:p-0 md:z-0' : 'hidden md:block'}`}>
          <div className="md:hidden flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={toggleFilter} className="p-1">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-6 bg-card rounded-lg p-6 border shadow-sm">
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <Search className="w-4 h-4 mr-2 text-muted-foreground" />
                Search
              </h3>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-3 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <Tag className="w-4 h-4 mr-2 text-muted-foreground" />
                Category
              </h3>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <ArrowUpDown className="w-4 h-4 mr-2 text-muted-foreground" />
                Price Range
              </h3>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    min="0"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    min="0"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-muted-foreground" />
                Condition
              </h3>
              <select
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {conditions.map(condition => (
                  <option key={condition.value} value={condition.value}>{condition.label}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={clearFilters}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full"
            >
              Clear Filters
            </button>
            
            <div className="md:hidden pt-4">
              <button 
                onClick={toggleFilter}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 w-full"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <div className="bg-card rounded-lg p-4 mb-6 border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm flex items-center">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{filteredListings.length} listings found</span>
            </div>
            
            <div className="flex items-center w-full sm:w-auto space-x-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
              <div className="w-full sm:w-[200px]">
                <OrderBySelect 
                  value={orderBy} 
                  onChange={handleOrderChange} 
                  options={orderOptions}
                />
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted rounded-lg mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map(listing => (
                <div key={listing.id} className="group bg-card rounded-lg border overflow-hidden hover:shadow-md transition-all hover:translate-y-[-4px]">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      {listing.timeLeft} left
                    </div>
                    <div className="absolute bottom-2 left-2 bg-primary/80 text-white text-xs px-2 py-1 rounded-full">
                      {listing.bids} bids
                    </div>
                  </div>
                  <div className="p-4">
                    <Link to={`/listings/${listing.id}`} className="text-lg font-medium hover:text-primary line-clamp-1">
                      {listing.title}
                    </Link>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-lg">${listing.currentBid}</span>
                      <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full capitalize">
                        {listing.category}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link 
                        to={`/listings/${listing.id}`}
                        className="text-center bg-secondary text-secondary-foreground hover:bg-secondary/80 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        View Item
                      </Link>
                      <Link 
                        to={`/listings/${listing.id}`}
                        className="text-center bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md text-sm font-medium"
                      >
                        Bid Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;