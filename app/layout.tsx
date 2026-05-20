import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL('https://tooltoolz.com'),
  title: 'tooltoolz — 웹 툴 모음',
  description: '개발자·디자이너·일반 사용자를 위한 무료 온라인 툴 모음. 설치 없이 바로 사용하세요.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
