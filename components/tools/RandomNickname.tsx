'use client'
import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'

type Style = 'cute' | 'cool' | 'funny' | 'nature'

const DATA: Record<Style, { adj: string[]; noun: string[] }> = {
  cute: {
    adj: ['귀여운', '깜찍한', '사랑스러운', '포근한', '달콤한', '따뜻한', '보들보들한', '조그마한', '복슬복슬한', '방긋방긋'],
    noun: ['고양이', '강아지', '토끼', '곰돌이', '햄스터', '병아리', '다람쥐', '판다', '뽀삐', '뭉치'],
  },
  cool: {
    adj: ['쿨한', '세련된', '날카로운', '차가운', '도도한', '냉정한', '멋있는', '강렬한', '카리스마', '시크한'],
    noun: ['늑대', '독수리', '표범', '매', '사자', '까마귀', '흑표', '검은여우', '팬텀', '블레이드'],
  },
  funny: {
    adj: ['웃긴', '엉뚱한', '졸린', '배고픈', '게으른', '덜렁대는', '허당', '뚱뚱한', '울보', '잠보'],
    noun: ['감자', '고구마', '바나나', '두부', '떡볶이', '붕어빵', '순대', '만두', '삼겹살', '치즈볼'],
  },
  nature: {
    adj: ['빛나는', '자유로운', '푸른', '은빛', '황금빛', '새벽', '별빛', '초록', '하얀', '깊은'],
    noun: ['구름', '바람', '별', '달', '강', '산', '숲', '파도', '이슬', '안개'],
  },
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generate(style: Style): string {
  const { adj, noun } = DATA[style]
  return `${pick(adj)} ${pick(noun)}`
}

export default function RandomNickname() {
  const t = useTranslations('tools.random-nickname')
  const [style, setStyle] = useState<Style>('cute')
  const [count, setCount] = useState(5)
  const [nicknames, setNicknames] = useState<string[]>([])
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const generateAll = useCallback(() => {
    setNicknames(Array.from({ length: count }, () => generate(style)))
  }, [style, count])

  function copyOne(i: number) {
    navigator.clipboard.writeText(nicknames[i])
    setCopiedIdx(i)
    setTimeout(() => setCopiedIdx(null), 1500)
  }

  const STYLES: Style[] = ['cute', 'cool', 'funny', 'nature']

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="flex flex-wrap gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 items-center">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('styleLabel')}</p>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button key={s} onClick={() => setStyle(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${style === s ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300'}`}>
                {t(`styles.${s}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('countLabel')}</p>
          <div className="flex items-center gap-3">
            <input type="range" min={1} max={10} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-24 accent-indigo-600" />
            <span className="text-sm font-bold w-4 text-indigo-600 dark:text-indigo-400">{count}</span>
          </div>
        </div>
      </div>

      <button onClick={generateAll}
        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors text-sm">
        {t('generate')}
      </button>

      {nicknames.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {nicknames.map((nick, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <span className="text-gray-900 dark:text-gray-100 font-medium">{nick}</span>
              <button onClick={() => copyOne(i)}
                className={`ml-3 shrink-0 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${copiedIdx === i ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'}`}>
                {copiedIdx === i ? t('copied') : t('copy')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
