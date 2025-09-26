import HeroImage from "@/components/auth/HeroImage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import ForgotImage from "../../../assets/auth/forgot.svg";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { Loader2, Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsloading] = useState(false)

  const handleSubmit = async () => {
    if (!email) return;
    try {
      setIsloading(true)
      await authService.forgotPassword(email);
      toast.success("A reset password link has been sent to your Email")
    } catch (err) {
      toast.error(err.response.data.message)
    } finally {
      setIsloading(false)
    }
  }

  return (
    <div className='w-full h-screen flex p-4 bg-white'>
      <div className="h-screen overflow-auto flex-1 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md p-0 shadow-none border-none">
          <CardHeader className="flex justify-center">
            <img src={ForgotImage} alt="Forgot password illustration" className="w-48 h-48 object-contain" />
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-semibold text-gray-900">Forgot Your Password?</h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                Enter your registered email below to receive password reset instructions.
              </p>
            </div>
            <div className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-[#8a8f9a]" strokeWidth={1.25} />
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full h-10 sm:h-12 rounded-md border-gray-100 bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out"
                />
              </div>

              <Button disabled={isLoading} onClick={handleSubmit} className="w-full h-10 sm:h-12 rounded-md bg-[#0a646d] text-white text-sm sm:text-base font-light shadow-md hover:shadow-lg hover:bg-[#127a87] transition-colors duration-300" size="lg">
                {isLoading ? (<> Loading <Loader2 className="animate-spin" /></>) : "Send"}
              </Button>
            </div>
            <div className="text-center">
              <a href="/auth/user/login" className="text-blue-600 hover:underline font-medium text-sm">Back to Login</a>
            </div>
          </CardContent>
        </Card>
      </div>
      <HeroImage role='user' />
    </div>
  )
}

export default ForgotPassword