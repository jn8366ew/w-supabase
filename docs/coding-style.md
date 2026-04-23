# 코딩 스타일 가이드

이 프로젝트(Next.js 16 App Router + Supabase SSR + React 19)에서 적용하는 코딩 컨벤션입니다.

---

## 파일 명명 규칙

- 컴포넌트 파일: `kebab-case.tsx` (예: `login-form.tsx`, `auth-button.tsx`)
- Next.js 규약 파일은 예외: `page.tsx`, `layout.tsx`, `route.ts`, `middleware.ts`
- 유틸/라이브러리: `kebab-case.ts` (예: `utils.ts`, `server.ts`)

---

## TypeScript 타입 정의

**Props 타입:**
- HTML 요소를 감싸는 컴포넌트: `React.ComponentPropsWithoutRef<"div">` 상속
- 확장이 필요한 복잡한 Props: `interface` 사용
- 단순한 Props: 인라인 타입

```typescript
// HTML 요소 확장
export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {}

// 복잡한 Props (interface)
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// 단순 Props (인라인)
export function TutorialStep({ title, children }: { title: string; children: React.ReactNode }) {}

// 루트 레이아웃
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {}
```

**그 외:**
- union/alias 타입: `type` 사용
- 에러 타입: 반드시 `unknown`으로 받고 `instanceof Error`로 확인

```typescript
type EmailOtpType = "signup" | "recovery" | "invite";

catch (error: unknown) {
  setError(error instanceof Error ? error.message : "An error occurred");
}
```

---

## 컴포넌트 작성 패턴

- 함수형 컴포넌트만 사용 (클래스 컴포넌트 금지)
- 일반 컴포넌트: named export
- 페이지/레이아웃: default export
- UI 컴포넌트(ref 전달 필요): `React.forwardRef` + `displayName` 설정

```typescript
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";
```

**서버/클라이언트 컴포넌트:**
- 기본값: 서버 컴포넌트
- `useState`, `useEffect`, 이벤트 핸들러가 필요한 경우에만 파일 최상단에 `"use client"` 선언
- 비동기 서버 컴포넌트는 사용하는 곳에서 `<Suspense>`로 감싸기

---

## Import 순서

```typescript
"use client"; // 1. 지시어 (필요 시)

import { useState } from "react";          // 2. React/Next.js
import Link from "next/link";
import { useRouter } from "next/navigation";

import * as RadixUI from "@radix-ui/...";  // 3. 외부 라이브러리
import { SomeIcon } from "lucide-react";

import { cn } from "@/lib/utils";          // 4. 내부 유틸
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button"; // 5. 내부 컴포넌트
```

---

## Tailwind / 스타일

- 조건부·동적 클래스는 반드시 `cn()` 헬퍼 사용 (`@/lib/utils`)
- UI variant 시스템: CVA(`class-variance-authority`) + `cn()` 조합
- 색상은 CSS 변수 기반 토큰 사용 (`bg-primary`, `text-muted-foreground`, `border-input` 등)

```typescript
// 조건부 클래스
<div className={cn("flex flex-col gap-6", className)} {...props}>

// variant 시스템
className={cn(buttonVariants({ variant, size, className }))}
```

---

## Supabase 클라이언트

| 컨텍스트 | import | 호출 방식 |
|----------|--------|-----------|
| 서버 컴포넌트 / Server Action / Route Handler | `@/lib/supabase/server` | `await createClient()` |
| 클라이언트 컴포넌트 | `@/lib/supabase/client` | `createClient()` |

- **전역 변수에 클라이언트 할당 금지** (Fluid compute 환경에서 요청 간 오염 방지)
- 사용자 인증 확인: `supabase.auth.getClaims()` 사용 (`getUser()` 사용 금지)

```typescript
// 서버 컴포넌트
const supabase = await createClient();
const { data, error } = await supabase.auth.getClaims();

// 클라이언트 컴포넌트
const supabase = createClient();
const { error } = await supabase.auth.signInWithPassword({ email, password });
```

---

## 에러 처리

**클라이언트 컴포넌트 (폼):**
```typescript
try {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  router.push("/protected");
} catch (error: unknown) {
  setError(error instanceof Error ? error.message : "An error occurred");
} finally {
  setIsLoading(false);
}
```

**서버 컴포넌트:**
```typescript
const { data, error } = await supabase.auth.getClaims();
if (error || !data?.claims) {
  redirect("/auth/login");
}
```

**에러 표시:**
```tsx
{error && <p className="text-sm text-red-500">{error}</p>}
```

---

## 폼 컴포넌트 패턴

- 컨테이너: `React.ComponentPropsWithoutRef<"div">` 상속으로 className 전달 가능하게 유지
- 로컬 상태: `isLoading: boolean`, `error: string | null`
- submit 핸들러: `async (e: React.FormEvent) => { e.preventDefault(); ... }`

```typescript
"use client";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ...
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        {/* ... */}
      </form>
    </div>
  );
}
```

---

## shadcn/ui 사용 규칙

- 폼 레이아웃: `Card > CardHeader + CardContent` + `Input + Label + Button` 패턴
- 네비게이션 버튼: `<Button asChild><Link href="...">텍스트</Link></Button>`
- 현재 설치된 컴포넌트만 사용: `Button`, `Card`, `Input`, `Label`, `Checkbox`, `DropdownMenu`, `Badge`
- 새 컴포넌트 필요 시 `npx shadcn@latest add <component>`로 추가
