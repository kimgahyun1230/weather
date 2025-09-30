"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, Sparkles, Lightbulb } from "lucide-react"

export function FloatingAIChat({ weather }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `안녕하세요! 👋\n AI 패션 어시스턴트입니다.\n\n오늘 ${weather.location}의 날씨는 ${weather.temperature}°C입니다.\n\n어떤 스타일의 패션 추천을 원하시나요?`,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    console.log("[v0] AI 채팅 메시지 전송 시작:", input)
    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      console.log("[v0] AI 추천 API 호출 중...")
      const response = await fetch("/api/ai-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          weather: weather,
          history: messages,
        }),
      })

      console.log("[v0] AI 추천 API 응답 상태:", response.status)
      const data = await response.json()
      console.log("[v0] AI 추천 API 응답 데이터:", data)

      setMessages((prev) => [...prev, { role: "assistant", content: data.recommendation }])
      console.log("[v0] AI 채팅 메시지 추가 완료")
    } catch (error) {
      console.error("[v0] AI 추천 오류:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요." },
      ])
    } finally {
      setIsLoading(false)
      console.log("[v0] AI 채팅 로딩 완료")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickSuggestions = ["오늘 데이트룩 추천해줘", "면접용 정장 코디", "캐주얼 주말 룩", "비 오는 날 신발"]

  const handleQuickSuggestion = (suggestion) => {
    console.log("[v0] 빠른 제안 선택:", suggestion)
    setInput(suggestion)
  }

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Pulsing ring animation */}
          <div className="absolute inset-0 w-14 h-14 bg-primary/30 rounded-full animate-ping" />
          <Button
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-full shadow-xl z-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-2 border-white"
            size="icon"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </Button>
          {/* Tooltip */}
          <div className="absolute bottom-16 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            AI 패션 추천 💫
          </div>
        </div>
      )}

      {/* 채팅 모달 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
          {/* 배경 오버레이 */}
          <div className="absolute inset-0 bg-black/20" onClick={() => setIsOpen(false)} />

          {/* 채팅 창 */}
          <Card className="relative w-full max-w-md h-[75vh] flex flex-col bg-background border shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI 패션 어시스턴트</h3>
                  <p className="text-xs text-white/80 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    온라인
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* 메시지 영역 */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md"
                          : "bg-muted rounded-bl-md"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-2xl rounded-bl-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <div className="flex items-center gap-1 mb-2">
                  <Lightbulb className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">빠른 질문:</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 justify-start bg-transparent"
                      onClick={() => handleQuickSuggestion(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* 입력 영역 */}
            <div className="p-4 border-t bg-muted/30">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="패션 고민을 말씀해주세요..."
                  className="flex-1 border-0 bg-background"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
