'use client'

import { useState, useEffect, useRef } from 'react'
import { filterCities } from '@orrery/core/cities'

interface City {
  name: string
  lat: number
  lon: number
}

interface BirthData {
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

interface MarriageData {
  married: boolean
  marriageYear?: number
}

interface BirthInfoFormProps {
  birthData: BirthData
  marriageData: MarriageData
  onBirthChange: (data: BirthData) => void
  onMarriageChange: (data: MarriageData) => void
  onNext: () => void
}

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i)
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = Array.from({ length: 12 }, (_, i) => i * 5) // 0,5,10,...55

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

export default function BirthInfoForm({
  birthData,
  marriageData,
  onBirthChange,
  onMarriageChange,
  onNext,
}: BirthInfoFormProps) {
  const [cityQuery, setCityQuery] = useState('')
  const [citySuggestions, setCitySuggestions] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const cityRef = useRef<HTMLDivElement>(null)

  const daysInMonth = getDaysInMonth(birthData.year, birthData.month)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // City search
  useEffect(() => {
    if (cityQuery.trim().length < 1) {
      setCitySuggestions([])
      return
    }
    const results = filterCities(cityQuery).slice(0, 8)
    setCitySuggestions(results as City[])
  }, [cityQuery])

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function updateBirth(patch: Partial<BirthData>) {
    onBirthChange({ ...birthData, ...patch })
  }

  function selectCity(city: City) {
    setSelectedCity(city)
    setCityQuery(city.name)
    setShowSuggestions(false)
    updateBirth({ latitude: city.lat, longitude: city.lon })
  }

  function clearCity() {
    setSelectedCity(null)
    setCityQuery('')
    updateBirth({ latitude: undefined, longitude: undefined })
  }

  const isValid =
    birthData.year &&
    birthData.month &&
    birthData.day &&
    (birthData.timeUnknown || (birthData.hour !== undefined && birthData.minute !== undefined))

  return (
    <div className="space-y-5">
      {/* Gender toggle */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink-dark)' }}>
          성별
        </label>
        <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--color-gold-light)' }}>
          {(['M', 'F'] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => updateBirth({ gender: g })}
              className="flex-1 py-2.5 text-sm font-medium transition-colors"
              style={
                birthData.gender === g
                  ? { backgroundColor: 'var(--color-red-primary)', color: '#fff' }
                  : { backgroundColor: 'var(--color-hanji-cream)', color: 'var(--color-ink-medium)' }
              }
            >
              {g === 'M' ? '남성 ♂' : '여성 ♀'}
            </button>
          ))}
        </div>
      </div>

      {/* Birth date — number inputs */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink-dark)' }}>
          생년월일
        </label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="number"
              min={1900}
              max={currentYear}
              placeholder="1990"
              className="w-full rounded-lg px-2 py-2.5 text-sm border focus:outline-none transition-colors pr-7"
              style={{
                backgroundColor: 'var(--color-hanji-cream)',
                borderColor: 'var(--color-gold-light)',
                color: 'var(--color-ink-dark)',
              }}
              value={birthData.year}
              onChange={(e) => {
                const v = Number(e.target.value)
                if (v >= 1900 && v <= currentYear) updateBirth({ year: v, day: 1 })
              }}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none" style={{ color: 'var(--color-ink-medium)' }}>년</span>
          </div>
          <div className="w-20 relative">
            <input
              type="number"
              min={1}
              max={12}
              placeholder="1"
              className="w-full rounded-lg px-2 py-2.5 text-sm border focus:outline-none transition-colors pr-7"
              style={{
                backgroundColor: 'var(--color-hanji-cream)',
                borderColor: 'var(--color-gold-light)',
                color: 'var(--color-ink-dark)',
              }}
              value={birthData.month}
              onChange={(e) => {
                const v = Number(e.target.value)
                if (v >= 1 && v <= 12) updateBirth({ month: v, day: 1 })
              }}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none" style={{ color: 'var(--color-ink-medium)' }}>월</span>
          </div>
          <div className="w-20 relative">
            <input
              type="number"
              min={1}
              max={daysInMonth}
              placeholder="1"
              className="w-full rounded-lg px-2 py-2.5 text-sm border focus:outline-none transition-colors pr-7"
              style={{
                backgroundColor: 'var(--color-hanji-cream)',
                borderColor: 'var(--color-gold-light)',
                color: 'var(--color-ink-dark)',
              }}
              value={birthData.day}
              onChange={(e) => {
                const v = Number(e.target.value)
                if (v >= 1 && v <= daysInMonth) updateBirth({ day: v })
              }}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none" style={{ color: 'var(--color-ink-medium)' }}>일</span>
          </div>
        </div>
      </div>

      {/* Birth time — number inputs */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink-dark)' }}>
          태어난 시간
        </label>
        <div className="flex gap-2 mb-2">
          <div className="flex-1 relative">
            <input
              type="number"
              min={0}
              max={23}
              placeholder="12"
              className="w-full rounded-lg px-2 py-2.5 text-sm border focus:outline-none transition-colors disabled:opacity-40 pr-7"
              style={{
                backgroundColor: 'var(--color-hanji-cream)',
                borderColor: 'var(--color-gold-light)',
                color: 'var(--color-ink-dark)',
              }}
              disabled={birthData.timeUnknown}
              value={birthData.hour}
              onChange={(e) => {
                const v = Number(e.target.value)
                if (v >= 0 && v <= 23) updateBirth({ hour: v })
              }}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none" style={{ color: 'var(--color-ink-medium)' }}>시</span>
          </div>
          <div className="w-28 relative">
            <input
              type="number"
              min={0}
              max={55}
              step={5}
              placeholder="0"
              className="w-full rounded-lg px-2 py-2.5 text-sm border focus:outline-none transition-colors disabled:opacity-40 pr-7"
              style={{
                backgroundColor: 'var(--color-hanji-cream)',
                borderColor: 'var(--color-gold-light)',
                color: 'var(--color-ink-dark)',
              }}
              disabled={birthData.timeUnknown}
              value={birthData.minute}
              onChange={(e) => {
                const v = Number(e.target.value)
                if (v >= 0 && v <= 55) updateBirth({ minute: Math.round(v / 5) * 5 })
              }}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none" style={{ color: 'var(--color-ink-medium)' }}>분</span>
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!birthData.timeUnknown}
            onChange={(e) => updateBirth({ timeUnknown: e.target.checked })}
            className="w-4 h-4 rounded"
            style={{ accentColor: 'var(--color-red-primary)' }}
          />
          <span className="text-sm" style={{ color: 'var(--color-ink-medium)' }}>
            시간 모름
          </span>
        </label>
      </div>

      {/* Birth place */}
      <div ref={cityRef}>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink-dark)' }}>
          태어난 장소 <span className="font-normal text-xs opacity-60">(선택)</span>
        </label>
        <div className="relative">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="도시명 또는 초성으로 검색 (예: 서울, ㅅㅇ)"
              className="flex-1 rounded-lg px-3 py-2.5 text-sm border focus:outline-none transition-colors"
              style={{
                backgroundColor: 'var(--color-hanji-cream)',
                borderColor: selectedCity ? 'var(--color-gold-accent)' : 'var(--color-gold-light)',
                color: 'var(--color-ink-dark)',
              }}
              value={cityQuery}
              onChange={(e) => {
                setCityQuery(e.target.value)
                setShowSuggestions(true)
                if (!e.target.value) clearCity()
              }}
              onFocus={() => cityQuery && setShowSuggestions(true)}
            />
            {selectedCity && (
              <button
                type="button"
                onClick={clearCity}
                className="px-3 rounded-lg text-sm border transition-colors"
                style={{
                  borderColor: 'var(--color-gold-light)',
                  color: 'var(--color-ink-medium)',
                  backgroundColor: 'var(--color-hanji-cream)',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {showSuggestions && citySuggestions.length > 0 && (
            <ul
              className="absolute z-10 w-full mt-1 rounded-lg border overflow-hidden shadow-lg"
              style={{
                backgroundColor: 'var(--color-hanji-cream)',
                borderColor: 'var(--color-gold-light)',
              }}
            >
              {citySuggestions.map((city) => (
                <li key={`${city.name}-${city.lat}`}>
                  <button
                    type="button"
                    onClick={() => selectCity(city)}
                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-gold-light/20 transition-colors"
                    style={{ color: 'var(--color-ink-dark)' }}
                  >
                    {city.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedCity && (
          <p className="text-xs mt-1" style={{ color: 'var(--color-gold-accent)' }}>
            위도 {selectedCity.lat.toFixed(2)}° · 경도 {selectedCity.lon.toFixed(2)}°
          </p>
        )}
      </div>

      {/* Marriage status */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink-dark)' }}>
          결혼 여부
        </label>
        <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--color-gold-light)' }}>
          {[
            { label: '미혼', value: false },
            { label: '기혼', value: true },
          ].map(({ label, value }) => (
            <button
              key={label}
              type="button"
              onClick={() => onMarriageChange({ ...marriageData, married: value })}
              className="flex-1 py-2.5 text-sm font-medium transition-colors"
              style={
                marriageData.married === value
                  ? { backgroundColor: 'var(--color-red-primary)', color: '#fff' }
                  : { backgroundColor: 'var(--color-hanji-cream)', color: 'var(--color-ink-medium)' }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {marriageData.married && (
          <div className="mt-3">
            <label className="block text-xs mb-1.5" style={{ color: 'var(--color-ink-medium)' }}>
              결혼 연도
            </label>
            <select
              className="w-full rounded-lg px-3 py-2.5 text-sm border focus:outline-none transition-colors"
              style={{
                backgroundColor: 'var(--color-hanji-cream)',
                borderColor: 'var(--color-gold-light)',
                color: 'var(--color-ink-dark)',
              }}
              value={marriageData.marriageYear ?? ''}
              onChange={(e) =>
                onMarriageChange({
                  ...marriageData,
                  marriageYear: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            >
              <option value="">선택 안함</option>
              {years.slice(0, 50).map((y) => (
                <option key={y} value={y}>{y}년</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Next button */}
      <button
        type="button"
        onClick={onNext}
        disabled={!isValid}
        className="w-full py-3.5 rounded-xl text-base font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: 'var(--color-red-primary)' }}
      >
        다음 단계 →
      </button>
    </div>
  )
}
