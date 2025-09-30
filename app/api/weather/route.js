import { NextResponse } from "next/server"

async function getAddressFromCoords(lat, lon) {
  console.log("[v0] 좌표로 주소 변환 시도:", { lat, lon })

  try {
    // Nominatim (OpenStreetMap) 무료 역지오코딩 서비스 사용
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ko&addressdetails=1`,
      {
        headers: {
          "User-Agent": "Fashion Weather App",
        },
      },
    )

    if (!response.ok) {
      throw new Error("Nominatim API request failed")
    }

    const data = await response.json()
    console.log("[v0] Nominatim 응답:", data)

    if (data && data.address) {
      const addr = data.address
      // 한국어 주소 구성
      let koreanAddress = ""

      if (addr.city) {
        koreanAddress = addr.city
      } else if (addr.town) {
        koreanAddress = addr.town
      } else if (addr.county) {
        koreanAddress = addr.county
      }

      if (addr.state && addr.state !== koreanAddress) {
        koreanAddress = addr.state + (koreanAddress ? " " + koreanAddress : "")
      }

      if (addr.suburb || addr.neighbourhood) {
        koreanAddress += " " + (addr.suburb || addr.neighbourhood)
      }

      console.log("[v0] 변환된 주소:", koreanAddress)
      return koreanAddress || "현재 위치"
    }
  } catch (error) {
    console.error("[v0] 역지오코딩 오류:", error)
  }

  return "현재 위치"
}

function mapWeatherCondition(weatherCode) {
  // Open-Meteo WMO Weather interpretation codes
  if (weatherCode === 0) return "sunny"
  if (weatherCode >= 1 && weatherCode <= 3) return "cloudy"
  if (weatherCode >= 45 && weatherCode <= 48) return "cloudy" // fog
  if (weatherCode >= 51 && weatherCode <= 67) return "rainy"
  if (weatherCode >= 71 && weatherCode <= 86) return "snowy"
  if (weatherCode >= 95 && weatherCode <= 99) return "rainy" // thunderstorm
  return "sunny" // default
}

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  console.log("[v0] Open-Meteo Weather API 요청:", { lat, lon })

  try {
    const latitude = lat || "37.5665"
    const longitude = lon || "126.9780"

    console.log("[v0] Open-Meteo API 호출:", { latitude, longitude })

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`,
    )

    if (!response.ok) {
      throw new Error("Open-Meteo API request failed")
    }

    const data = await response.json()
    console.log("[v0] Open-Meteo API 응답:", data)

    const detailedLocation = await getAddressFromCoords(latitude, longitude)

    const weatherData = {
      temperature: Math.round(data.current.temperature_2m),
      minTemp: Math.round(data.daily.temperature_2m_min[0]),
      maxTemp: Math.round(data.daily.temperature_2m_max[0]),
      condition: mapWeatherCondition(data.current.weather_code),
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      location: detailedLocation,
      temperatureDiff: Math.round(data.daily.temperature_2m_max[0] - data.daily.temperature_2m_min[0]),
    }

    console.log("[v0] 변환된 날씨 데이터:", weatherData)
    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Open-Meteo API Error:", error)

    const fallbackData = {
      temperature: 22,
      minTemp: 18,
      maxTemp: 28,
      condition: "sunny",
      humidity: 65,
      windSpeed: 8,
      location: "현재 위치",
      temperatureDiff: 10,
    }

    return NextResponse.json(fallbackData)
  }
}
