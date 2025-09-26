import { Calendar } from "lucide-react";
import React from "react";

export default function RestauranAvalableSlot({
  openingTime, closingTime, availableSlots
}) {
  return (
    <div className="flex flex-col font-[var(--font-inter)] gap-6">
        <div className="bg-[#E8FFE1] p-3 rounded-xl border border-[#72E94E] flex sm:w-fit items-center gap-4">
          <div>
            <svg
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.9999 0.333008C26.2049 0.333008 33.6666 7.79467 33.6666 16.9997C33.6666 26.2047 26.2049 33.6663 16.9999 33.6663C7.79492 33.6663 0.333252 26.2047 0.333252 16.9997C0.333252 7.79467 7.79492 0.333008 16.9999 0.333008ZM16.9999 3.66634C13.4637 3.66634 10.0723 5.0711 7.57183 7.57158C5.07134 10.0721 3.66659 13.4635 3.66659 16.9997C3.66659 20.5359 5.07134 23.9273 7.57183 26.4278C10.0723 28.9282 13.4637 30.333 16.9999 30.333C20.5361 30.333 23.9275 28.9282 26.428 26.4278C28.9285 23.9273 30.3333 20.5359 30.3333 16.9997C30.3333 13.4635 28.9285 10.0721 26.428 7.57158C23.9275 5.0711 20.5361 3.66634 16.9999 3.66634ZM16.9999 6.99967C17.4081 6.99973 17.8021 7.1496 18.1072 7.42087C18.4123 7.69213 18.6072 8.06592 18.6549 8.47134L18.6666 8.66634V16.3097L23.1783 20.8213C23.4772 21.1213 23.6507 21.5237 23.6636 21.947C23.6766 22.3702 23.5279 22.7825 23.2478 23.1001C22.9678 23.4177 22.5773 23.6168 22.1558 23.657C21.7343 23.6972 21.3132 23.5754 20.9783 23.3163L20.8216 23.178L15.8216 18.178C15.5626 17.9188 15.3962 17.5813 15.3483 17.218L15.3333 16.9997V8.66634C15.3333 8.22431 15.5088 7.80039 15.8214 7.48783C16.134 7.17527 16.5579 6.99967 16.9999 6.99967Z"
                fill="#068D33"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-xs">Opening Hours</p>
            <p className="font-semibold text-sm">{openingTime} - {closingTime} Daily</p>
          </div>
        </div>
      <div className="max-w-4xl w-full">
        <h2 className="text-gray-800 mb-6">
          Check out available reservation slots for today
        </h2>

        <div className="flex flex-wrap gap-4">
          {availableSlots.map((slot) => (
            <button
              key={slot}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-200 bg-white border-[#0A6C6D] text-[#0A6C6D] hover:bg-slate-50 hover:border-[#0A6C6D]
              `}
            >
              <Calendar className="size-4" />
              <span className="font-medium text-sm">{slot}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
