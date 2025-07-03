import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8 text-center">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mt-4 mb-2">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link 
          to="/" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Back to Home
        </Link>
        <Link 
          to="/listings" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Browse Auctions
        </Link>
      </div>
    </div>
  );
};

export default NotFound;