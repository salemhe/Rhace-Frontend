import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import HeroImage from '../../../components/auth/HeroImage';
import { authService } from "@/services/auth.service";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { setAdmin } from "@/redux/slices/authSlice";
import logo from "../../../assets/Rhace-11.png";

const getCurrentYear = () => new Date().getFullYear();

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard/admin";

  const handleLogin = async () => {
    try {
      if (!formValidation()) {
        return;
      }
      setError({ email: "", password: "" });
      setIsloading(true);
      const user = await authService.adminLogin(formData.email, formData.password);
      console.log("Admin login response:", user);
      dispatch(setAdmin(user?.user));
      toast.success("Welcome back, Admin!");
      navigate(redirectTo);
    } catch (err) {
      toast.error(err.response?.data.message);
    } finally {
      setIsloading(false);
    }
  };

  const formValidation = () => {
    if (!formData.email) {
      setError((prev) => ({ ...prev, email: "Email is required." }));
      return false;
    }
    if (!formData.password) {
      setError((prev) => ({ ...prev, password: "Password is required." }));
      return false;
    }
    if (formData.password.length < 6) {
      setError((prev) => ({ ...prev, password: "Password must be at least 6 characters." }));
      return false;
    }
    return true;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className='w-full h-screen flex p-4 bg-white'>
      <div className='flex-1 h-full overflow-y-auto hide-scrollbar'>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md bg-white shadow-none p-0 border-none">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2">
                <a href="/auth/admin/login" className="cursor-pointer">
                  <img
                    src={logo} 
                    alt="Rhace Logo"
                    className="w-20 h-20 object-contain"
                  />
                </a> 
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back Admin</h1>
              <p className="text-sm text-gray-600">Please log in to your admin account.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your admin email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full h-10 sm:h-12 rounded-md border-gray-100 bg-gray-100 
                          text-black text-sm placeholder-[#a0a3a8]
                          focus:outline-none focus:border-[#0A6C6D] focus:ring-1 focus:ring-[#0A6C6D]
                          hover:border-[#0A6C6D] transition-all duration-300 ease-in-out pl-3"
                  />
                </div>
                {error.email && <p className="text-sm text-red-600 mt-1">{error.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    placeholder="********"
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full h-10 sm:h-12 rounded-md border-gray-100 bg-gray-100 
                          text-black text-sm placeholder-[#a0a3a8]
                          focus:outline-none focus:border-[#0A6C6D] focus:ring-1 focus:ring-[#0A6C6D]
                          hover:border-[#0A6C6D] transition-all duration-300 ease-in-out pl-3"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error.password && <p className="text-sm text-red-600 mt-1">{error.password}</p>}
              </div>
              <Button
                disabled={!formData.email || !formData.password || isLoading}
                onClick={handleLogin}
                className="w-full py-6 rounded-md bg-[#0A6C6D] text-white text-sm font-light transition-transform duration-200 hover:shadow-lg hover:bg-[#0A6C6D] mt-5"
              >
                {isLoading ? (
                  <span className="flex items-center gap-1">
                    Loading <Loader2 className="animate-spin" />
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <p className="text-sm text-center text-[#0A6C6D] hover:text-[#074f55] transition-all font-light">
                Don't Have An Account?{" "}
                <a href="/auth/admin/signup" className="text-[#0a646d] hover:underline font-medium">
                  Sign up
                </a>
              </p>
              <p className="text-center text-sm text-[#0A6C6D] hover:text-[#074f55] transition-all font-light">
                <a href="/auth/vendor/login" className="underline">
                  Sign in as Vendor
                </a>
              </p>
              <div className="flex flex-col md:flex-row justify-between items-center w-full text-xs text-gray-500">
                <span>Copyright © {getCurrentYear()} Rhace Enterprises LTD.</span>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <HeroImage role='admin' />
    </div>
  );
};

export default AdminLogin;