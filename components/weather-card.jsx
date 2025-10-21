/*
 * ========================================
 * 📝 날씨 카드 컴포넌트 (weather-card.jsx)
 * ========================================
 *
 * 🎯 이 파일이 하는 일:
 * - 현재 날씨 정보를 예쁜 카드로 보여줍니다
 * - 온도, 날씨 상태, 습도, 바람 등을 표시합니다
 * - 새로고침 버튼으로 날씨를 다시 가져올 수 있습니다
 * - 카드를 클릭하면 시간대별 날씨를 볼 수 있습니다
 *
 * 💡 초보자를 위한 설명:
 * - props: 부모 컴포넌트에서 받아오는 데이터
 * - loading: 데이터를 불러오는 중인지 확인
 * - Skeleton: 로딩 중일 때 보여주는 임시 화면
 */

"use client" // 이 파일이 브라우저에서 실행된다는 표시

// 필요한 UI 컴포넌트들을 가져옵니다
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshIcon, LocationIcon } from "@/components/icons"
import { Skeleton } from "@/components/ui/skeleton"
import { HourlyWeather } from "@/components/hourly-weather"

// ========================================
// 🌤️ 날씨 상태에 맞는 이모지 가져오기
// ========================================
const getWeatherIcon = (condition) => {
  if (!condition) return "🌤️"

  // 날씨 상태별로 이모지를 저장한 객체
  const icons = {
    sunny: "☀️", // 맑음
    clear: "☀️", // 맑음
    cloudy: "☁️", // 흐림
    clouds: "☁️", // 흐림
    rainy: "🌧️", // 비
    rain: "🌧️", // 비
    snowy: "❄️", // 눈
    snow: "❄️", // 눈
  }
  // 해당하는 이모지를 반환, 없으면 기본값 🌤️
  return icons[condition.toLowerCase()] || "🌤️"
}

// ========================================
// 📝 날씨 상태를 한글로 변환하기
// ========================================
const getWeatherDescription = (condition) => {
  if (!condition) return "보통"

  // 날씨 상태별로 한글 설명을 저장한 객체
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
  // 해당하는 한글 설명을 반환, 없으면 기본값 "보통"
  return descriptions[condition.toLowerCase()] || "보통"
}

