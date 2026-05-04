---
name: update-roadmap
description: tasks.json 상태를 ROADMAP.md에 동기화. Task 완료 후 수동으로 호출.
disable-model-invocation: true
allowed-tools: Read(.taskmaster/tasks/tasks.json) Edit(.taskmaster/tasks/tasks.json) Read(docs/ROADMAP.md) Edit(docs/ROADMAP.md)
---

# /update-roadmap

`.taskmaster/tasks/tasks.json`을 기준으로 완료된 작업을 `docs/ROADMAP.md`에 반영합니다.

## 현재 Task 상태 (실시간)

```!
cat .taskmaster/tasks/tasks.json
```

## 프로세스

1. 위 tasks.json에서 `status`가 `"pending"` 또는 `"in-progress"`인 Task 목록 표시
2. "어떤 Task를 완료했나요? (예: 1 또는 1,2,3)" 질문 (tasks.json의 `id` 기준)
3. 해당 Task의 tasks.json `status` → `"done"` 업데이트
4. `docs/ROADMAP.md` 읽기
5. ROADMAP.md에서 대응하는 Task 행의 상태 기호 → `✅` 업데이트
6. Phase 전체 완료 여부 자동 확인
7. ROADMAP.md의 `최종 업데이트` 날짜 갱신
8. 변경 내용 요약 출력

## 상태 매핑

| tasks.json `status` | ROADMAP.md 기호 |
|---------------------|-----------------|
| `"pending"` | ⬜ |
| `"in-progress"` | 🔵 |
| `"done"` | ✅ |

## 업데이트 규칙

### tasks.json 업데이트

```json
// Before
{ "id": 1, "title": "...", "status": "pending" }

// After
{ "id": 1, "title": "...", "status": "done" }
```

### ROADMAP.md Task 행 매핑

tasks.json의 `title`과 ROADMAP.md의 Task 행 설명을 **의미적으로 매핑**하여 대응하는 행을 찾습니다.

**Before:**
```markdown
| **Task-100** | 로그인 페이지 UI (mock) — 카카오/구글 로그인 버튼만 표시 (F010) | ⬜ |
```

**After:**
```markdown
| **Task-100** | 로그인 페이지 UI (mock) — 카카오/구글 로그인 버튼만 표시 (F010) | ✅ |
```

### Phase 완료 자동 감지

Phase 내 모든 Task가 `✅`이면 Phase 헤더에 완료 표시 추가:

```markdown
## Phase 1: UI/UX Mock 구현 ✅
```

### 날짜 갱신

```markdown
**최종 업데이트**: 2026-04-20  →  **최종 업데이트**: 오늘 날짜(YYYY-MM-DD)
```

## 구현 상세

### tasks.json → ROADMAP.md 매핑 로직

두 파일의 ID 체계가 다르므로(tasks.json: 1,2,3… / ROADMAP: Task-100,Task-101…)
아래 순서로 대응 행을 탐색합니다:

1. tasks.json `title`의 핵심 키워드를 ROADMAP.md Task 행 설명에서 검색
2. 일치하는 행의 상태 기호를 교체
3. 매핑이 불확실한 경우 사용자에게 확인 후 처리

### Phase 완료 체크 로직

1. 업데이트된 Phase 섹션 내 모든 `| **Task-` 행의 상태 확인
2. 전체 `✅`이면 Phase 헤더 끝에 ` ✅` 추가
3. 하나라도 `⬜`/`🔵`가 남아 있으면 Phase 헤더는 그대로

## 주의사항

- Task ID는 `.taskmaster/tasks/tasks.json`의 `id` 숫자를 기준으로 입력
- 이미 `"done"` / `✅`인 Task는 건너뜀
- ROADMAP.md 매핑이 불명확하면 사용자에게 확인 요청
- Phase 완료 판정은 해당 Phase의 **모든 Task**가 `✅`인 경우에만 적용
- 날짜는 `YYYY-MM-DD` 형식 사용
- 여러 Task 동시 처리 지원 (쉼표 구분: `1,2,3`)
