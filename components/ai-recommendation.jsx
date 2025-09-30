"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Sparkles, User, Bot } from "lucide-react"

const WeatherData = {
  temperature: 0,
  condition: "",
  humidity: 0,
  windSpeed: 0,
  location: "",
}

const ChatMessage = {
  id: "",
  type: "",
  content: "",
  timestamp: new Date(),
}

const AIRecommendationProps = {
  weather: WeatherData,
}

export function AIRecommendation({ weather }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const generateAIResponse = (userInput) => {
    const responses = [
      `${weather.temperature}°C의 ${weather.condition} 날씨를 고려해서, "${userInput}"에 맞는 스타일을 추천드릴게요! 
      
      🎯 **맞춤 추천:**
      - 상의: 가벼운 니트 카디건 (베이지 톤)
      - 하의: 슬림핏 청바지 (다크 인디고)
      - 신발: 화이트 스니커즈
      - 액세서리: 미니멀한 시계, 크로스백
      
      💡 **스타일링 팁:**
      현재 날씨에는 레이어링이 중요해요. 카디건을 어깨에 걸치거나 허리에 묶어서 포인트를 줄 수 있어요!`,

      `"${userInput}"를 반영한 오늘의 코디를 제안해드려요!
      
      🌟 **AI 분석 결과:**
      - 날씨: ${weather.temperature}°C, ${weather.condition}
      - 추천 컬러: 어스톤 계열 (카키, 베이지, 브라운)
      - 핵심 아이템: 오버사이즈 셔츠, 와이드 팬츠
      
      📝 **코디 완성법:**
      1. 베이스: 화이트 기본 티셔츠
      2. 레이어: 오버사이즈 카키 셔츠 (단추 풀고 가디건처럼)
      3. 하의: 베이지 와이드 팬츠
      4. 포인트: 브라운 벨트, 캔버스 백`,
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(input),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 2000)
  }

  const quickQuestions = ["데이트 룩 추천", "회사 미팅용 코디", "편안한 주말 스타일", "특별한 날 옷차림"]

  if (!showChat) {
    return (
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">AI 맞춤 추천</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              당신의 취향과 보유 아이템을 알려주시면, AI가 개인 맞춤형 스타일을 추천해드려요
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((question) => (
              <Badge
                key={question}
                variant="secondary"
                className="cursor-pointer hover:bg-primary/10 p-2 text-xs"
                onClick={() => {
                  setInput(question)
                  setShowChat(true)
                }}
              >
                {question}
              </Badge>
            ))}
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => setShowChat(true)}>
            <Sparkles className="w-4 h-4 mr-2" />
            AI와 대화 시작하기
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">AI 스타일 어시스턴트</h3>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">안녕하세요! 어떤 스타일을 찾고 계신가요?</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex gap-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}
                >
                  {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    message.type === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-secondary p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="예: 데이트 룩 추천해줘, 내가 가진 검은 재킷 활용법..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {messages.length === 0 && (
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                className="text-xs h-8 bg-transparent"
                onClick={() => setInput(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
