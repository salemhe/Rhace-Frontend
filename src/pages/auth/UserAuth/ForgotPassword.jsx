import HeroImage from "@/components/auth/HeroImage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import ForgotImage from "../../../assets/auth/forgot.svg";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ForgotPassword = () => {
  const [email, setEmail] = useState("")

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
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <Button className="w-full bg-[#0A6C6D] hover:bg-[#085253] text-white py-3 rounded-lg font-medium" size="lg">
                Send
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