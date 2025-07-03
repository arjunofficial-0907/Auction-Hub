import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">BidZone</h3>
            <p className="text-muted-foreground text-sm">The next generation bidding platform with AI-powered features.</p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/listings" className="text-muted-foreground hover:text-primary transition-colors">Browse Auctions</Link></li>
              <li><Link to="/sell" className="text-muted-foreground hover:text-primary transition-colors">Sell an Item</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} BidZone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;