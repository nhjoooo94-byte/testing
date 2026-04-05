export const SECTION_IDS = [
  'personality',
  'life-direction',
  'monthly',
  'love',
  'wealth',
  'health',
  'career',
] as const

export type SectionId = (typeof SECTION_IDS)[number]

export const SECTION_TITLES: Record<SectionId, string> = {
  personality: '기본 성향 분석',
  'life-direction': '삶의 방향성',
  monthly: `${new Date().getFullYear()}년 월간 운세`,
  love: '연애운 · 결혼운',
  wealth: '재물운',
  health: '건강운',
  career: '직업운',
}

export const SECTION_ICONS: Record<SectionId, string> = {
  personality: '🪞',
  'life-direction': '🧭',
  monthly: '📅',
  love: '💕',
  wealth: '💰',
  health: '🏥',
  career: '💼',
}