// ========================================
// 🎨 날씨 카드 컴포넌트
// ========================================
export function WeatherCard({ weather, loading, onRefresh, coordinates }) {
  // ========================================
  // 📦 받아온 데이터 (Props)
  // ========================================
  // weather: 날씨 정보 (온도, 날씨 상태, 습도 등)
  // loading: 로딩 중인지 확인 (true/false)
  // onRefresh: 새로고침 버튼을 눌렀을 때 실행할 함수
  // coordinates: 위치 좌표 (위도, 경도)

  // ========================================
  // 🔄 로딩 중일 때 보여줄 화면
  // ========================================
  if (loading) {
    return (
      <Card className="p-4 weather-gradient text-white">
        <div className="space-y-3">
          {/* Skeleton: 로딩 중일 때 보여주는 임시 박스들 */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 bg-white/20" /> {/* 위치 이름 자리 */}
            <Skeleton className="h-6 w-6 rounded-full bg-white/20" /> {/* 새로고침 버튼 자리 */}
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-8 w-16 bg-white/20" /> {/* 온도 자리 */}
              <Skeleton className="h-3 w-12 bg-white/20" /> {/* 날씨 설명 자리 */}
            </div>
            <Skeleton className="h-12 w-12 rounded-full bg-white/20" /> {/* 날씨 아이콘 자리 */}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {/* 습도, 바람, 일교차 자리 */}
            <Skeleton className="h-8 bg-white/20 rounded-lg" />
            <Skeleton className="h-8 bg-white/20 rounded-lg" />
            <Skeleton className="h-8 bg-white/20 rounded-lg" />
          </div>
        </div>
      </Card>
    )
  }

  // ========================================
  // ❌ 날씨 정보가 없을 때
  // ========================================
  if (!weather) {
    return (
      <Card className="p-4 text-center">
        <p className="text-muted-foreground text-sm">날씨 정보를 불러오는 중...</p>
      </Card>
    )
  }

  // ========================================
  // 📊 일교차 계산하기
  // ========================================
  // 일교차 = 최고 온도 - 최저 온도
  const temperatureDiff =
    weather.temperatureDiff || (weather.maxTemp && weather.minTemp ? weather.maxTemp - weather.minTemp : 0)
  const hasTemperatureDiff = temperatureDiff > 0 // 일교차가 있는지 확인

  // ========================================
  // 🎨 날씨 카드 화면 그리기
  // ========================================
  return (
    <HourlyWeather
      coordinates={coordinates} // 위치 좌표 전달
      trigger={
        // trigger: 클릭하면 시간대별 날씨를 보여줄 카드
        <Card className="p-4 weather-gradient text-white relative overflow-hidden cursor-pointer hover:shadow-xl hover:border-white/30 transition-all">
          {/* 배경 그라데이션 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

          <div className="relative space-y-3">
            {/* 상단: 위치와 새로고침 버튼 */}
            <div className="flex items-center justify-between">
              {/* 위치 정보 */}
              <div className="flex items-center gap-1.5">
                <LocationIcon className="w-3 h-3" /> {/* 위치 아이콘 */}
                <span className="text-[11px] font-medium">{weather.location}</span> {/* 위치 이름 */}
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

            {/* 중간: 온도와 날씨 아이콘 */}
            <div className="flex items-center justify-between">
              {/* 온도 정보 */}
              <div className="space-y-0.5">
                <div className="text-xl font-bold">{weather.temperature}°C</div> {/* 현재 온도 */}
                <div className="text-[10px] opacity-90">{getWeatherDescription(weather.condition)}</div>{" "}
                {/* 날씨 설명 */}
                {/* 최저/최고 온도 (있을 경우에만 표시) */}
                {hasTemperatureDiff && (
                  <div className="text-[10px] opacity-80">
                    {weather.minTemp}° / {weather.maxTemp}°
                  </div>
                )}
              </div>
              {/* 날씨 아이콘 */}
              <div className="text-3xl">{getWeatherIcon(weather.condition)}</div>
            </div>

            {/* 하단: 습도, 바람, 일교차 정보 */}
            <div className="grid grid-cols-3 gap-2">
              {/* 습도 */}
              <div className="bg-white/10 rounded-lg p-1.5 text-center backdrop-blur-sm">
                <div className="text-base mb-0.5">💧</div> {/* 습도 아이콘 */}
                <div className="text-[9px] opacity-80">습도</div>
                <div className="text-[10px] font-semibold">{weather.humidity}%</div>
              </div>
              {/* 바람 */}
              <div className="bg-white/10 rounded-lg p-1.5 text-center backdrop-blur-sm">
                <div className="text-base mb-0.5">💨</div> {/* 바람 아이콘 */}
                <div className="text-[9px] opacity-80">바람</div>
                <div className="text-[10px] font-semibold">{weather.windSpeed}m/s</div>
              </div>
              {/* 일교차 (있을 경우에만 표시) */}
              {hasTemperatureDiff && (
                <div className="bg-white/10 rounded-lg p-1.5 text-center backdrop-blur-sm">
                  <div className="text-base mb-0.5">🌡️</div> {/* 온도계 아이콘 */}
                  <div className="text-[9px] opacity-80">일교차</div>
                  <div className="text-[10px] font-semibold">{temperatureDiff}°</div>
                </div>
              )}
            </div>

            {/* 일교차 경고 (10도 이상일 때만 표시) */}
            {temperatureDiff > 10 && (
              <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-300 text-sm">⚠️</span>
                  <div className="text-[10px]">
                    <div className="font-medium">일교차가 큽니다!</div>
                    <div className="opacity-90">레이어링 스타일을 추천드려요</div>
                  </div>
                </div>
              </div>
            )}

            {/* 안내 문구 */}
            <div className="text-center">
              <div className="text-[9px] opacity-75 bg-white/10 rounded-full px-2.5 py-0.5 inline-block">
                탭하여 시간대별 날씨 확인
              </div>
            </div>
          </div>
        </Card>
      }
    />
  )
}
