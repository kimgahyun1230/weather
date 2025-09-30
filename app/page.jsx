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
  { id: "casual", name: "캐주얼", description: "편안하고 자연스러운 일상 스타일", icon: "👕" },
  { id: "formal", name: "포멀", description: "세련되고 전문적인 정장 스타일", icon: "👔" },
  { id: "street", name: "스트릿", description: "트렌디하고 개성 있는 스타일", icon: "🧥" },
  { id: "random", name: "랜덤", description: "오늘의 기분에 맞는 랜덤 스타일", icon: "🎲" },
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
    } catch (error) {
      console.error("날씨 정보를 가져오는데 실패했습니다:", error)
    } finally {
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
          let errorMessage = "위치 정보를 가져올 수 없습니다. 서울 기준으로 날씨를 표시합니다."
          setLocationPermission(false)
          setLocationError(errorMessage)
          fetchWeather()
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
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
      {/* ✅ 테스트용 문구 */}
      <div className="bg-green-100 text-green-800 text-center py-2 font-bold">
        ✅ Next.js 페이지가 정상적으로 실행 중입니다!
      </div>

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

        {/* 기존 UI */}
        <div className="px-3 pt-4 w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 h-10">
              <TabsTrigger value="weather">TODAY'S WEATHER</TabsTrigger>
              <TabsTrigger value="fashion">FASHION</TabsTrigger>
            </TabsList>

            <TabsContent value="weather">
              <WeatherCard
                weather={weather}
                loading={loading}
                onRefresh={() => fetchWeather(coordinates?.lat, coordinates?.lon)}
                coordinates={coordinates}
              />
            </TabsContent>

            <TabsContent value="fashion">
              {weather && selectedStyle && (
                <>
                  <StyleSelector styles={STYLE_TYPES} selectedStyle={selectedStyle} onStyleSelect={setSelectedStyle} />
                  <FashionItemsGallery selectedStyle={selectedStyle} weather={weather} />
                  <FashionRecommendation weather={weather} styleType={selectedStyle} />
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {weather && <FloatingAIChat weather={weather} />}
    </main>
  )
}
