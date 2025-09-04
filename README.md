# 👕 패션 스타일 토글 웹사이트

토글 버튼으로 다양한 테마(캐주얼, 포멀, 스트릿, 랜덤)를 선택할 수 있고,  
즐겨찾기(찜하기) 기능과 소셜 공유, Pinterest 보드 저장 기능을 제공하는 웹사이트입니다.  

---

## 🚀 주요 기능
- 🎨 **테마 전환**: 캐주얼 / 포멀 / 스트릿 / 랜덤 테마 토글 가능  
- ❤️ **즐겨찾기 저장(찜하기)**: 마음에 드는 스타일을 저장 (LocalStorage 활용)  
- 🌍 **소셜 공유**: 트위터, 페이스북, 카카오톡 등 SNS 공유 버튼  
- 📌 **Pinterest 연동**: 선택한 이미지를 Pinterest 보드에 바로 저장  

---

## 🛠 기술 스택
- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Node.js + Express  
- **API**: 
  - Pinterest API (핀 저장 기능)  
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
