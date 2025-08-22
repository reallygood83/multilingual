# 🏫 가정통신문 다국어 번역 시스템

한국의 학교에서 사용하는 가정통신문을 다국어로 자동 번역하고 PDF로 생성할 수 있는 웹 애플리케이션입니다.

## ✨ 주요 기능

- **📝 실시간 편집**: WYSIWYG 에디터로 가정통신문 작성 및 편집
- **🌍 다국어 번역**: 한국어를 영어, 중국어, 베트남어, 러시아어로 자동 번역
- **🎨 템플릿 시스템**: 표준 가정통신문 형식 (헤더, 본문, 푸터)
- **📄 PDF 생성**: 각 언어별 PDF 파일 자동 생성 및 다운로드
- **🖼️ 로고 업로드**: 학교 로고 업로드 및 배치
- **📱 반응형 디자인**: 데스크톱과 모바일에서 모두 사용 가능

## 🛠️ 기술 스택

### 프론트엔드
- **React** - 사용자 인터페이스
- **Styled Components** - CSS-in-JS 스타일링
- **React Quill** - WYSIWYG 에디터
- **jsPDF + html2canvas** - PDF 생성
- **Vite** - 빌드 도구

### 백엔드
- **Node.js + Express** - 서버
- **Google Translate API** - 번역 서비스
- **CORS** - 크로스 오리진 리소스 공유

## 🚀 설치 및 실행

### 로컬 개발환경

#### 1. 저장소 클론
```bash
git clone <repository-url>
cd multilingual
```

#### 2. 백엔드 설정
```bash
cd backend
npm install
cp .env.example .env
npm start
```

#### 3. 프론트엔드 설정
```bash
cd school-notice-app
npm install
cp .env.example .env
npm run dev
```

#### 4. 웹 브라우저에서 접속
http://localhost:5173 에서 애플리케이션을 확인할 수 있습니다.

### 🌐 Vercel 배포

#### 1. GitHub에 코드 업로드
```bash
# Git 저장소 초기화 (이미 완료)
git add .
git commit -m "Initial commit: School Notice Translation System"
git branch -M main
git remote add origin https://github.com/yourusername/school-notice-translator.git
git push -u origin main
```

#### 2. Vercel 배포
1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. GitHub 저장소 연결
4. 프로젝트 설정:
   - **Framework Preset**: Other
   - **Root Directory**: `/` (루트)
   - **Build Command**: `cd school-notice-app && npm install && npm run build`
   - **Output Directory**: `school-notice-app/dist`
5. 환경 변수 설정:
   - `REACT_APP_API_URL` = `/api`
6. "Deploy" 클릭

#### 3. 자동 배포 설정
- GitHub에 코드를 푸시할 때마다 자동으로 배포됩니다
- `main` 브랜치의 변경사항이 프로덕션에 반영됩니다

### 📋 배포 후 확인사항

1. **API 연결 확인**: 배포된 사이트에서 "API 상태"가 "✅ 연결됨"으로 표시되는지 확인
2. **번역 기능 테스트**: 각 언어별 번역이 정상적으로 작동하는지 확인
3. **PDF 생성 테스트**: PDF 다운로드가 정상적으로 작동하는지 확인

## 📖 사용 방법

### 1. 가정통신문 작성
- "편집 모드" 버튼을 클릭하여 편집 모드로 전환
- 헤더 정보 (학교명, 제목, 발행인 등) 입력
- 본문 내용을 WYSIWYG 에디터로 작성
- 푸터 정보 (첨부파일, 서명 등) 입력

### 2. 번역
- "모든 언어로 번역" 버튼으로 일괄 번역
- 또는 개별 언어 버튼으로 선택적 번역

### 3. PDF 생성
- "한국어 PDF" 버튼으로 원본 PDF 생성
- 각 번역된 언어별로 개별 PDF 생성
- "모든 PDF 생성" 버튼으로 일괄 PDF 생성

## 🔧 환경 설정

### Google Translate API 설정 (프로덕션용)
1. Google Cloud Console에서 프로젝트 생성
2. Translation API 활성화
3. 서비스 계정 키 생성
4. `.env` 파일에 API 키 설정

```bash
# backend/.env
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
GOOGLE_TRANSLATE_PROJECT_ID=your_project_id
```

## 📁 프로젝트 구조

```
multilingual/
├── backend/                 # 백엔드 서버
│   ├── server.js           # Express 서버 메인 파일
│   ├── package.json
│   └── .env.example
├── school-notice-app/       # 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   │   ├── NoticeHeader.jsx
│   │   │   ├── NoticeContent.jsx
│   │   │   └── NoticeFooter.jsx
│   │   ├── services/       # API 서비스
│   │   │   ├── translationService.js
│   │   │   └── pdfService.js
│   │   └── App.jsx
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🎯 주요 컴포넌트

### NoticeHeader
- 학교 정보, 로고, 제목 표시
- 발행인, 담당자, 연락처 정보

### NoticeContent  
- WYSIWYG 에디터로 본문 작성
- 리스트, 표, 이미지 등 다양한 콘텐츠 지원

### NoticeFooter
- 첨부파일 정보
- 주의사항 및 추가 안내
- 발신인 서명

## 🌐 지원 언어

- 🇰🇷 한국어 (원본)
- 🇺🇸 영어 (English)
- 🇨🇳 중국어 (中文)
- 🇻🇳 베트남어 (Tiếng Việt)
- 🇷🇺 러시아어 (Русский)

## 📝 개발자 노트

이 프로젝트는 기존의 Google Apps Script 기반 번역 시스템을 웹 애플리케이션으로 발전시킨 것입니다. 다문화 가정이 많은 한국의 교육 환경에서 언어 장벽을 해소하고자 개발되었습니다.

## 🤝 기여하기

버그 리포트나 기능 제안은 이슈로 등록해주세요. Pull Request도 환영합니다!

## 📄 라이선스

MIT License

---

Made with ❤️ for Korean schools and multicultural families