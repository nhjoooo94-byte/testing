interface ProbabilityBadgeProps {
  label: string
  percentage: number
  explanation: string
}

export default function ProbabilityBadge({ label, percentage, explanation }: ProbabilityBadgeProps) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span
          className="text-sm font-medium"
          style={{ color: 'var(--color-ink-dark)' }}
        >
          {label}
        </span>
        <span
          className="text-sm font-bold"
          style={{ color: 'var(--color-gold-accent)' }}
        >
          {percentage}%
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: '8px', backgroundColor: 'var(--color-gold-light)', opacity: 0.4 }}
      >
        <div
          className="prob-bar h-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p
        className="text-xs mt-1 leading-relaxed"
        style={{ color: 'var(--color-ink-medium)' }}
      >
        {explanation}
      </p>
    </div>
  )
}
