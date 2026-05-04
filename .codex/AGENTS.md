# Codex Repository Guide

Follow this guide when working in this repository. It is distilled from `CLAUDE.md`
and the referenced docs.

## Project Context

- This is a small-group event management MVP. `rough-prd.md` is an early draft and
  may change.
- Stack: Next.js 16 App Router, React 19, Supabase SSR, Tailwind CSS, shadcn/ui,
  TypeScript.
- Developer environment may include Windows/PowerShell usage, so avoid assumptions
  that only work on macOS or Unix path conventions when writing project guidance.

## Common Commands

```bash
npm run dev
npm run build
npm run lint
npx tsc --noEmit
```

Run `npx tsc --noEmit` after implementation. For UI-affecting changes, also verify
the rendered browser flow when Playwright tooling is available.

## Documentation Sources

- Before Next.js-specific work, consult the relevant local official docs under
  `node_modules/next/dist/docs/`.
- Supabase local development and CLI context lives in `docs/supabase.md`.
- Project coding conventions live in `docs/coding-style.md`.

## Architecture Notes

- `app/`: pages and layouts.
- `app/auth/`: auth routes including login, sign-up, forgot-password,
  update-password, confirm route handler, and error.
- `app/protected/`: auth-required pages when present.
- `components/`: React components. shadcn/ui primitives live in `components/ui/`.
- `lib/supabase/`: Supabase browser, server, and proxy client factories.
- `lib/utils.ts`: `cn()` Tailwind class merge helper and environment checks.
- Root `proxy.ts` is the Next.js request entry point for auth/session refresh, not
  `middleware.ts`.

## Supabase Rules

- Use `@/lib/supabase/server` and `await createClient()` in Server Components,
  Route Handlers, and Server Actions.
- Use `@/lib/supabase/client` and `createClient()` in Client Components.
- Do not store Supabase clients in module-level globals.
- Check authentication with `supabase.auth.getClaims()`, not `getUser()`.
- Auth sessions are cookie-based through `@supabase/ssr`.
- Email OTP confirmation is handled by `app/auth/confirm/route.ts`.
- Environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Prefer `PUBLISHABLE_KEY` naming over the old `ANON_KEY` naming.

## UI And Component Conventions

- Default to Server Components. Add `"use client"` only when state, effects, or
  event handlers require it.
- General components use named exports. Pages and layouts use default exports.
- Component filenames use `kebab-case.tsx`; utility files use `kebab-case.ts`.
  Next.js convention files such as `page.tsx`, `layout.tsx`, and `route.ts` are
  exceptions.
- Use Tailwind CSS with CSS variable tokens such as `bg-primary`,
  `text-muted-foreground`, and `border-input`.
- Use `cn()` from `@/lib/utils` for conditional or composed class names.
- Follow the shadcn/ui form pattern: `Card`, `Input`, `Label`, and `Button`.
- Navigation buttons should use `<Button asChild><Link href="...">...</Link></Button>`.
- Currently installed shadcn/ui components: `Button`, `Card`, `Input`, `Label`,
  `Checkbox`, `DropdownMenu`, `Badge`.
- Use `React.forwardRef` plus `displayName` for reusable UI primitives that pass refs.
- Use lucide-react icons when icons are needed.

## TypeScript And Error Handling

- For wrapper components around HTML elements, prefer
  `React.ComponentPropsWithoutRef<"...">`.
- Use `interface` for complex extensible props, inline types for simple props, and
  `type` for unions and aliases.
- Catch errors as `unknown` and narrow with `instanceof Error`.
- In auth/server checks, redirect unauthenticated users to `/auth/login`.

## Verification

After implementation:

1. Run `npx tsc --noEmit`.
2. Run lint/build when the changed surface justifies it.
3. For UI changes, run the dev server and verify core browser flows:
   - golden path
   - error or empty states
   - navigation and redirects
   - mobile layout around 375px width

Only report work as complete after relevant checks pass, or explicitly state which
checks could not be run and why.
