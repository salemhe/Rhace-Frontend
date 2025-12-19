// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
// import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"
// import HeroImage from '../../../components/auth/HeroImage'
// import { authService } from "@/services/auth.service"
// import { useDispatch } from "react-redux"
// import { useNavigate, useSearchParams } from "react-router"
// import { toast } from "sonner"
// import { setUser } from "@/redux/slices/authSlice"

// const getCurrentYear = () => new Date().getFullYear();

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isLoading, setIsloading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false)
//   const [error, setError] = useState({
//     email: "",
//     password: "",
//   })
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   })

//   const [searchParams] = useSearchParams();
//   const redirectTo = searchParams.get("redirect") || "/";

//   const handleLogin = async () => {
//     try {
//       if (!formValidation()) {
//         return
//       }
//       setError({ email: "", password: "" });
//       setIsloading(true);
//       const user = await authService.login(
//         formData.email,
//         formData.password,
//       );
//       dispatch(setUser(user?.user));
//       toast.success("Welcome back!");
//       navigate(redirectTo);
//     } catch (err) {
//       toast.error(err.response?.data.message);
//       if (err.response.data.message === "Please verify your email with the OTP sent to your inbox.") {
//         navigate(`/auth/user/otp?email=${formData.email}`)
//       }
//     } finally {
//       setIsloading(false);
//     }
//   };

//   const formValidation = () => {
//     // Basic validation logic
//     if (!formData.email) {
//       setError((prev) => ({ ...prev, email: "Email is required." }))
//       return false
//     }
//     if (!formData.password) {
//       setError((prev) => ({ ...prev, password: "Password is required." }))
//       return false
//     }
//     if (formData.password.length < 6) {
//       setError((prev) => ({ ...prev, password: "Password must be at least 6 characters." }))
//       return false
//     }
//     return true
//   }

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }
//   return (
//     <div className='w-full h-screen flex p-4 bg-white'>
//       <div className='flex-1 h-full overflow-y-auto hide-scrollbar'>
//         <div className="min-h-screen flex items-center justify-center">
//           <Card className="w-full max-w-md bg-white shadow-none p-0 border-none">
//             <CardHeader className="text-center pb-6">
//               <div className="flex items-center justify-center gap-2 mb-6">
//                 <div className="w-6 h-6 bg-[#60A5FA] rounded-full flex items-center justify-center">
//                 </div>
//                 <span className="text-xl font-semibold text-gray-900">Rhace</span>
//               </div>
//               <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h1>
//               <p className="text-sm text-gray-600">We're glad to see you again. Please log in to your account.</p>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-sm font-medium text-gray-700">
//                   Email
//                 </Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-3.5 h-4 w-4 text-[#8a8f9a]" strokeWidth={1.25} />
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="john.doe@example.com"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange("email", e.target.value)}
//                     className="pl-10 w-full h-10 sm:h-12 rounded-md border-gray-100 bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out"
//                   />
//                 </div>
//                 {error.email && <p className="text-sm text-red-600 mt-1">{error.email}</p>}
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-sm font-medium text-gray-700">
//                   Password
//                 </Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3.5 h-4 w-4 text-[#8a8f9a]" strokeWidth={1.25} />
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     value={formData.password}
//                     placeholder="********"
//                     onChange={(e) => handleInputChange("password", e.target.value)}
//                     className="px-10 w-full h-10 sm:h-12 rounded-md border-gray-100 bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                   </button>
//                 </div>
//                 {error.password && <p className="text-sm text-red-600 mt-1">{error.password}</p>}
//               </div>
//               <div className="flex justify-end">
//                 <a
//                   href="/auth/user/forgot-password"
//                   className="text-sm text-blue-600 hover:underline font-medium"
//                 >
//                   Forgot password?
//                 </a>
//               </div>
//               <Button
//                 disabled={!formData.email || !formData.password || isLoading}
//                 onClick={handleLogin}
//                 className="w-full h-10 sm:h-12 rounded-md bg-[#0a646d] text-white text-sm sm:text-base font-light shadow-md hover:shadow-lg hover:bg-[#127a87] transition-colors duration-300 mt-6"
//               >
//                 {isLoading ? (
//                   <span className="flex items-center gap-1">
//                     Loading <Loader2 className="animate-spin" />
//                   </span>
//                 ) : (
//                   "Login"
//                 )}
//               </Button>
//             </CardContent>
//             <CardFooter className="flex flex-col space-y-4 pt-6">
//               <p className="text-sm text-center text-gray-600">
//                 Don't Have An Account?{" "}
//                 <a href="/auth/user/signup" className="text-blue-600 hover:underline font-medium">
//                   Sign up
//                 </a>
//               </p>
//               <div className="flex flex-col md:flex-row justify-between items-center w-full text-xs text-gray-500">
//                 <span>Copyright © {getCurrentYear()} Rhace Enterprises LTD.</span>
//                 <a href="#" className="hover:underline">
//                   Privacy Policy
//                 </a>
//               </div>
//             </CardFooter>
//           </Card>
//         </div>
//       </div>
//       <HeroImage role='user' />
//     </div>
//   )
// }

