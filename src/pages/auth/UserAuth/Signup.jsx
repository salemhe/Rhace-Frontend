import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react"
import HeroImage from '../../../components/auth/HeroImage'
import { toast } from "sonner"
import { useNavigate } from "react-router"
import { authService } from "@/services/auth.service"

const getCurrentYear = () => new Date().getFullYear();

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsloading] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleRegister = async () => {
    try {
      if (!formValidation()) {
        return
      }
      setError({ email: "", password: "", firstName: "", lastName: "", confirmPassword: "" });
      setIsloading(true);
      const user = await authService.register(
        formData
      );
      console.log(user);
      toast.success("Congratulations!. Next: verify your email");
      navigate(`/auth/user/otp?email=${formData.email}`)
    } catch (err) {
      toast.error(err.response?.data.message);
    } finally {
      setIsloading(false);
    }
  }

  const getPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    if (password.length >= 12) strength++
    return strength
  }

  const strength = getPasswordStrength(formData.password)

  const formValidation = () => {
    // Basic validation logic
    if (!formData.firstName) {
      setError((prev) => ({ ...prev, firstName: "First Name is required." }))
      return false
    }
    if (!formData.lastName) {
      setError((prev) => ({ ...prev, lastName: "Last Name is required." }))
      return false
    }
    if (!formData.email) {
      setError((prev) => ({ ...prev, email: "Email is required." }))
      return false
    }
    if (!formData.password) {
      setError((prev) => ({ ...prev, password: "Password is required." }))
      return false
    }
    if (formData.password.length < 8) {
      setError((prev) => ({ ...prev, password: "Password must be at least 8 characters." }))
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }))
      return false
    }
    return true
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  return (
    <div className='w-full h-screen flex p-4 bg-white'>
      <div className='flex-1 h-full overflow-y-auto hide-scrollbar'>
        <div className="min-h-screen flex items-center justify-center ">
          <Card className="w-full max-w-md bg-white shadow-none p-0 border-none">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-6 h-6 bg-[#60A5FA] rounded-full flex items-center justify-center">
                </div>
                <span className="text-xl font-semibold text-gray-900">Rhace</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create an Account</h1>
              <p className="text-sm text-gray-600">Join now to streamline your experience from day one.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fname" className="text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-[#8a8f9a]" strokeWidth={1.25} />
                  <Input
                    id="fname"
                    type="text"
                    value={formData.firstName}
                    placeholder="John"
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="pl-10 w-full h-10 sm:h-12 rounded-md border-gray-100 bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out"
                  />
                </div>
                {error.name && <p className="text-sm text-red-600 mt-1">{error.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-[#8a8f9a]" strokeWidth={1.25} />
                  <Input
                    id="lname"
                    type="text"
                    value={formData.lastName}
                    placeholder="Doe"
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="pl-10 w-full h-10 sm:h-12 rounded-md border-gray-100 bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out"
                  />
                </div>
                {error.name && <p className="text-sm text-red-600 mt-1">{error.lastName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-[#8a8f9a]" strokeWidth={1.25} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 w-full h-10 sm:h-12 rounded-md border-gray-100 bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out"
                  />
                </div>
                {error.email && <p className="text-sm text-red-600 mt-1">{error.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-[#8a8f9a]" strokeWidth={1.25} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    placeholder="********"
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="px-10 w-full h-10 sm:h-12 rounded-md border-gray-100 bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out"
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
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-[#8a8f9a]" strokeWidth={1.25} />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    placeholder="********"
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="px-10 w-full h-10 sm:h-12 rounded-md border-gray-100 bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out"
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
              {formData.password && (
                <div className="w-full mt-2">
                  <PasswordStrengthMeter strength={strength} />
                </div>
              )}
              <Button disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword || strength < 3} onClick={handleRegister} className="w-full h-10 sm:h-12 rounded-md bg-[#0a646d] text-white text-sm sm:text-base font-light shadow-md hover:shadow-lg hover:bg-[#127a87] transition-colors duration-300">
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
              <p className="text-sm text-center text-gray-600">
                Already Have An Account?{" "}
                <a href="/auth/user/login" className="text-blue-600 hover:underline font-medium">
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
      <HeroImage role='user' />
    </div>
  )
}

export default Signup

export const PasswordStrengthMeter = ({ strength }) => {


  const getStrengthLabel = (score) => {
    if (score <= 2) return "Weak"
    if (score <= 4) return "Medium"
    return "Strong"
  }

  const getStrengthColor = (score) => {
    if (score <= 2) return "bg-red-600"
    if (score <= 4) return "bg-yellow-600"
    return "bg-green-600"
  }

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center">
        <div className={`h-2 w-full rounded ${getStrengthColor(strength)}`} />
        <span className="ml-2 text-sm font-medium">{getStrengthLabel(strength)}</span>
      </div>
      <div className="flex flex-col justify-between text-xs text-gray-500">
        <span>Password must be at least 8 characters long</span>
        <span>Include uppercase and lowercase letters</span>
        <span>Include numbers</span>
        <span>Include symbols</span>
        <span>Longer passwords are stronger</span>
      </div>
    </div>
  )
}
