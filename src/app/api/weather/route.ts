import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface WeatherResponse {
  city: string;
  country: string;
  condition: string;
  temp: number;
  isDay: boolean;
  icon: string;
}

const CONDITION_MAP: Record<string, string> = {
  Thunderstorm: "thunderstorm",
  Drizzle: "rain",
  Rain: "rain",
  Snow: "snow",
  Mist: "mist",
  Smoke: "mist",
  Haze: "mist",
  Dust: "mist",
  Fog: "mist",
  Sand: "mist",
  Ash: "mist",
  Squall: "rain",
  Tornado: "thunderstorm",
  Clear: "clear",
  Clouds: "clouds",
};

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Weather API key not configured" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const qLat = searchParams.get("lat");
    const qLon = searchParams.get("lon");
    const qCity = searchParams.get("city");

    let city = "New Delhi";
    let country = "IN";
    let lat = 28.6139;
    let lon = 77.209;

    if (qCity) {
      // Geocode city name → coordinates
      try {
        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(qCity)}&limit=1&appid=${apiKey}`,
          { next: { revalidate: 300 } }
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.length > 0) {
            city = geoData[0].name || qCity;
            country = geoData[0].country || country;
            lat = geoData[0].lat;
            lon = geoData[0].lon;
          } else {
            return NextResponse.json(
              { error: `City "${qCity}" not found` },
              { status: 404 }
            );
          }
        }
      } catch {
        // fall through to defaults
      }
    } else if (qLat && qLon) {
      lat = parseFloat(qLat);
      lon = parseFloat(qLon);
      try {
        const revRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`,
          { next: { revalidate: 300 } }
        );
        if (revRes.ok) {
          const revData = await revRes.json();
          if (revData.length > 0) {
            city = revData[0].name || city;
            country = revData[0].country || country;
          }
        }
      } catch {
        // keep defaults
      }
    } else {
      const forwarded = request.headers.get("x-forwarded-for");
      const ip = forwarded?.split(",")[0]?.trim() || null;

      if (ip && ip !== "127.0.0.1" && ip !== "::1") {
        try {
          const geoRes = await fetch(
            `http://ip-api.com/json/${ip}?fields=status,city,country,countryCode,lat,lon`,
            { next: { revalidate: 300 } }
          );
          const geoData = await geoRes.json();
          if (geoData.status === "success") {
            city = geoData.city || city;
            country = geoData.countryCode || country;
            lat = geoData.lat ?? lat;
            lon = geoData.lon ?? lon;
          }
        } catch {
          // fall through to defaults
        }
      }
    }

    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
      { next: { revalidate: 300 } }
    );

    let mainCondition = "Clear";
    let iconCode = "01d";
    let temp = 0;

    if (weatherRes.ok) {
      const weatherData = await weatherRes.json();
      mainCondition = weatherData.weather?.[0]?.main || "Clear";
      iconCode = weatherData.weather?.[0]?.icon || "01d";
      temp = Math.round(weatherData.main?.temp ?? 0);
    } else {
      // API key may not be activated yet — still return geolocation data
      const hour = new Date().getUTCHours();
      iconCode = hour >= 6 && hour < 18 ? "01d" : "01n";
    }

    const isDay = iconCode.endsWith("d");

    const response: WeatherResponse = {
      city,
      country,
      condition: CONDITION_MAP[mainCondition] || "clear",
      temp,
      isDay,
      icon: iconCode,
    };

    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
