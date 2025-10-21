"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function HistoryPage() {
  const router = useRouter()
  const [histories, setHistories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    fetchHistories()
  }, [])

  const fetchHistories = async () => {
    try {
      const token = localStorage.getItem("jwt_token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch("/api/fashion/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch histories")
      }

      const data = await response.json()
      setHistories(data.histories || [])
    } catch (error) {
      console.error("히스토리 로드 오류:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">AI 추천 이력</h1>
            <p className="text-muted-foreground mt-1">
              나의 패션 추천 기록을 확인하세요
            </p>
          </div>
          <Button onClick={() => router.push("/")} variant="outline">
            홈으로
          </Button>
        </div>

        {/* 히스토리 리스트 */}
        {histories.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">아직 추천 이력이 없습니다.</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              AI 추천 받기
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {histories.map((history) => (
              <Card key={history._id} className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* 왼쪽: 텍스트 정보 */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          {history.userMessage}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(history.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{history.weather?.temperature}°C</span>
                        <span>·</span>
                        <span>{history.weather?.condition}</span>
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽: 이미지 그리드 */}
                  {history.images && history.images.length > 0 && (
                    <div className="w-full md:w-80">
                      <div className="grid grid-cols-4 gap-2">
                        {history.images.map((image, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-[3/4] overflow-hidden rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setSelectedImage(image)}
                          >
                            <img
                              src={image.smallImageUrl || image.imageUrl}
                              alt={image.title || "패션 이미지"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none'
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 이미지 확대 모달 */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-3xl p-0">
            <div className="relative">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title || "패션 이미지"}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              {/* 사진작가 크레딧 */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3">
                <p className="text-sm">
                  Photo by{" "}
                  <a
                    href={selectedImage.photographerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gray-300"
                  >
                    {selectedImage.photographer}
                  </a>
                  {" "}on{" "}
                  <a
                    href={selectedImage.unsplashUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gray-300"
                  >
                    Unsplash
                  </a>
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