// export default Login



import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import GoogleIcon from "@/public/auth/google.svg";
import { authService } from "@/services/auth.service"
import { useDispatch } from "react-redux"
import { useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"
import { setUser } from "@/redux/slices/authSlice"
import logo from "../../../public/images/Rhace-11.png"
import { useGoogleLogin } from "@react-oauth/google"

const getCurrentYear = () => new Date().getFullYear();

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      try {
        setGoogleLoading(true);
        const code = tokenResponse.code;
        const user = await authService.googleLogin(code);
        dispatch(setUser(user?.user));
        toast.success("Welcome back!");
        navigate(redirectTo);
      } catch (error) {
        console.error("Google login failed:", error);
        toast.error("Google login failed. Please try again.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: error => console.log('Login Failed:', error)
  });

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleLogin = async () => {
    try {
      if (!formValidation()) return;

      setError({ email: "", password: "" });
      setIsloading(true);
      const user = await authService.login(formData.email, formData.password);
      dispatch(setUser(user?.user));
      toast.success("Welcome back!");
      navigate(redirectTo);
    } catch (err) {
      toast.error(err.response?.data.message);
      if (err.response?.data?.message === "Please verify your email with the OTP sent to your inbox.") {
        navigate(`/auth/user/otp?email=${formData.email}`);
      }
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
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8 relative">

      {/* Logo — positioned outside the card */}
      <div className="absolute top-6 left-4 sm:left-10 flex items-center gap-2 sm:top-[8%] sm:-translate-y-1/2">
        <a href="/" className="cursor-pointer">
          <img
            src={logo}
            alt="Rhace Logo"
            className="w-20 h-20 object-contain"
          />
        </a>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md bg-white shadow-md rounded-2xl border border-gray-100 mt-16 sm:mt-24">
        <CardHeader className="text-left pb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-600 mt-1 mb-[-7px]">
            We're glad to see you again. Please log in to your account.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full h-10 sm:h-12 rounded-md border-gray-100 bg-gray-100 
                        text-black text-sm placeholder-[#a0a3a8]
                        focus:outline-none focus:border-[#0A6C6D] focus:ring-1 focus:ring-[#0A6C6D]
                        hover:border-[#0A6C6D] transition-all duration-300 ease-in-out pl-3"
            />
            {error.email && <p className="text-sm text-red-600 mt-1">{error.email}</p>}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={formData.password}
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

          {/* Forgot Password */}
          <div className="flex justify-end">
            <a
              href="/auth/user/forgot-password"
              className="text-sm text-[#0A6C6D] hover:text-[#074f55] font-medium transition-all"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <Button
            disabled={!formData.email || !formData.password || isLoading}
            onClick={handleLogin}
            className="w-full py-6 rounded-md bg-[#0A6C6D] text-white text-sm font-light transition-transform duration-200 hover:shadow-lg hover:bg-[#0A6C6D]"
          >
            {isLoading ? (
              <span className="flex items-center gap-1">
                Loading <Loader2 className="animate-spin" />
              </span>
            ) : (
              "Login"
            )}
          </Button>

          {/* OR Divider */}
          <div className="flex items-center my-2">
            <div className="flex-1 h-px bg-[#0A6C6D]"></div>
            <span className="px-3 text-sm text-[#074f55]">OR</span>
            <div className="flex-1 h-px bg-[#0A6C6D]"></div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-300 
                       bg-white py-3 rounded-md hover:bg-gray-50 transition-all"
          >
            {/* Google Icon */}
            <img src={GoogleIcon} alt="Google" className="h-5 w-5" />
            {googleLoading ? <Loader2 className="animate-spin h-4 w-4 text-gray-600" /> :
              <span className="text-sm text-gray-700 font-medium">Continue with Google</span>
            }
          </button> 


          <p className="text-sm text-center text-[#0A6C6D] hover:text-[#074f55] transition-all font-light">
            Don’t Have An Account?{" "}
            <a href="/auth/user/signup" className="text-[#0a646d] hover:underline font-medium">
              Sign Up
            </a>
          </p>
        </CardContent>

        <CardFooter />
      </Card>

      {/* Footer */}
      <footer className="text-xs text-gray-500 mt-6 text-center px-4">
        <p>
          Copyright © {getCurrentYear()} Rhace Enterprises LTD. •{" "}
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Login;












