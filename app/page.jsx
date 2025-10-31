/*
 * ========================================
 * 📝 메인 페이지 (app/page.jsx)
 * ========================================
 *
 * 🎯 이 파일이 하는 일:
 * - 앱의 메인 화면을 보여줍니다
 * - "오늘의 날씨"와 "패션" 두 개의 탭을 관리합니다
 * - 사용자의 위치를 가져와서 날씨 정보를 보여줍니다
 *
 * 💡 초보자를 위한 설명:
 * - "use client": 이 파일이 브라우저에서 실행된다는 표시
 * - useState: 데이터를 저장하고 변경할 수 있게 해주는 도구
 * - useEffect: 페이지가 처음 열릴 때 자동으로 실행되는 코드
 */

"use client"

// React에서 필요한 기능들을 가져옵니다
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// UI 컴포넌트들을 가져옵니다 (미리 만들어진 디자인 요소들)
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 우리가 만든 컴포넌트들을 가져옵니다
import { WeatherCard } from "@/components/weather-card"
import { StyleSelector } from "@/components/style-selector"
import { FashionItemsGallery } from "@/components/fashion-items-gallery"
import { AIRecommendationCard } from "@/components/ai-recommendation-card"
import { FashionRecommendation } from "@/components/fashion-recommendation"

// 스타일 종류들을 정의합니다 (캐주얼, 포멀, 스트릿, 랜덤)
const STYLE_TYPES = [
  { id: "casual", name: "캐주얼", description: "편안하고 자연스러운 일상 스타일", icon: "👕" },
  { id: "formal", name: "포멀", description: "세련되고 전문적인 정장 스타일", icon: "👔" },
  { id: "street", name: "스트릿", description: "트렌디하고 개성 있는 스타일", icon: "🧥" },
  { id: "random", name: "랜덤", description: "오늘의 기분에 맞는 랜덤 스타일", icon: "🎲" },
]

