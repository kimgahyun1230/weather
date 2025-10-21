"use client"

import { Card } from "@/components/ui/card"

// SVG 아이콘 컴포넌트들
const ShirtIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const PantsIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 3v3a2 2 0 01-2 2H4m16-5v3a2 2 0 002 2h2M8 3h8M8 3L6 21m10-18l2 18M6 21h4m4 0h4"
    />
  </svg>
)

const FootprintsIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
    />
  </svg>
)

const WatchIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="7" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3l2 2" />
  </svg>
)

export function FashionRecommendation({ weather, selectedStyle }) {
  // ========================================
  // 📦 받아온 데이터 (Props)
  // ========================================
  // weather: 날씨 정보 (온도, 날씨 상태 등)
  // selectedStyle: 선택한 스타일 (캐주얼, 포멀, 스트릿, 랜덤)

  // ========================================
  // 🎯 날씨와 스타일에 맞는 옷 추천하기
  // ========================================
  const getDetailedRecommendation = () => {
    // 현재 온도 가져오기 (없으면 기본값 20도)
    const temp = weather?.temperature || 20
    // 선택한 스타일 가져오기 (없으면 기본값 캐주얼)
    const style = selectedStyle || "casual"
    // 비가 오는지 확인
    const isRainy = weather?.condition === "rainy"

    // ========================================
    // 📚 모든 추천 데이터
    // ========================================
    // 각 스타일별, 온도별로 추천할 옷들을 저장
    const recommendations = {
      casual: {
        hot: {
          top: { name: "반팔 티셔츠", color: "화이트", material: "코튼", reason: "통풍이 잘 되어 시원해요" },
          bottom: { name: "반바지", color: "베이지", material: "린넨", reason: "가볍고 편안한 착용감이에요" },
          shoes: { name: "슬리퍼", color: "브라운", material: "가죽", reason: "발이 편하고 시원해요" },
          accessory: { name: "선글라스", color: "블랙", material: "플라스틱", reason: "강한 햇빛을 차단해요" },
        },
        warm: {
          top: { name: "얇은 가디건", color: "그레이", material: "코튼", reason: "적당한 온도에 편안해요" },
          bottom: { name: "청바지", color: "블루", material: "데님", reason: "casual 스타일에 잘 어울려요" },
          shoes: { name: "스니커즈", color: "화이트", material: "캔버스", reason: "편안하고 활동적이에요" },
          accessory: { name: "크로스백", color: "블랙", material: "나일론", reason: "실용적이고 스타일리시해요" },
        },
        mild: {
          top: { name: "긴팔 T셔츠", color: "그레이", material: "코튼", reason: "적당한 온도에 편안해요" },
          bottom: {
            name: "스커트",
            color: "블랙",
            material: "울",
            reason: isRainy ? "방수 처리되어 비에 적합해요" : "casual 스타일에 알맞게 어울려요",
          },
          shoes: {
            name: "힐",
            color: "브라운",
            material: "가죽",
            reason: isRainy ? "방수 기능이 있어 비에 적합해요" : "세련된 느낌을 줘요",
          },
          accessory: {
            name: isRainy ? "우산" : "백팩",
            color: "베이지",
            material: isRainy ? "폴리에스터" : "나일론",
            reason: isRainy ? "비로부터 옷을 보호해요" : "실용적이고 편리해요",
          },
        },
        cool: {
          top: { name: "후드티", color: "네이비", material: "코튼", reason: "따뜻하고 편안해요" },
          bottom: { name: "청바지", color: "블루", material: "데님", reason: "보온성이 좋아요" },
          shoes: { name: "운동화", color: "블랙", material: "합성섬유", reason: "활동하기 편해요" },
          accessory: { name: "비니", color: "그레이", material: "울", reason: "머리를 따뜻하게 해줘요" },
        },
        cold: {
          top: { name: "패딩", color: "블랙", material: "나일론", reason: "추운 날씨에 최적이에요" },
          bottom: { name: "기모 바지", color: "그레이", material: "폴리에스터", reason: "보온성이 뛰어나요" },
          shoes: { name: "부츠", color: "브라운", material: "가죽", reason: "발을 따뜻하게 보호해요" },
          accessory: { name: "목도리", color: "베이지", material: "울", reason: "목을 따뜻하게 해줘요" },
        },
      },
      formal: {
        hot: {
          top: { name: "린넨 셔츠", color: "화이트", material: "린넨", reason: "시원하고 격식있어요" },
          bottom: { name: "슬랙스", color: "베이지", material: "린넨", reason: "가볍고 포멀해요" },
          shoes: { name: "로퍼", color: "브라운", material: "가죽", reason: "편안하면서 격식있어요" },
          accessory: { name: "가죽 서류가방", color: "브라운", material: "가죽", reason: "전문적인 이미지를 줘요" },
        },
        warm: {
          top: { name: "얇은 블레이저", color: "네이비", material: "울", reason: "세련되고 격식있어요" },
          bottom: { name: "면바지", color: "그레이", material: "코튼", reason: "편안하면서 포멀해요" },
          shoes: { name: "구두", color: "블랙", material: "가죽", reason: "격식있는 자리에 적합해요" },
          accessory: { name: "시계", color: "실버", material: "메탈", reason: "세련된 포인트가 돼요" },
        },
        mild: {
          top: { name: "니트", color: "그레이", material: "울", reason: "따뜻하고 단정해요" },
          bottom: { name: "슬랙스", color: "블랙", material: "울", reason: "포멀한 분위기를 연출해요" },
          shoes: { name: "옥스포드", color: "블랙", material: "가죽", reason: "클래식하고 격식있어요" },
          accessory: { name: "벨트", color: "블랙", material: "가죽", reason: "전체적인 룩을 완성해요" },
        },
        cool: {
          top: { name: "코트", color: "카멜", material: "울", reason: "따뜻하고 우아해요" },
          bottom: { name: "정장 바지", color: "그레이", material: "울", reason: "격식있고 보온성이 좋아요" },
          shoes: { name: "구두", color: "블랙", material: "가죽", reason: "포멀한 자리에 완벽해요" },
          accessory: { name: "머플러", color: "네이비", material: "캐시미어", reason: "고급스럽고 따뜻해요" },
        },
        cold: {
          top: { name: "울 코트", color: "블랙", material: "울", reason: "추위를 막아주고 격식있어요" },
          bottom: { name: "두꺼운 슬랙스", color: "차콜", material: "울", reason: "보온성과 격식을 모두 갖췄어요" },
          shoes: { name: "부츠", color: "블랙", material: "가죽", reason: "따뜻하고 세련돼요" },
          accessory: { name: "장갑", color: "블랙", material: "가죽", reason: "손을 따뜻하게 보호해요" },
        },
      },
      street: {
        hot: {
          top: { name: "오버핏 티셔츠", color: "화이트", material: "코튼", reason: "힙하고 시원해요" },
          bottom: { name: "와이드 팬츠", color: "블랙", material: "데님", reason: "트렌디하고 편안해요" },
          shoes: { name: "슬라이드", color: "블랙", material: "러버", reason: "편하고 스타일리시해요" },
          accessory: { name: "버킷햇", color: "베이지", material: "코튼", reason: "햇빛을 막고 포인트가 돼요" },
        },
        warm: {
          top: { name: "후드집업", color: "그레이", material: "코튼", reason: "레이어드하기 좋아요" },
          bottom: { name: "배기 진", color: "블루", material: "데님", reason: "트렌디하고 편안해요" },
          shoes: { name: "청키 스니커즈", color: "화이트", material: "가죽", reason: "스트릿 감성을 살려줘요" },
          accessory: { name: "크로스백", color: "블랙", material: "나일론", reason: "실용적이고 힙해요" },
        },
        mild: {
          top: { name: "맨투맨", color: "블랙", material: "코튼", reason: "편안하고 스타일리시해요" },
          bottom: { name: "카고 팬츠", color: "올리브", material: "코튼", reason: "유틸리티 감성이 살아요" },
          shoes: { name: "하이탑", color: "블랙", material: "캔버스", reason: "스트릿 무드를 완성해요" },
          accessory: { name: "비니", color: "블랙", material: "울", reason: "힙한 포인트가 돼요" },
        },
        cool: {
          top: { name: "야상", color: "카키", material: "나일론", reason: "따뜻하고 스타일리시해요" },
          bottom: { name: "청바지", color: "블루", material: "데님", reason: "어떤 스타일에도 잘 어울려요" },
          shoes: { name: "워커", color: "블랙", material: "가죽", reason: "튼튼하고 멋있어요" },
          accessory: { name: "체인 목걸이", color: "실버", material: "메탈", reason: "개성있는 포인트가 돼요" },
        },
        cold: {
          top: { name: "롱패딩", color: "블랙", material: "나일론", reason: "따뜻하고 트렌디해요" },
          bottom: { name: "기모 팬츠", color: "블랙", material: "폴리에스터", reason: "보온성이 뛰어나요" },
          shoes: { name: "부츠", color: "블랙", material: "가죽", reason: "따뜻하고 스타일리시해요" },
          accessory: { name: "마스크", color: "블랙", material: "코튼", reason: "얼굴을 따뜻하게 해줘요" },
        },
      },
      feminine: {
        hot: {
          top: { name: "블라우스", color: "화이트", material: "실크", reason: "시원하고 우아해요" },
          bottom: { name: "플레어 스커트", color: "핑크", material: "쉬폰", reason: "여성스럽고 가벼워요" },
          shoes: { name: "샌들", color: "베이지", material: "가죽", reason: "시원하고 예뻐요" },
          accessory: { name: "선글라스", color: "핑크", material: "플라스틱", reason: "귀엽고 실용적이에요" },
        },
        warm: {
          top: { name: "니트 가디건", color: "베이지", material: "울", reason: "부드럽고 따뜻해요" },
          bottom: { name: "플리츠 스커트", color: "화이트", material: "폴리에스터", reason: "우아하고 여성스러워요" },
          shoes: { name: "메리제인", color: "블랙", material: "가죽", reason: "클래식하고 예뻐요" },
          accessory: { name: "리본 헤어핀", color: "핑크", material: "새틴", reason: "귀엽고 포인트가 돼요" },
        },
        mild: {
          top: { name: "블라우스", color: "화이트", material: "코튼", reason: "깔끔하고 여성스러워요" },
          bottom: { name: "미디 스커트", color: "베이지", material: "울", reason: "우아하고 따뜻해요" },
          shoes: { name: "발레 플랫", color: "핑크", material: "가죽", reason: "편하고 예뻐요" },
          accessory: { name: "진주 목걸이", color: "화이트", material: "진주", reason: "고급스럽고 우아해요" },
        },
        cool: {
          top: { name: "니트", color: "핑크", material: "울", reason: "따뜻하고 부드러워요" },
          bottom: { name: "롱 스커트", color: "그레이", material: "울", reason: "보온성이 좋고 우아해요" },
          shoes: { name: "앵클 부츠", color: "브라운", material: "가죽", reason: "따뜻하고 세련돼요" },
          accessory: { name: "스카프", color: "베이지", material: "울", reason: "목을 따뜻하게 해줘요" },
        },
        cold: {
          top: { name: "롱 코트", color: "베이지", material: "울", reason: "따뜻하고 우아해요" },
          bottom: { name: "기모 레깅스", color: "블랙", material: "폴리에스터", reason: "보온성이 뛰어나요" },
          shoes: { name: "롱 부츠", color: "블랙", material: "가죽", reason: "따뜻하고 멋있어요" },
          accessory: { name: "머플러", color: "핑크", material: "캐시미어", reason: "따뜻하고 예뻐요" },
        },
      },
      random: {
        hot: {
          top: { name: "민소매", color: "화이트", material: "코튼", reason: "시원하고 편안해요" },
          bottom: { name: "반바지", color: "베이지", material: "린넨", reason: "가볍고 시원해요" },
          shoes: { name: "샌들", color: "브라운", material: "가죽", reason: "발이 편하고 시원해요" },
          accessory: { name: "모자", color: "베이지", material: "스트로", reason: "햇빛을 막아줘요" },
        },
        warm: {
          top: { name: "반팔 셔츠", color: "블루", material: "코튼", reason: "시원하고 깔끔해요" },
          bottom: { name: "면바지", color: "베이지", material: "코튼", reason: "편안하고 통풍이 잘 돼요" },
          shoes: { name: "스니커즈", color: "화이트", material: "캔버스", reason: "편하고 활동적이에요" },
          accessory: { name: "가방", color: "블랙", material: "나일론", reason: "실용적이고 편리해요" },
        },
        mild: {
          top: { name: "긴팔 티", color: "그레이", material: "코튼", reason: "적당한 온도에 편안해요" },
          bottom: { name: "청바지", color: "블루", material: "데님", reason: "어떤 스타일에도 잘 어울려요" },
          shoes: { name: "운동화", color: "블랙", material: "합성섬유", reason: "편하고 활동적이에요" },
          accessory: { name: "시계", color: "실버", material: "메탈", reason: "세련된 포인트가 돼요" },
        },
        cool: {
          top: { name: "자켓", color: "네이비", material: "울", reason: "따뜻하고 스타일리시해요" },
          bottom: { name: "면바지", color: "그레이", material: "코튼", reason: "편안하고 보온성이 좋아요" },
          shoes: { name: "부츠", color: "브라운", material: "가죽", reason: "따뜻하고 멋있어요" },
          accessory: { name: "스카프", color: "베이지", material: "울", reason: "목을 따뜻하게 해줘요" },
        },
        cold: {
          top: { name: "코트", color: "블랙", material: "울", reason: "추위를 막아주고 세련돼요" },
          bottom: {
            name: "기모 바지",
            color: "그레이",
            material: "폴리에스터",
            reason: "보온성과 격식을 모두 갖췄어요",
          },
          shoes: { name: "부츠", color: "블랙", material: "가죽", reason: "따뜻하고 튼튼해요" },
          accessory: { name: "장갑", color: "블랙", material: "가죽", reason: "손을 따뜻하게 보호해요" },
        },
      },
    }

    // ========================================
    // 🌡️ 온도에 따라 카테고리 정하기
    // ========================================
    let tempCategory = "mild" // 기본값: 적당한 날씨

    if (temp >= 28)
      tempCategory = "hot" // 28도 이상: 더운 날씨
    else if (temp >= 23)
      tempCategory = "warm" // 23-27도: 따뜻한 날씨
    else if (temp >= 17)
      tempCategory = "mild" // 17-22도: 적당한 날씨
    else if (temp >= 9)
      tempCategory = "cool" // 9-16도: 쌀쌀한 날씨
    else tempCategory = "cold" // 9도 미만: 추운 날씨

    // 선택한 스타일과 온도에 맞는 추천 반환
    return recommendations[style]?.[tempCategory] || recommendations.casual.mild
  }

  // 추천 아이템 가져오기
  const items = getDetailedRecommendation()

  // 스타일 이름을 한글로 변환
  const styleName =
    {
      casual: "캐주얼",
      formal: "포멀",
      street: "스트릿",
      feminine: "페미닌",
      random: "랜덤",
    }[selectedStyle] || "랜덤"

  // ========================================
  // 🎨 화면 그리기
  // ========================================
  return (
    <div className="space-y-3">
      {/* 제목 */}
      <div className="text-center space-y-1">
        <h2 className="text-lg font-bold">{styleName} 스타일 추천</h2>
        <p className="text-xs text-muted-foreground">현재 날씨에 알맞은 코디네이션이에요</p>
      </div>

      <div className="space-y-2">
        {/* 상의 카드 */}
        <Card className="p-3 bg-white/80 backdrop-blur">
          <div className="flex items-start gap-3">
            {/* 상의 아이콘 */}
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <ShirtIcon className="w-5 h-5 text-green-600" />
            </div>
            {/* 상의 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs text-muted-foreground">상의</span>
                <span className="font-semibold text-sm">{items.top.name}</span>
              </div>
              {/* 색상과 소재 태그 */}
              <div className="flex gap-1.5 mb-1.5">
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{items.top.color}</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{items.top.material}</span>
              </div>
              {/* 추천 이유 */}
              <p className="text-xs text-muted-foreground">{items.top.reason}</p>
            </div>
          </div>
        </Card>

        {/* 하의 카드 */}
        <Card className="p-3 bg-white/80 backdrop-blur">
          <div className="flex items-start gap-3">
            {/* 하의 아이콘 (바지 모양) */}
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <PantsIcon className="w-5 h-5 text-blue-600" />
            </div>
            {/* 하의 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs text-muted-foreground">하의</span>
                <span className="font-semibold text-sm">{items.bottom.name}</span>
              </div>
              <div className="flex gap-1.5 mb-1.5">
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{items.bottom.color}</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{items.bottom.material}</span>
              </div>
              <p className="text-xs text-muted-foreground">{items.bottom.reason}</p>
            </div>
          </div>
        </Card>

        {/* 신발 카드 */}
        <Card className="p-3 bg-white/80 backdrop-blur">
          <div className="flex items-start gap-3">
            {/* 신발 아이콘 */}
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <FootprintsIcon className="w-5 h-5 text-purple-600" />
            </div>
            {/* 신발 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs text-muted-foreground">신발</span>
                <span className="font-semibold text-sm">{items.shoes.name}</span>
              </div>
              <div className="flex gap-1.5 mb-1.5">
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{items.shoes.color}</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{items.shoes.material}</span>
              </div>
              <p className="text-xs text-muted-foreground">{items.shoes.reason}</p>
            </div>
          </div>
        </Card>

        {/* 액세서리 카드 */}
        <Card className="p-3 bg-white/80 backdrop-blur">
          <div className="flex items-start gap-3">
            {/* 액세서리 아이콘 */}
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <WatchIcon className="w-5 h-5 text-orange-600" />
            </div>
            {/* 액세서리 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs text-muted-foreground">액세서리</span>
                <span className="font-semibold text-sm">{items.accessory.name}</span>
              </div>
              <div className="flex gap-1.5 mb-1.5">
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{items.accessory.color}</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{items.accessory.material}</span>
              </div>
              <p className="text-xs text-muted-foreground">{items.accessory.reason}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
