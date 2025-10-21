"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // JWT 토큰을 로컬 스토리지에 저장
        localStorage.setItem("jwt_token", data.token)
        localStorage.setItem("user_phone", phoneNumber)

        // 메인 페이지로 이동
        router.push("/")
      } else {
        setError(data.message || "로그인에 실패했습니다")
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Image src="/wtw-logo.png" alt="WTW Logo" width={200} height={120} className="object-contain" />
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">전화번호</label>
            <Input
              type="tel"
              placeholder="01012345678 (숫자만 입력)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">비밀번호</label>
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">계정이 없으신가요? </span>
            <button type="button" onClick={() => router.push("/signup")} className="text-primary hover:underline">
              회원가입
            </button>
          </div>
        </form>
      </Card>
    </main>
  )
}
