# 과거 이벤트 캘리브레이션은 실제 계산 데이터가 필요하다

## The Insight
"사용자가 2018년에 힘들었다"라는 텍스트만 AI에 전달하면 가짜 교차검증이다. AI가 추측으로 분석할 뿐이다. 진짜 교차검증은 해당 연도의 실제 운세 계산 데이터(자미두수 유년운 등)를 함께 보내야 한다.

## Why This Matters
과거 이벤트로 체계별 적중도를 판단하겠다면서, 실제 계산 없이 텍스트만 보내면 AI가 "그 시기에 안 좋은 운이 있었을 것이다"라고 역추론할 뿐이다. 이건 검증이 아니라 확인 편향이다.

## Recognition Pattern
- 과거 이벤트를 입력받아 "이 체계가 더 정확했다"고 판단하려 할 때
- calculateLiunian()을 현재 연도만 호출하고 과거 연도는 빠뜨렸을 때
- 마찬가지로 근 미래(2~3년) 예측 시에도 해당 연도의 유년운을 실제 계산해서 보내야 한다

## The Approach
과거 이벤트 연도마다 `calculateLiunian(chart, pastYear)`를 호출하고, 그 결과 JSON을 프롬프트에 포함시켜라. 근 미래 월 단위 예측이 필요하면 해당 연도의 유년운도 미리 계산해서 보내라.

## Example
```typescript
// 과거 이벤트 연도 수집
const pastYears = collectPastEventYears(input) // [2018, 2020]
for (const year of pastYears) {
  pastLiunians[year] = calculateLiunian(ziweiChart, year)
}
// 근 미래 유년운
futureLiunians[currentYear + 1] = calculateLiunian(ziweiChart, currentYear + 1)
futureLiunians[currentYear + 2] = calculateLiunian(ziweiChart, currentYear + 2)
```
