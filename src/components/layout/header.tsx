export default function Header() {
  return (
    <header className="w-full py-6 px-4 text-center border-b border-gold-light bg-hanji-cream/60 backdrop-blur-sm">
      <h1
        className="text-3xl font-bold tracking-widest"
        style={{ color: 'var(--color-red-primary)', fontFamily: 'var(--font-heading)' }}
      >
        Sun Fortune
      </h1>
      <p
        className="mt-1 text-sm tracking-[0.25em]"
        style={{ color: 'var(--color-gold-accent)' }}
      >
        사주 · 자미두수 · 점성술
      </p>
    </header>
  )
}
