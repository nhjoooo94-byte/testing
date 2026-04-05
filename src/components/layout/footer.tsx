export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer
      className="w-full py-4 px-4 text-center mt-auto"
      style={{ color: 'var(--color-ink-medium)' }}
    >
      <p className="text-xs opacity-40">
        © {year} Sun Fortune
      </p>
      <p className="text-[10px] mt-1 opacity-20">
        <a
          href="https://github.com/nhjoo/sun-fortune"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-60 transition-opacity"
        >
          open source
        </a>
      </p>
    </footer>
  )
}
