import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { phoneNumber, password } = await request.json();

    console.log("[Frontend API] 회원가입 시도:", phoneNumber);

    // 백엔드 API 호출
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("[Frontend API] 회원가입 실패:", data.error);
      return NextResponse.json(
        { message: data.error || "회원가입에 실패했습니다" },
        { status: response.status }
      );
    }

    console.log("[Frontend API] 회원가입 성공");

    // 백엔드 응답 형식: { success: true, data: { user, token } }
    return NextResponse.json({
      message: "회원가입이 완료되었습니다",
      user: {
        phoneNumber: data.data.user.phoneNumber,
      },
    });
  } catch (error) {
    console.error("[Frontend API] 회원가입 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
