import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "United States",
    bio: "Passionate collector of vintage cameras and vinyl records.",
    notifyBidUpdates: true,
    notifyWatchlistUpdates: true,
    notifyNewMessages: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock updating profile
    setTimeout(() => {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    }, 1000);
  };

  // Check user authentication
  const user = JSON.parse(localStorage.getItem("userAuth")) || null;
  
  if (!user) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-6">You need to log in to view your profile</h2>
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
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Sidebar */}
        <div>
          <div className="bg-card rounded-lg border overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="h-32 w-32 bg-primary/10 rounded-full flex items-center justify-center text-primary text-4xl font-bold mb-4">
                {formData.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-xl font-semibold">{formData.fullName}</h2>
              <p className="text-muted-foreground text-sm mt-1">{formData.email}</p>
              <p className="text-sm text-muted-foreground mt-1">Member since January 2023</p>
              
              <div className="w-full mt-6 pt-6 border-t flex flex-col gap-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bid Success Rate:</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items Sold:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items Purchased:</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seller Rating:</span>
                  <div className="flex items-center">
                    <div className="flex items-center mr-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span>4.0</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 p-6">
              <h3 className="font-medium mb-2">About Me</h3>
              <p className="text-sm text-muted-foreground">{formData.bio || "No bio provided."}</p>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6 mt-6">
            <h3 className="font-medium mb-4">Account Balance</h3>
            <div className="text-3xl font-bold">$1,250.50</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                Deposit
              </button>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                Withdraw
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Column - Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label 
                      htmlFor="fullName"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label 
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label 
                      htmlFor="phone"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label 
                      htmlFor="address"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label 
                      htmlFor="city"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label 
                      htmlFor="state"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      State/Province
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label 
                      htmlFor="zip"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Postal/Zip Code
                    </label>
                    <input
                      id="zip"
                      name="zip"
                      type="text"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label 
                      htmlFor="country"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Country
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label 
                      htmlFor="bio"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t">
                <h3 className="font-medium mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="notifyBidUpdates" 
                      name="notifyBidUpdates"
                      checked={formData.notifyBidUpdates} 
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      disabled={!isEditing}
                    />
                    <label htmlFor="notifyBidUpdates" className={`text-sm ${!isEditing ? 'text-muted-foreground' : ''}`}>
                      Notify me when I'm outbid or win an auction
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="notifyWatchlistUpdates" 
                      name="notifyWatchlistUpdates"
                      checked={formData.notifyWatchlistUpdates} 
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      disabled={!isEditing}
                    />
                    <label htmlFor="notifyWatchlistUpdates" className={`text-sm ${!isEditing ? 'text-muted-foreground' : ''}`}>
                      Notify me about watchlist item updates and price changes
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="notifyNewMessages" 
                      name="notifyNewMessages"
                      checked={formData.notifyNewMessages} 
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      disabled={!isEditing}
                    />
                    <label htmlFor="notifyNewMessages" className={`text-sm ${!isEditing ? 'text-muted-foreground' : ''}`}>
                      Notify me about new messages
                    </label>
                  </div>
                </div>
              </div>
              
              {isEditing && (
                <div className="px-6 pb-6 flex justify-end">
                  <button 
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
          
          <div className="bg-card rounded-lg border overflow-hidden mt-6">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Security</h2>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-medium mb-2">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label 
                      htmlFor="currentPassword"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label 
                      htmlFor="newPassword"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                  >
                    Update Password
                  </button>
                </div>
              </div>
              
              <div className="pt-6 border-t">
                <h3 className="font-medium mb-2">Multi-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enhance your account security by enabling multi-factor authentication.
                </p>
                <button 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                >
                  Enable 2FA
                </button>
              </div>
              
              <div className="pt-6 mt-6 border-t">
                <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete your account and all associated data.
                </p>
                <button 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-red-600 text-white hover:bg-red-700 h-9 px-4 py-2"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;