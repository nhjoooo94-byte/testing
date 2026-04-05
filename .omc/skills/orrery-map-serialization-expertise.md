# @orrery/core Map 직렬화 함정

## The Insight
JavaScript `Map` 객체는 `JSON.stringify()`로 직렬화하면 빈 객체 `{}`가 된다. @orrery/core의 `SajuResult.relations.pairs`가 `Map<string, PairRelation>` 타입이라 아무 에러 없이 데이터가 사라진다.

## Why This Matters
사주 관계 데이터(합충형파해)가 통째로 빈 객체로 전달되어, Claude가 관계 분석을 전혀 못 한다. 에러도 안 나서 발견이 어렵다.

## Recognition Pattern
- @orrery/core의 `calculateSaju()` 결과를 JSON으로 직렬화할 때
- Claude 응답에서 사주 관계(합, 충, 형 등) 언급이 전혀 없을 때
- `JSON.stringify(sajuResult)`에서 `relations.pairs`가 `{}`로 나올 때

## The Approach
@orrery/core의 반환값을 직렬화하기 전에, `Map` 타입 필드를 `Object.fromEntries()`로 변환하는 어댑터 레이어를 반드시 거쳐야 한다. 라이브러리의 타입 정의(`types.d.ts`)에서 `Map` 사용 여부를 확인하라.

## Example
```typescript
// BAD: 데이터 사라짐
const saju = calculateSaju(input)
JSON.stringify(saju) // relations.pairs → {}

// GOOD: Map을 plain object로 변환
const relations = saju.relations.pairs instanceof Map
  ? Object.fromEntries(saju.relations.pairs)
  : saju.relations.pairs
```
