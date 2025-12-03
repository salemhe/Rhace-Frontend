import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import HeroImage from '../../../components/auth/HeroImage';
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import logo from "../../../assets/Rhace-11.png";

const forbiddenRoles = ["admin", "superadmin", "finance", "ops", "support", "manager"];

const getCurrentYear = () => new Date().getFullYear();

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async () => {
    try {
      if (!formValidation()) {
        return;
      }
      setError({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        password: "",
        confirmPassword: "",
      });
      setIsloading(true);
      // Prepare payload excluding confirmPassword
      const { confirmPassword, ...payload } = formData;
      // If no role provided, remove it from payload
      if (!payload.role) {
        delete payload.role;
      }
      const user = await authService.adminRegister(payload);
      toast.success("Congratulations! Please verify your email.");
      navigate(`/auth/admin/login`);
    } catch (err) {
      toast.error(err.response?.data.message || "Registration failed.");
    } finally {
      setIsloading(false);
    }
  };

  const formValidation = () => {
    if (!formData.firstName) {
      setError((prev) => ({ ...prev, firstName: "First name is required." }));
      return false;
    }
    if (!formData.lastName) {
      setError((prev) => ({ ...prev, lastName: "Last name is required." }));
      return false;
    }
    if (!formData.email) {
      setError((prev) => ({ ...prev, email: "Email is required." }));
      return false;
    }
    if (!formData.phone) {
      setError((prev) => ({ ...prev, phone: "Phone number is required." }));
      return false;
    }
    if (formData.role && forbiddenRoles.includes(formData.role.toLowerCase())) {
      setError((prev) => ({ ...prev, role: "Role cannot be an admin role." }));
      return false;
    }
    if (!formData.password) {
      setError((prev) => ({ ...prev, password: "Password is required." }));
      return false;
    }
    if (formData.password.length < 8) {
      setError((prev) => ({ ...prev, password: "Password must be at least 8 characters." }));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
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
        <div className="min-h-screen flex items-center justify-center ">
          <Card className="w-full max-w-md bg-white shadow-none p-0 border-none">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2">
                <img
                  src={logo} 
                  alt="Rhace Logo"
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create Admin Account</h1>
              <p className="text-sm text-gray-600">Join now to manage your admin dashboard.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="text-black"
                />
                {error.firstName && <p className="text-sm text-red-600 mt-1">{error.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="text-black"
                />
                {error.lastName && <p className="text-sm text-red-600 mt-1">{error.lastName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="text-black"
                />
                {error.email && <p className="text-sm text-red-600 mt-1">{error.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="text-black"
                />
                {error.phone && <p className="text-sm text-red-600 mt-1">{error.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Role (optional, cannot be admin roles)
                </Label>
                <Input
                  id="role"
                  type="text"
                  placeholder="Enter your user role"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="text-black"
                />
                {error.role && <p className="text-sm text-red-600 mt-1">{error.role}</p>}
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    placeholder="********"
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="w-full h-10 sm:h-12 rounded-md border-gray-100 bg-gray-100 
                        text-black text-sm placeholder-[#a0a3a8]
                        focus:outline-none focus:border-[#0A6C6D] focus:ring-1 focus:ring-[#0A6C6D]
                        hover:border-[#0A6C6D] transition-all duration-300 ease-in-out pl-3"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error.confirmPassword && <p className="text-sm text-red-600 mt-1">{error.confirmPassword}</p>}
              </div>
              <Button disabled={!formData.email || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName || !formData.phone} onClick={handleRegister} className="w-full py-6 rounded-md bg-[#0A6C6D] text-white text-sm font-light transition-transform duration-200 hover:shadow-lg hover:bg-[#0A6C6D]">
                {isLoading ? (
                  <span className="flex items-center gap-1">
                    Loading <Loader2 className="animate-spin" />
                  </span>
                ) : (
                  "Register"
                )}
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <p className="text-sm text-center text-[#0A6C6D] hover:text-[#074f55] transition-all font-light">
                Already Have An Account?{" "}
                <a href="/auth/admin/login" className="text-[#0a646d] hover:underline font-medium">
                  Sign In
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

export default Signup;
