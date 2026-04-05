# Claude Opus 한국어 출력 토큰 예산

## The Insight
Claude Opus는 Sonnet보다 훨씬 상세하게 쓴다. 한국어 JSONL 7개 섹션(각 3~5문단)을 생성할 때, Sonnet은 8K 토큰이면 부족하고, Opus는 16K도 부족하다. 32K가 필요하다.

## Why This Matters
`max_tokens`이 부족하면 응답이 중간에 잘려서 앞쪽 섹션 1~2개만 나오고 나머지는 사라진다. 사용자는 "재물운이 없어졌다"고 인식한다. 에러 메시지도 없어서 원인 파악이 어렵다.

## Recognition Pattern
- JSONL 형식으로 여러 섹션을 한 번에 출력할 때
- 앞쪽 섹션만 나오고 뒤쪽이 잘릴 때
- 한국어 + 상세 해석 + JSON 구조체 조합일 때

## The Approach
한국어 상세 JSONL 출력 시 토큰 예산:
- Sonnet: 섹션당 ~2K → 7개 = ~14K → `max_tokens: 16000` 설정
- Opus: 섹션당 ~3-4K → 7개 = ~21-28K → `max_tokens: 32000` 설정
- 프롬프트에 "7개 섹션에 고르게 분배하라"는 지침을 반드시 포함
- Vercel `maxDuration`도 Opus는 300초로 늘려야 한다 (기본 60초는 부족)

## Example
```typescript
// Opus용 설정
model: 'claude-opus-4-20250514',
max_tokens: 32000,

// route.ts
export const maxDuration = 300 // Opus는 느리다

// 프롬프트에 추가
"반드시 7개 섹션을 모두 출력해야 한다. 한 섹션에 너무 많은 분량을 쏟지 말고, 7개 섹션에 고르게 분배하라."
```
