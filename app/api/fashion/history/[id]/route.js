import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    console.log("[Frontend API] 히스토리 업데이트 요청:", id);

    // 백엔드 API 호출
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/fashion/history/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("[Frontend API] 히스토리 업데이트 실패:", data.error);
      return NextResponse.json(
        { error: data.error || "히스토리 업데이트에 실패했습니다" },
        { status: response.status }
      );
    }

    console.log("[Frontend API] 히스토리 업데이트 성공");

    return NextResponse.json(data.data);
  } catch (error) {
    console.error("[Frontend API] 히스토리 업데이트 API 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
