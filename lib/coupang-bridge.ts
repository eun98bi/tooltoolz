import { promises as fs } from 'fs'
import path from 'path'

export type CoupangBridgeData = {
  slug: string
  title: string
  price: string
  imageUrl: string
  deepLink: string
  sourceUrl: string
  publishedAt: string
}

export async function getCoupangBridge(slug: string): Promise<CoupangBridgeData | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'coupang', `${slug}.json`)
    const raw = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(raw) as CoupangBridgeData
  } catch {
    return null
  }
}
