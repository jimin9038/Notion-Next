# Note Taking App (Notion Clone)

- SungKyunKwan Univ. SWE3048(Web Programming Lab) Final Project

## 소개

이 프로젝트는 'Notion'과 유사한 메모 작성 및 관리 앱입니다. 사용자는 메모를 작성하고 수정하며 삭제할 수 있으며, 추가적으로 다음과 같은 기능들을 제공합니다:

- Text Formatting: Markdown 형식의 텍스트 포맷팅
- Profile Image: 사용자 프로필 이미지 변경
- Comment: 메모에 댓글 달기
- Favorite and Pin: 메모를 즐겨찾기 및 고정
- Theme/Font Change: 앱 테마와 폰트 변경
- Table of Contents: 메모 내 목차 생성

이 앱은 Next.js로 프론트엔드와 백엔드를 구현하였고, SQLite를 데이터베이스로 사용합니다.

## 프로젝트 실행 방법

리포지토리를 클론합니다:

```bash
git clone <repository_url>
cd <project_directory>
```

의존성 설치:

```
npm install
```

개발 서버 실행:

```
npm run dev
```

브라우저에서 localhost:3000으로 접속하여 앱을 확인할 수 있습니다.

## **기본 기능**

### **로그인 / 회원가입**

- 사용자는 로그인 또는 회원가입을 통해 자신의 계정을 만들고 로그인할 수 있습니다.
- 로그인 후 메모를 작성하고 관리할 수 있습니다.

### **메모 추가**

- 'New Note' 버튼을 클릭하여 새로운 메모를 작성할 수 있습니다.

### **메모 수정**

- 기존 메모를 클릭하여 제목과 내용을 수정할 수 있습니다.

### **메모 삭제**

- 메모를 삭제할 수 있습니다.

## **추가 기능**

### **Text Formatting**

- Markdown 형식을 사용하여 메모를 포맷할 수 있습니다. (헤딩, 볼드, 리스트, 테이블 등)
- MDX를 사용하여 텍스트 포맷팅을 처리합니다.

### **Profile Image**

- 사용자는 자신의 프로필 이미지를 변경할 수 있습니다. 이미지를 업로드하여 새로운 프로필 이미지를 설정합니다. 프로필 이미지는 DB에 저장되도록 간단하게 구현했습니다.

### **Comment**

- 메모에 댓글을 추가하고 삭제할 수 있습니다. 댓글은 오른쪽 사이드바에서 확인하고 관리할 수 있으며, 토글을 통해 여닫을 수 있습니다.

### **Favorite and Pin**

- 메모를 즐겨찾기하고, 즐겨찾기된 메모는 목록 상단에 고정할 수 있습니다.

### **Theme/Font Change**

- 사용자는 앱의 테마를 다크 모드 또는 라이트 모드로 변경할 수 있으며, 폰트를 세 가지 유형으로 변경할 수 있습니다.

### **Table of Contents**

- 메모 내에 자동으로 생성되는 목차를 사이드바에서 확인할 수 있습니다. 목차는 헤딩을 기반으로 생성됩니다.

## **프로젝트 구조**

```
├── app/                # Next.js 페이지 파일
│   ├── _components/    # 재사용 가능한 컴포넌트들
│   ├── actions.tsx     # 메모 관련 액션
│   ├── auth.ts         # 인증 관련 함수
│   ├── db.tsx          # SQLite 데이터베이스 연결 및 쿼리
│   └── globals.css     # 전역 스타일
├── components/         # UI 컴포넌트들
│   └── ui/             # UI 관련 컴포넌트
├── lib/                # 유틸리티 함수들
├── public/             # 정적 파일
|   prisma              # Prisma(DB Schema, migrations)
└── README.md           # 프로젝트 설명 파일
```

## **데이터베이스 구조**

### **Users 테이블**

- id (INTEGER PRIMARY KEY)
- username (TEXT)
- password (TEXT)
- theme (Text) - light or dark
- font (text) - serif, sans-serif, mono

### **Page 테이블**

- id (INTEGER PRIMARY KEY)
- userId (INTEGER, Foreign Key)
- title (TEXT)
- content (TEXT)
- pin (Boolean)

### **Comments 테이블**

- id (INTEGER PRIMARY KEY)
- pageId (INTEGER, Foreign Key)
- content (TEXT)
- userId (INTEGER, Foreign Key)

## **기능 구현에 대한 설명**

- **Text Formatting**: MDX를 사용하여 메모 내용을 포맷할 수 있도록 구현했습니다. 헤딩, 볼드, 리스트, 테이블 등을 지원합니다.
- **Profile Image**: 사용자가 자신의 프로필 이미지를 업로드하고 변경할 수 있도록 구현했습니다.
- **Comment**: 댓글 기능은 comments 테이블을 사용하여 각 메모에 댓글을 달 수 있습니다.
- **Favorite and Pin**: 메모를 즐겨찾기하고 고정하는 기능을 Pin 플래그로 처리했습니다. 클라이언트에서는 목차의 페이지 왼쪽 별을 클릭하여 고정할 수 있습니다.
- **Theme/Font Change**: 사용자가 테마와 폰트를 변경하면 해당 설정이 DB(User Table)에 저장되어, 사용자에 따라 변경됩니다.
- **Table of Contents**: MDX 헤딩을 기반으로 자동으로 목차를 생성하여 사이드바에 표시합니다. 헤딩(H1, H2, ...)만 간격을 두고 목차로 생성됩니다.

## 라이센스

MIT License를 따릅니다.
