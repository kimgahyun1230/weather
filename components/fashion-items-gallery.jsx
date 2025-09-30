"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"

// 온도별 옷차림 기준표 (첨부된 이미지 기준)
const getTemperatureCategory = (temp) => {
  if (temp >= 28) return "very_hot" // 28°C 이상: 민소매, 반팔, 반바지, 원피스
  if (temp >= 23) return "hot" // 27°C-23°C: 반팔, 얇은 셔츠, 반바지, 면바지
  if (temp >= 20) return "warm" // 22°C-20°C: 얇은 가디건, 긴팔, 면바지, 청바지
  if (temp >= 17) return "mild" // 19°C-17°C: 얇은 니트, 맨투맨, 가디건, 청바지
  if (temp >= 12) return "cool" // 16°C-12°C: 자켓, 가디건, 야상, 스타킹, 청바지, 면바지
  if (temp >= 9) return "cold" // 11°C-9°C: 자켓, 트렌치코트, 야상, 니트, 스타킹, 청바지
  if (temp >= 5) return "very_cold" // 8°C-5°C: 코트, 가죽자켓, 히트텍, 니트, 레깅스
  return "freezing" // 4°C 이하: 패딩, 두꺼운 코트, 목도리, 기모제품
}

// 20대 여성을 위한 온도별 한국 트렌드 패션 이미지 데이터베이스
const fashionImagesDB = {
  casual: {
    very_hot: [
      // 28°C 이상
      "/korean-women-crop-top-casual.jpg",
      "/korean-women-linen-shorts-casual.jpg",
      "/korean-women-canvas-sneakers-casual.jpg",
      "/korean-women-mini-dress-casual.jpg",
      "/korean-women-sandals-casual.jpg",
      "/korean-women-tank-top-casual.jpg",
    ],
    hot: [
      // 27°C-23°C
      "/korean-women-oversized-shirt-casual.jpg",
      "/korean-women-linen-shorts-casual.jpg",
      "/korean-women-canvas-sneakers-casual.jpg",
      "/korean-women-cotton-pants-casual.jpg",
      "/korean-women-light-blouse-casual.jpg",
      "/korean-women-summer-dress-casual.jpg",
    ],
    warm: [
      // 22°C-20°C (현재 21도)
      "/korean-women-knit-cardigan-casual.jpg",
      "/korean-women-long-sleeve-casual.jpg",
      "/korean-women-wide-jeans-casual.jpg",
      "/korean-women-cotton-pants-casual.jpg",
      "/korean-women-light-jacket-casual.jpg",
      "/korean-women-ankle-boots-casual.jpg",
    ],
    mild: [
      // 19°C-17°C
      "/korean-women-oversized-hoodie-casual.jpg",
      "/korean-women-knit-sweater-casual.jpg",
      "/korean-women-wide-jeans-casual.jpg",
      "/korean-women-cardigan-casual.jpg",
      "/korean-women-chunky-sneakers-casual.jpg",
      "/korean-women-midi-skirt-casual.jpg",
    ],
    cool: [
      // 16°C-12°C
      "/korean-women-jacket-casual.jpg",
      "/korean-women-cardigan-casual.jpg",
      "/korean-women-wide-jeans-casual.jpg",
      "/korean-women-ankle-boots-casual.jpg",
      "/korean-women-field-jacket-casual.jpg",
      "/korean-women-cotton-pants-casual.jpg",
    ],
    cold: [
      // 11°C-9°C
      "/korean-women-trench-coat-casual.jpg",
      "/korean-women-knit-sweater-casual.jpg",
      "/korean-women-wide-jeans-casual.jpg",
      "/korean-women-ankle-boots-casual.jpg",
      "/korean-women-field-jacket-casual.jpg",
      "/korean-women-thick-cardigan-casual.jpg",
    ],
    very_cold: [
      // 8°C-5°C
      "/korean-women-wool-coat-casual.jpg",
      "/korean-women-leather-jacket-casual.jpg",
      "/korean-women-thick-knit-casual.jpg",
      "/korean-women-leggings-casual.jpg",
      "/korean-women-ankle-boots-casual.jpg",
      "/korean-women-heattech-casual.jpg",
    ],
    freezing: [
      // 4°C 이하
      "/korean-women-padding-casual.jpg",
      "/korean-women-thick-coat-casual.jpg",
      "/korean-women-scarf-casual.jpg",
      "/korean-women-fleece-casual.jpg",
      "/korean-women-winter-boots-casual.jpg",
      "/korean-women-thermal-casual.jpg",
    ],
  },
  formal: {
    very_hot: [
      "/korean-women-silk-blouse-formal.jpg",
      "/korean-women-linen-skirt-formal.jpg",
      "/korean-women-pointed-flats-formal.jpg",
      "/korean-women-sleeveless-dress-formal.jpg",
      "/korean-women-low-heels-formal.jpg",
      "/korean-women-summer-blazer-formal.jpg",
    ],
    hot: [
      "/korean-women-linen-blazer-formal.jpg",
      "/korean-women-cotton-pants-formal.jpg",
      "/korean-women-pointed-flats-formal.jpg",
      "/korean-women-light-shirt-formal.jpg",
      "/korean-women-a-line-skirt-formal.jpg",
      "/korean-women-low-heels-formal.jpg",
    ],
    warm: [
      // 22°C-20°C (현재 21도)
      "/korean-women-light-cardigan-formal.jpg",
      "/korean-women-blouse-formal.jpg",
      "/korean-women-cotton-pants-formal.jpg",
      "/korean-women-pencil-skirt-formal.jpg",
      "/korean-women-low-heels-formal.jpg",
      "/korean-women-midi-dress-formal.jpg",
    ],
    mild: [
      "/korean-women-knit-cardigan-formal.jpg",
      "/korean-women-blouse-formal.jpg",
      "/korean-women-trousers-formal.jpg",
      "/korean-women-pencil-skirt-formal.jpg",
      "/korean-women-heels-formal.jpg",
      "/korean-women-sweater-formal.jpg",
    ],
    cool: [
      "/korean-women-blazer-formal.jpg",
      "/korean-women-cardigan-formal.jpg",
      "/korean-women-trousers-formal.jpg",
      "/korean-women-heels-formal.jpg",
      "/korean-women-jacket-formal.jpg",
      "/korean-women-pencil-skirt-formal.jpg",
    ],
    cold: [
      "/korean-women-blazer-formal.jpg",
      "/korean-women-trench-coat-formal.jpg",
      "/korean-women-trousers-formal.jpg",
      "/korean-women-heels-formal.jpg",
      "/korean-women-knit-sweater-formal.jpg",
      "/korean-women-wool-skirt-formal.jpg",
    ],
    very_cold: [
      "/korean-women-wool-coat-formal.jpg",
      "/korean-women-leather-jacket-formal.jpg",
      "/korean-women-thick-knit-formal.jpg",
      "/korean-women-heels-formal.jpg",
      "/korean-women-wool-dress-formal.jpg",
      "/korean-women-tights-formal.jpg",
    ],
    freezing: [
      "/korean-women-thick-coat-formal.jpg",
      "/korean-women-padding-formal.jpg",
      "/korean-women-scarf-formal.jpg",
      "/korean-women-winter-boots-formal.jpg",
      "/korean-women-thermal-formal.jpg",
      "/korean-women-fleece-formal.jpg",
    ],
  },
  street: {
    very_hot: [
      "/korean-women-crop-hoodie-street.jpg",
      "/korean-women-cargo-shorts-street.jpg",
      "/korean-women-chunky-sneakers-street.jpg",
      "/korean-women-oversized-tee-street.jpg",
      "/korean-women-bucket-hat-street.jpg",
      "/korean-women-high-top-sneakers-street.jpg",
    ],
    hot: [
      "/korean-women-oversized-tee-street.jpg",
      "/korean-women-cargo-shorts-street.jpg",
      "/korean-women-chunky-sneakers-street.jpg",
      "/korean-women-bucket-hat-street.jpg",
      "/korean-women-baggy-pants-street.jpg",
      "/korean-women-platform-sneakers-street.jpg",
    ],
    warm: [
      // 22°C-20°C (현재 21도)
      "/korean-women-light-hoodie-street.jpg",
      "/korean-women-baggy-jeans-street.jpg",
      "/korean-women-chunky-sneakers-street.jpg",
      "/korean-women-cardigan-street.jpg",
      "/korean-women-platform-sneakers-street.jpg",
      "/korean-women-long-sleeve-street.jpg",
    ],
    mild: [
      "/korean-women-graphic-hoodie-street.jpg",
      "/korean-women-baggy-jeans-street.jpg",
      "/korean-women-chunky-sneakers-street.jpg",
      "/korean-women-beanie-street.jpg",
      "/korean-women-sweatshirt-street.jpg",
      "/korean-women-combat-boots-street.jpg",
    ],
    cool: [
      "/korean-women-oversized-jacket-street.jpg",
      "/korean-women-baggy-jeans-street.jpg",
      "/korean-women-platform-sneakers-street.jpg",
      "/korean-women-beanie-street.jpg",
      "/korean-women-field-jacket-street.jpg",
      "/korean-women-combat-boots-street.jpg",
    ],
    cold: [
      "/korean-women-oversized-jacket-street.jpg",
      "/korean-women-graphic-hoodie-street.jpg",
      "/korean-women-baggy-jeans-street.jpg",
      "/korean-women-combat-boots-street.jpg",
      "/korean-women-beanie-street.jpg",
      "/korean-women-platform-sneakers-street.jpg",
    ],
    very_cold: [
      "/korean-women-puffer-jacket-street.jpg",
      "/korean-women-leather-jacket-street.jpg",
      "/korean-women-thick-hoodie-street.jpg",
      "/korean-women-combat-boots-street.jpg",
      "/korean-women-beanie-street.jpg",
      "/korean-women-baggy-jeans-street.jpg",
    ],
    freezing: [
      "/korean-women-padding-street.jpg",
      "/korean-women-thick-coat-street.jpg",
      "/korean-women-scarf-street.jpg",
      "/korean-women-winter-boots-street.jpg",
      "/korean-women-fleece-hoodie-street.jpg",
      "/korean-women-thermal-street.jpg",
    ],
  },
  random: {
    very_hot: [
      "/korean-women-floral-dress.jpg",
      "/korean-women-strappy-sandals.jpg",
      "/korean-women-chiffon-blouse.jpg",
      "/korean-women-mini-skirt.jpg",
      "/korean-women-ballet-flats.jpg",
      "/korean-women-summer-cardigan.jpg",
    ],
    hot: [
      "/korean-women-chiffon-blouse.jpg",
      "/korean-women-mini-skirt.jpg",
      "/korean-women-ballet-flats.jpg",
      "/korean-women-summer-cardigan.jpg",
      "/korean-women-floral-dress.jpg",
      "/korean-women-strappy-sandals.jpg",
    ],
    warm: [
      // 22°C-20°C (현재 21도)
      "/korean-women-light-cardigan-feminine.jpg",
      "/korean-women-pleated-skirt.jpg",
      "/korean-women-mary-jane-shoes.jpg",
      "/korean-women-blouse-feminine.jpg",
      "/korean-women-midi-dress-feminine.jpg",
      "/korean-women-ballet-flats.jpg",
    ],
    mild: [
      "/korean-women-cashmere-sweater.jpg",
      "/korean-women-pleated-skirt.jpg",
      "/korean-women-mary-jane-shoes.jpg",
      "/korean-women-cardigan-feminine.jpg",
      "/korean-women-midi-boots.jpg",
      "/korean-women-wool-dress.jpg",
    ],
    cool: [
      "/korean-women-feminine-jacket.jpg",
      "/korean-women-pleated-skirt.jpg",
      "/korean-women-mary-jane-shoes.jpg",
      "/korean-women-cashmere-sweater.jpg",
      "/korean-women-midi-boots.jpg",
      "/korean-women-cardigan-feminine.jpg",
    ],
    cold: [
      "/korean-women-feminine-coat.jpg",
      "/korean-women-pleated-skirt.jpg",
      "/korean-women-mary-jane-shoes.jpg",
      "/korean-women-cashmere-sweater.jpg",
      "/korean-women-midi-boots.jpg",
      "/korean-women-wool-dress.jpg",
    ],
    very_cold: [
      "/korean-women-wool-coat-feminine.jpg",
      "/korean-women-thick-sweater-feminine.jpg",
      "/korean-women-tights-feminine.jpg",
      "/korean-women-midi-boots.jpg",
      "/korean-women-wool-dress.jpg",
      "/korean-women-cashmere-scarf.jpg",
    ],
    freezing: [
      "/korean-women-padding-feminine.jpg",
      "/korean-women-thick-coat-feminine.jpg",
      "/korean-women-scarf-feminine.jpg",
      "/korean-women-winter-boots-feminine.jpg",
      "/korean-women-thermal-feminine.jpg",
      "/korean-women-fleece-feminine.jpg",
    ],
  },
}

