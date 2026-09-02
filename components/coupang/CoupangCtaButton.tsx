'use client'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export default function CoupangCtaButton({
  slug,
  title,
  deepLink,
}: {
  slug: string
  title: string
  deepLink: string
}) {
  const handleClick = () => {
    window.gtag?.('event', 'coupang_click', { slug, title })
  }

  return (
    <a
      href={deepLink}
      onClick={handleClick}
      className="block w-full rounded-xl bg-gray-900 px-6 py-4 text-center text-base font-semibold text-white active:scale-[0.99] dark:bg-white dark:text-gray-900"
    >
      쿠팡에서 최저가 확인하기
    </a>
  )
}
