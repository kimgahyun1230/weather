"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

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

const HeartIcon = ({ filled, className }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
)

export function FashionItemsGallery({ selectedStyle, weather }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [likedImages, setLikedImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)

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

  useEffect(() => {
    const saved = localStorage.getItem("liked_images")
    if (saved) {
      setLikedImages(JSON.parse(saved))
    }
  }, [])

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

  const toggleLike = (imageUrl) => {
    setLikedImages((prev) => {
      const newLiked = prev.includes(imageUrl) ? prev.filter((url) => url !== imageUrl) : [...prev, imageUrl]
      localStorage.setItem("liked_images", JSON.stringify(newLiked))
      return newLiked
    })
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
      <div className="text-center">
        <h2 className="text-lg font-semibold">{getStyleName(selectedStyle)} 스타일</h2>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {images.map((src, index) => (
          <div key={index} className="relative group">
            <div
              className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square cursor-pointer"
              onClick={() => setSelectedImage(src)}
            >
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
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleLike(src)
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
              >
                <HeartIcon filled={likedImages.includes(src)} className="w-5 h-5 text-red-500" />
              </button>
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

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl p-0">
          {selectedImage && (
            <div className="relative w-full h-[80vh]">
              <Image src={selectedImage || "/placeholder.svg"} alt="확대 이미지" fill className="object-contain" />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleLike(selectedImage)
                }}
                className="absolute top-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
              >
                <HeartIcon filled={likedImages.includes(selectedImage)} className="w-6 h-6 text-red-500" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
