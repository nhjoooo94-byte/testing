import type { FortuneSection } from '@/lib/claude/types'
import ProbabilityBadge from './probability-badge'
import KeyPeriod from './key-period'

interface SectionCardProps {
  section: FortuneSection
  icon?: string
  delay?: number
}

export default function SectionCard({ section, icon, delay = 0 }: SectionCardProps) {
  return (
    <div
      className="fortune-card p-6 fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b" style={{ borderColor: 'var(--color-gold-light)' }}>
        {icon && <span className="text-2xl">{icon}</span>}
        <h2
          className="text-xl font-bold"
          style={{ color: 'var(--color-ink-dark)', fontFamily: 'var(--font-heading)' }}
        >
          {section.title}
        </h2>
        {section.systemSources.length > 0 && (
          <div className="ml-auto flex gap-1 flex-wrap justify-end">
            {section.systemSources.map((src) => (
              <span
                key={src}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: 'rgba(196, 30, 58, 0.08)',
                  color: 'var(--color-red-primary)',
                  border: '1px solid rgba(196, 30, 58, 0.2)',
                }}
              >
                {src}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <p
        className="text-base font-medium leading-relaxed mb-4"
        style={{ color: 'var(--color-ink-dark)' }}
      >
        {section.summary}
      </p>

      {/* Content paragraphs */}
      <div className="space-y-2 mb-4">
        {section.content.split('\n').filter(Boolean).map((paragraph, i) => (
          <p
            key={i}
            className="text-sm leading-7"
            style={{ color: 'var(--color-ink-medium)' }}
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Probabilities */}
      {section.probabilities && section.probabilities.length > 0 && (
        <div
          className="mt-4 pt-4 border-t"
          style={{ borderColor: 'var(--color-gold-light)' }}
        >
          <h3
            className="text-sm font-semibold mb-3 tracking-wide uppercase"
            style={{ color: 'var(--color-gold-accent)' }}
          >
            확률 분석
          </h3>
          {section.probabilities.map((prob, i) => (
            <ProbabilityBadge
              key={i}
              label={prob.label}
              percentage={prob.percentage}
              explanation={prob.explanation}
            />
          ))}
        </div>
      )}

      {/* Key Periods */}
      {section.keyPeriods && section.keyPeriods.length > 0 && (
        <div
          className="mt-4 pt-4 border-t"
          style={{ borderColor: 'var(--color-gold-light)' }}
        >
          <h3
            className="text-sm font-semibold mb-3 tracking-wide uppercase"
            style={{ color: 'var(--color-gold-accent)' }}
          >
            주요 시기
          </h3>
          {section.keyPeriods.map((kp, i) => (
            <KeyPeriod
              key={i}
              period={kp.period}
              significance={kp.significance}
              confidence={kp.confidence}
            />
          ))}
        </div>
      )}
    </div>
  )
}
