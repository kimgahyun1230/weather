import { NextResponse } from "next/server";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  console.log("[Frontend API] 날씨 API 요청:", { lat, lon });

  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const latitude = lat || "37.5665";
    const longitude = lon || "126.9780";

    // 백엔드 API 호출
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/weather?lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Backend weather API request failed");
    }

    const data = await response.json();
    console.log("[Frontend API] 백엔드 날씨 응답:", data);

    // 백엔드 응답 형식: { success: true, data: {...} }
    return NextResponse.json(data.data);
  } catch (error) {
    console.error("[Frontend API] 날씨 API 오류:", error);

    // Fallback data
    const fallbackData = {
      temperature: 22,
      minTemp: 18,
      maxTemp: 28,
      condition: "sunny",
      humidity: 65,
      windSpeed: 8,
      location: "현재 위치",
      temperatureDiff: 10,
    };

    return NextResponse.json(fallbackData);
  }
}
