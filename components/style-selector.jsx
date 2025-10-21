/*
 * ========================================
 * 📝 스타일 선택 컴포넌트 (style-selector.jsx)
 * ========================================
 *
 * 🎯 이 파일이 하는 일:
 * - 캐주얼, 포멀, 스트릿, 랜덤 스타일 버튼을 보여줍니다
 * - 사용자가 버튼을 클릭하면 선택한 스타일을 저장합니다
 *
 * 💡 초보자를 위한 설명:
 * - props: 부모 컴포넌트에서 받아오는 데이터
 * - map: 배열의 각 항목을 하나씩 처리하는 함수
 * - onClick: 버튼을 클릭했을 때 실행되는 함수
 */

"use client"

import { Card } from "@/components/ui/card"

export function StyleSelector({ styles, selectedStyle, onStyleSelect }) {
  // ========================================
  // 📦 받아온 데이터 (Props)
  // ========================================
  // styles: 스타일 목록 (캐주얼, 포멀, 스트릿, 랜덤)
  // selectedStyle: 현재 선택된 스타일
  // onStyleSelect: 스타일을 선택했을 때 실행할 함수

  return (
    <div className="space-y-4">
      {/* 2x2 그리드로 버튼 배치 */}
      <div className="grid grid-cols-2 gap-2">
        {/* 각 스타일마다 버튼 만들기 */}
        {styles.map((style) => (
          <Card
            key={style.id} // 각 버튼을 구분하는 고유 ID
            className={`p-2.5 cursor-pointer transition-all duration-200 ${
              // 선택된 스타일이면 파란색, 아니면 회색
              selectedStyle === style.id
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "hover:bg-muted/50 hover:border-primary/30"
            }`}
            onClick={() => onStyleSelect(style.id)} // 클릭하면 스타일 선택
          >
            <div className="text-center space-y-1.5">
              {/* 스타일 아이콘 (이모지) */}
              <div className="text-xl">{style.icon}</div>
              {/* 스타일 이름 */}
              <div className="font-semibold text-xs">{style.name}</div>
              {/* 스타일 설명 */}
              <div className="text-[10px] opacity-80 text-pretty">{style.description}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
