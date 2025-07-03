import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, User, LogOut, Package } from "lucide-react";
import { toast } from "sonner";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      const userAuth = localStorage.getItem("userAuth");
      if (userAuth) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userAuth));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    
    checkAuth();
    
    // Listen for storage events to detect logout from other tabs
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [location]);
  
  // Handle scroll event for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userAuth");
    setIsAuthenticated(false);
    setUser(null);
    toast.success("Successfully logged out!");
    navigate("/");
  };
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  return (
    <header className={`sticky top-0 z-50 w-full border-b ${isScrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "bg-background"}`}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">BidZone</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium ${location.pathname === "/" ? "text-foreground" : "text-muted-foreground"} transition-colors hover:text-foreground`}>
              Home
            </Link>
            <Link to="/listings" className={`text-sm font-medium ${location.pathname === "/listings" ? "text-foreground" : "text-muted-foreground"} transition-colors hover:text-foreground`}>
              Auctions
            </Link>
            <Link to="/sell" className={`text-sm font-medium ${location.pathname === "/sell" ? "text-foreground" : "text-muted-foreground"} transition-colors hover:text-foreground`}>
              Sell
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search auctions..."
              className="flex h-9 w-[200px] lg:w-[300px] rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden"
              >
                {user?.fullName ? (
                  <span className="text-xs font-medium">{user.fullName.split(' ').map(n => n[0]).join('')}</span>
                ) : (
                  <User className="h-4 w-4" />
                )}
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-background border shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-muted-foreground border-b">
                      <div className="font-medium">{user?.fullName || user?.email || "User"}</div>
                      <div className="text-xs truncate">{user?.email}</div>
                    </div>
                    <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm hover:bg-muted">
                      <Package className="h-4 w-4 mr-3" />
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm hover:bg-muted">
                      <User className="h-4 w-4 mr-3" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-muted"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                Login
              </Link>
              <Link to="/signup" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                Sign Up
              </Link>
            </div>
          )}
          
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background h-[calc(100vh-4rem)] md:hidden">
          <div className="container py-6 grid gap-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search auctions..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            
            <nav className="grid gap-3">
              <Link to="/" className="flex items-center gap-2 text-lg font-medium">
                Home
              </Link>
              <Link to="/listings" className="flex items-center gap-2 text-lg font-medium">
                Auctions
              </Link>
              <Link to="/sell" className="flex items-center gap-2 text-lg font-medium">
                Sell
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="flex items-center gap-2 text-lg font-medium">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2 text-lg font-medium">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-lg font-medium text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  <Link to="/login" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    Login
                  </Link>
                  <Link to="/signup" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;