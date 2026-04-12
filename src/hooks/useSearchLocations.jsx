import { useState, useEffect, useCallback, useRef } from "react";

const LS_KEY     = "rhace_user_location";
const IP_API     = "https://ipapi.co/json/"; // free, no-key IP geolocation
const GEO_OPTS   = { timeout: 8_000, maximumAge: 5 * 60_000, enableHighAccuracy: false };

const persist = (data) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify({ ...data, ts: Date.now() })); } catch {}
};
const load = () => {
  try {
    const d = JSON.parse(localStorage.getItem(LS_KEY) || "null");
    // 30-minute TTL
    if (d && Date.now() - d.ts < 30 * 60_000) return d;
  } catch {}
  return null;
};

export const useSearchLocation = () => {
  const [location, setLocation] = useState({ lat: null, lng: null, city: "", country: "" });
  const [status, setStatus]     = useState("idle"); // idle | detecting | granted | denied | ip
  const [error, setError]       = useState(null);
  const attempted = useRef(false);

  const applyCoords = useCallback((lat, lng, city = "", country = "") => {
    const loc = { lat, lng, city, country };
    setLocation(loc);
    persist(loc);
    setStatus("granted");
  }, []);

  /** Reverse-geocode coords → city name via ipapi (free, no API key needed) */
  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      // Use a simple open reverse-geocode endpoint
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
        headers: { "Accept-Language": "en" }
      });
      if (r.ok) {
        const d = await r.json();
        const city = d.address?.city || d.address?.town || d.address?.state_district || d.address?.state || "";
        const country = d.address?.country || "";
        applyCoords(lat, lng, city, country);
        return;
      }
    } catch {}
    applyCoords(lat, lng, "", "");
  }, [applyCoords]);

  /** IP-based fallback — no browser prompt, works silently */
  const detectByIP = useCallback(async () => {
    setStatus("detecting");
    try {
      const r = await fetch(IP_API);
      if (!r.ok) throw new Error("IP lookup failed");
      const d  = await r.json();
      const loc = { lat: d.latitude, lng: d.longitude, city: d.city || d.region || "", country: d.country_name || "" };
      setLocation(loc);
      persist(loc);
      setStatus("ip");
    } catch {
      setStatus("denied");
      setError("Could not detect location");
    }
  }, []);

  /** Silent geolocation check (no prompt) */
  const trySilentGeo = useCallback(async () => {
    if (!navigator?.geolocation) return false;
    try {
      // Check permission state without triggering prompt
      if (navigator.permissions) {
        const perm = await navigator.permissions.query({ name: "geolocation" });
        if (perm.state === "denied") return false;
        if (perm.state === "granted") {
          setStatus("detecting");
          navigator.geolocation.getCurrentPosition(
            pos => reverseGeocode(pos.coords.latitude, pos.coords.longitude),
            ()  => detectByIP(),
            GEO_OPTS,
          );
          return true;
        }
        // "prompt" state — don't request yet, fall through to IP
        return false;
      }
    } catch {}
    return false;
  }, [reverseGeocode, detectByIP]);

  /** Public: triggered only by explicit user interaction */
  const requestLocation = useCallback(() => {
    if (!navigator?.geolocation) { detectByIP(); return; }
    setStatus("detecting");
    setError(null);
    navigator.geolocation.getCurrentPosition(
      pos => reverseGeocode(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        if (err.code === 1) { setStatus("denied"); setError("Location access denied"); }
        else detectByIP();
      },
      GEO_OPTS,
    );
  }, [reverseGeocode, detectByIP]);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    // 1. Try cache first (instant)
    const cached = load();
    if (cached) { setLocation(cached); setStatus(cached.lat ? "granted" : "ip"); return; }

    // 2. Try silent geo (no prompt)
    trySilentGeo().then(handled => {
      if (!handled) detectByIP(); // fall back to IP detection
    });
  }, [trySilentGeo, detectByIP]);

  return {
    location,       // { lat, lng, city, country }
    status,         // "idle" | "detecting" | "granted" | "denied" | "ip"
    error,
    requestLocation,
    hasLocation: location.lat != null,
    isDetecting: status === "detecting",
  };
};