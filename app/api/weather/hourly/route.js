import { NextResponse } from "next/server";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  console.log("[Frontend API] 시간대별 날씨 API 요청:", { lat, lon });

  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const latitude = lat || "37.5665";
    const longitude = lon || "126.9780";

    // 백엔드 API 호출
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/weather/hourly?lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Backend hourly weather API request failed");
    }

    const data = await response.json();
    console.log("[Frontend API] 백엔드 시간대별 날씨 응답:", data);

    // 백엔드 응답 형식: { success: true, data: { hourly: [...] } }
    return NextResponse.json({ hourly: data.data.hourly });
  } catch (error) {
    console.error("[Frontend API] 시간대별 날씨 API 오류:", error);

    // Fallback data
    const hourlyData = [];
    const now = new Date();

    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000);
      hourlyData.push({
        time: time.toISOString(),
        hour: time.getHours(),
        temperature: Math.floor(Math.random() * 15) + 15,
        condition: "sunny",
        humidity: 60,
        windSpeed: 5,
        precipitation: 0,
      });
    }

    return NextResponse.json({ hourly: hourlyData });
  }
}
