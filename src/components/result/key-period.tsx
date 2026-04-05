interface KeyPeriodProps {
  period: string
  significance: string
  confidence: number
}

export default function KeyPeriod({ period, significance, confidence }: KeyPeriodProps) {
  return (
    <div
      className="gold-border pl-3 py-2 mb-2 rounded-r-md"
      style={{ backgroundColor: 'rgba(212, 168, 71, 0.08)' }}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-bold text-sm"
          style={{ color: 'var(--color-ink-dark)' }}
        >
          {period}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            backgroundColor: 'var(--color-gold-accent)',
            color: 'var(--color-hanji-bg)',
          }}
        >
          {confidence}%
        </span>
      </div>
      <p
        className="text-xs mt-1 leading-relaxed"
        style={{ color: 'var(--color-ink-medium)' }}
      >
        {significance}
      </p>
    </div>
  )
}
