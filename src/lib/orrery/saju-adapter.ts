import type { SajuData } from './types'

export function adaptSaju(sajuResult: any): SajuData {
  const pillars = {
    year: extractPillar(sajuResult.pillars?.year),
    month: extractPillar(sajuResult.pillars?.month),
    day: extractPillar(sajuResult.pillars?.day),
    hour: extractPillar(sajuResult.pillars?.hour),
  }

  // Map -> plain object conversion (Map serializes to {} with JSON.stringify)
  const relations =
    sajuResult.relations?.pairs instanceof Map
      ? Object.fromEntries(sajuResult.relations.pairs)
      : sajuResult.relations?.pairs ?? {}

  return {
    pillars,
    daewoon: sajuResult.daewoon ?? [],
    relations,
    specialSals: sajuResult.specialSals ?? [],
    gongmang: sajuResult.gongmang ?? null,
  }
}

function extractPillar(pillar: any) {
  if (!pillar) return { stem: '', branch: '' }
  return {
    stem: pillar.stem ?? '',
    branch: pillar.branch ?? '',
    element: pillar.element,
    yinyang: pillar.yinyang,
    hiddenStems: pillar.hiddenStems,
  }
}
