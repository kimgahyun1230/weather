/*
 * ========================================
 * 📝 AI 추천 카드 컴포넌트 (ai-recommendation-card.jsx)
 * ========================================
 *
 * 🎯 이 파일이 하는 일:
 * - AI와 대화하며 패션 추천을 받을 수 있는 카드를 보여줍니다
 * - 예시 질문 버튼을 클릭하거나 직접 질문을 입력할 수 있습니다
 * - 카드를 클릭하면 대화창이 열립니다
 * - AI가 날씨 정보를 고려해서 맞춤형 추천을 해줍니다
 *
 * 💡 초보자를 위한 설명:
 * - useState: 데이터를 저장하고 변경할 수 있게 해주는 도구
 * - useEffect: 특정 조건이 바뀔 때 자동으로 실행되는 코드
 * - useRef: 특정 요소를 가리키는 참조 (스크롤 위치 등)
 * - async/await: 서버와 통신할 때 기다리는 방법
 */

"use client" // 이 파일이 브라우저에서 실행된다는 표시

// React에서 필요한 기능들을 가져옵니다
import { useState, useRef, useEffect } from "react"
// UI 컴포넌트들을 가져옵니다
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// SVG 아이콘 정의
const SparklesIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
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

// ========================================
// 🎨 AI 추천 카드 컴포넌트
// ========================================
export function AIRecommendationCard({ weather, size = "large" }) {
  // ========================================
  // 📦 데이터 저장소 (State)
  // ========================================
  const [isOpen, setIsOpen] = useState(false) // 대화창이 열려있는지 확인
  const [messages, setMessages] = useState([]) // 대화 내역 저장
  const [inputValue, setInputValue] = useState("") // 입력창에 입력한 텍스트
  const [isLoading, setIsLoading] = useState(false) // AI가 답변 생성 중인지 확인
  const [isLoadingImages, setIsLoadingImages] = useState(false) // 이미지 로딩 중인지 확인
  const [selectedImage, setSelectedImage] = useState(null) // 선택된 이미지 (확대 표시용)
  const [likedImages, setLikedImages] = useState({}) // 좋아요한 이미지들 (imageUrl: likeId)
  const messagesEndRef = useRef(null) // 메시지 목록의 맨 끝을 가리키는 참조

  // 예시 질문들
  const examplePrompts = ["데이트 룩 추천하기", "회사 미팅용 코디", "편안한 주말 스타일", "특별한 날 옷차림"]

  // ========================================
  // 📜 자동 스크롤 기능
  // ========================================
  // 새 메시지가 추가될 때마다 자동으로 맨 아래로 스크롤
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" }) // 부드럽게 스크롤
    }
  }, [messages]) // messages가 바뀔 때마다 실행

  // ========================================
  // ❤️ 좋아요 추가 기능
  // ========================================
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

      if (response.ok) {
        const data = await response.json()
        setLikedImages((prev) => ({
          ...prev,
          [image.imageUrl]: data.data._id,
        }))
      } else {
        const error = await response.json()
        if (error.error !== "Image already liked") {
          console.error("좋아요 추가 실패:", error)
        }
      }
    } catch (error) {
      console.error("좋아요 추가 오류:", error)
    }
  }

  // ========================================
  // 💔 좋아요 취소 기능
  // ========================================
  const handleUnlike = async (imageUrl, likeId) => {
    try {
      const token = localStorage.getItem("jwt_token")
      const response = await fetch(`/api/likes/${likeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setLikedImages((prev) => {
          const newLikes = { ...prev }
          delete newLikes[imageUrl]
          return newLikes
        })
      }
    } catch (error) {
      console.error("좋아요 취소 오류:", error)
    }
  }

  // ========================================
  // 💬 예시 질문 클릭 처리
  // ========================================
  const handleExampleClick = async (prompt) => {
    setIsOpen(true) // 대화창 열기
    await sendMessage(prompt) // 질문 보내기
  }

  // ========================================
  // 📤 메시지 보내기
  // ========================================
  const sendMessage = async (message) => {
    if (!message.trim()) return // 빈 메시지는 보내지 않음

    // 사용자 메시지 추가
    const userMessage = { role: "user", content: message }
    setMessages((prev) => [...prev, userMessage]) // 기존 메시지에 추가
    setInputValue("") // 입력창 비우기
    setIsLoading(true) // 로딩 시작

    try {
      const token = localStorage.getItem("jwt_token")
      const response = await fetch("/api/ai-recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // JWT 토큰 추가
        },
        body: JSON.stringify({
          // 보낼 데이터
          message, // 사용자 질문
          weather: {
            // 날씨 정보
            temperature: weather?.temperature,
            condition: weather?.condition,
            humidity: weather?.humidity,
          },
        }),
      })

      const data = await response.json() // 응답을 JSON으로 변환
      
      // DALL-E 이미지 가져오기
      let images = []
      setIsLoadingImages(true)
      try {
        const imageResponse = await fetch(
          `/api/dalle?query=${encodeURIComponent(data.recommendation)}`,
          { timeout: 70000 }
        )
        if (imageResponse.ok) {
          const imageData = await imageResponse.json()
          images = imageData || []
          
          // 이미지를 백엔드에 저장 (히스토리 업데이트)
          if (images.length > 0 && data.historyId) {
            try {
              await fetch(`/api/fashion/history/${data.historyId}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ images }),
              })
            } catch (updateError) {
              console.error("히스토리 업데이트 오류:", updateError)
            }
          }
        } else {
          console.error("이미지 로드 실패:", imageResponse.status)
        }
      } catch (error) {
        console.error("이미지 로드 오류:", error.message)
      } finally {
        setIsLoadingImages(false)
      }
      
      // AI 응답 메시지 추가 (이미지 포함)
      const aiMessage = { 
        role: "assistant", 
        content: data.recommendation,
        images: images
      }
      setMessages((prev) => [...prev, aiMessage]) // 기존 메시지에 추가
    } catch (error) {
      // 오류 발생 시
      console.error("AI 추천 오류:", error)
      const errorMessage = {
        role: "assistant",
        content: "죄송합니다. 추천을 생성하는 중 오류가 발생했습니다.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false) // 로딩 끝
    }
  }

  // ========================================
  // 📝 폼 제출 처리
  // ========================================
  const handleSubmit = (e) => {
    e.preventDefault() // 페이지 새로고침 방지
    sendMessage(inputValue) // 입력한 메시지 보내기
  }

  // ========================================
  // 🎨 화면 그리기
  // ========================================
  return (
    <>
      {/* AI 추천 카드 */}
      <Card
        className={`${size === "large" ? "p-4" : "p-3"} cursor-pointer hover:shadow-lg transition-shadow`}
        onClick={() => setIsOpen(true)} // 클릭하면 대화창 열기
      >
        <div className="flex flex-col items-center text-center space-y-2">
          {/* AI 아이콘 */}
          <div
            className={`${
              size === "large" ? "w-12 h-12" : "w-10 h-10"
            } bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center`}
          >
            <SparklesIcon className={`${size === "large" ? "w-6 h-6" : "w-5 h-5"} text-purple-600`} />
          </div>

          {/* 제목과 설명 */}
          <div>
            <h3 className={`font-bold mb-1 ${size === "large" ? "text-base" : "text-sm"}`}>AI 맞춤 추천</h3>
            <p className={`text-muted-foreground leading-tight ${size === "large" ? "text-xs" : "text-[10px]"}`}>
              당신의 취향과 분위 아이템을 알려주시면,
              <br />
              AI가 개인 맞춤형 스타일을 추천해드려요
            </p>
          </div>

          {/* 예시 질문 버튼들 */}
          <div className={`grid grid-cols-2 gap-1.5 w-full`}>
            {examplePrompts.map((prompt, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation() // 카드 클릭 이벤트 막기
                  handleExampleClick(prompt) // 예시 질문 보내기
                }}
                className={`${size === "large" ? "text-xs h-8" : "text-[10px] h-7"} whitespace-nowrap px-2`}
              >
                {prompt}
              </Button>
            ))}
          </div>

          {/* AI와 대화 시작하기 버튼 */}
          <Button
            className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 ${
              size === "large" ? "h-9 text-sm" : "h-8 text-xs"
            }`}
          >
            <SparklesIcon className={`${size === "large" ? "w-4 h-4" : "w-3 h-3"} mr-1.5`} />
            AI와 대화 시작하기
          </Button>
        </div>
      </Card>

      {/* AI 대화창 (Dialog) */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-hidden">
          {/* 대화창 헤더 */}
          <DialogHeader className="pb-3">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <SparklesIcon className="w-5 h-5 text-purple-500" />
              AI 맞춤 추천
            </DialogTitle>
          </DialogHeader>

          {/* 대화 내역 */}
          <div className="space-y-3 mb-4 overflow-y-auto max-h-[400px] scrollbar-hide">
            {/* 각 메시지를 하나씩 표시 */}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground" // 사용자 메시지: 파란색
                      : "bg-secondary text-secondary-foreground" // AI 메시지: 회색
                  }`}
                >
                  {/* 사용자 메시지만 텍스트 표시, AI 메시지는 키워드 숨김 */}
                  {msg.role === "user" && (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}
                  
                  {/* AI 메시지에 이미지가 있으면 표시 */}
                  {msg.role === "assistant" && msg.images && msg.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {msg.images.map((image, imgIdx) => {
                        const isLiked = !!likedImages[image.imageUrl]
                        const likeId = likedImages[image.imageUrl]
                        
                        return (
                          <div key={imgIdx} className="relative aspect-[3/4] overflow-hidden rounded-md bg-gray-100">
                            <img
                              src={image.smallImageUrl || image.imageUrl}
                              alt={image.title || "패션 이미지"}
                              className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                              onClick={() => setSelectedImage(image)}
                              onError={(e) => {
                                e.target.src = '/placeholder.svg?height=400&width=300'
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
                  
                  {/* AI 메시지에 이미지가 없으면 로딩 메시지 표시 */}
                  {msg.role === "assistant" && (!msg.images || msg.images.length === 0) && (
                    <p className="text-sm text-muted-foreground">이미지를 불러오는 중...</p>
                  )}
                </div>
              </div>
            ))}
            {/* AI가 답변 생성 중일 때 */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground p-3 rounded-lg">
                  <p className="text-sm">AI가 생각 중...</p>
                  {isLoadingImages && <p className="text-xs mt-1 text-muted-foreground">이미지 검색 중...</p>}
                </div>
              </div>
            )}
            {/* 자동 스크롤을 위한 참조 지점 */}
            <div ref={messagesEndRef} />
          </div>

          {/* 메시지 입력 폼 */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue} // 입력한 텍스트
              onChange={(e) => setInputValue(e.target.value)} // 입력할 때마다 저장
              placeholder="원하는 스타일을 말해주세요..." // 안내 문구
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !inputValue.trim()}>
              {/* 로딩 중이거나 빈 텍스트면 비활성화 */}
              전송
            </Button>
          </form>
        </DialogContent>
      </Dialog>

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
    </>
  )
}
