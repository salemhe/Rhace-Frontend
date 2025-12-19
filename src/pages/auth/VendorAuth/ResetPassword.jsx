import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import HeroImage from "@/components/auth/HeroImage";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import logo from "../../../public/images/Rhace-11.png";


const PasswordStrengthMeter = ({ strength }) => {
    const getStrengthLabel = (score) => {
        if (score <= 2) return "Weak";
        if (score <= 4) return "Medium";
        return "Strong";
    };

    const getStrengthColor = (score) => {
        if (score <= 2) return "bg-red-600";
        if (score <= 4) return "bg-yellow-600";
        return "bg-green-600";
    };

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
    );
};

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        if (password.length >= 12) strength++;
        return strength;
    };

    const strength = getPasswordStrength(password);

    const formValidation = () => {
        if (!password) {
            setError((prev) => ({ ...prev, password: "Password is required." }));
            return false;
        }
        if (password.length < 8) {
            setError((prev) => ({ ...prev, password: "Password must be at least 8 characters." }));
            return false;
        }
        if (password !== confirmPassword) {
            setError((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!formValidation()) {
            return;
        }
        setError({
            password: "",
            confirmPassword: "",
        });
        try {
            setIsloading(true);
            await authService.vendorResetPassword(token, password);
            toast.success("Password reset successful. Please login.");
            navigate("/auth/vendor/login");
        } catch (err) {
            toast.error(err.response?.data.message);
        } finally {
            setIsloading(false);
        }
    };

    return (
        <div className="w-full h-screen flex p-4 bg-white">
            <div className="flex-1 h-full overflow-y-auto hide-scrollbar flex items-center justify-center">
                <Card className="w-full max-w-md bg-white shadow-none p-0 border-none">
                    <CardHeader className="flex justify-center">
                        <img src={logo} alt="Forgot password illustration" className="w-20 h-10 object-contain" />
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
                                    {/* <Lock className="absolute left-3 top-3.5 h-4 w-4 text-[#8a8f9a]" strokeWidth={1.25} /> */}
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        placeholder="********"
                                        onChange={(e) => setPassword(e.target.value)}
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
                                        value={confirmPassword}
                                        placeholder="********"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                            {password && (
                                <div className="w-full mt-2">
                                    <PasswordStrengthMeter strength={strength} />
                                </div>
                            )}

                            <Button disabled={isLoading} onClick={handleSubmit} className="w-full py-6 rounded-md bg-[#0A6C6D] text-white text-sm font-light transition-transform duration-200 hover:shadow-lg hover:bg-[#0A6C6D] mt-2" size="lg">
                                {isLoading ? (<> Loading <Loader2 className="animate-spin" /></>) : "Send"}
                            </Button>
                        </div>
                        <div className="text-center">
                            <a href="/auth/vendor/login" className="text-[#0A6C6D] hover:underline font-medium text-sm">Back to Login</a>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <HeroImage role="vendor" />
        </div>
    );
};

export default ResetPassword;