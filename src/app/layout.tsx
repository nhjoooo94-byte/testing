import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sun Fortune — 사주 · 자미두수 · 점성술 교차검증 운세',
  description:
    '사주팔자, 자미두수, 서양 점성술 3개 체계를 AI가 교차검증하여 가장 확률 높은 미래를 보여주는 운세 앱',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
