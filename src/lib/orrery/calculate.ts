import type { FortuneInput, FortuneData } from './types'
import { adaptSaju } from './saju-adapter'
import { adaptZiwei } from './ziwei-adapter'
import { adaptNatal } from './natal-adapter'

function collectPastEventYears(input: FortuneInput): number[] {
  const years = new Set<number>()
  const events = input.pastEvents
  if (!events) return []
  events.childhoodHardships?.forEach((e) => e.year && years.add(e.year))
  events.meetingDates?.forEach((e) => e.year && years.add(e.year))
  events.breakupDates?.forEach((e) => e.year && years.add(e.year))
  return Array.from(years)
}

export async function calculateAllSystems(
  input: FortuneInput
): Promise<FortuneData> {
  try {
    const { calculateSaju } = await import('@orrery/core/saju')
    const { createChart, calculateLiunian, getDaxianList } = await import(
      '@orrery/core/ziwei'
    )
    const { calculateNatal } = await import('@orrery/core/natal')

    const birth = input.birth
    const timeUnknown = birth.timeUnknown ?? false

    // unknownTime: default to noon (12:00)
    const effectiveHour = timeUnknown ? 12 : birth.hour
    const effectiveMinute = timeUnknown ? 0 : birth.minute

    const birthInput = {
      year: birth.year,
      month: birth.month,
      day: birth.day,
      hour: effectiveHour,
      minute: effectiveMinute,
      gender: birth.gender,
      latitude: birth.latitude,
      longitude: birth.longitude,
    }

    // Saju (sync)
    const sajuResult = calculateSaju(birthInput)
    const saju = adaptSaju(sajuResult)

    // Ziwei (sync) - isMale boolean
    const ziweiChart = createChart(
      birth.year,
      birth.month,
      birth.day,
      effectiveHour,
      effectiveMinute,
      birth.gender === 'M'
    )
    const currentYear = new Date().getFullYear()
    const liunian = calculateLiunian(ziweiChart, currentYear)
    const daxian = getDaxianList(ziweiChart)

    // Calculate liunian for next 2 years (detailed short-term prediction)
    const liunianNext1 = calculateLiunian(ziweiChart, currentYear + 1)
    const liunianNext2 = calculateLiunian(ziweiChart, currentYear + 2)

    // Calculate liunian for past event years (real cross-validation)
    const pastYears = collectPastEventYears(input)
    const pastLiunians: Record<number, unknown> = {}
    for (const year of pastYears) {
      pastLiunians[year] = calculateLiunian(ziweiChart, year)
    }

    const ziwei = adaptZiwei(ziweiChart, liunian, daxian)

    // Natal (async)
    const natalResult = await calculateNatal(birthInput)
    const natal = adaptNatal(natalResult)

    return {
      input,
      systems: { saju, ziwei, natal },
      futureLiunians: {
        [currentYear + 1]: liunianNext1,
        [currentYear + 2]: liunianNext2,
      },
      pastLiunians,
      timeUnknown,
      currentYear,
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown calculation error'
    throw new Error(
      `Fortune calculation failed: ${message}. Check birth data validity.`
    )
  }
}
