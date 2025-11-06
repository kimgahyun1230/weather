import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query =
      searchParams.get("query") ||
      "A Korean woman in her twenties wearing casual outfit. Full body photo, plain white background.";

    console.log("[Frontend API] DALL-E API 요청:", { query });

    // 백엔드 API 호출
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/external/dalle?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      console.error(
        "[Frontend API] DALL-E API 오류:",
        response.status,
        response.statusText
      );
      throw new Error(`Backend DALL-E API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      "[Frontend API] 백엔드 DALL-E 응답:",
      data.data?.length,
      "개 이미지"
    );

    // 백엔드 응답 형식: { success: true, data: [...] }
    return NextResponse.json(data.data);
  } catch (error) {
    console.error("[Frontend API] DALL-E API 처리 오류:", error);

    // 폴백 데이터 반환
    const fallbackImages = Array.from({ length: 2 }, (_, index) => ({
      id: `fallback-${index}`,
      title: `Fashion Style ${index + 1}`,
      imageUrl: `/placeholder.svg?height=400&width=300&query=fashion style ${
        index + 1
      }`,
      smallImageUrl: `/placeholder.svg?height=200&width=150&query=fashion style ${
        index + 1
      }`,
      photographer: "AI Generated",
      photographerUrl: "#",
      unsplashUrl: "#",
    }));

    return NextResponse.json(fallbackImages);
  }
}
