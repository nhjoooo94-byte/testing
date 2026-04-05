import type { FortuneData } from '../orrery/types'
import { DEFAULT_WEIGHTS } from '../weights'
import { buildCalibrationPrompt } from './prompt-templates/calibration'
import { SECTION_INSTRUCTIONS } from './prompt-templates/sections'

export function buildUserMessage(data: FortuneData): string {
  const { input, systems, timeUnknown, currentYear } = data
  const { birth, marriageStatus, pastEvents } = input
  const parts: string[] = []

  // Birth data
  parts.push('[출�� 정보]')
  parts.push(
    `생년월일시: ${birth.year}-${String(birth.month).padStart(2, '0')}-${String(birth.day).padStart(2, '0')} ${String(birth.hour).padStart(2, '0')}:${String(birth.minute).padStart(2, '0')}`
  )
  parts.push(`성별: ${birth.gender === 'M' ? '남성' : '여성'}`)
  if (birth.latitude && birth.longitude) {
    parts.push(`출생��� 좌표: (${birth.latitude}, ${birth.longitude})`)
  }
  parts.push(
    `결혼 여부: ${marriageStatus.married ? `기혼 (${marriageStatus.marriageYear}년)` : '미혼'}`
  )
  if (timeUnknown) {
    parts.push('⚠️ 태어난 시간 미상 (기본값 12:00 적용)')
  }

  // Saju data
  parts.push('')
  parts.push('[사주팔자 데이터]')
  parts.push(JSON.stringify(systems.saju, null, 0))

  // Ziwei data
  parts.push('')
  parts.push('[자미두수 데이터]')
  parts.push(JSON.stringify(systems.ziwei, null, 0))

  // Natal data
  parts.push('')
  parts.push('[서양 점성술 데이터]')
  parts.push(JSON.stringify(systems.natal, null, 0))

  // Weight matrix
  parts.push('')
  parts.push('[가중치 매트릭스]')
  for (const [domain, weights] of Object.entries(DEFAULT_WEIGHTS)) {
    parts.push(
      `- ${domain}: 사주 ${weights.saju * 100}% / 자미두수 ${weights.ziwei * 100}% / 점성술 ${weights.natal * 100}%`
    )
  }

  // Calibration (if past events provided)
  if (
    pastEvents &&
    (pastEvents.childhoodHardships?.length ||
      pastEvents.meetingDates?.length ||
      pastEvents.breakupDates?.length)
  ) {
    parts.push('')
    parts.push(buildCalibrationPrompt(pastEvents))

    // Include actual calculated ziwei liunian data for past event years
    if (data.pastLiunians && Object.keys(data.pastLiunians).length > 0) {
      parts.push('')
      parts.push('[과거 연도 자미두수 유년운 실제 계산 데이터]')
      parts.push('아래는 과거 이벤트 연도에 대해 실제 계산된 자미두수 유년운입니다.')
      parts.push('이 데이터를 사주/점성술의 과거 신호와 함께 교차 대조하여, 어떤 체계가 이 사람에게 더 정확했는지 판단하세요.')
      for (const [year, liunianData] of Object.entries(data.pastLiunians)) {
        parts.push(`${year}년 유년운: ${JSON.stringify(liunianData, null, 0)}`)
      }
    }
  }

  // Section instructions
  parts.push('')
  parts.push(SECTION_INSTRUCTIONS)

  // Current year reminder
  parts.push('')
  parts.push(`[현재 연도: ${currentYear}년]`)
  parts.push(
    `${currentYear}년 월간 운세 섹션에서는 반드시 ${currentYear}년 기준으로 작성하세요.`
  )

  return parts.join('\n')
}
