import HeroImage from "@/components/auth/HeroImage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import ResetImage from "../../../assets/auth/reset.svg";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { Label } from "@/components/ui/label";
import { PasswordStrengthMeter } from "./Signup";

const ResetPassword = () => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState({
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsloading] = useState(false)
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token")

    const handleSubmit = async () => {
        if (!formValidation()) {
            return
        }
        setError({
            password: "",
            confirmPassword: ""
        })
        try {
            setIsloading(true)
            await authService.resetPassword(token, password)
            toast.success("A reset password link has been sent to your Email")
                        navigate("/auth/user/login")
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            setIsloading(false)
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

    const formValidation = () => {
        if (!password) {
            setError((prev) => ({ ...prev, password: "Password is required." }))
            return false
        }
        if (password.length < 8) {
            setError((prev) => ({ ...prev, password: "Password must be at least 8 characters." }))
            return false
        }
        if (password !== confirmPassword) {
            setError((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }))
            return false
        }
        return true
    }

    const strength = getPasswordStrength(password)

    return (
        <div className='w-full h-screen flex p-4 bg-white'>
            <div className="h-screen overflow-auto flex-1 flex flex-col items-center justify-center">
                <Card className="w-full max-w-md p-0 shadow-none border-none">
                    <CardHeader className="flex justify-center">
                        <img src={ResetImage} alt="Forgot password illustration" className="w-48 h-48 object-contain" />
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="text-center space-y-4">
                            <h1 className="text-2xl font-semibold text-gray-900">Reset Your Password?</h1>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Enter your new Password
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        placeholder="********"
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pr-10"
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
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        placeholder="********"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pr-10"
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
                            {password && (
                                <div className="w-full mt-2">
                                    <PasswordStrengthMeter strength={strength} />
                                </div>
                            )}

                            <Button disabled={isLoading} onClick={handleSubmit} className="w-full bg-[#0A6C6D] hover:bg-[#085253] text-white py-3 rounded-lg font-medium" size="lg">
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

export default ResetPassword