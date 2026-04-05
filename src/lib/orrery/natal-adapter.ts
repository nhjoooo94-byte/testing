import type { NatalData, PlanetInfo, AspectInfo } from './types'

export function adaptNatal(natalResult: any): NatalData {
  const planets: Record<string, PlanetInfo> = {}
  if (natalResult.planets) {
    for (const [key, planet] of Object.entries(natalResult.planets)) {
      const p = planet as any
      planets[key] = {
        sign: p.sign ?? '',
        degreeInSign: p.degreeInSign,
        house: p.house,
        isRetrograde: p.isRetrograde ?? false,
      }
    }
  }

  const aspects: AspectInfo[] = (natalResult.aspects ?? []).map((a: any) => ({
    planet1: a.planet1 ?? '',
    planet2: a.planet2 ?? '',
    type: a.type ?? '',
    orb: a.orb,
  }))

  return {
    planets,
    houses: natalResult.houses ?? {},
    angles: natalResult.angles ?? null,
    aspects,
  }
}
