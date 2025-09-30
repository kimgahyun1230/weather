"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

const generateRecommendations = (weather, styleType) => {
  const { temperature, condition, humidity, temperatureDiff, minTemp, maxTemp } = weather
  const recommendations = []

  const hasLargeTemperatureDiff = temperatureDiff > 10
  const actualMinTemp = minTemp || temperature - (temperatureDiff || 0) / 2
  const actualMaxTemp = maxTemp || temperature + (temperatureDiff || 0) / 2

  // 일교차가 클 때 레이어링 추천
  if (hasLargeTemperatureDiff) {
    recommendations.push({
      category: "레이어링 팁",
      item: "가디건 + 기본 티셔츠",
      color: styleType === "street" ? "블랙" : "베이지",
      material: "코튼/니트",
      reason: `일교차 ${temperatureDiff}°로 레이어링이 필수예요. 낮에는 벗고 저녁에는 입을 수 있어요`,
    })
  }

  // 최저 기온 기준 아우터
  if (actualMinTemp < 5) {
    recommendations.push({
      category: "아우터",
      item: styleType === "formal" ? "울 코트" : styleType === "random" ? "패딩 재킷" : "패딩 재킷",
      color: styleType === "street" ? "블랙" : "네이비",
      material: "울/다운",
      reason: hasLargeTemperatureDiff ? "아침/저녁 추위에 대비해요" : "추운 날씨에 보온성이 중요해요",
    })
  } else if (actualMinTemp < 15) {
    recommendations.push({
      category: "아우터",
      item: styleType === "casual" ? "후드집업" : styleType === "formal" ? "블레이저" : "트렌치코트",
      color: styleType === "street" ? "올리브" : "베이지",
      material: "코튼/울",
      reason: hasLargeTemperatureDiff ? "쌀쌀한 아침/저녁에 적합해요" : "쌀쌀한 날씨에 적당한 보온성을 제공해요",
    })
  }

  // 최고 기온 기준 상의
  if (actualMaxTemp > 25) {
    recommendations.push({
      category: "상의",
      item: styleType === "formal" ? "린넨 셔츠" : styleType === "random" ? "실크 블라우스" : "반팔 T셔츠",
      color: styleType === "casual" ? "화이트" : styleType === "street" ? "그래픽" : "파스텔",
      material: styleType === "random" ? "실크" : styleType === "formal" ? "린넨" : "코튼",
      reason: hasLargeTemperatureDiff ? "더운 낮 시간대에 시원해요" : "따뜻한 날씨에 시원하고 편안해요",
    })
  } else if (actualMaxTemp > 15) {
    recommendations.push({
      category: "상의",
      item: styleType === "formal" ? "니트 셔츠" : "긴팔 T셔츠",
      color: styleType === "street" ? "블랙" : "그레이",
      material: "코튼",
      reason: "적당한 온도에 편안해요",
    })
  } else {
    recommendations.push({
      category: "상의",
      item: styleType === "formal" ? "니트 셔츠" : "스웨터",
      color: styleType === "street" ? "블랙" : "그레이",
      material: "울/코튼",
      reason: "추운 날씨에 보온성이 좋아요",
    })
  }

  // 하의
  recommendations.push({
    category: "하의",
    item:
      styleType === "formal"
        ? "슬랙스"
        : styleType === "random"
          ? "스커트"
          : styleType === "street"
            ? "카고팬츠"
            : "청바지",
    color: styleType === "formal" ? "차콜" : styleType === "casual" ? "인디고" : "블랙",
    material: styleType === "random" ? "울" : "코튼",
    reason: `${styleType} 스타일에 완벽하게 어울려요`,
  })

  // 신발
  recommendations.push({
    category: "신발",
    item:
      styleType === "formal"
        ? "옥스포드 슈즈"
        : styleType === "random"
          ? "힐"
          : styleType === "street"
            ? "스니커즈"
            : "로퍼",
    color: styleType === "street" ? "화이트" : "브라운",
    material: styleType === "formal" || styleType === "random" ? "가죽" : "캔버스",
    reason:
      condition === "rainy" || condition === "rain" ? "방수 기능이 있어 비에 적합해요" : "편안하고 스타일리시해요",
  })

  // 날씨별 액세서리
  if (condition === "sunny" || condition === "clear") {
    recommendations.push({
      category: "액세서리",
      item: "선글라스",
      color: styleType === "street" ? "미러" : "블랙",
      material: "플라스틱/메탈",
      reason: "강한 햇빛으로부터 눈을 보호해요",
    })
  }

  if (condition === "rainy" || condition === "rain") {
    recommendations.push({
      category: "액세서리",
      item: "우산",
      color: styleType === "random" ? "베이지" : "블랙",
      material: "폴리에스터",
      reason: "비로부터 옷을 보호해요",
    })
  }

  return recommendations
}

export function FashionRecommendation({ weather, styleType }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    // 추천 생성 시뮬레이션
    setTimeout(() => {
      const newRecommendations = generateRecommendations(weather, styleType)
      setRecommendations(newRecommendations)
      setLoading(false)
    }, 800)
  }, [weather, styleType])

  const getStyleName = (styleType) => {
    const names = {
      casual: "캐주얼",
      formal: "포멀",
      street: "스트릿",
      random: "랜덤",
    }
    return names[styleType] || styleType
  }

  if (loading) {
    return (
      <Card className="p-4">
        <div className="text-center space-y-3">
          <div className="text-3xl animate-spin">🎯</div>
          <p className="text-base font-medium">완벽한 스타일을 찾고 있어요...</p>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-center space-y-1">
        <h2 className="text-lg font-semibold">{getStyleName(styleType)} 스타일 추천</h2>
        <p className="text-xs text-muted-foreground">현재 날씨에 완벽한 코디네이션이에요</p>
      </div>

      <div className="space-y-2">
        {recommendations.map((item, index) => (
          <Card key={index} className="p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center text-lg">
                {item.category === "아우터" && "🧥"}
                {item.category === "상의" && "👕"}
                {item.category === "하의" && "👖"}
                {item.category === "신발" && "👟"}
                {item.category === "액세서리" && "🕶️"}
                {item.category === "레이어링 팁" && "🔄"}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                  <span className="font-semibold text-sm">{item.item}</span>
                </div>

                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">
                    {item.color}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {item.material}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground text-pretty">{item.reason}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-2">
        <Button className="w-full" onClick={() => window.location.reload()}>
          다른 추천 받기
        </Button>
      </div>
    </div>
  )
}
