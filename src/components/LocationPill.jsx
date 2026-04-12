import { MapPin, Loader2, Navigation } from "lucide-react";

/**
 * LocationPill
 * Shows the currently detected city + a subtle "Use my location" affordance.
 * Industry pattern: show the resolved name, let user re-trigger if wrong.
 */
export const LocationPill = ({ location, status, isDetecting, requestLocation, error }) => {
  const label =
    status === "detecting" ? "Detecting…" :
    location.city          ? location.city :
    status === "denied"    ? "Location denied" :
    "Enable location";

  return (
    <button
      onClick={requestLocation}
      title={status === "granted" ? `Using location: ${location.city}` : "Click to use your location"}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all ${
        status === "granted"
          ? "border-[#0A6C6D]/30 bg-[#0A6C6D]/5 text-[#0A6C6D] cursor-default"
          : status === "detecting"
          ? "border-gray-200 bg-gray-50 text-gray-400 cursor-wait"
          : "border-gray-200 bg-white text-gray-500 hover:border-[#0A6C6D] hover:text-[#0A6C6D] cursor-pointer"
      }`}
    >
      {isDetecting
        ? <Loader2 className="w-3 h-3 animate-spin" />
        : status === "granted"
        ? <MapPin className="w-3 h-3" />
        : <Navigation className="w-3 h-3" />
      }
      <span className="max-w-[120px] truncate">{label}</span>
    </button>
  );
};

/**
 * LocationBanner (shown on discovery home when location is unknown)
 * Friendly, non-blocking prompt — user can dismiss.
 */
export const LocationBanner = ({ requestLocation, isDetecting, onDismiss }) => (
  <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#0A6C6D]/8 to-transparent border border-[#0A6C6D]/15 rounded-xl px-4 py-3 mb-6">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-[#0A6C6D]/10 rounded-full flex items-center justify-center shrink-0">
        <MapPin className="w-4 h-4 text-[#0A6C6D]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800">See what's near you</p>
        <p className="text-xs text-gray-500">Enable location for personalised results</p>
      </div>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={requestLocation}
        disabled={isDetecting}
        className="px-3 py-1.5 bg-[#0A6C6D] text-white text-xs font-semibold rounded-full hover:bg-[#084F4F] disabled:opacity-60 transition-colors flex items-center gap-1.5"
      >
        {isDetecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
        {isDetecting ? "Detecting…" : "Use location"}
      </button>
      {onDismiss && (
        <button onClick={onDismiss} className="text-xs text-gray-400 hover:text-gray-600 px-2">
          Not now
        </button>
      )}
    </div>
  </div>
);