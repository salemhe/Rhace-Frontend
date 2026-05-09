import { Amenity, Plate, SvgIcon2, SvgIcon4 } from "@/public/icons/icons";
import { Check } from "lucide-react";

export function SetupSteps({ currentStep }) {
  const steps = [
    { id: 1, title: "Room Configuration", icon: <SvgIcon2 /> },
    {
      id: 2,
      title: "Amenities",
      icon: <Plate color={currentStep === 2 ? "#fff" : "#606368"} />,
    },
    {
      id: 3,
      title: "Confirm",
      icon: <Amenity color={currentStep === 3 ? "#fff" : "#606368"} />,
    },
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
                    ? "bg-[#0a6c6d] text-white"
                    : step.id < currentStep
                      ? "bg-[#0a6c6d] text-white"
                      : "bg-gray-200 text-gray-600"
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
                    ? "text-[#0a6c6d] font-medium"
                    : step.id < currentStep
                      ? "text-gray-900"
                      : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 ${
                  step.id < currentStep ? "bg-[#0a6c6d]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