export function FashionItemsGallery({ selectedStyle, weather }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [likedImages, setLikedImages] = useState(new Set())

  useEffect(() => {
    console.log("[v0] 패션 이미지 로딩 시작:", {
      styleType: selectedStyle,
      temperature: weather?.temperature,
      temperatureCategory: getTemperatureCategory(weather?.temperature),
    })

    setLoading(true)

    const temperatureCategory = getTemperatureCategory(weather?.temperature || 20)

    // 스타일에 맞는 이미지 가져오기
    const styleImages =
      fashionImagesDB[selectedStyle]?.[temperatureCategory] || fashionImagesDB.casual[temperatureCategory]

    setTimeout(() => {
      setImages(styleImages)
      setLoading(false)
      console.log("[v0] 패션 이미지 로딩 완료:", styleImages.length, "개 이미지", "온도구간:", temperatureCategory)
    }, 500)
  }, [weather, selectedStyle])

  const toggleLike = (imageIndex) => {
    setLikedImages((prev) => {
      const newLiked = new Set(prev)
      if (newLiked.has(imageIndex)) {
        newLiked.delete(imageIndex)
      } else {
        newLiked.add(imageIndex)
      }
      return newLiked
    })
  }

  const getStyleName = (styleType) => {
    const names = {
      casual: "캐주얼",
      formal: "포멀",
      street: "스트릿",
      random: "페미닌",
    }
    return names[styleType] || styleType
  }

  const getTemperatureDescription = (temp) => {
    if (temp >= 28) return "민소매, 반팔, 반바지 추천"
    if (temp >= 23) return "반팔, 얇은 셔츠, 면바지 추천"
    if (temp >= 20) return "얇은 가디건, 긴팔, 청바지 추천"
    if (temp >= 17) return "얇은 니트, 맨투맨, 가디건 추천"
    if (temp >= 12) return "자켓, 가디건, 야상 추천"
    if (temp >= 9) return "자켓, 트렌치코트, 니트 추천"
    if (temp >= 5) return "코트, 가죽자켓, 히트텍 추천"
    return "패딩, 두꺼운 코트, 목도리 추천"
  }

  if (loading) {
    return (
      <div className="text-center space-y-3 py-8">
        <div className="text-3xl animate-bounce">👗</div>
        <p className="text-base font-medium">20대 여성 트렌드를 찾고 있어요...</p>
        <div className="w-full bg-secondary rounded-full h-2 max-w-xs mx-auto">
          <div className="bg-primary h-2 rounded-full animate-pulse w-3/4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-lg font-semibold">{getStyleName(selectedStyle)} 스타일</h2>
        <p className="text-xs text-muted-foreground">
          {weather?.temperature}°C - {getTemperatureDescription(weather?.temperature)}
        </p>
      </div>

      {/* Pinterest 스타일 Masonry 그리드 */}
      <div className="grid grid-cols-3 gap-2">
        {images.slice(0, 9).map((image, index) => (
          <div key={index} className="relative group">
            <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square">
              <img
                src={image || "/placeholder.svg"}
                alt={`${getStyleName(selectedStyle)} 스타일 ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  console.log("[v0] 이미지 로드 실패:", image)
                  e.target.src = `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(`20대 여성 한국 패션 ${getStyleName(selectedStyle)}`)}`
                }}
              />

              {/* 하트 버튼 */}
              <button
                onClick={() => toggleLike(index)}
                className="absolute top-1 right-1 p-1.5 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110"
              >
                <Heart
                  className={`w-3 h-3 ${likedImages.has(index) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                />
              </button>

              {/* 호버 오버레이 */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground">20대 여성을 위한 한국 트렌드 패션 스타일</p>
      </div>
    </div>
  )
}
