'use client'

export interface DateEvent {
  year: number
  month?: number
}

export interface PastEventsData {
  childhoodHardships: DateEvent[]
  meetingDates: DateEvent[]
  breakupDates: DateEvent[]
}

interface PastEventsFormProps {
  data: PastEventsData
  onChange: (data: PastEventsData) => void
  onSkip: () => void
  onBack: () => void
  onSubmit: () => void
}

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i)
const months = Array.from({ length: 12 }, (_, i) => i + 1)

const selectStyle = {
  backgroundColor: 'var(--color-hanji-cream)',
  borderColor: 'var(--color-gold-light)',
  color: 'var(--color-ink-dark)',
}

function DateEventList({
  label,
  items,
  max,
  onChange,
}: {
  label: string
  items: DateEvent[]
  max: number
  onChange: (items: DateEvent[]) => void
}) {
  function updateItem(index: number, patch: Partial<DateEvent>) {
    const updated = [...items]
    updated[index] = { ...updated[index], ...patch }
    onChange(updated)
  }

  return (
    <div>
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: 'var(--color-ink-dark)' }}
      >
        {label} (최대 {max}개)
      </label>

      {items.map((item, i) => (
        <div key={i} className="flex gap-2 mb-2 items-center">
          <select
            className="flex-1 rounded-lg px-3 py-2.5 text-sm border focus:outline-none transition-colors"
            style={selectStyle}
            value={item.year || ''}
            onChange={(e) => updateItem(i, { year: Number(e.target.value) })}
          >
            <option value="">년도 선택</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}년</option>
            ))}
          </select>
          <select
            className="w-24 rounded-lg px-3 py-2.5 text-sm border focus:outline-none transition-colors"
            style={selectStyle}
            disabled={!item.year}
            value={item.month ?? ''}
            onChange={(e) =>
              updateItem(i, { month: e.target.value ? Number(e.target.value) : undefined })
            }
          >
            <option value="">월</option>
            {months.map((m) => (
              <option key={m} value={m}>{m}월</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-colors shrink-0"
            style={{ borderColor: 'var(--color-gold-light)', color: 'var(--color-ink-medium)' }}
          >
            ✕
          </button>
        </div>
      ))}

      {items.length < max && (
        <button
          type="button"
          onClick={() => onChange([...items, { year: 0 }])}
          className="w-full py-2 rounded-lg text-sm border border-dashed transition-colors"
          style={{
            borderColor: 'var(--color-gold-light)',
            color: 'var(--color-gold-accent)',
          }}
        >
          + 시기 추가 ({items.length}/{max})
        </button>
      )}
    </div>
  )
}

export default function PastEventsForm({ data, onChange, onSkip, onBack, onSubmit }: PastEventsFormProps) {
  function update(patch: Partial<PastEventsData>) {
    onChange({ ...data, ...patch })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <span
          className="inline-block text-xs px-3 py-1 rounded-full tracking-widest font-medium"
          style={{
            backgroundColor: 'rgba(212, 168, 71, 0.15)',
            color: 'var(--color-gold-accent)',
            border: '1px solid rgba(212, 168, 71, 0.3)',
          }}
        >
          선택 사항
        </span>
        <p className="text-sm mt-2" style={{ color: 'var(--color-ink-medium)' }}>
          과거 사건을 입력하면 더 정확한 운세를 제공할 수 있습니다
        </p>
      </div>

      <DateEventList
        label="가장 힘들었던 시기"
        items={data.childhoodHardships}
        max={3}
        onChange={(items) => update({ childhoodHardships: items })}
      />

      <DateEventList
        label="만남 시기"
        items={data.meetingDates}
        max={3}
        onChange={(items) => update({ meetingDates: items })}
      />

      <DateEventList
        label="헤어짐 시기"
        items={data.breakupDates}
        max={3}
        onChange={(items) => update({ breakupDates: items })}
      />

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl text-sm font-medium border transition-colors"
          style={{
            borderColor: 'var(--color-gold-light)',
            color: 'var(--color-ink-medium)',
            backgroundColor: 'transparent',
          }}
        >
          이전
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="flex-1 py-3 rounded-xl text-sm font-medium border transition-colors"
          style={{
            borderColor: 'var(--color-gold-accent)',
            color: 'var(--color-gold-accent)',
            backgroundColor: 'transparent',
          }}
        >
          건너뛰기
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-colors"
          style={{ backgroundColor: 'var(--color-red-primary)' }}
        >
          운세 보기
        </button>
      </div>
    </div>
  )
}
