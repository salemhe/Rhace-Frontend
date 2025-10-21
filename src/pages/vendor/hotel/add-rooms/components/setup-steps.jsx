"use client";
import SvgIcon, { Amenities, Plate } from '@/assets/icons/icons';
import { Check } from 'lucide-react';


export function SetupSteps({ currentStep }) {
  const steps = [
    { id: 1, title: 'Room Configuration', icon: <SvgIcon /> },
    { id: 2, title: 'Amenities', icon: <Plate color={currentStep === 2 ? "#fff" : "#606368"}/> },
    { id: 3, title: 'Confirm', icon: <Amenities color={currentStep === 3 ? "#fff" : "#606368"} /> },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id === currentStep
                    ? 'bg-teal-600 text-white'
                    : step.id < currentStep
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </div>
              <span
                className={`mt-2 text-sm ${
                  step.id === currentStep
                    ? 'text-teal-600 font-medium'
                    : step.id < currentStep
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 ${
                  step.id < currentStep ? 'bg-teal-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}