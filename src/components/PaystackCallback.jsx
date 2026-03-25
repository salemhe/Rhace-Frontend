import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentService } from '@/services/payment.service';
import { toast } from 'react-toastify';
import UniversalLoader from './user/ui/LogoLoader';
import Receipt from './Receipt';

const PaystackCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');
  const status = searchParams.get('status') || 'pending';

  const [resultData, setResultData] = useState({
    reservation: null,
    payment: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const handleCallback = async () => {
      if (!reference && !trxref) {
        setResultData({
          reservation: null,
          payment: null,
          loading: false,
          error: 'No payment reference or transaction ID found'
        });
        toast.error('No payment reference found');
        return;
      }

      try {
        toast.info(`${trxref ? 'Completing reservation' : 'Verifying payment'}...`);
        
        let verifyRes, completeRes;

        // Always verify payment first if reference present
        if (reference) {
          verifyRes = await paymentService.verifyPayment(reference);
          toast.success(`Payment verified: ${verifyRes.status}`);
        }

        // Complete reservation for hotel/club/restaurant bookings
        if (trxref) {
          completeRes = await paymentService.completeReservation(trxref);
          toast.success('Reservation confirmed successfully!');
        }

        // Set success data
        setResultData({
          reservation: completeRes?.reservation || verifyRes?.reservation,
          payment: verifyRes || completeRes?.payment,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Callback processing failed:', error);
        
        const errorMsg = error.response?.data?.message || 
                        'Payment processing failed. Please check your Payments page.';
        
        setResultData({
          reservation: null,
          payment: null,
          loading: false,
          error: errorMsg
        });
        toast.error(errorMsg);
      }
    };

    handleCallback();
  }, [reference, trxref, navigate]);

  if (resultData.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center p-12 max-w-lg mx-auto bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
          <UniversalLoader />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Finalizing Your Booking
          </h2>
          <p className="mt-3 text-gray-600">
            {trxref ? `Transaction: ${trxref.slice(-8)}` : reference ? `Ref: ${reference.slice(-8)}` : 'Processing...'}
          </p>
          <p className={`mt-4 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r ${
            status === 'success' ? 'from-emerald-100 to-green-100 text-emerald-800' : 
            'from-amber-100 to-yellow-100 text-amber-800'
          }`}>
            Status: {status?.toUpperCase()}
          </p>
        </div>
      </div>
    );
  }

  if (resultData.error || !resultData.reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-red-50">
        <div className="text-center p-12 max-w-lg mx-auto bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <div className="w-12 h-12 bg-red-400 rounded-xl flex items-center justify-center">
              <X className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Reservation Processing Failed
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            {resultData.error}
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.reload()}
              className="w-full bg-[#0A6C6D] hover:bg-teal-800 h-12 text-lg"
            >
              🔄 Retry
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/payments')}
              className="w-full h-12 border-2 border-gray-300"
            >
              Go to Payments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success - Show Receipt
  return (
    <Receipt 
      reservation={resultData.reservation} 
      payment={resultData.payment}
      type="hotel"
    />
  );
};

export default PaystackCallback;

