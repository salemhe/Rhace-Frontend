import { Check, Mail, Clock, X, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { paymentService } from "@/services/payment.service";
import UniversalLoader from "@/components/user/ui/LogoLoader";
import Receipt from "@/components/Receipt";
import Success from "@/public/images/success.gif";

export default function ConfirmPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    const reference = searchParams.get('reference');
    const [state, setState] = useState({
        reservation: null,
        payment: null,
        isLoading: true,
        error: null
    });

    // Check token before API calls
    const checkAuthToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Session expired. Please log in again.');
            navigate('/auth/user/login');
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (!id && !reference) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: "No transaction reference found"
            }));
            return;
        }

        let isMounted = true;
        let timeoutId;
        let pollCount = 0;
        const MAX_POLLS = 10;

        const processPayment = async () => {
            // First check auth
            if (!checkAuthToken()) return;

            try {
                toast.info('Finalizing your reservation...');

                let result;
                
                // Prefer reference for full verification flow
                if (reference) {
                    // Verify payment first, then complete
                    await paymentService.verifyPayment(reference);
                    result = await paymentService.completeReservation(id);
                } else {
                    // Direct complete (fallback)
                    result = await paymentService.completeReservation(id);
                }

                if (!isMounted) return;

                setState({
                    reservation: result.reservation,
                    payment: result.payment || state.payment,
                    isLoading: false,
                    error: null
                });

                localStorage.removeItem('resData');
                sessionStorage.removeItem('pendingPayment');

                if (result.isNewBooking) {
                    toast.success("Reservation confirmed successfully!");
                }

            } catch (err) {
                if (!isMounted) return;

                // Handle 401 token issues
                if (err.response?.status === 401) {
                    toast.error('Session expired. Redirecting to login...');
                    localStorage.removeItem('token');
                    navigate('/auth/user/login');
                    return;
                }

                // Handle 404 polling
                if (err.response?.status === 404 && pollCount < MAX_POLLS) {
                    pollCount++;
                    console.log(`Polling attempt ${pollCount}/${MAX_POLLS}...`);
                    timeoutId = setTimeout(processPayment, 2000);
                    return;
                }

                const errorMessage = err.response?.data?.message || "Failed to confirm reservation. Please check Payments page.";

                setState({
                    reservation: null,
                    payment: null,
                    isLoading: false,
                    error: errorMessage
                });
                toast.error(errorMessage);
            }
        };

        processPayment();

        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [id, reference, navigate]);

    if (state.isLoading) {
        return (
            <div className="min-h-screen">
                <div className="h-[90vh] w-full flex items-center justify-center">
                    <div className="flex items-center flex-col gap-4">
                        <UniversalLoader />
                        <p className="text-gray-600">Processing your reservation...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-50 flex items-center justify-center px-4 py-12">
                <div className="text-center max-w-lg w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-100 p-12">
                    <div className="w-24 h-24 bg-red-100 rounded-3xl mx-auto mb-8 flex items-center justify-center">
                        <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center">
                            <X className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Reservation Failed
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        {state.error}
                    </p>
                    <div className="space-y-4 max-w-md mx-auto">
                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full h-14 bg-[#0A6C6D] hover:bg-teal-800 text-lg font-semibold rounded-2xl shadow-lg"
                        >
                            🔄 Retry Payment
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/payments')}
                            className="w-full h-14 border-2 border-gray-300 text-lg rounded-2xl"
                        >
                            📋 View Payments
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => navigate(`/paystack/callback?trxref=${id}`)}
                            className="w-full h-14 text-[#0A6C6D] border-2 border-[#0A6C6D] hover:bg-[#0A6C6D]/5 rounded-2xl text-lg font-medium"
                        >
                            <ArrowRightLeft className="w-5 h-5 mr-2" />
                            Process via Callback
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Success - use unified Receipt
    return <Receipt 
        reservation={state.reservation} 
        payment={state.payment}
        type="hotel"
    />;
}

