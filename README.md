# 👕 패션 스타일 토글 웹사이트

토글 버튼으로 다양한 테마(캐주얼, 포멀, 스트릿, 채팅)를 선택할 수 있고,  
Pinterest 보드로 추천을제공하는 웹사이트입니다.  

---

## 🚀 주요 기능
- 🎨 **테마 전환**: 캐주얼 / 포멀 / 스트릿 / 채팅 테마 토글 가능  
- ❤️ **채팅**: 오픈형 api가 추천해줌
- 📌 **Pinterest 연동**: 선택한 이미지를 Pinterest 보드로 보여줌

---

## 🛠 기술 스택
- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Node.js + Express  
- **API**: 
  - Pinterest API (핀 저장 기능)
  - 기상청 API(openweather API)
  - (추후 확장 가능: 다른 소셜 API)  

---

## 📂 폴더 구조
fashion-style-app/
├── server.js # Node.js 백엔드 서버
├── .env # Pinterest API Key (Git에 업로드 금지)
├── public/
│ ├── index.html # 메인 페이지
│ ├── style.css # 테마별 스타일 정의
│ └── script.js # 찜하기/공유/테마 로직
├── .gitignore
└── README.md
