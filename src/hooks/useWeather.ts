"use client";
import { useState, useCallback } from "react";

export type WeatherCondition =
  | "clear"
  | "clouds"
  | "rain"
  | "thunderstorm"
  | "snow"
  | "mist";

export interface WeatherData {
  city: string;
  country: string;
  condition: WeatherCondition;
  temp: number;
  isDay: boolean;
  icon: string;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (lat?: number, lon?: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (lat !== undefined && lon !== undefined) {
        params.set("lat", lat.toString());
        params.set("lon", lon.toString());
      }
      const url = `/api/weather${params.toString() ? `?${params}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setWeather(data as WeatherData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load weather");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCity = useCallback(async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ city: cityName });
      const res = await fetch(`/api/weather?${params}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (!res.ok) throw new Error("API error");
      setWeather(data as WeatherData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "City not found");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearWeather = useCallback(() => {
    setWeather(null);
    setError(null);
  }, []);

  return { weather, loading, error, fetchWeather, fetchWeatherByCity, clearWeather };
}
