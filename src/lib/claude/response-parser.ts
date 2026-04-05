import { z } from 'zod'
import type { FortuneSection } from './types'

const ProbabilitySchema = z.object({
  label: z.string(),
  percentage: z.number().min(0).max(100),
  explanation: z.string(),
})

const KeyPeriodSchema = z.object({
  period: z.string(),
  significance: z.string(),
  confidence: z.number().min(0).max(100),
})

const SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  content: z.string(),
  probabilities: z.array(ProbabilitySchema).optional(),
  keyPeriods: z.array(KeyPeriodSchema).optional(),
  systemSources: z.array(z.string()),
})

function clampProbability(value: number): number {
  return Math.min(95, Math.max(60, Math.round(value)))
}

export function parseSectionLine(line: string): FortuneSection | null {
  const trimmed = line.trim()
  if (!trimmed) return null

  try {
    const raw = JSON.parse(trimmed)
    const parsed = SectionSchema.parse(raw)

    // Filter: only show 60%+ probabilities, clamp to 60-95 range
    if (parsed.probabilities) {
      parsed.probabilities = parsed.probabilities
        .filter((p) => p.percentage >= 60)
        .map((p) => ({
          ...p,
          percentage: clampProbability(p.percentage),
        }))
    }
    if (parsed.keyPeriods) {
      parsed.keyPeriods = parsed.keyPeriods
        .filter((kp) => kp.confidence >= 60)
        .map((kp) => ({
          ...kp,
          confidence: clampProbability(kp.confidence),
        }))
    }

    return parsed as FortuneSection
  } catch {
    return null
  }
}
