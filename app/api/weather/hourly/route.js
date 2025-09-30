import { NextResponse } from "next/server"

function mapWeatherCondition(weatherCode) {
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

  console.log("[v0] Open-Meteo 시간대별 날씨 API 요청:", { lat, lon })

  try {
    const latitude = lat || "37.5665"
    const longitude = lon || "126.9780"

    console.log("[v0] Open-Meteo 시간대별 API 호출:", { latitude, longitude })

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation_probability&timezone=auto&forecast_days=2`,
    )

    if (!response.ok) {
      throw new Error("Open-Meteo Hourly API request failed")
    }

    const data = await response.json()
    console.log("[v0] Open-Meteo 시간대별 API 응답:", data)

    const now = new Date()
    const currentHour = now.getHours()

    // 현재 시간 이후의 24시간 데이터를 가져옴
    const hourlyData = data.hourly.time
      .map((time, index) => {
        const date = new Date(time)
        return {
          time: time,
          hour: date.getHours(),
          temperature: Math.round(data.hourly.temperature_2m[index]),
          condition: mapWeatherCondition(data.hourly.weather_code[index]),
          humidity: data.hourly.relative_humidity_2m[index],
          windSpeed: Math.round(data.hourly.wind_speed_10m[index]),
          precipitation: data.hourly.precipitation_probability[index] || 0,
          date: date,
        }
      })
      .filter((item) => {
        // 현재 시간 이후의 데이터만 필터링
        return item.date >= now
      })
      .slice(0, 24) // 24시간만 가져옴

    console.log("[v0] 변환된 시간대별 데이터:", hourlyData.slice(0, 3))
    return NextResponse.json({ hourly: hourlyData })
  } catch (error) {
    console.error("Open-Meteo Hourly API Error:", error)

    const hourlyData = []
    const now = new Date()

    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000)
      hourlyData.push({
        time: time.toISOString(),
        hour: time.getHours(),
        temperature: Math.floor(Math.random() * 15) + 15,
        condition: "sunny",
        humidity: 60,
        windSpeed: 5,
        precipitation: 0,
      })
    }

    return NextResponse.json({ hourly: hourlyData })
  }
}
