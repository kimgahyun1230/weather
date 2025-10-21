import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const requestData = await request.json();
    const { message, weather, history } = requestData;

    console.log("[Frontend API] AI 패션 추천 요청:", message);
    console.log("[Frontend API] 날씨 정보:", weather);

    // localStorage에서 토큰 가져오기 (클라이언트에서 전달됨)
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    // 백엔드 API 호출
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/fashion/recommendation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, weather }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("[Frontend API] AI 추천 실패:", data.error);
      return NextResponse.json(
        { error: data.error || "AI 추천에 실패했습니다" },
        { status: response.status }
      );
    }

    console.log("[Frontend API] AI 추천 성공");

    // 백엔드 응답 형식: { success: true, data: { recommendation, historyId } }
    return NextResponse.json({
      recommendation: data.data.recommendation,
      historyId: data.data.historyId,
    });
  } catch (error) {
    console.error("[Frontend API] AI 추천 API 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
