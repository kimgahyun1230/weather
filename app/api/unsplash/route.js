import { NextResponse } from "next/server"

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || "demo-key"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || "fashion"
    const count = searchParams.get("count") || "9"

    console.log("[v0] Unsplash API 요청:", { query, count })

    // Unsplash API 호출
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&count=${count}&orientation=portrait`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      },
    )

    if (!response.ok) {
      console.error("[v0] Unsplash API 오류:", response.status, response.statusText)
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Unsplash API 응답:", data.length, "개 이미지")

    // 이미지 데이터 정리
    const images = data.map((photo, index) => ({
      id: photo.id || `unsplash-${index}`,
      title: photo.alt_description || photo.description || `Fashion Style ${index + 1}`,
      imageUrl: photo.urls.regular,
      smallImageUrl: photo.urls.small,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      unsplashUrl: photo.links.html,
    }))

    return NextResponse.json(images)
  } catch (error) {
    console.error("[v0] Unsplash API 처리 오류:", error)

    // 폴백 데이터 반환
    const fallbackImages = Array.from({ length: 9 }, (_, index) => ({
      id: `fallback-${index}`,
      title: `Fashion Style ${index + 1}`,
      imageUrl: `/placeholder.svg?height=400&width=300&query=fashion style ${index + 1}`,
      smallImageUrl: `/placeholder.svg?height=200&width=150&query=fashion style ${index + 1}`,
      photographer: "Fashion Designer",
      photographerUrl: "#",
      unsplashUrl: "#",
    }))

    return NextResponse.json(fallbackImages)
  }
}
