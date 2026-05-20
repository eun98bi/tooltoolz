'use client'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function inline(s: string): string {
  return s
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+?)\*/g, '<em>$1</em>')
    .replace(/_([^_\n]+?)_/g, '<em>$1</em>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="md-img"/>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="md-a">$1</a>')
}

function render(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++])
      out.push(`<pre class="md-pre"><code${lang ? ` class="lang-${lang}"` : ''}>${esc(code.join('\n'))}</code></pre>`)
      i++; continue
    }

    // ATX heading
    const hm = line.match(/^(#{1,6})\s+(.+)$/)
    if (hm) {
      const lvl = hm[1].length
      out.push(`<h${lvl} class="md-h${lvl}">${inline(hm[2])}</h${lvl}>`)
      i++; continue
    }

    // HR
    if (/^[-*_]{3,}$/.test(line.trim())) {
      out.push('<hr class="md-hr"/>')
      i++; continue
    }

    // Blockquote
    if (line.startsWith('>')) {
      const bq: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) bq.push(lines[i++].replace(/^>\s?/, ''))
      out.push(`<blockquote class="md-bq">${render(bq.join('\n'))}</blockquote>`)
      continue
    }

    // Unordered list
    if (/^[-*+]\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*+]\s/.test(lines[i]))
        items.push(`<li class="md-li">${inline(lines[i++].replace(/^[-*+]\s+/, ''))}</li>`)
      out.push(`<ul class="md-ul">${items.join('')}</ul>`)
      continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i]))
        items.push(`<li class="md-li">${inline(lines[i++].replace(/^\d+\.\s+/, ''))}</li>`)
      out.push(`<ol class="md-ol">${items.join('')}</ol>`)
      continue
    }

    // Empty line
    if (line.trim() === '') { i++; continue }

    // Paragraph
    const para: string[] = []
    while (i < lines.length) {
      const l = lines[i]
      if (!l.trim() || l.startsWith('#') || l.startsWith('>') || l.startsWith('```') ||
          /^[-*+]\s/.test(l) || /^\d+\.\s/.test(l) || /^[-*_]{3,}$/.test(l.trim())) break
      para.push(lines[i++])
    }
    if (para.length) out.push(`<p class="md-p">${para.map(inline).join('<br/>')}</p>`)
  }

  return out.join('\n')
}

export default function MarkdownPreview() {
  const t = useTranslations('tools.markdown-preview')
  const [input, setInput] = useState('')

  const html = useMemo(() => (input ? render(input) : ''), [input])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('inputLabel')}</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)}
          placeholder={t('placeholder')} rows={22} spellCheck={false}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('previewLabel')}</label>
        <div
          className="markdown-body flex-1 min-h-[22rem] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-4 overflow-auto text-sm text-gray-900 dark:text-gray-100"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
