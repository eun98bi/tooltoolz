import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

interface AnalyzeResult {
  rankings: { tag: string; count: number }[]
  skipped: string[]
  totalAnalyzed: number
}

const MAX_URLS = 10

const FETCH_HEADERS: HeadersInit = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
  Referer: 'https://map.naver.com/',
}

function isListUrl(url: string): boolean {
  return /pcmap\.place\.naver\.com\/[^/?]+\/list/.test(url)
}

function extractPlaceId(url: string): string | null {
  const pcmapMatch = url.match(/pcmap\.place\.naver\.com\/place\/(\d+)/)
  if (pcmapMatch) return pcmapMatch[1]

  const mobileMatch = url.match(/m\.place\.naver\.com\/place\/(\d+)/)
  if (mobileMatch) return mobileMatch[1]

  const generalMatch = url.match(/place\.naver\.com\/[^/]+\/(\d+)/)
  if (generalMatch) return generalMatch[1]

  const idOnlyMatch = url.trim().match(/^(\d+)$/)
  if (idOnlyMatch) return idOnlyMatch[1]

  return null
}

async function fetchPlaceIdsFromList(listUrl: string, limit: number): Promise<string[]> {
  try {
    const cleanUrl = listUrl.split('#')[0]
    const res = await fetch(cleanUrl, { headers: FETCH_HEADERS, cache: 'no-store' })
    if (!res.ok) return []

    const html = await res.text()
    const idSet = new Set<string>()

    Array.from(html.matchAll(/"id"\s*:\s*"(\d{7,14})"/g)).forEach((match) => {
      idSet.add(match[1])
    })
    Array.from(html.matchAll(/\/[a-zA-Z_-]+\/(\d{7,14})(?:\/|"|'|\s)/g)).forEach((match) => {
      idSet.add(match[1])
    })

    return Array.from(idSet).slice(0, limit)
  } catch {
    return []
  }
}

async function fetchKeywords(placeId: string): Promise<string[] | null> {
  const targetUrl = `https://pcmap.place.naver.com/place/${placeId}/home`

  try {
    const res = await fetch(targetUrl, { headers: FETCH_HEADERS, cache: 'no-store' })
    if (!res.ok) return null

    const html = await res.text()
    const match = html.match(/"keywordList"\s*:\s*(\[[^\]]*\])/)
    if (!match) return null

    const parsed: unknown = JSON.parse(match[1])
    if (!Array.isArray(parsed)) return null

    return parsed.filter((v): v is string => typeof v === 'string')
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  let urls: unknown
  try {
    const body = await req.json()
    urls = body?.urls
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: 'A list of urls is required.' }, { status: 400 })
  }

  const validUrls = urls
    .filter((u): u is string => typeof u === 'string' && u.trim() !== '')
    .slice(0, MAX_URLS)

  if (validUrls.length === 0) {
    return NextResponse.json({ error: 'A list of urls is required.' }, { status: 400 })
  }

  const skipped: string[] = []
  const tagCounts: Record<string, number> = {}
  let totalAnalyzed = 0

  const placeIds: string[] = []
  for (const url of validUrls) {
    if (isListUrl(url)) {
      const ids = await fetchPlaceIdsFromList(url, MAX_URLS)
      if (ids.length === 0) {
        skipped.push(url)
      } else {
        placeIds.push(...ids)
      }
    } else {
      const id = extractPlaceId(url)
      if (!id) {
        skipped.push(url)
      } else {
        placeIds.push(id)
      }
    }
  }

  const uniqueIds = Array.from(new Set(placeIds)).slice(0, MAX_URLS)

  for (const placeId of uniqueIds) {
    const keywords = await fetchKeywords(placeId)
    if (!keywords || keywords.length === 0) {
      skipped.push(placeId)
      continue
    }

    totalAnalyzed++
    for (const tag of keywords) {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1
    }

    await new Promise((r) => setTimeout(r, 300))
  }

  const rankings = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))

  const result: AnalyzeResult = { rankings, skipped, totalAnalyzed }
  return NextResponse.json(result)
}
