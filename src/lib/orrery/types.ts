export interface FortuneInput {
  birth: {
    year: number
    month: number
    day: number
    hour: number
    minute: number
    gender: 'M' | 'F'
    latitude?: number
    longitude?: number
    timeUnknown?: boolean
  }
  marriageStatus: {
    married: boolean
    marriageYear?: number
  }
  pastEvents?: {
    childhoodHardships?: { year: number; month?: number }[]
    meetingDates?: { year: number; month?: number }[]
    breakupDates?: { year: number; month?: number }[]
  }
}

export interface SystemResults {
  saju: SajuData
  ziwei: ZiweiData
  natal: NatalData
}

export interface SajuData {
  pillars: {
    year: PillarInfo
    month: PillarInfo
    day: PillarInfo
    hour: PillarInfo
  }
  daewoon: DaewoonItem[]
  relations: Record<string, unknown>
  specialSals: unknown[]
  gongmang: unknown
}

export interface PillarInfo {
  stem: string
  branch: string
  element?: string
  yinyang?: string
  hiddenStems?: string[]
}

export interface DaewoonItem {
  ageStart: number
  ageEnd: number
  ganZhi?: string
  [key: string]: unknown
}

export interface ZiweiData {
  chart: unknown
  liunian: unknown
  daxian: unknown[]
}

export interface NatalData {
  planets: Record<string, PlanetInfo>
  houses: Record<string, unknown>
  angles: {
    asc?: { sign: string; degree: number }
    mc?: { sign: string; degree: number }
    [key: string]: unknown
  } | null
  aspects: AspectInfo[]
}

export interface PlanetInfo {
  sign: string
  degreeInSign?: number
  house?: number
  isRetrograde?: boolean
  [key: string]: unknown
}

export interface AspectInfo {
  planet1: string
  planet2: string
  type: string
  orb?: number
}

export interface FortuneData {
  input: FortuneInput
  systems: SystemResults
  pastLiunians: Record<number, unknown>
  timeUnknown: boolean
  currentYear: number
}
