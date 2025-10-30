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

  useEffect(() => {
    const token = localStorage.getItem("jwt_token")
    if (!token) {
      router.push("/login")
      return
    }

    // 좋아요한 이미지 불러오기
    const liked = localStorage.getItem("liked_images")
    if (liked) {
      setLikedImages(JSON.parse(liked))
    }

    // AI 추천 이력 불러오기
    const history = localStorage.getItem("ai_recommendations")
    if (history) {
      setRecommendations(JSON.parse(history))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("jwt_token")
    router.push("/login")
  }

  const removeLike = (imageUrl) => {
    const newLiked = likedImages.filter((url) => url !== imageUrl)
    setLikedImages(newLiked)
    localStorage.setItem("liked_images", JSON.stringify(newLiked))
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
                  {likedImages.map((src, index) => (
                    <div key={index} className="relative group">
                      <div
                        className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square cursor-pointer"
                        onClick={() => setSelectedImage(src)}
                      >
                        <Image
                          src={src || "/placeholder.svg"}
                          alt={`좋아요 이미지 ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 33vw, 200px"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeLike(src)
                          }}
                          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
                        >
                          <HeartIcon filled={true} className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
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
                recommendations.map((rec, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">✨</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">{rec.date}</p>
                        <p className="text-sm font-medium mb-2">{rec.question}</p>
                        <p className="text-xs text-muted-foreground whitespace-pre-wrap">{rec.answer}</p>
                      </div>
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
            <div className="relative w-full h-[80vh]">
              <Image src={selectedImage || "/placeholder.svg"} alt="확대 이미지" fill className="object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
