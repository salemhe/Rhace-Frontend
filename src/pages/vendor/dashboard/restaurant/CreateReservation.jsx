import DashboardButton from '@/components/dashboard/ui/DashboardButton'
import { Cash2, DishCover } from '@/components/dashboard/ui/svg';
import Header2 from '@/components/layout/headers/vendor_header2'
import { Check } from 'lucide-react';
import React, { useState } from 'react'

const CreateReservation = () => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: "Reservation Details",
            icon: DishCover
        },
        {
            title: "Preselect meal",
            icon: DishCover
        },
        {
            title: "Payment",
            icon: Cash2
        },
    ]

    return (
        <div className='bg-[#F9FAFB] h-dvh'>
            <Header2 title="Create Menu" />
            <div className='md:p-6 space-y-[45px]'>
                <div className='max-w-[600px] mx-auto flex gap-6 items-center justify-center'>
                    {steps.map((step1, i) => (
                        <div key={i} className='flex gap-6'>
                            <div className='flex flex-col items-center gap-2'>
                                <div className={`p-2.5 w-auto rounded-full ${i <= step ? "bg-[#0A6C6D]" : "bg-[#E5E7EB]"}`}>
                                    {i < step ? <Check className='size-5 text-white' /> : <step1.icon fill={i <= step ? "#fff" : "#606368"} />}
                                </div>
                                <div className={`text-sm font-medium ${i <= step ? "text-[#0A6C6D]" : "text-[#606368]"}`}>
                                    {step1.title}
                                </div>
                            </div>
                            <div className={`w-16 mt-5 h-0.5 rounded-full ${i === 2 ? "hidden" : i <= step ? "bg-[#0A6C6D] " : "bg-[#606368]"}`} />
                        </div>
                    ))}
                </div>

                {step === 0 && (
                    <div className='max-w-[1100px] p-5 bg-white border mx-auto rounded-2xl'>

                    </div>
                )}
                {step === 1 && (
                    <div className='max-w-[1300px] mx-auto grid grid-cols-5 gap-6'>
                        <div className='p-5 bg-white border rounded-2xl col-span-3'>

                        </div>
                        <div className='p-5 bg-white border rounded-2xl col-span-2'>

                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className='max-w-[864px] p-5 bg-white border mx-auto rounded-2xl'>

                    </div>
                )}
                {step === 3 && (
                    <div className='max-w-[864px] p-5 bg-white border mx-auto rounded-2xl'>

                    </div>
                )}

            </div>

            <div className='fixed flex justify-between bottom-0 left-0 w-full px-8 py-4 bg-white border-t'>
                <DashboardButton variant="secondary" className="px-6 w-[158px] text-sm text-[#606368]" text="Cancel" />
                <DashboardButton onClick={() => setStep(prev => prev + 1)} variant="primary" className="px-6 w-[384px] text-sm" text="Continue to Meal Selection" />
            </div>
        </div>
    )
}

export default CreateReservation