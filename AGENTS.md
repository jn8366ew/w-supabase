# AGENTS.md

이 파일은 Codex (Codex.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 명령어

```bash
npm run dev      # 개발 서버 시작
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 실행
```

## Next.js 컨텍스트 파일

@docs/next-js.md

## supabase 컨텍스트 파일

@docs/supabase.md

## 코딩스타일 컨텍스트 파일

@docs/coding-style.md

## 기술 스택 버전

| 패키지                | 버전                            |
| --------------------- | ------------------------------- |
| next                  | 16.2.4 (package.json: `latest`) |
| react / react-dom     | ^19.0.0                         |
| @supabase/ssr         | latest                          |
| @supabase/supabase-js | latest                          |
| tailwindcss           | ^3.4.1                          |
| next-themes           | ^0.4.6                          |
| lucide-react          | ^0.511.0                        |
| typescript            | ^5                              |

## 개발자 사용 OS

Windows 11과 MAC을 사용중 입니다. - 파워셸을 사용하고 있고, 맥, UNIX OS와의 구성 중 백슬래시 등의 이슈가 있을 수 있습니다.

## 환경 변수

`.env.local` 파일을 생성하여 아래 값을 설정합니다:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

참고: Supabase는 기존 `ANON_KEY` 대신 `PUBLISHABLE_KEY` 명칭을 사용합니다.

## 프로젝트 목적

소규모 그룹 이벤트 관리 MVP로 개발 중입니다. 초기 기획은 `rough-prd.md`에 있으나 **러프한 초고**이며 추후 변경될 수 있습니다.

## 아키텍처

**Next.js 16 App Router + Supabase SSR (React 19)**

### 주요 디렉토리

- `app/` — 페이지 및 레이아웃
  - `app/auth/` — 인증 라우트: login, sign-up, forgot-password, update-password, confirm (OTP 라우트 핸들러), error
  - `app/protected/` — 인증 필요 페이지 (미들웨어 + 서버 사이드 redirect로 보호)
- `components/` — React 컴포넌트; `components/ui/`에 shadcn/ui 기본 컴포넌트
- `lib/supabase/` — Supabase 클라이언트 팩토리 (브라우저, 서버, 미들웨어 프록시)
- `lib/utils.ts` — Tailwind 클래스 병합용 `cn()` 헬퍼 + `hasEnvVars` 체크

### 인증 흐름

세션 관리는 `@supabase/ssr`을 통한 쿠키 기반입니다. 세 가지 Supabase 클라이언트 타입:

1. **브라우저 클라이언트** (`lib/supabase/client.ts`) — Client Component용
2. **서버 클라이언트** (`lib/supabase/server.ts`) — Server Component, Route Handler, Server Action용 (`next/headers`로 쿠키 읽기/쓰기)
3. **미들웨어 프록시** (`lib/supabase/proxy.ts` / 루트 `proxy.ts`에서 호출) — 모든 요청마다 세션 갱신

보호 라우트는 루트의 `proxy.ts`에서 적용됩니다 (실제 Next.js 미들웨어 진입점, `middleware.ts`가 아님). 미인증 사용자를 `/auth/login`으로 리다이렉트하며, `/`, `/login` 경로, `/auth/*` 경로는 제외합니다.

사용자 인증은 `supabase.auth.getClaims()`로 확인합니다 (`getUser()` 아님) — 현재 Supabase SSR 패턴입니다.

이메일 OTP 인증은 `app/auth/confirm/route.ts` 라우트 핸들러가 처리합니다.

### Next.js 설정

`next.config.ts`에서 React 19 컴포넌트 캐싱을 위해 `cacheComponents: true`를 활성화합니다.

### UI 컨벤션

- Tailwind CSS + shadcn/ui (스타일: `new-york`, RSC 활성화)
- `next-themes`를 통한 다크 모드 (class 전략)
- 경로 별칭 `@/*`는 저장소 루트를 가리킵니다
- 폼은 `Card + Input + Label + Button` shadcn 패턴 사용; 네비게이션 버튼은 `asChild`와 `Link` 조합 사용
- 설치된 shadcn/ui 컴포넌트: Button, Card, Input, Label, Checkbox, DropdownMenu, Badge

## 구현 후 테스트 프로세스 (필수)

모든 구현이 완료된 후 반드시 아래 순서로 검증한다:

### 1단계 — TypeScript 검증

```bash
npx tsc --noEmit
```

오류가 있으면 수정 후 다음 단계로 진행.

### 2단계 — Playwright MCP로 UI 검증

개발 서버(`npm run dev`)가 실행 중인 상태에서 `mcp__playwright` 도구를 사용해 실제 브라우저 렌더링과 사용자 흐름을 검증한다.

```
// 기본 흐름
mcp__playwright__browser_navigate(url)   → 페이지 이동
mcp__playwright__browser_snapshot()      → 접근성 트리 확인 (인터랙션 전 필수)
mcp__playwright__browser_take_screenshot() → 시각적 확인
mcp__playwright__browser_click(element)  → 버튼/링크 클릭
mcp__playwright__browser_fill_form(...)  → 폼 입력
mcp__playwright__browser_wait_for(...)   → 비동기 상태 대기
```

### 3단계 — 검증 기준

각 Task 완료 시 확인할 항목:

- **골든 패스**: 정상 시나리오 전체 흐름이 막힘 없이 동작하는가
- **에러 케이스**: 잘못된 입력, 빈 상태, 권한 없는 접근이 적절히 처리되는가
- **네비게이션**: 모든 링크와 리다이렉트가 의도한 페이지로 이동하는가
- **반응형**: 모바일 뷰포트(375px)에서 레이아웃이 깨지지 않는가

### 에이전트 지침

에이전트가 구현을 완료했다고 보고할 때는 반드시 위 3단계를 모두 통과한 후에만 "완료"로 보고한다. TypeScript 오류나 브라우저 렌더링 실패가 있으면 수정 후 재검증한다.
