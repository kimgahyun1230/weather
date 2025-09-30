"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshIcon, LocationIcon } from "@/components/icons"
import { Skeleton } from "@/components/ui/skeleton"
import { HourlyWeather } from "@/components/hourly-weather"

const getWeatherIcon = (condition) => {
  const icons = {
    sunny: "☀️",
    clear: "☀️",
    cloudy: "☁️",
    clouds: "☁️",
    rainy: "🌧️",
    rain: "🌧️",
    snowy: "❄️",
    snow: "❄️",
  }
  return icons[condition.toLowerCase()] || "🌤️"
}

const getWeatherDescription = (condition) => {
  const descriptions = {
    sunny: "맑음",
    clear: "맑음",
    cloudy: "흐림",
    clouds: "흐림",
    rainy: "비",
    rain: "비",
    snowy: "눈",
    snow: "눈",
  }
  return descriptions[condition.toLowerCase()] || "보통"
}

export function WeatherCard({ weather, loading, onRefresh, coordinates }) {
  if (loading) {
    return (
      <Card className="p-4 weather-gradient text-white">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 bg-white/20" />
            <Skeleton className="h-6 w-6 rounded-full bg-white/20" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-8 w-16 bg-white/20" />
              <Skeleton className="h-3 w-12 bg-white/20" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full bg-white/20" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-8 bg-white/20 rounded-lg" />
            <Skeleton className="h-8 bg-white/20 rounded-lg" />
            <Skeleton className="h-8 bg-white/20 rounded-lg" />
          </div>
        </div>
      </Card>
    )
  }

  if (!weather) {
    return (
      <Card className="p-4 text-center">
        <p className="text-muted-foreground text-sm">날씨 정보를 불러오는 중...</p>
      </Card>
    )
  }

  const temperatureDiff =
    weather.temperatureDiff || (weather.maxTemp && weather.minTemp ? weather.maxTemp - weather.minTemp : 0)
  const hasTemperatureDiff = temperatureDiff > 0

  return (
    <HourlyWeather
      coordinates={coordinates}
      trigger={
        <Card className="p-4 weather-gradient text-white relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

          <div className="relative space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LocationIcon className="w-3 h-3" />
                <span className="text-xs font-medium">{weather.location}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onRefresh()
                }}
                className="text-white hover:bg-white/20 h-6 w-6 p-0"
              >
                <RefreshIcon className="w-3 h-3" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-2xl font-bold">{weather.temperature}°C</div>
                <div className="text-xs opacity-90">{getWeatherDescription(weather.condition)}</div>
                {hasTemperatureDiff && (
                  <div className="text-xs opacity-80">
                    {weather.minTemp}° / {weather.maxTemp}°
                  </div>
                )}
              </div>
              <div className="text-4xl">{getWeatherIcon(weather.condition)}</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm">
                <div className="text-lg mb-1">💧</div>
                <div className="text-xs opacity-80">습도</div>
                <div className="text-xs font-semibold">{weather.humidity}%</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm">
                <div className="text-lg mb-1">💨</div>
                <div className="text-xs opacity-80">바람</div>
                <div className="text-xs font-semibold">{weather.windSpeed}m/s</div>
              </div>
              {hasTemperatureDiff && (
                <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm">
                  <div className="text-lg mb-1">🌡️</div>
                  <div className="text-xs opacity-80">일교차</div>
                  <div className="text-xs font-semibold">{temperatureDiff}°</div>
                </div>
              )}
            </div>

            {temperatureDiff > 10 && (
              <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-300">⚠️</span>
                  <div className="text-xs">
                    <div className="font-medium">일교차가 큽니다!</div>
                    <div className="opacity-90">레이어링 스타일을 추천드려요</div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <div className="text-xs opacity-75 bg-white/10 rounded-full px-3 py-1 inline-block">
                탭하여 시간대별 날씨 확인
              </div>
            </div>
          </div>
        </Card>
      }
    />
  )
}
