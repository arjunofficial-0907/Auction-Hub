import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Sell = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'electronics',
    condition: 'new',
    startingPrice: '',
    reservePrice: '',
    duration: '7',
    images: []
  });

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'collectibles', label: 'Collectibles' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'art', label: 'Art' },
    { value: 'jewelry', label: 'Jewelry & Watches' },
    { value: 'sports', label: 'Sports' },
    { value: 'toys', label: 'Toys & Hobbies' },
    { value: 'books', label: 'Books & Media' },
    { value: 'other', label: 'Other' }
  ];

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const durations = [
    { value: '1', label: '1 day' },
    { value: '3', label: '3 days' },
    { value: '5', label: '5 days' },
    { value: '7', label: '7 days' },
    { value: '10', label: '10 days' },
    { value: '14', label: '14 days' }
  ];
  
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('userAuth')) || null;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files) {
      // For demo, we'll just store image URLs - in a real app you'd upload to a server
      const newImagesArray = [];
      
      for (let i = 0; i < Math.min(e.target.files.length, 4); i++) {
        const placeholderUrls = [
          "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format",
          "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format",
          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format",
          "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format",
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format",
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format",
          "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format",
          "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format"
        ];
        
        newImagesArray.push(placeholderUrls[Math.floor(Math.random() * placeholderUrls.length)]);
      }
      
      setFormData(prevState => ({
        ...prevState,
        images: [...prevState.images, ...newImagesArray].slice(0, 4) // Max 4 images
      }));
    }
  };

  // Remove an image
  const handleRemoveImage = (index) => {
    setFormData(prevState => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to create a listing');
      navigate('/login');
      return;
    }
    
    // Validation
    if (
      !formData.title || 
      !formData.description || 
      !formData.startingPrice ||
      formData.startingPrice <= 0
    ) {
      toast.error('Please fill in all required fields correctly');
      return;
    }
    
    // Add placeholder images if none were selected
    let imagesToUse = formData.images.length > 0 ? formData.images : [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format"
    ];
    
    setIsLoading(true);
    
    // Mock submission with timeout
    setTimeout(() => {
      // Get existing listings from localStorage
      const existingListings = JSON.parse(localStorage.getItem('auctionListings')) || [];
      
      // Create new listing
      const newListing = {
        id: new Date().getTime(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        startingPrice: parseFloat(formData.startingPrice),
        currentBid: parseFloat(formData.startingPrice),
        reservePrice: formData.reservePrice ? parseFloat(formData.reservePrice) : null,
        duration: parseInt(formData.duration),
        timeLeft: `${formData.duration}d 0h`,
        images: imagesToUse,
        bids: [],
        seller: user.email || user.id,
        sellerId: user.id,
        location: "United States",
        shippingCost: 9.99,
        returns: "No returns accepted",
        endDate: new Date(Date.now() + parseInt(formData.duration) * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('auctionListings', JSON.stringify([...existingListings, newListing]));
      
      setIsLoading(false);
      toast.success('Your listing has been created successfully!');
      navigate('/dashboard');
    }, 1500);
  };

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-6">You need to log in to create a listing</h2>
        <button 
          onClick={() => navigate('/login')}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Sell an Item</h1>
      
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Item Title *
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="What are you selling?"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Provide details about your item, its condition, history, etc."
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="condition" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Condition *
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  {conditions.map(condition => (
                    <option key={condition.value} value={condition.value}>{condition.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="startingPrice" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Starting Price ($) *
                </label>
                <input
                  id="startingPrice"
                  name="startingPrice"
                  type="number"
                  value={formData.startingPrice}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="reservePrice" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Reserve Price ($) <span className="text-muted-foreground">(Optional)</span>
                </label>
                <input
                  id="reservePrice"
                  name="reservePrice"
                  type="number"
                  value={formData.reservePrice}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">Minimum price for the item to sell. If not met, you're not obligated to sell.</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Auction Duration *
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  {durations.map(duration => (
                    <option key={duration.value} value={duration.value}>{duration.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Item Images <span className="text-muted-foreground">(Up to 4)</span>
              </label>
              <div className="flex flex-wrap gap-4 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative w-24 h-24 md:w-32 md:h-32 rounded border overflow-hidden">
                    <img src={image} alt={`Item preview ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {formData.images.length < 4 && (
                  <label className="w-24 h-24 md:w-32 md:h-32 border border-dashed rounded flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-xs text-muted-foreground">Add Image</span>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                      multiple={formData.images.length < 3}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Add up to 4 images. First image will be the cover image.</p>
            </div>
            
            <div className="border-t pt-6 flex gap-3 justify-end">
              <button 
                type="button" 
                onClick={() => navigate(-1)} 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
              >
                {isLoading ? 'Creating Listing...' : 'Create Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sell;