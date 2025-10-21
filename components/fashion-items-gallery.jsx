"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

// ========================================
// 🎯 S3 폴더별 URL 매핑
// ========================================
const S3_BASE_URL = "https://fashionweather.s3.ap-southeast-2.amazonaws.com"
const TOTAL_IMAGES_PER_FOLDER = 50 // 각 폴더의 이미지 개수

const RefreshIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)

export function FashionItemsGallery({ selectedStyle, weather }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  // ========================================
  // 🔄 버튼 클릭 시 이미지 로드
  // ========================================
  useEffect(() => {
    console.log("[v0] 스타일 변경 감지:", selectedStyle)

    // 버튼이 선택되었을 때만 이미지 로드
    if (selectedStyle) {
      loadImages(selectedStyle)
    }
  }, [selectedStyle])

  const loadImages = (folder) => {
    setLoading(true)
    console.log("[v0] 이미지 로딩 시작:", folder)

    try {
      const baseUrl = `${S3_BASE_URL}/${folder}/`

      // 1부터 50까지 중 랜덤으로 9개 숫자 선택
      const randomIndices = []
      while (randomIndices.length < 9) {
        const randomNum = Math.floor(Math.random() * TOTAL_IMAGES_PER_FOLDER) + 1
        if (!randomIndices.includes(randomNum)) {
          randomIndices.push(randomNum)
        }
      }

      // URL 생성
      const urls = randomIndices.map((i) => `${baseUrl}${i}.jpg`)

      console.log("[v0] 생성된 이미지 URLs:", urls)
      setImages(urls)
    } catch (error) {
      console.error("[v0] 이미지 로드 오류:", error)
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    if (selectedStyle) {
      loadImages(selectedStyle)
    }
  }

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
      <div className="text-center space-y-3 py-8">
        <div className="text-3xl animate-bounce">👗</div>
        <p className="text-base font-medium">패션 이미지를 불러오고 있어요...</p>
        <div className="w-full bg-secondary rounded-full h-2 max-w-xs mx-auto">
          <div className="bg-primary h-2 rounded-full animate-pulse w-3/4"></div>
        </div>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {selectedStyle ? <p>이미지를 불러올 수 없습니다</p> : <p>스타일을 선택해주세요</p>}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-lg font-semibold">{getStyleName(selectedStyle)} 스타일</h2>
        <p className="text-xs text-muted-foreground">{weather?.temperature}°C 추천 스타일</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {images.map((src, index) => (
          <div key={index} className="relative group">
            <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square">
              <Image
                src={src || "/placeholder.svg"}
                alt={`${getStyleName(selectedStyle)} 스타일 ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 33vw, 200px"
                onError={(e) => {
                  e.target.src = `/placeholder.svg?height=200&width=200`
                }}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2 bg-transparent">
          <RefreshIcon className="w-3 h-3" />
          다른 추천 받기
        </Button>
      </div>
    </div>
  )
}
