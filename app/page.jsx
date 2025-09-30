"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeatherCard } from "@/components/weather-card"
import { StyleSelector } from "@/components/style-selector"
import { FashionItemsGallery } from "@/components/fashion-items-gallery"
import { FloatingAIChat } from "@/components/floating-ai-chat"
import { FashionRecommendation } from "@/components/fashion-recommendation"

const STYLE_TYPES = [
  {
    id: "casual",
    name: "캐주얼",
    description: "편안하고 자연스러운 일상 스타일",
    icon: "👕",
  },
  {
    id: "formal",
    name: "포멀",
    description: "세련되고 전문적인 정장 스타일",
    icon: "👔",
  },
  {
    id: "street",
    name: "스트릿",
    description: "트렌디하고 개성 있는 스타일",
    icon: "🧥",
  },
  {
    id: "random",
    name: "랜덤",
    description: "오늘의 기분에 맞는 랜덤 스타일",
    icon: "🎲",
  },
]

export default function HomePage() {
  const [weather, setWeather] = useState(null)
  const [selectedStyle, setSelectedStyle] = useState("")
  const [loading, setLoading] = useState(false)
  const [locationPermission, setLocationPermission] = useState(null)
  const [activeTab, setActiveTab] = useState("weather")
  const [coordinates, setCoordinates] = useState(null)
  const [locationError, setLocationError] = useState(null)

  const fetchWeather = async (lat, lon) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (lat && lon) {
        params.append("lat", lat.toString())
        params.append("lon", lon.toString())
        setCoordinates({ lat, lon })
      }

      const response = await fetch(`/api/weather?${params}`)
      const weatherData = await response.json()

      setWeather(weatherData)
      setLoading(false)
    } catch (error) {
      console.error("날씨 정보를 가져오는데 실패했습니다:", error)
      setLoading(false)
    }
  }

  const requestLocation = () => {
    setLocationError(null)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("[v0] 위치 정보 획득 성공:", position.coords)
          setLocationPermission(true)
          fetchWeather(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          let errorMessage = ""
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "위치 정보 접근이 거부되었습니다. 서울 기준으로 날씨를 표시합니다."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "위치 정보를 사용할 수 없습니다. 서울 기준으로 날씨를 표시합니다."
              break
            case error.TIMEOUT:
              errorMessage = "위치 정보 요청 시간이 초과되었습니다. 서울 기준으로 날씨를 표시합니다."
              break
            default:
              errorMessage = "위치 정보를 가져올 수 없습니다. 서울 기준으로 날씨를 표시합니다."
              break
          }

          setLocationPermission(false)
          setLocationError(errorMessage)
          fetchWeather() // 기본 위치(서울)로 날씨 정보 가져오기
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5분간 캐시된 위치 정보 사용
        },
      )
    } else {
      setLocationPermission(false)
      setLocationError("브라우저에서 위치 서비스를 지원하지 않습니다. 서울 기준으로 날씨를 표시합니다.")
      fetchWeather()
    }
  }

  useEffect(() => {
    requestLocation()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 w-full">
      <div className="pb-6 w-full">
        <header className="bg-primary text-primary-foreground px-4 py-3 w-full">
          <div className="flex items-center justify-between max-w-full">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary-foreground/20 rounded"></div>
            </div>
            <h1 className="text-lg font-bold tracking-wider">W-TO-W</h1>
            <div className="w-6 h-6"></div>
          </div>
        </header>

        <div className="px-3 pt-4 w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 h-10">
              <TabsTrigger value="weather" className="text-xs font-medium px-2">
                TODAY'S WEATHER
              </TabsTrigger>
              <TabsTrigger value="fashion" className="text-xs font-medium px-2">
                FASHION
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weather" className="space-y-3">
              {locationError && (
                <Card className="p-3 bg-amber-50 border-amber-200">
                  <div className="flex items-center gap-2 text-amber-800">
                    <div className="text-sm">📍</div>
                    <p className="text-xs">{locationError}</p>
                  </div>
                </Card>
              )}

              <WeatherCard
                weather={weather}
                loading={loading}
                onRefresh={() => fetchWeather(coordinates?.lat, coordinates?.lon)}
                coordinates={coordinates}
              />

              {weather && (
                <Card className="p-3">
                  <h3 className="text-sm font-semibold mb-3 text-center">SET YOUR TODAY'S MOOD</h3>
                  <div className="grid grid-cols-4 gap-1.5">
                    {STYLE_TYPES.map((style) => (
                      <button
                        key={style.id}
                        className={`p-2 rounded-lg border transition-all duration-200 text-center min-h-[60px] ${
                          selectedStyle === style.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background hover:bg-accent border-border hover:border-accent"
                        }`}
                        onClick={() => {
                          setSelectedStyle(style.id)
                          setActiveTab("fashion")
                        }}
                      >
                        <div className="text-base mb-1">{style.icon}</div>
                        <div className="text-xs font-medium leading-tight">{style.name}</div>
                      </button>
                    ))}
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="fashion" className="space-y-3">
              {weather && (
                <StyleSelector styles={STYLE_TYPES} selectedStyle={selectedStyle} onStyleSelect={setSelectedStyle} />
              )}

              {weather && selectedStyle && <FashionItemsGallery selectedStyle={selectedStyle} weather={weather} />}

              {weather && selectedStyle && <FashionRecommendation weather={weather} styleType={selectedStyle} />}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {weather && <FloatingAIChat weather={weather} />}
    </main>
  )
}
