export const DEFAULT_WEIGHTS = {
  personality: { saju: 0.5, ziwei: 0.2, natal: 0.3 },
  lifeDirection: { saju: 0.5, ziwei: 0.2, natal: 0.3 },
  monthly: { saju: 0.25, ziwei: 0.25, natal: 0.5 },
  love: { saju: 0.2, ziwei: 0.5, natal: 0.3 },
  wealth: { saju: 0.25, ziwei: 0.5, natal: 0.25 },
  health: { saju: 0.4, ziwei: 0.35, natal: 0.25 },
  career: { saju: 0.25, ziwei: 0.5, natal: 0.25 },
} as const

export type WeightDomain = keyof typeof DEFAULT_WEIGHTS
