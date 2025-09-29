"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Info } from 'lucide-react';
import { advanceBookingOptions,  cancellationTypes, checkInTimes, freeCancellationOptions } from '@/types/booking-policy';




export function BookingPolicyForm({ onSubmit, formData, setFormData }) {
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentOptionChange = (option, checked) => {
    setFormData(prev => ({
      ...prev,
      paymentOptions: {
        ...prev.paymentOptions,
        [option]: checked
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className=" ">
      <form onSubmit={handleSubmit} className="p-">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Window Rules */}
          <div className="space-y-6">
            <div className="space-y-6 bg-white rounded-lg shadow-sm border p-4">
               <h3 className="text-lg font-medium text-gray-900">Booking Window Rules</h3>
               
               <div className="flex items-center justify-between  ">
                  {/* Check-In Time */}
               <div className="space-y-2">
                  <Label htmlFor="checkInTime" className="text-sm font-medium text-gray-700">
                     Check-In Time*
                  </Label>
                  <Select value={formData.checkInTime} onValueChange={(value) => handleInputChange('checkInTime', value)}>
                     <SelectTrigger className="w-full">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        {checkInTimes.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">Select standard check-in time for guests</p>
               </div>

               {/* Room Type Name */}
                  <div className="space-y-2">
                     <Label htmlFor="roomTypeName" className="text-sm font-medium text-gray-700">
                        Room Type Name*
                     </Label>
                     <Input
                        id="roomTypeName"
                        placeholder="e.g Luxury room"
                        value={formData.roomTypeName}
                        onChange={(e) => handleInputChange('roomTypeName', e.target.value)}
                        className="w-full"
                     />
                     <p className="text-xs text-gray-500">Select standard check-out time for guests</p>
                  </div>
               </div>

               {/* Advance Booking Requirement */}
               <div className="space-y-2">
                  <div className="flex items-center gap-2">
                     <Label className="text-sm font-medium text-gray-700">
                        Advance Booking Requirement
                     </Label>
                     <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-sm text-gray-600">Must book at least</span>
                     <Select 
                        value={formData.advanceBookingHours.toString()} 
                        onValueChange={(value) => handleInputChange('advanceBookingHours', parseInt(value))}
                     >
                        <SelectTrigger className="w-20">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        {advanceBookingOptions.map((option) => (
                           <SelectItem key={option.value} value={option.value.toString()}>
                              {option.label}
                           </SelectItem>
                        ))}
                        </SelectContent>
                     </Select>
                     <span className="text-sm text-gray-600">hours in advance</span>
                  </div>
               </div>
            </div>

            {/* Cancellation Policy */}
            <div className="space-y-4 bg-white rounded-lg shadow-sm border p-4">
              <h4 className="text-base font-medium text-gray-900">Cancellation Policy</h4>
              
              {/* Cancellation Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Cancellation Type
                </Label>
                <Select 
                  value={formData.cancellationType} 
                  onValueChange={(value) => handleInputChange('cancellationType', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cancellationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Free Cancellation Period */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Free cancellation period
                  </Label>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Free cancellation up to</span>
                  <Select 
                    value={formData.freeCancellationHours.toString()} 
                    onValueChange={(value) => handleInputChange('freeCancellationHours', parseInt(value))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {freeCancellationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600">hours before check-in</span>
                </div>
              </div>

              {/* Custom Policy Note */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Custom Policy Note <span className="text-gray-400">(Optional)</span>
                </Label>
                <Textarea
                  placeholder="Add any additional details about your cancellation policy"
                  value={formData.customPolicyNote}
                  onChange={(e) => handleInputChange('customPolicyNote', e.target.value)}
                  className="w-full min-h-[120px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Payment Settings */}
          <div className="space-y-6 bg-white rounded-lg shadow-sm border p-4 h-max">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-gray-900">Payment Settings</h3>
            </div>
            
            {/* Payment Options */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  Payment Options*
                </Label>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="fullPayment"
                    checked={formData.paymentOptions.fullPaymentRequired}
                    onCheckedChange={(checked) => handlePaymentOptionChange('fullPaymentRequired', checked )}
                  />
                  <Label htmlFor="fullPayment" className="text-sm text-gray-700">
                    Full Payment Required
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="partPayment"
                    checked={formData.paymentOptions.allowPartPayment}
                    onCheckedChange={(checked) => handlePaymentOptionChange('allowPartPayment', checked)}
                  />
                  <Label htmlFor="partPayment" className="text-sm text-gray-700">
                    Allow Part Payment
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Checkbox
                    className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                    id="payAtHotel"
                    checked={formData.paymentOptions.payAtHotel}
                    onCheckedChange={(checked) => handlePaymentOptionChange('payAtHotel', checked)}
                  />
                  <Label htmlFor="payAtHotel" className="text-sm text-gray-700">
                    Pay at Hotel
                  </Label>
                </div>
              </div>
            </div>

            {/* Add Payment Instructions */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Add Payment Instructions <span className="text-gray-400">(Optional)</span>
              </Label>
              <Textarea
                placeholder="Add any additional details about your cancellation policy"
                value={formData.paymentInstructions}
                onChange={(e) => handleInputChange('paymentInstructions', e.target.value)}
                className="w-full min-h-[120px] resize-none"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}