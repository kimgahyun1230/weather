"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"

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

export default function MyPage() {
  const router = useRouter()
  const [likedImages, setLikedImages] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [likedImageUrls, setLikedImageUrls] = useState({}) // 추천 이력의 좋아요 상태

  useEffect(() => {
    const token = localStorage.getItem("jwt_token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchLikedImages(token)
    fetchRecommendations(token)
  }, [router])

  const fetchLikedImages = async (token) => {
    try {
      const response = await fetch("/api/likes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        localStorage.removeItem("jwt_token")
        router.push("/")
        return
      }

      if (response.ok) {
        const data = await response.json()
        setLikedImages(data.likes || [])
        
        // 좋아요한 이미지 URL 맵 생성
        const urlMap = {}
        data.likes?.forEach(like => {
          urlMap[like.originalImageUrl] = like._id
        })
        setLikedImageUrls(urlMap)
      }
    } catch (error) {
      console.error("좋아요 목록 로드 오류:", error)
    }
  }

  const fetchRecommendations = async (token) => {
    try {
      const response = await fetch("/api/fashion/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        localStorage.removeItem("jwt_token")
        router.push("/")
        return
      }

      if (response.ok) {
        const data = await response.json()
        const histories = data.histories || []
        setRecommendations(histories)
      }
    } catch (error) {
      console.error("추천 이력 로드 오류:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("jwt_token")
    router.push("/login")
  }

  const removeLike = async (likeId) => {
    try {
      const token = localStorage.getItem("jwt_token")
      const response = await fetch(`/api/likes/${likeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        localStorage.removeItem("jwt_token")
        router.push("/")
        return
      }

      if (response.ok) {
        setLikedImages((prev) => prev.filter((like) => like._id !== likeId))
        setLikedImageUrls((prev) => {
          const newMap = { ...prev }
          const like = likedImages.find(l => l._id === likeId)
          if (like) {
            delete newMap[like.originalImageUrl]
          }
          return newMap
        })
      }
    } catch (error) {
      console.error("좋아요 삭제 오류:", error)
    }
  }

  const handleLike = async (image) => {
    try {
      const token = localStorage.getItem("jwt_token")
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrl: image.imageUrl,
          title: image.title,
          photographer: image.photographer,
          photographerUrl: image.photographerUrl,
        }),
      })

      if (response.status === 401) {
        localStorage.removeItem("jwt_token")
        router.push("/")
        return
      }

      if (response.ok) {
        const data = await response.json()
        setLikedImages((prev) => [data.data, ...prev])
        setLikedImageUrls((prev) => ({
          ...prev,
          [image.imageUrl]: data.data._id,
        }))
      }
    } catch (error) {
      console.error("좋아요 추가 오류:", error)
    }
  }

  const handleUnlike = async (imageUrl, likeId) => {
    try {
      const token = localStorage.getItem("jwt_token")
      const response = await fetch(`/api/likes/${likeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        localStorage.removeItem("jwt_token")
        router.push("/")
        return
      }

      if (response.ok) {
        setLikedImageUrls((prev) => {
          const newMap = { ...prev }
          delete newMap[imageUrl]
          return newMap
        })
      }
    } catch (error) {
      console.error("좋아요 취소 오류:", error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 w-full">
      <div className="w-full h-screen flex flex-col overflow-hidden">
        <header className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img src="/wtw-logo.png" alt="WTW Logo" className="h-8 brightness-0 invert" />
            <h1 className="text-lg font-bold hidden sm:block">마이페이지</h1>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/")}
              className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-primary-foreground text-primary rounded-md hover:bg-primary-foreground/90 transition-colors whitespace-nowrap"
            >
              홈으로
            </button>
            <button
              onClick={handleLogout}
              className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-primary-foreground text-primary rounded-md hover:bg-primary-foreground/90 transition-colors whitespace-nowrap"
            >
              로그아웃
            </button>
          </div>
        </header>

        <div className="px-3 pt-3 w-full flex-1 overflow-hidden">
          <Tabs defaultValue="liked" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-3 h-9 flex-shrink-0">
              <TabsTrigger value="liked" className="text-xs font-medium px-2">
                내 마음함
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs font-medium px-2">
                추천 이력
              </TabsTrigger>
            </TabsList>

            <TabsContent value="liked" className="flex-1 overflow-y-auto pb-3 scrollbar-hide">
              {likedImages.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="text-4xl mb-3">💝</div>
                  <p className="text-muted-foreground">아직 좋아요한 이미지가 없습니다</p>
                </Card>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {likedImages.map((like) => {
                    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${like.localFilePath}`
                    return (
                      <div key={like._id} className="relative group">
                        <div
                          className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square cursor-pointer"
                          onClick={() => setSelectedImage(imageUrl)}
                        >
                          <img
                            src={imageUrl}
                            alt={like.imageMetadata?.title || "좋아요 이미지"}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              console.error("이미지 로드 실패:", imageUrl)
                              e.target.src = '/placeholder.svg?height=300&width=300'
                              e.target.style.objectFit = 'contain'
                            }}
                          />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeLike(like._id)
                          }}
                          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 hover:shadow-xl transition-all duration-200 z-10"
                        >
                          <HeartIcon filled={true} className="w-5 h-5 text-red-500 transition-all duration-200 hover:scale-110" />
                        </button>
                      </div>
                    </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="flex-1 overflow-y-auto pb-3 scrollbar-hide space-y-3">
              {recommendations.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-muted-foreground">아직 AI 추천 이력이 없습니다</p>
                </Card>
              ) : (
                recommendations.map((rec) => (
                  <Card key={rec._id} className="p-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">✨</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">
                            {new Date(rec.createdAt).toLocaleDateString("ko-KR")}
                          </p>
                          <p className="text-sm font-medium mb-2">{rec.userMessage}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{rec.weather?.temperature}°C</span>
                            <span>·</span>
                            <span>{rec.weather?.condition}</span>
                          </div>
                        </div>
                      </div>
                      {rec.images && rec.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 ml-13">
                          {rec.images.map((image, idx) => {
                            const isLiked = !!likedImageUrls[image.imageUrl]
                            const likeId = likedImageUrls[image.imageUrl]

                            return (
                              <div
                                key={idx}
                                className="relative aspect-square overflow-hidden rounded-md cursor-pointer hover:opacity-80 transition-opacity bg-gray-100"
                              >
                                <Image
                                  src={image.smallImageUrl || image.imageUrl}
                                  alt={image.title || "패션 이미지"}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 25vw, 150px"
                                  onClick={() => setSelectedImage(image.imageUrl)}
                                  onError={(e) => {
                                    e.target.src = '/placeholder.svg?height=300&width=300'
                                    e.target.style.objectFit = 'contain'
                                  }}
                                />
                                {/* 하트 버튼 */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (isLiked) {
                                      handleUnlike(image.imageUrl, likeId)
                                    } else {
                                      handleLike(image)
                                    }
                                  }}
                                  className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 hover:shadow-xl transition-all duration-200 z-10"
                                >
                                  <HeartIcon filled={isLiked} className={`w-5 h-5 transition-all duration-200 ${isLiked ? 'text-red-500 hover:scale-110' : 'text-gray-400 hover:text-red-300'}`} />
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl p-0">
          {selectedImage && (
            <div className="relative w-full h-[80vh] flex items-center justify-center">
              <img 
                src={typeof selectedImage === 'string' ? selectedImage : (selectedImage.imageUrl || "/placeholder.svg")} 
                alt="확대 이미지" 
                className="max-w-full max-h-full object-contain" 
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
