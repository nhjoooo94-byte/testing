import type { ZiweiData } from './types'

export function adaptZiwei(
  chart: any,
  liunian: any,
  daxian: any[]
): ZiweiData {
  return {
    chart: serializeChart(chart),
    liunian: liunian ?? null,
    daxian: daxian ?? [],
  }
}

function serializeChart(chart: any): unknown {
  if (!chart) return null

  // ZiweiChart.palaces is Record<string, ZiweiPalace> (not an array)
  const palaces: Record<string, unknown> = {}
  if (chart.palaces) {
    for (const [key, palace] of Object.entries(chart.palaces)) {
      const p = palace as any
      palaces[key] = {
        name: p.name,
        stars: p.stars?.map((s: any) => ({
          name: s.name,
          brightness: s.brightness,
          siHua: s.siHua,
        })),
      }
    }
  }

  return {
    mingGongZhi: chart.mingGongZhi,
    shenGongZhi: chart.shenGongZhi,
    wuXingJu: chart.wuXingJu,
    palaces,
  }
}
