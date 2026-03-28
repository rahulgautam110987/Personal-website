"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Loader2, X, CloudSun, Search } from "lucide-react";

interface LocationButtonProps {
  weatherActive: boolean;
  cityName?: string | null;
  onEnable: (lat: number, lon: number) => void;
  onEnableByCity: (city: string) => void;
  onDisable: () => void;
  loading?: boolean;
}

export default function LocationButton({
  weatherActive,
  cityName,
  onEnable,
  onEnableByCity,
  onDisable,
  loading,
}: LocationButtonProps) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [manualCity, setManualCity] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopupOpen(false);
      }
    };
    if (popupOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [popupOpen]);

  useEffect(() => {
    if (popupOpen && !weatherActive && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [popupOpen, weatherActive]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported by your browser");
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        setPopupOpen(false);
        onEnable(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError("Location access denied");
        } else {
          setGeoError("Could not get your location");
        }
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  const handleCitySubmit = () => {
    const trimmed = manualCity.trim();
    if (!trimmed) return;
    setGeoError(null);
    setPopupOpen(false);
    setManualCity("");
    onEnableByCity(trimmed);
  };

  const handleDisable = () => {
    setPopupOpen(false);
    onDisable();
  };

  return (
    <div className="relative" ref={popupRef}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setPopupOpen(!popupOpen)}
        className="relative p-2.5 rounded-full transition-colors"
        style={{
          backgroundColor: weatherActive
            ? "rgba(59,130,246,0.15)"
            : "transparent",
        }}
        aria-label="Set your location"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
        ) : (
          <MapPin
            className={`w-4 h-4 transition-colors ${
              weatherActive ? "text-blue-400" : "text-white/40"
            }`}
          />
        )}
        {weatherActive && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400" />
        )}
      </motion.button>

      <AnimatePresence>
        {popupOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:top-full sm:mt-2 sm:left-1/2 sm:-translate-x-1/2 sm:w-72 rounded-xl border overflow-hidden z-50"
            style={{
              backgroundColor: "var(--bg)",
              borderColor: "var(--border)",
              boxShadow:
                "0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CloudSun className="w-4 h-4 text-blue-400" />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-1)" }}
                  >
                    Weather Theme
                  </span>
                </div>
                <button
                  onClick={() => setPopupOpen(false)}
                  className="p-1 rounded-md hover:bg-white/5"
                >
                  <X className="w-3.5 h-3.5" style={{ color: "var(--text-4)" }} />
                </button>
              </div>

              {weatherActive && cityName ? (
                <>
                  <p className="text-xs mb-3" style={{ color: "var(--text-3)" }}>
                    Background matches weather in{" "}
                    <span className="font-semibold" style={{ color: "var(--text-1)" }}>
                      {cityName}
                    </span>
                  </p>

                  {/* Change city while active */}
                  <div className="flex gap-1.5 mb-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={manualCity}
                      onChange={(e) => setManualCity(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCitySubmit()}
                      placeholder="Try another city..."
                      className="flex-1 px-3 py-2 rounded-lg text-xs border outline-none transition-colors"
                      style={{
                        backgroundColor: "var(--bg-card)",
                        borderColor: "var(--border)",
                        color: "var(--text-1)",
                      }}
                    />
                    <button
                      onClick={handleCitySubmit}
                      disabled={!manualCity.trim()}
                      className="px-3 py-2 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 transition-opacity disabled:opacity-40"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleDisable}
                    className="w-full py-2 rounded-lg text-xs font-medium border transition-colors"
                    style={{
                      color: "var(--text-3)",
                      borderColor: "var(--border)",
                      backgroundColor: "var(--bg-card)",
                    }}
                  >
                    Disable Weather Theme
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs mb-3" style={{ color: "var(--text-3)" }}>
                    See the background change based on real weather.
                  </p>

                  {geoError && (
                    <p className="text-xs text-red-400 mb-2">{geoError}</p>
                  )}

                  {/* Manual city input */}
                  <div className="flex gap-1.5 mb-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={manualCity}
                      onChange={(e) => setManualCity(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCitySubmit()}
                      placeholder="Enter city name..."
                      className="flex-1 px-3 py-2.5 rounded-lg text-xs border outline-none transition-colors"
                      style={{
                        backgroundColor: "var(--bg-card)",
                        borderColor: "var(--border)",
                        color: "var(--text-1)",
                      }}
                    />
                    <button
                      onClick={handleCitySubmit}
                      disabled={!manualCity.trim() || !!loading}
                      className="px-3 py-2.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
                    <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-5)" }}>
                      or
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
                  </div>

                  {/* GPS button */}
                  <button
                    onClick={handleGetLocation}
                    disabled={geoLoading}
                    className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {geoLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3.5 h-3.5" />
                        Use My Location
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
