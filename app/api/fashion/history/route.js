import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    console.log("[Frontend API] 패션 히스토리 요청");

    // 백엔드 API 호출
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/fashion/history?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("[Frontend API] 히스토리 조회 실패:", data.error);
      return NextResponse.json(
        { error: data.error || "히스토리 조회에 실패했습니다" },
        { status: response.status }
      );
    }

    console.log(
      "[Frontend API] 히스토리 조회 성공:",
      data.data?.histories?.length,
      "개"
    );

    return NextResponse.json(data.data);
  } catch (error) {
    console.error("[Frontend API] 히스토리 API 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
