export interface FortuneSection {
  id: string
  title: string
  summary: string
  content: string
  probabilities?: Probability[]
  keyPeriods?: KeyPeriod[]
  systemSources: string[]
}

export interface Probability {
  label: string
  percentage: number
  explanation: string
}

export interface KeyPeriod {
  period: string
  significance: string
  confidence: number
}

export interface CalibrationResult {
  systemAccuracy: { saju: number; ziwei: number; natal: number }
  adjustedWeights: Record<
    string,
    { saju: number; ziwei: number; natal: number }
  >
  explanation: string
}

export interface FortuneResponse {
  calibration?: CalibrationResult
  sections: FortuneSection[]
}
