# Memo App

제대로 배우는 Express.js: Part1 기초부터 심화까지 [기초편] 강의를 통해 학습한 프로젝트입니다.

Node.js와 Express를 학습하기 위해 만든 메모 웹 애플리케이션입니다. 회원가입, 로그인, JWT 인증, 메모 CRUD, 검색 기능을 구현했습니다.

## 사용 기술

- Node.js
- Express.js
- EJS

## 사용한 패키지

- `express`: 서버와 라우터 구현
- `ejs`: 서버 사이드 템플릿 렌더링
- `dotenv`: 환경변수 관리
- `cookie-parser`: 쿠키 파싱
- `jsonwebtoken`: JWT 토큰 생성 및 검증
- `bcrypt`: 비밀번호 해싱
- `uuid`: 고유 ID 생성
- `nodemon`: 개발 중 서버 자동 재시작

## 주요 미들웨어

- `express.json()`: JSON 요청 본문 파싱
- `express.urlencoded()`: HTML form 데이터 파싱
- `cookieParser()`: 쿠키 데이터 파싱
- `ensureDataFileExists`: JSON 데이터 파일이 없으면 자동 생성
- `authenticateUser`: JWT 토큰을 검증하고 로그인 사용자 ID를 `req.userId`에 저장

## 주요 기능

- 회원가입
- 로그인 / 로그아웃
- JWT 기반 인증
- 메모 목록 조회
- 메모 검색
- 메모 작성
- 메모 수정
- 메모 삭제
- 작성자 권한 확인

## API / Routes

### Users

- `GET /users/login`: 로그인 페이지 렌더링
- `POST /users/login`: 로그인 처리, JWT 토큰 발급 및 쿠키 저장
- `POST /users/logout`: 로그아웃 처리, 토큰 쿠키 삭제
- `GET /users/register`: 회원가입 페이지 렌더링
- `POST /users/register`: 회원가입 처리, 비밀번호 해싱 후 사용자 저장

### Memos

- `GET /memos`: 메모 목록 조회 및 검색
- `GET /memos/add`: 메모 작성 페이지 렌더링
- `POST /memos/add`: 로그인 사용자 메모 작성
- `GET /memos/edit/:id`: 메모 수정 페이지 렌더링
- `POST /memos/edit/:id`: 작성자 권한 확인 후 메모 수정
- `POST /memos/delete/:id`: 작성자 권한 확인 후 메모 삭제
