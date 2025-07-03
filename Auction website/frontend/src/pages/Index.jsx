import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronDown } from 'lucide-react';

const Index = () => {
  // Featured auctions data
  const [featuredAuctions, setFeaturedAuctions] = useState([
    { id: 1, title: "Vintage Camera Collection", price: "$350", bids: 12, image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format", timeLeft: "2 days" },
    { id: 2, title: "Antique Pocket Watch", price: "$780", bids: 18, image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&auto=format", timeLeft: "5 hours" },
    { id: 3, title: "Limited Edition Vinyl Records", price: "$120", bids: 7, image: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=800&auto=format", timeLeft: "1 day" },
    { id: 4, title: "Handcrafted Leather Bag", price: "$230", bids: 9, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format", timeLeft: "3 days" }
  ]);
  
  const [orderBy, setOrderBy] = useState("featured");
  
  // Order options
  const orderOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "bids", label: "Most Bids" },
    { value: "ending-soon", label: "Ending Soon" }
  ];

  // Order By Select Component
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

  // Handle order change
  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);
  };

  // Effect to sort auctions when orderBy changes
  useEffect(() => {
    let sortedAuctions = [...featuredAuctions];
    
    switch(orderBy) {
      case "price-asc":
        sortedAuctions.sort((a, b) => parseFloat(a.price.substring(1)) - parseFloat(b.price.substring(1)));
        break;
      case "price-desc":
        sortedAuctions.sort((a, b) => parseFloat(b.price.substring(1)) - parseFloat(a.price.substring(1)));
        break;
      case "bids":
        sortedAuctions.sort((a, b) => b.bids - a.bids);
        break;
      case "ending-soon":
        // Simple sort based on timeLeft string for demo
        const timeOrder = { "hours": 0, "day": 1, "days": 2 };
        sortedAuctions.sort((a, b) => {
          const aTime = a.timeLeft.split(" ")[1];
          const bTime = b.timeLeft.split(" ")[1];
          return timeOrder[aTime] - timeOrder[bTime];
        });
        break;
      default: // "featured" - use original order
        break;
    }
    
    setFeaturedAuctions(sortedAuctions);
  }, [orderBy]);

  // Categories
  const categories = [
    { id: 1, name: "Electronics", icon: "📱", count: 245 },
    { id: 2, name: "Collectibles", icon: "🏆", count: 189 },
    { id: 3, name: "Art", icon: "🎨", count: 156 },
    { id: 4, name: "Fashion", icon: "👕", count: 213 },
    { id: 5, name: "Home & Garden", icon: "🏡", count: 178 },
    { id: 6, name: "Jewelry", icon: "💍", count: 145 }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-700 to-indigo-900 py-12 md:py-20 text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">Discover Unique Items at Auction Prices</h1>
            <p className="text-lg md:text-xl opacity-90 mb-6 md:mb-8">Join thousands of collectors and enthusiasts bidding on one-of-a-kind items from around the world.</p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link to="/listings" className="bg-white text-primary hover:bg-gray-100 px-6 py-2.5 md:px-8 md:py-3 rounded-md font-medium transition-colors">
                Browse Auctions
              </Link>
              <Link to="/sell" className="bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-white/20 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-md font-medium transition-colors">
                Sell an Item
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500 rounded-full filter blur-3xl"></div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Auctions</h2>
            <div className="flex items-center w-full sm:w-auto space-x-2 sm:space-x-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
              <div className="w-full sm:w-auto min-w-[180px]">
                <OrderBySelect 
                  value={orderBy} 
                  onChange={handleOrderChange} 
                  options={orderOptions}
                />
              </div>
              <Link to="/listings" className="text-primary hover:underline font-medium text-sm whitespace-nowrap">
                View All
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredAuctions.map((auction) => (
              <div key={auction.id} className="bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-muted relative">
                  <img src={auction.image} alt={auction.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {auction.timeLeft} left
                  </div>
                </div>
                <div className="p-4">
                <Link to={`/listings/${auction.id}`} className="text-lg font-medium hover:text-primary line-clamp-1">
                    {auction.title}
                  </Link>
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="font-bold text-foreground">{auction.price}</span>
                    <span className="text-muted-foreground">{auction.bids} bids</span>
                  </div>
                  
                 
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((category) => (
              <Link 
                key={category.id}
                to={`/listings?category=${category.name.toLowerCase()}`}
                className="bg-card hover:bg-accent rounded-lg p-4 md:p-6 text-center transition-colors border flex flex-col items-center justify-center"
              >
                <div className="text-2xl md:text-3xl mb-2">{category.icon}</div>
                <h3 className="font-medium text-sm md:text-base">{category.name}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{category.count} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-center mb-8 md:mb-12">Our transparent auction platform makes buying and selling simple</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-card p-5 md:p-6 rounded-lg border text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-4">1</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Browse or List</h3>
              <p className="text-muted-foreground text-sm md:text-base">Browse our wide selection of items or list your own for auction.</p>
            </div>
            <div className="bg-card p-5 md:p-6 rounded-lg border text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-4">2</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Bid or Sell</h3>
              <p className="text-muted-foreground text-sm md:text-base">Place competitive bids on items or accept bids on your listings.</p>
            </div>
            <div className="bg-card p-5 md:p-6 rounded-lg border text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-4">3</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Win or Get Paid</h3>
              <p className="text-muted-foreground text-sm md:text-base">Win auctions or get paid when your items sell successfully.</p>
            </div>
          </div>
          
          <div className="text-center mt-8 md:mt-12">
            <Link 
              to="/how-it-works"
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
            >
              Learn more about our process
              <svg className="ml-2 w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Bidding?</h2>
          <p className="max-w-2xl mx-auto mb-6 md:mb-8">Join thousands of users buying and selling unique items every day.</p>
          <Link 
            to="/signup" 
            className="inline-block bg-white text-primary hover:bg-gray-100 px-6 py-2.5 md:px-8 md:py-3 rounded-md font-medium transition-colors"
          >
            Sign Up for Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;