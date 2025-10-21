import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "fashion";
    const count = searchParams.get("count") || "9";

    console.log("[Frontend API] Unsplash API 요청:", { query, count });

    // 백엔드 API 호출
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/external/unsplash?query=${encodeURIComponent(query)}&count=${count}`
    );

    if (!response.ok) {
      console.error(
        "[Frontend API] Unsplash API 오류:",
        response.status,
        response.statusText
      );
      throw new Error(`Backend Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      "[Frontend API] 백엔드 Unsplash 응답:",
      data.data?.length,
      "개 이미지"
    );

    // 백엔드 응답 형식: { success: true, data: [...] }
    return NextResponse.json(data.data);
  } catch (error) {
    console.error("[Frontend API] Unsplash API 처리 오류:", error);

    // 폴백 데이터 반환
    const fallbackImages = Array.from({ length: 9 }, (_, index) => ({
      id: `fallback-${index}`,
      title: `Fashion Style ${index + 1}`,
      imageUrl: `/placeholder.svg?height=400&width=300&query=fashion style ${
        index + 1
      }`,
      smallImageUrl: `/placeholder.svg?height=200&width=150&query=fashion style ${
        index + 1
      }`,
      photographer: "Fashion Designer",
      photographerUrl: "#",
      unsplashUrl: "#",
    }));

    return NextResponse.json(fallbackImages);
  }
}