export default function HomePage() {
  const router = useRouter()

  // 날씨 기능 정상 작동 확인

  // ========================================
  // 📦 데이터 저장소 (State)
  // ========================================
  // useState는 데이터를 저장하고 변경할 수 있게 해줍니다

  const [weather, setWeather] = useState(null) // 날씨 정보를 저장
  const [selectedStyle, setSelectedStyle] = useState("") // 선택한 스타일을 저장
  const [loading, setLoading] = useState(false) // 로딩 중인지 저장
  const [activeTab, setActiveTab] = useState("weather") // 현재 보고 있는 탭 저장
  const [coordinates, setCoordinates] = useState(null) // 위치 좌표 저장
  const [locationError, setLocationError] = useState(null) // 위치 오류 메시지 저장
  const [isAuthenticated, setIsAuthenticated] = useState(false) // 인증 상태 저장

  // ========================================
  // 🌤️ 날씨 정보 가져오기
  // ========================================
  const fetchWeather = async (lat, lon) => {
    setLoading(true) // 로딩 시작

    try {
      // URL 파라미터 만들기 (위도, 경도)
      const params = new URLSearchParams()
      if (lat && lon) {
        params.append("lat", lat.toString())
        params.append("lon", lon.toString())
        setCoordinates({ lat, lon }) // 좌표 저장
      }

      const response = await fetch(`/api/weather?${params}`)

      if (!response.ok) {
        throw new Error("날씨 정보를 가져오는데 실패했습니다")
      }

      const weatherData = await response.json()

      setWeather(weatherData) // 받아온 날씨 정보 저장
      setLoading(false) // 로딩 끝
    } catch (error) {
      console.error("날씨 정보를 가져오는데 실패했습니다:", error)
      setLoading(false) // 로딩 끝
    }
  }

  // ========================================
  // 📍 사용자 위치 가져오기
  // ========================================
  const requestLocation = () => {
    setLocationError(null) // 이전 오류 메시지 지우기

    // 브라우저가 위치 서비스를 지원하는지 확인
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // 위치를 성공적으로 가져왔을 때
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude)
        },
        // 위치를 가져오지 못했을 때
        (error) => {
          const errorMessage = "위치 정보를 가져올 수 없습니다. 서울 기준으로 날씨를 표시합니다."
          setLocationError(errorMessage)
          fetchWeather() // 기본 위치(서울)로 날씨 가져오기
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
      )
    } else {
      // 브라우저가 위치 서비스를 지원하지 않을 때
      setLocationError("브라우저에서 위치 서비스를 지원하지 않습니다. 서울 기준으로 날씨를 표시합니다.")
      fetchWeather() // 기본 위치(서울)로 날씨 가져오기
    }
  }

  // ========================================
  // 🚀 페이지가 처음 열릴 때 실행
  // ========================================
  useEffect(() => {
    requestLocation() // 위치 정보 가져오기
    const token = localStorage.getItem("jwt_token")
    if (!token) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router]) // [] 는 "페이지가 처음 열릴 때만 실행"이라는 뜻

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem("jwt_token")
    router.push("/login")
  }

  // ========================================
  // 🎨 화면 그리기
  // ========================================
  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 w-full">
      <div className="w-full h-screen flex flex-col overflow-hidden">
        <header className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setActiveTab("weather")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img src="/wtw-logo.png" alt="WTW Logo" className="h-8 brightness-0 invert" />
            <h1 className="text-lg font-bold hidden sm:block">Weather To Wear</h1>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/mypage")}
              className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-primary-foreground text-primary rounded-md hover:bg-primary-foreground/90 transition-colors whitespace-nowrap"
            >
              마이페이지
            </button>
            <button
              onClick={handleLogout}
              className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-primary-foreground text-primary rounded-md hover:bg-primary-foreground/90 transition-colors whitespace-nowrap"
            >
              로그아웃
            </button>
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <div className="px-3 pt-3 w-full flex-1 overflow-hidden">
          {/* 탭 (오늘의 날씨 / 패션) */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            {/* 탭 버튼들 */}
            <TabsList className="grid w-full grid-cols-2 mb-3 h-auto bg-muted/30 p-1.5 rounded-lg flex-shrink-0">
              <TabsTrigger
                value="weather"
                className="text-base sm:text-lg font-bold py-3 px-4 rounded-md data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted/50 data-[state=inactive]:hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-200"
              >
                TODAY'S WEATHER
              </TabsTrigger>
              <TabsTrigger
                value="fashion"
                className="text-base sm:text-lg font-bold py-3 px-4 rounded-md data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted/50 data-[state=inactive]:hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-200"
              >
                FASHION
              </TabsTrigger>
            </TabsList>

            {/* 오늘의 날씨 탭 내용 */}
            <TabsContent value="weather" className="space-y-2 flex-1 overflow-y-auto pb-3 scrollbar-hide">
              {/* 위치 오류 메시지 (있을 경우에만 표시) */}
              {locationError && (
                <Card className="p-2.5 bg-amber-50 border-amber-200">
                  <div className="flex items-center gap-2 text-amber-800">
                    <div className="text-xs">📍</div>
                    <p className="text-[10px]">{locationError}</p>
                  </div>
                </Card>
              )}

              {/* 날씨 카드 */}
              <WeatherCard
                weather={weather}
                loading={loading}
                onRefresh={() => fetchWeather(coordinates?.lat, coordinates?.lon)}
                coordinates={coordinates}
              />

              {weather && <AIRecommendationCard weather={weather} size="large" />}
            </TabsContent>

            {/* 패션 탭 내용 */}
            <TabsContent value="fashion" className="space-y-2 flex-1 overflow-y-auto pb-3 scrollbar-hide">
              {weather && (
                <Card className="p-3 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{weather.icon || "☀️"}</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{weather.location || "서울"}</p>
                        <p className="text-xs text-muted-foreground">{weather.description || "맑음"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{weather.temperature}°C</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* 스타일 선택 버튼들 */}
              {weather && (
                <StyleSelector styles={STYLE_TYPES} selectedStyle={selectedStyle} onStyleSelect={setSelectedStyle} />
              )}

              {/* 패션 이미지 갤러리 */}
              {weather && selectedStyle && <FashionItemsGallery selectedStyle={selectedStyle} weather={weather} />}

              {/* 패션 아이템 추천 */}
              {weather && selectedStyle && <FashionRecommendation weather={weather} selectedStyle={selectedStyle} />}

              {weather && <AIRecommendationCard weather={weather} size="small" />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
