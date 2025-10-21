import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { phoneNumber, password } = await request.json();

    console.log("[Frontend API] 로그인 시도:", phoneNumber);

    // 백엔드 API 호출
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("[Frontend API] 로그인 실패:", data.error);
      return NextResponse.json(
        { message: data.error || "로그인에 실패했습니다" },
        { status: response.status }
      );
    }

    console.log("[Frontend API] 로그인 성공");

    // 백엔드 응답 형식: { success: true, data: { user, token } }
    return NextResponse.json({
      token: data.data.token,
      user: {
        phoneNumber: data.data.user.phoneNumber,
      },
    });
  } catch (error) {
    console.error("[Frontend API] 로그인 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
