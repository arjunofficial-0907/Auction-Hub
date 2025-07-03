import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    // Mock authentication - would be replaced with actual auth
    setTimeout(() => {
      // For demo, we'll accept any email/password
      const user = {
        id: Math.random().toString(36).substring(2, 15),
        fullName: formData.email.split('@')[0],
        email: formData.email,
        createdAt: new Date().toISOString()
      };
      
      // Store user auth status in localStorage
      localStorage.setItem("userAuth", JSON.stringify(user));
      
      setIsLoading(false);
      toast.success("Successfully logged in!");
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <div className="w-full max-w-md">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight text-center">
              Welcome Back
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Log in to your account to continue
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="p-6 pt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label 
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label 
                      htmlFor="password"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Password
                    </label>
                    <Link to="#" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe} 
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-muted-foreground">
                    Remember me
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center p-6 pt-0 flex-col">
              <button 
                type="submit" 
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 w-full"
              >
                {isLoading ? "Logging in..." : "Log In"}
              </button>
              
              <p className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;