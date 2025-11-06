import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("imageUrl");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "이미지 URL이 필요합니다" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/likes/check?imageUrl=${encodeURIComponent(imageUrl)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "좋아요 확인에 실패했습니다" },
        { status: response.status }
      );
    }

    return NextResponse.json(data.data);
  } catch (error) {
    console.error("[Frontend API] 좋아요 확인 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
