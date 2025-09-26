import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import HeroImage from '../../../components/auth/HeroImage'
import { authService } from "@/services/auth.service"
import { useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"

const getCurrentYear = () => new Date().getFullYear();

const Otp = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "john@example.com";
  const navigate = useNavigate();
  const [value, setValue] = useState("")
  const [isLoading, setIsloading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    try {
      setIsResending(true);
      const res = await authService.resendOTP(email);
      setShowModal(true);
      setCountdown(60);
      toast.success(res.message)
    } catch (err) {
      toast.error(err.response?.data.message);
    } finally {
      setIsResending(false)
    }
  };

  const handleSubmit = async () => {
    try {
      setIsloading(true);
      setError("");
      if (value.length !== 6) {
        setError("Please enter the 6-digit OTP.");
        setIsloading(false);
        return;
      }
      const res = await authService.verifyOTP(email, value);
      toast.success(res.message)
      navigate(`/auth/vendor/login`)
    } catch (err) {
      setError(err.response?.data.message || "Invalid OTP.");
      toast.error(err.response?.data.message);
    } finally {
      setIsloading(false)
    }
  };

  return (
    <div className='w-full h-screen flex p-4 bg-white'>
      <div className='flex-1 h-full overflow-y-auto hide-scrollbar'>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md bg-white shadow-none p-0 border-none">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-6 h-6 bg-[#60A5FA] rounded-full flex items-center justify-center"></div>
                <span className="text-xl font-semibold text-gray-900">Rhace</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Verify your email</h1>
              <p className="text-sm text-gray-600">
                A verification code has been sent to <span className="font-medium">{email}</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Enter OTP
                </label>
                <div className="flex justify-center gap-2 mb-2">
                  <InputOTP
                    maxLength={6}
                    value={value}
                    onChange={setValue}
                    className="w-full"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {error && <p className="text-sm text-red-600 mt-1 text-center">{error}</p>}
              </div>
              <Button
                disabled={isLoading || value.length !== 6}
                onClick={handleSubmit}
                className="w-full h-10 sm:h-12 rounded-md bg-[#0a646d] text-white text-sm sm:text-base font-light shadow-md hover:shadow-lg hover:bg-[#127a87] transition-colors duration-300 mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-1">
                    Loading <Loader2 className="animate-spin" />
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </Button>
              <Button
                disabled={countdown > 0 || isResending}
                onClick={handleResend}
                variant="outline"
                className="w-full h-10 sm:h-12 rounded-md border-gray-200 mt-2 text-sm font-light"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <p className="text-sm text-center text-gray-600">
                Already verified?{" "}
                <a href="/auth/vendor/login" className="text-blue-600 hover:underline font-medium">
                  Login
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
      <HeroImage role='vendor' />
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-2">Email Sent!</h2>
            <p className="mb-4">A new OTP has been sent to {email}</p>
            <Button
              className="w-full h-10 rounded-md bg-[#0a646d] text-white font-medium mt-2"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Otp