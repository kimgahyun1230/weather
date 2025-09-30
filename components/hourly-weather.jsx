"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { ClockIcon } from "@/components/icons"

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

const formatHour = (hour) => {
  if (hour === 0) return "자정"
  if (hour === 12) return "정오"
  if (hour < 12) return `오전 ${hour}시`
  return `오후 ${hour - 12}시`
}

const getTimeLabel = (hour) => {
  if (hour >= 6 && hour < 9) return "출근"
  if (hour >= 12 && hour < 14) return "점심"
  if (hour >= 18 && hour < 20) return "퇴근"
  if (hour >= 22 || hour < 6) return "밤"
  return ""
}

export function HourlyWeather({ coordinates, trigger }) {
  const [hourlyData, setHourlyData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchHourlyWeather = async () => {
    if (!coordinates) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        lat: coordinates.lat.toString(),
        lon: coordinates.lon.toString(),
      })

      const response = await fetch(`/api/weather/hourly?${params}`)
      const data = await response.json()
      setHourlyData(data.hourly)
    } catch (error) {
      console.error("시간대별 날씨 데이터 로드 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && coordinates) {
      fetchHourlyWeather()
    }
  }, [open, coordinates])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm max-h-[85vh] overflow-hidden">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <ClockIcon className="w-5 h-5" />
            24시간 날씨
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-hidden">
          {loading ? (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="flex-shrink-0 w-20 p-3">
                  <div className="space-y-2 text-center">
                    <Skeleton className="h-3 w-12 mx-auto" />
                    <Skeleton className="h-8 w-8 rounded-full mx-auto" />
                    <Skeleton className="h-4 w-8 mx-auto" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : hourlyData ? (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {hourlyData.map((item, index) => {
                const timeLabel = getTimeLabel(item.hour)
                const isCurrentHour = index === 0

                return (
                  <Card
                    key={index}
                    className={`flex-shrink-0 w-20 p-3 text-center transition-all duration-200 ${
                      isCurrentHour ? "bg-primary/10 border-primary/30 shadow-md" : "hover:bg-muted/30"
                    }`}
                  >
                    <div className="space-y-2">
                      {/* 시간 표시 */}
                      <div className="space-y-1">
                        <div className={`text-xs font-medium ${isCurrentHour ? "text-primary" : ""}`}>
                          {index === 0 ? "지금" : formatHour(item.hour)}
                        </div>
                        {timeLabel && (
                          <div className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                            {timeLabel}
                          </div>
                        )}
                      </div>

                      {/* 날씨 아이콘 */}
                      <div className="text-2xl">{getWeatherIcon(item.condition)}</div>

                      {/* 온도 */}
                      <div className={`font-bold text-sm ${isCurrentHour ? "text-primary" : ""}`}>
                        {item.temperature}°
                      </div>

                      {/* 강수확률 */}
                      <div className="text-[10px] text-muted-foreground">💧 {item.precipitation}%</div>

                      {/* 습도와 풍속 */}
                      <div className="space-y-0.5 text-[9px] text-muted-foreground">
                        <div>습도 {item.humidity}%</div>
                        <div>바람 {item.windSpeed}m/s</div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ClockIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">시간대별 날씨 정보를 불러올 수 없습니다</p>
            </div>
          )}
        </div>

        {hourlyData && !loading && (
          <div className="text-center text-[10px] text-muted-foreground pt-2 border-t">
            ← 좌우로 스와이프하여 더 많은 시간대를 확인하세요 →
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
