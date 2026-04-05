'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import BirthInfoForm from '@/components/form/birth-info-form'
import PastEventsForm from '@/components/form/past-events-form'

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

interface PastEventsData {
  childhoodHardships: { year: number; month?: number }[]
  meetingDates: { year: number; month?: number }[]
  breakupDates: { year: number; month?: number }[]
}

const currentYear = new Date().getFullYear()

const defaultBirth: BirthData = {
  year: 0,
  month: 0,
  day: 0,
  hour: 0,
  minute: 0,
  gender: 'F',
}

const defaultMarriage: MarriageData = { married: false }
const defaultPastEvents: PastEventsData = {
  childhoodHardships: [],
  meetingDates: [],
  breakupDates: [],
}

export default function HomePage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [birthData, setBirthData] = useState<BirthData>(defaultBirth)
  const [marriageData, setMarriageData] = useState<MarriageData>(defaultMarriage)
  const [pastEvents, setPastEvents] = useState<PastEventsData>(defaultPastEvents)

  function handleSubmit(events?: PastEventsData) {
    const hasEvents = events &&
      (events.childhoodHardships.some(e => e.year) ||
       events.meetingDates.some(e => e.year) ||
       events.breakupDates.some(e => e.year))
    const cleanEvents = hasEvents ? {
      childhoodHardships: events!.childhoodHardships.filter(e => e.year),
      meetingDates: events!.meetingDates.filter(e => e.year),
      breakupDates: events!.breakupDates.filter(e => e.year),
    } : undefined
    const fortuneInput = {
      birth: birthData,
      marriageStatus: marriageData,
      pastEvents: cleanEvents,
    }
    sessionStorage.setItem('fortuneInput', JSON.stringify(fortuneInput))
    router.push('/result')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-hanji-bg)' }}>
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        {/* Decorative title */}
        <div className="text-center mb-8">
          <div
            className="inline-block text-5xl font-black tracking-tight mb-3"
            style={{ color: 'var(--color-red-primary)', fontFamily: 'var(--font-heading)' }}
          >
            운명을 보다
          </div>
          <p className="text-base max-w-md mx-auto leading-relaxed" style={{ color: 'var(--color-ink-medium)' }}>
            하나가 아닌 세 개의 체계로
            <br className="hidden sm:block" />
            가장 확률 높은 미래를 미리 엿보세요
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                style={
                  step === s
                    ? { backgroundColor: 'var(--color-red-primary)', color: '#fff' }
                    : step > s
                    ? { backgroundColor: 'var(--color-gold-accent)', color: '#fff' }
                    : { backgroundColor: 'var(--color-gold-light)', color: 'var(--color-ink-medium)' }
                }
              >
                {step > s ? '✓' : s}
              </div>
              <span
                className="text-xs font-medium hidden sm:block"
                style={{ color: step === s ? 'var(--color-ink-dark)' : 'var(--color-ink-medium)' }}
              >
                {s === 1 ? '기본 정보' : '과거 사건'}
              </span>
              {s < 2 && (
                <div
                  className="w-8 h-px hidden sm:block"
                  style={{ backgroundColor: 'var(--color-gold-light)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div
          className="fortune-card w-full max-w-lg p-6 sm:p-8"
        >
          <h2
            className="text-lg font-bold mb-5"
            style={{ color: 'var(--color-ink-dark)', fontFamily: 'var(--font-heading)' }}
          >
            {step === 1 ? '생년월일 정보' : '과거 사건 (선택)'}
          </h2>

          {step === 1 ? (
            <BirthInfoForm
              birthData={birthData}
              marriageData={marriageData}
              onBirthChange={setBirthData}
              onMarriageChange={setMarriageData}
              onNext={() => setStep(2)}
            />
          ) : (
            <PastEventsForm
              data={pastEvents}
              onChange={setPastEvents}
              onSkip={() => handleSubmit(undefined)}
              onBack={() => setStep(1)}
              onSubmit={() => handleSubmit(pastEvents)}
            />
          )}
        </div>

        {/* Decorative note */}
        <p className="text-xs mt-6 text-center max-w-xs" style={{ color: 'var(--color-ink-medium)', opacity: 0.6 }}>
          입력하신 정보는 운세 계산에만 사용되며 서버에 저장되지 않습니다
        </p>
      </main>

      <Footer />
    </div>
  )
}
