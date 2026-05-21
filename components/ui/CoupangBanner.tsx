'use client'
import { useEffect } from 'react'

declare global {
  interface Window {
    PartnersCoupang: {
      G: new (config: Record<string, string | number>) => void
    }
  }
}

export default function CoupangBanner() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://ads-partners.coupang.com/g.js'
    script.onload = () => {
      new window.PartnersCoupang.G({
        id: 991100,
        template: 'carousel',
        trackingCode: 'AF9566167',
        width: '680',
        height: '140',
        tsource: '',
      })
    }
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="mt-10">
      <div id="coupang-banner" />
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
        이 배너는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  )
}
