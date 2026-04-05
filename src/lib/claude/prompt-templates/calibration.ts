function formatDate(d: { year: number; month?: number }): string {
  return `${d.year}년${d.month ? ` ${d.month}월` : ''}`
}

export function buildCalibrationPrompt(pastEvents: {
  childhoodHardships?: { year: number; month?: number }[]
  meetingDates?: { year: number; month?: number }[]
  breakupDates?: { year: number; month?: number }[]
}): string {
  const parts: string[] = []

  parts.push('[과거 이벤트 교차검증 — 캘리브레이션]')
  parts.push(
    '아래 과거 이벤트를 3개 체계의 과거 신호와 대조하여 분석하세요:'
  )

  if (pastEvents.childhoodHardships?.length) {
    parts.push(
      `- 가장 힘들었던 시기: ${pastEvents.childhoodHardships.map(formatDate).join(', ')}`
    )
  }

  if (pastEvents.meetingDates?.length) {
    parts.push(
      `- 만남 시기: ${pastEvents.meetingDates.map(formatDate).join(', ')}`
    )
  }

  if (pastEvents.breakupDates?.length) {
    parts.push(
      `- 헤어짐 시기: ${pastEvents.breakupDates.map(formatDate).join(', ')}`
    )
  }

  parts.push('')
  parts.push('캘리브레이션 지침:')
  parts.push(
    '1. 각 이벤트에 대해 3개 체계가 해당 시기에 어떤 신호를 보냈는지 분석하세요'
  )
  parts.push('2. 어떤 체계가 이 사용자에게 더 정확했는지 판단하세요')
  parts.push(
    '3. 정확했던 체계의 가중치를 상향 조정하여 미래 예측에 반영하세요'
  )
  parts.push(
    '4. 첫 번째 섹션(personality)의 content에 캘리브레이션 결과를 간단히 언급하세요'
  )

  return parts.join('\n')
}
