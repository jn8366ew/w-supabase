# macOS 개발환경 설정 가이드

Windows 11에서 구성된 MCP 개발환경을 macOS에서 동일하게 재현하기 위한 단계별 가이드입니다.

---

## 현재 MCP 구성 (`claude mcp list` 기준)

| MCP | 스코프 | 방식 |
|---|---|---|
| `supabase` | 프로젝트 | `npx @supabase/mcp-server-supabase@latest` |
| `context7` | 유저 | HTTP `https://mcp.context7.com/mcp` |
| `playwright` | 유저 | `npx @playwright/mcp@latest` |
| `sequential-thinking` | 유저 | `npx @modelcontextprotocol/server-sequential-thinking@latest` |
| `taskmaster-ai` | 유저 | `npx task-master-ai` |
| `claude.ai Google Drive/Gmail/Calendar` | 계정 | claude.ai 로그인 시 자동 연동 |

---

## 사전 요구사항

```bash
# Node.js (Homebrew)
brew install node

# Claude Code CLI
npm install -g @anthropic-ai/claude-code
```

---

## 1. 유저 스코프 MCP 추가

아래 명령어를 터미널에서 순서대로 실행합니다.

```bash
# playwright
claude mcp add playwright npx @playwright/mcp@latest -s user

# sequential-thinking
claude mcp add sequential-thinking -s user -- npx -y @modelcontextprotocol/server-sequential-thinking@latest

# taskmaster-ai
claude mcp add taskmaster-ai -s user -- npx task-master-ai
```

context7은 API 키가 포함된 HTTP 방식이므로 `~/.claude/.mcp.json`에 직접 추가합니다.

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "ctx7sk-99fb24d3-4584-4121-851b-259d8cc40619"
      }
    }
  }
}
```

---

## 2. 유저 Claude Code 설정

`~/.claude/settings.json` 파일을 생성합니다.

```json
{
  "model": "claude-sonnet-4-6",
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "defaultMode": "plan",
    "disableBypassPermissionsMode": "disable",
    "allow": [
      "Bash(npm run *)",
      "Bash(npx prisma *)",
      "Bash(git status)",
      "Bash(git log *)",
      "Bash(git diff *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "mcp__context7"
    ],
    "deny": [
      "Read(//**/.env)",
      "Read(//**/.env.*)",
      "Read(//**/*.key)",
      "Read(//**/*.pem)",
      "Read(//**/*secret*)",
      "Read(//**/*credential*)",
      "Bash(rm -rf *)",
      "Bash(git push --force *)",
      "Bash(sudo *)",
      "Bash(curl *)",
      "Bash(wget *)",
      "Bash(ssh *)",
      "Bash(scp *)"
    ]
  }
}
```

---

## 3. 프로젝트 supabase MCP 토큰 설정

프로젝트 루트의 `.mcp.json`에 실제 Supabase Personal Access Token을 채웁니다.

1. [https://supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) 에서 토큰 발급
2. `.mcp.json`의 `<YOUR_SUPABASE_ACCESS_TOKEN>` 부분을 실제 토큰으로 교체

---

## 4. 프로젝트 로컬 설정

`.claude/settings.local.json` 파일을 프로젝트 루트 기준 `.claude/` 디렉토리에 생성합니다.

```json
{
  "model": "claude-sonnet-4-6",
  "permissions": {
    "allow": [
      "mcp__supabase",
      "Read",
      "Bash",
      "WebFetch",
      "WebSearch",
      "mcp__ide",
      "mcp__playwright",
      "mcp__sequential-thinking",
      "mcp__context7",
      "mcp__taskmaster-ai"
    ]
  },
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["supabase"],
  "language": "korean",
  "outputs": "Explanatory",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint"
          }
        ]
      }
    ]
  }
}
```

> Windows의 Stop 훅(토스트 알림)은 macOS에서 동작하지 않으므로 생략합니다.

---

## 5. Google 서비스 (Drive / Gmail / Calendar)

`claude.ai` 계정으로 로그인되어 있으면 자동으로 연동됩니다. 별도 설정 불필요.

---

## 설정 완료 확인

```bash
claude mcp list
```

아래 항목이 모두 `✓ Connected`로 표시되면 완료입니다.

```
playwright:          npx @playwright/mcp@latest
sequential-thinking: npx @modelcontextprotocol/server-sequential-thinking@latest
context7:            https://mcp.context7.com/mcp (HTTP)
taskmaster-ai:       npx task-master-ai
supabase:            npx -y @supabase/mcp-server-supabase@latest
```
