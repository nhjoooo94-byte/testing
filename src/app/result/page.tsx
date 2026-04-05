'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import SectionCard from '@/components/result/section-card'
import { parseSectionLine } from '@/lib/claude/response-parser'
import { SECTION_TITLES, SECTION_ICONS, SECTION_IDS } from '@/lib/constants'
import type { FortuneSection } from '@/lib/claude/types'
import type { SectionId } from '@/lib/constants'

type Status = 'loading' | 'streaming' | 'done' | 'error'

export default function ResultPage() {
  const router = useRouter()
  const [sections, setSections] = useState<FortuneSection[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [currentSectionLabel, setCurrentSectionLabel] = useState('운세를 분석하고 있습니다...')

  useEffect(() => {
    const raw = sessionStorage.getItem('fortuneInput')
    if (!raw) {
      router.replace('/')
      return
    }

    let input: unknown
    try {
      input = JSON.parse(raw)
    } catch {
      router.replace('/')
      return
    }

    // sseBuffer: incomplete SSE line; textAccum: accumulated Claude text output
    let sseBuffer = ''
    let textAccum = ''
    const controller = new AbortController()

    async function fetchFortune() {
      try {
        const res = await fetch('/api/fortune', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
          signal: controller.signal,
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error((errData as { error?: string }).error ?? `HTTP ${res.status}`)
        }

        if (!res.body) throw new Error('No response body')

        setStatus('streaming')
        const reader = res.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          sseBuffer += decoder.decode(value, { stream: true })

          // Process complete SSE lines
          const lines = sseBuffer.split('\n')
          sseBuffer = lines.pop() ?? ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed || !trimmed.startsWith('data:')) continue

            const data = trimmed.slice(5).trim()
            if (data === '[DONE]') {
              setStatus('done')
              continue
            }

            let parsed: { text?: string; error?: string }
            try {
              parsed = JSON.parse(data)
            } catch {
              continue
            }

            if (parsed.error) {
              setErrorMsg(parsed.error)
              setStatus('error')
              return
            }

            if (parsed.text) {
              // Accumulate Claude text chunks — each JSON section arrives on its own line
              textAccum += parsed.text

              // Try to parse any complete newline-delimited JSON lines from the accumulator
              const textLines = textAccum.split('\n')
              // Keep the last (potentially incomplete) line in the accumulator
              textAccum = textLines.pop() ?? ''

              for (const textLine of textLines) {
                const section = parseSectionLine(textLine)
                if (section) {
                  setSections((prev) => {
                    const exists = prev.find((s) => s.id === section.id)
                    if (exists) return prev
                    const next = [...prev, section]
                    // Update progress label to next pending section
                    const nextPending = SECTION_IDS.find(
                      (id) => !next.find((s) => s.id === id)
                    )
                    if (nextPending) {
                      setCurrentSectionLabel(
                        `${SECTION_TITLES[nextPending as SectionId]} 분석 중...`
                      )
                    }
                    return next
                  })
                }
              }
            }
          }
        }

        // Try to parse any remaining accumulated text as a section
        if (textAccum.trim()) {
          const section = parseSectionLine(textAccum)
          if (section) {
            setSections((prev) => {
              const exists = prev.find((s) => s.id === section.id)
              if (exists) return prev
              return [...prev, section]
            })
          }
        }

        setStatus('done')
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setErrorMsg(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
        setStatus('error')
      }
    }

    fetchFortune()
    return () => controller.abort()
  }, [router]) // eslint-disable-line react-hooks/exhaustive-deps

  const isLoading = status === 'loading' || (status === 'streaming' && sections.length === 0)

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-hanji-bg)' }}>
      <Header />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8">
        {/* Page title */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-bold tracking-wide"
            style={{ color: 'var(--color-red-primary)', fontFamily: 'var(--font-heading)' }}
          >
            운세 결과
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-ink-medium)' }}>
            사주 · 자미두수 · 점성술 교차검증 분석
          </p>
        </div>

        {/* Error state */}
        {status === 'error' && (
          <div
            className="fortune-card p-6 text-center mb-6"
            style={{ borderColor: 'var(--color-red-primary)' }}
          >
            <p className="text-lg mb-2" style={{ color: 'var(--color-red-primary)' }}>
              오류가 발생했습니다
            </p>
            <p className="text-sm mb-4" style={{ color: 'var(--color-ink-medium)' }}>
              {errorMsg}
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--color-red-primary)' }}
            >
              처음으로 돌아가기
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-4">
            <div
              className="text-center text-sm mb-4 ink-loading"
              style={{ color: 'var(--color-gold-accent)' }}
            >
              {currentSectionLabel}
            </div>
            {SECTION_IDS.map((id) => (
              <div
                key={id}
                className="fortune-card p-6 ink-loading"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: 'var(--color-gold-light)' }}
                  />
                  <div
                    className="h-5 rounded w-32"
                    style={{ backgroundColor: 'var(--color-gold-light)' }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="h-3 rounded w-full" style={{ backgroundColor: 'var(--color-gold-light)' }} />
                  <div className="h-3 rounded w-5/6" style={{ backgroundColor: 'var(--color-gold-light)' }} />
                  <div className="h-3 rounded w-4/5" style={{ backgroundColor: 'var(--color-gold-light)' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Streaming progress indicator */}
        {status === 'streaming' && sections.length > 0 && sections.length < SECTION_IDS.length && (
          <div
            className="text-center text-sm mb-4 ink-loading"
            style={{ color: 'var(--color-gold-accent)' }}
          >
            {currentSectionLabel} ({sections.length}/{SECTION_IDS.length})
          </div>
        )}

        {/* Section cards */}
        <div className="space-y-4">
          {sections.map((section, i) => {
            const icon = SECTION_ICONS[section.id as SectionId]
            return (
              <SectionCard
                key={section.id}
                section={section}
                icon={icon}
                delay={i * 100}
              />
            )
          })}
        </div>

        {/* Done state — remaining skeleton slots */}
        {status === 'streaming' && sections.length > 0 && sections.length < SECTION_IDS.length && (
          <div className="space-y-4 mt-4">
            {SECTION_IDS.filter((id) => !sections.find((s) => s.id === id)).map((id) => (
              <div key={id} className="fortune-card p-6 ink-loading">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{SECTION_ICONS[id as SectionId]}</span>
                  <div
                    className="h-5 rounded w-40"
                    style={{ backgroundColor: 'var(--color-gold-light)' }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="h-3 rounded w-full" style={{ backgroundColor: 'var(--color-gold-light)' }} />
                  <div className="h-3 rounded w-4/5" style={{ backgroundColor: 'var(--color-gold-light)' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Done CTA */}
        {status === 'done' && sections.length > 0 && (
          <div className="text-center mt-8 fade-in-up">
            <p className="text-sm mb-4" style={{ color: 'var(--color-ink-medium)' }}>
              분석이 완료되었습니다
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-red-primary)' }}
            >
              다시 보기
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
