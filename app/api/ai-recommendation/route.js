export async function POST(request) {
  let message, weather, history

  try {
    const requestData = await request.json()
    message = requestData.message
    weather = requestData.weather
    history = requestData.history

    console.log("[v0] AI 패션 추천 요청:", message)
    console.log("[v0] 날씨 정보:", weather)

    const recommendation = await generateOpenAIRecommendation(message, weather, history)

    console.log("[v0] OpenAI 패션 추천 생성 완료:", recommendation.substring(0, 50) + "...")

    return Response.json({
      recommendation: recommendation,
    })
  } catch (error) {
    console.error("[v0] AI 패션 추천 API 오류:", error)

    // 폴백: OpenAI 실패시 스마트 추천 시스템 사용
    const fallbackRecommendation = await generateSmartRecommendation(message, weather, history)

    return Response.json({
      recommendation: fallbackRecommendation,
    })
  }
}

async function generateOpenAIRecommendation(message, weather, history) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.log("[v0] OPENAI_API_KEY가 설정되지 않음, 스마트 추천 시스템 사용")
    return await generateSmartRecommendation(message, weather, history)
  }

  const temp = weather?.temperature || 20
  const condition = weather?.condition || "맑음"
  const humidity = weather?.humidity || 50
  const windSpeed = weather?.windSpeed || 0
  const location = weather?.location || "현재 위치"
  const minTemp = weather?.minTemp || temp
  const maxTemp = weather?.maxTemp || temp

  // 패션 전문가 시스템 프롬프트
  const systemPrompt = `당신은 전문 패션 스타일리스트입니다. 날씨 정보와 사용자의 요청을 바탕으로 개인화된 패션 조언을 제공해주세요.

현재 날씨 정보:
- 위치: ${location}
- 온도: ${temp}°C (최저 ${minTemp}°C, 최고 ${maxTemp}°C)
- 날씨 상태: ${condition}
- 습도: ${humidity}%
- 풍속: ${windSpeed}km/h

조언 가이드라인:
1. 날씨에 적합한 옷차림 추천
2. 사용자의 구체적인 요청 (색상, 스타일, 상황) 반영
3. 실용적이고 구체적인 아이템 제안
4. 한국어로 친근하고 자연스럽게 답변
5. 이모지 적절히 사용하여 친근함 표현
6. 200자 내외로 간결하게 답변

특별 고려사항:
- 일교차가 큰 경우 레이어링 조언
- 비나 바람 등 특수 날씨 조건 고려
- 상황별 (데이트, 업무, 캐주얼) 맞춤 조언`

  const userMessage = `사용자 요청: ${message}`

  try {
    console.log("[v0] OpenAI API 호출 시작")

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] OpenAI API 오류:", response.status, errorData)
      throw new Error(`OpenAI API 오류: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] OpenAI API 응답 성공")

    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error("[v0] OpenAI API 호출 실패:", error)
    throw error
  }
}

// 폴백용 스마트 추천 시스템 (기존 코드 유지)
async function generateSmartRecommendation(message, weather, history) {
  console.log("[v0] 스마트 추천 시스템 사용")

  const temp = weather?.temperature || 20
  const condition = weather?.condition || "맑음"
  const humidity = weather?.humidity || 50
  const windSpeed = weather?.windSpeed || 0
  const location = weather?.location || "현재 위치"
  const minTemp = weather?.minTemp || temp
  const maxTemp = weather?.maxTemp || temp

  // 사용자 요청 분석
  const request = analyzeUserRequest(message.toLowerCase())

  // 날씨 기반 기본 추천
  const weatherAdvice = getWeatherBasedAdvice(temp, condition, humidity, windSpeed)

  // 요청별 맞춤 추천
  const customAdvice = getCustomAdvice(request, temp, condition)

  // 최종 추천 생성
  return generatePersonalizedResponse(location, temp, minTemp, maxTemp, condition, weatherAdvice, customAdvice, request)
}

function analyzeUserRequest(message) {
  const request = {
    occasion: "casual",
    colors: [],
    items: [],
    style: "casual",
    concerns: [],
    specificQuestion: null, // 구체적인 질문 유형 추가
  }

  if (message.includes("신발") || message.includes("구두") || message.includes("부츠") || message.includes("운동화")) {
    request.specificQuestion = "shoes"
    if (message.includes("비") || message.includes("우천") || message.includes("장마")) {
      request.concerns.push("rain")
    }
  } else if (message.includes("가방") || message.includes("백")) {
    request.specificQuestion = "bag"
  } else if (message.includes("액세서리") || message.includes("목걸이") || message.includes("귀걸이")) {
    request.specificQuestion = "accessory"
  } else if (message.includes("헤어") || message.includes("머리") || message.includes("헤어스타일")) {
    request.specificQuestion = "hair"
  } else if (message.includes("메이크업") || message.includes("화장")) {
    request.specificQuestion = "makeup"
  }

  // 상황/목적 분석
  if (message.includes("데이트") || message.includes("소개팅")) {
    request.occasion = "date"
  } else if (
    message.includes("회사") ||
    message.includes("직장") ||
    message.includes("업무") ||
    message.includes("면접")
  ) {
    request.occasion = "work"
  } else if (message.includes("운동") || message.includes("헬스") || message.includes("조깅")) {
    request.occasion = "workout"
  } else if (message.includes("파티") || message.includes("모임") || message.includes("약속")) {
    request.occasion = "party"
  } else if (message.includes("여행") || message.includes("나들이")) {
    request.occasion = "travel"
  }

  // 색상 분석
  const colors = [
    "검은색",
    "검정",
    "흰색",
    "하얀색",
    "빨간색",
    "파란색",
    "노란색",
    "초록색",
    "회색",
    "베이지",
    "핑크",
    "보라색",
    "갈색",
    "카키",
    "네이비",
  ]
  colors.forEach((color) => {
    if (message.includes(color)) {
      request.colors.push(color)
    }
  })

  const items = [
    "원피스",
    "치마",
    "바지",
    "청바지",
    "셔츠",
    "블라우스",
    "니트",
    "가디건",
    "자켓",
    "코트",
    "부츠",
    "운동화",
    "구두",
    "신발",
    "샌들",
    "슬리퍼",
    "하이힐",
    "로퍼",
    "스니커즈",
    "가방",
    "백팩",
    "토트백",
    "크로스백",
  ]
  items.forEach((item) => {
    if (message.includes(item)) {
      request.items.push(item)
    }
  })

  // 스타일 분석
  if (message.includes("캐주얼") || message.includes("편안")) {
    request.style = "casual"
  } else if (message.includes("포멀") || message.includes("정장")) {
    request.style = "formal"
  } else if (message.includes("스트릿") || message.includes("힙합")) {
    request.style = "street"
  } else if (message.includes("페미닌") || message.includes("여성스러운")) {
    request.style = "feminine"
  } else if (message.includes("미니멀") || message.includes("심플")) {
    request.style = "minimal"
  }

  // 고민사항 분석
  if (message.includes("추워") || message.includes("춥")) {
    request.concerns.push("cold")
  } else if (message.includes("더워") || message.includes("덥")) {
    request.concerns.push("hot")
  }
  if (message.includes("비") || message.includes("우산") || message.includes("장마") || message.includes("우천")) {
    request.concerns.push("rain")
  }
  if (message.includes("바람") || message.includes("강풍")) {
    request.concerns.push("wind")
  }

  return request
}

function getWeatherBasedAdvice(temp, condition, humidity, windSpeed) {
  const advice = {
    layers: [],
    materials: [],
    accessories: [],
    tips: [],
  }

  // 온도별 레이어링
  if (temp < 5) {
    advice.layers = ["패딩", "두꺼운 코트", "니트", "목도리"]
    advice.materials = ["울", "플리스", "다운"]
    advice.accessories = ["장갑", "모자", "따뜻한 부츠"]
  } else if (temp < 10) {
    advice.layers = ["코트", "자켓", "가디건", "긴팔"]
    advice.materials = ["울", "코튼", "폴리에스터"]
    advice.accessories = ["목도리", "부츠"]
  } else if (temp < 15) {
    advice.layers = ["자켓", "가디건", "긴팔", "얇은 니트"]
    advice.materials = ["코튼", "린넨", "니트"]
    advice.accessories = ["가벼운 스카프"]
  } else if (temp < 20) {
    advice.layers = ["가디건", "얇은 자켓", "긴팔"]
    advice.materials = ["코튼", "린넨"]
    advice.accessories = ["가벼운 겉옷"]
  } else if (temp < 25) {
    advice.layers = ["긴팔", "얇은 블라우스"]
    advice.materials = ["코튼", "린넨", "실크"]
    advice.accessories = []
  } else if (temp < 30) {
    advice.layers = ["반팔", "민소매", "얇은 원피스"]
    advice.materials = ["린넨", "코튼", "시폰"]
    advice.accessories = ["모자", "선글라스"]
  } else {
    advice.layers = ["민소매", "반팔", "반바지"]
    advice.materials = ["린넨", "메시", "통기성 좋은 소재"]
    advice.accessories = ["모자", "선글라스", "부채"]
  }

  // 날씨 상태별 조언
  if (condition.includes("rain") || condition.includes("비")) {
    advice.tips.push("우산이나 레인코트 준비")
    advice.accessories.push("방수 신발")
  }
  if (windSpeed > 15) {
    advice.tips.push("바람에 날리지 않는 옷 선택")
  }
  if (humidity > 70) {
    advice.tips.push("통기성 좋은 소재 선택")
  }

  return advice
}

function getCustomAdvice(request, temp, condition) {
  const advice = {
    outfit: [],
    colors: [],
    styling: [],
    items: [],
  }

  // 상황별 조언
  switch (request.occasion) {
    case "date":
      advice.outfit = ["원피스", "블라우스+치마", "니트+슬랙스"]
      advice.colors = ["파스텔톤", "화이트", "베이지", "네이비"]
      advice.styling = ["여성스럽고 우아한 느낌", "액세서리로 포인트", "편안하면서도 세련된"]
      break
    case "work":
      advice.outfit = ["블라우스+슬랙스", "셔츠+정장바지", "원피스+자켓"]
      advice.colors = ["네이비", "그레이", "화이트", "베이지"]
      advice.styling = ["깔끔하고 전문적인", "과하지 않은 액세서리", "편안한 구두"]
      break
    case "workout":
      advice.outfit = ["운동복", "레깅스+탑", "트레이닝복"]
      advice.colors = ["다크톤", "스포티한 컬러"]
      advice.styling = ["움직임이 편한", "땀 흡수 잘되는 소재", "운동화"]
      break
    case "party":
      advice.outfit = ["드레스", "블라우스+스커트", "세련된 원피스"]
      advice.colors = ["블랙", "와인", "네이비", "골드 포인트"]
      advice.styling = ["화려한 액세서리", "하이힐", "메이크업 포인트"]
      break
    case "travel":
      advice.outfit = ["편안한 바지", "레이어링 가능한 상의", "편한 신발"]
      advice.colors = ["실용적인 다크톤", "더러움이 덜 보이는 색"]
      advice.styling = ["편안함 우선", "가벼운 소재", "활동성 좋은"]
      break
  }

  // 색상 요청 반영
  if (request.colors.length > 0) {
    advice.colors = request.colors
  }

  // 아이템 요청 반영
  if (request.items.length > 0) {
    advice.items = request.items
  }

  // 스타일별 조언
  switch (request.style) {
    case "formal":
      advice.styling.push("정장 스타일", "깔끔한 라인")
      break
    case "street":
      advice.styling.push("캐주얼하고 트렌디한", "스니커즈", "레이어링")
      break
    case "feminine":
      advice.styling.push("여성스러운 실루엣", "플로럴 패턴", "소프트한 컬러")
      break
    case "minimal":
      advice.styling.push("심플하고 깔끔한", "베이직 아이템", "무채색 활용")
      break
  }

  return advice
}

function generatePersonalizedResponse(
  location,
  temp,
  minTemp,
  maxTemp,
  condition,
  weatherAdvice,
  customAdvice,
  request,
) {
  if (request.specificQuestion === "shoes") {
    let response = `${location}에서 ${temp}°C 날씨에 신발 추천드릴게요! 👠\n\n`

    if (request.concerns.includes("rain")) {
      response += "비 오는 날에는 방수 기능이 있는 신발이 필수예요! 🌧️\n"
      response += "• 레인부츠나 방수 처리된 부츠\n"
      response += "• 고무창이 두꺼운 운동화\n"
      response += "• 가죽 소재보다는 합성소재 신발\n"
      response += "• 굽이 낮고 미끄럼 방지 기능이 있는 신발\n\n"
      response += "발목까지 오는 부츠를 신으면 물이 들어가는 것도 막을 수 있어요! 💧"
    } else {
      // 온도별 신발 추천
      if (temp < 10) {
        response += "추운 날씨에는 따뜻한 신발이 좋겠어요! ❄️\n"
        response += "• 털 안감이 있는 부츠\n"
        response += "• 방한 기능이 있는 운동화\n"
        response += "• 두꺼운 양말과 함께 착용할 수 있는 여유 있는 사이즈"
      } else if (temp < 20) {
        response += "선선한 날씨에 딱 맞는 신발들이에요! 🍂\n"
        response += "• 가죽 부츠나 앵클부츠\n"
        response += "• 캔버스 스니커즈\n"
        response += "• 로퍼나 옥스포드 구두"
      } else if (temp < 28) {
        response += "따뜻한 날씨에 편안한 신발 추천해요! ☀️\n"
        response += "• 통기성 좋은 운동화\n"
        response += "• 가벼운 플랫슈즈\n"
        response += "• 메시 소재 스니커즈"
      } else {
        response += "더운 날씨에는 시원한 신발이 최고예요! 🌞\n"
        response += "• 샌들이나 슬리퍼\n"
        response += "• 통풍이 잘 되는 캔버스 신발\n"
        response += "• 가벼운 소재의 운동화"
      }
    }

    return response
  }

  let response = `${location}에서 ${temp}°C`

  // 온도 표현
  if (temp < 10) {
    response += " 쌀쌀한 날씨네요! 🥶 "
  } else if (temp < 20) {
    response += " 선선한 날씨예요! 🍂 "
  } else if (temp < 28) {
    response += " 따뜻한 날씨네요! ☀️ "
  } else {
    response += " 더운 날씨예요! 🌞 "
  }

  // 상황별 맞춤 조언
  if (request.occasion === "date") {
    response += "데이트룩으로는 "
    if (customAdvice.outfit.length > 0) {
      response += `${customAdvice.outfit[0]}이나 ${customAdvice.outfit[1]} 조합이 좋겠어요. `
    }
  } else if (request.occasion === "work") {
    response += "업무용으로는 "
    if (customAdvice.outfit.length > 0) {
      response += `${customAdvice.outfit[0]} 같은 깔끔한 스타일을 추천해요. `
    }
  }

  // 색상 조언
  if (request.colors.length > 0) {
    response += `${request.colors[0]} 계열로 `
  } else if (customAdvice.colors.length > 0) {
    response += `${customAdvice.colors[0]}이나 ${customAdvice.colors[1]} 컬러로 `
  }

  // 날씨 기반 레이어링 조언
  if (weatherAdvice.layers.length > 0) {
    response += `${weatherAdvice.layers[0]}이나 ${weatherAdvice.layers[1]}으로 레이어링하시고, `
  }

  // 소재 조언
  if (weatherAdvice.materials.length > 0) {
    response += `${weatherAdvice.materials[0]} 소재를 선택하세요. `
  }

  // 액세서리 조언
  if (weatherAdvice.accessories.length > 0) {
    response += `${weatherAdvice.accessories[0]}`
    if (weatherAdvice.accessories.length > 1) {
      response += `와 ${weatherAdvice.accessories[1]}`
    }
    response += "도 잊지 마세요! "
  }

  // 특별 팁
  if (weatherAdvice.tips.length > 0) {
    response += `${weatherAdvice.tips[0]}하시는 것도 좋겠어요. `
  }

  // 온도 변화 조언
  const tempDiff = maxTemp - minTemp
  if (tempDiff > 8) {
    response += "일교차가 크니 겉옷을 준비하세요! "
  }

  // 이모지 추가
  const emojis = ["✨", "💫", "🌟", "👗", "👔", "👕", "🧥"]
  response += emojis[Math.floor(Math.random() * emojis.length)]

  return response
}
