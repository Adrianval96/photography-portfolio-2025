import { REVALIDATE_SECONDS } from '@/constants'

const PRINTFUL_BASE = 'https://api.printful.com'

export interface PrintProduct {
  id: string
  title: string
  location: string
  price: number
  currency: string
  thumbnailUrl: string | null
  isLandscape: boolean
}

// ---- Printful v1 API types ----
interface PrintfulSyncProductSummary {
  id: number
  name: string
  thumbnail_url: string | null
}

interface PrintfulSyncVariant {
  id: number
  name: string
  retail_price: string
  currency: string
  product: { name: string }
}

interface PrintfulSyncProductDetail {
  sync_product: {
    id: number
    name: string
    thumbnail_url: string | null
  }
  sync_variants: PrintfulSyncVariant[]
}

interface PrintfulListResponse {
  code: number
  result: PrintfulSyncProductSummary[]
}

interface PrintfulDetailResponse {
  code: number
  result: PrintfulSyncProductDetail
}

// ---- Orientation detection from catalog product name (e.g. "Enhanced Matte Paper Poster (in) - 18×24") ----
function isLandscape(catalogName: string): boolean {
  const sep = catalogName.indexOf('×')
  if (sep === -1) return false
  const w = Number(catalogName.slice(0, sep).trim().split(' ').at(-1))
  const h = Number(
    catalogName
      .slice(sep + 1)
      .trim()
      .split(' ')
      .at(0),
  )
  return !isNaN(w) && !isNaN(h) && w > h
}

// ---- Product name parsing ----
function parseProductName(name: string): { title: string; location: string } {
  const sep = name.indexOf(' | ')
  if (sep !== -1) return { title: name.slice(0, sep).trim(), location: name.slice(sep + 3).trim() }
  return { title: name.trim(), location: '' }
}

// ---- API calls ----
function authHeader(): HeadersInit {
  const key = process.env.PRINTFUL_API_KEY
  if (!key) throw new Error('PRINTFUL_API_KEY is not configured')
  return { Authorization: `Bearer ${key}` }
}

async function listSyncProducts(): Promise<PrintfulSyncProductSummary[]> {
  const res = await fetch(`${PRINTFUL_BASE}/sync/products`, {
    headers: authHeader(),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Printful /sync/products failed: ${res.status}`)
  const data: PrintfulListResponse = await res.json()
  return data.result
}

async function getSyncProduct(id: number): Promise<PrintfulSyncProductDetail> {
  const res = await fetch(`${PRINTFUL_BASE}/sync/products/${id}`, {
    headers: authHeader(),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Printful /sync/products/${id} failed: ${res.status}`)
  const data: PrintfulDetailResponse = await res.json()
  return data.result
}

// ---- Concurrency limiter (max 5 parallel detail requests) ----
function withConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  limit: number,
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = new Array(tasks.length)
    let started = 0
    let finished = 0

    function next() {
      if (started === tasks.length) return
      const index = started++
      tasks[index]()
        .then((value) => {
          results[index] = value
          finished++
          if (finished === tasks.length) resolve(results)
          else next()
        })
        .catch(reject)
    }

    for (let i = 0; i < Math.min(limit, tasks.length); i++) next()
    if (tasks.length === 0) resolve([])
  })
}

// ---- Main export ----
export async function fetchPrintProducts(): Promise<PrintProduct[]> {
  const summaries = await listSyncProducts()

  const settled = await withConcurrency(
    summaries.map((summary) => () => getSyncProduct(summary.id)),
    5,
  )

  return settled
    .map((detail, i) => {
      const { title, location } = parseProductName(detail.sync_product.name)

      const cheapest = detail.sync_variants.reduce<PrintfulSyncVariant | null>((best, v) => {
        const price = parseFloat(v.retail_price)
        if (isNaN(price)) return best
        if (!best || price < parseFloat(best.retail_price)) return v
        return best
      }, null)

      if (!cheapest) return null

      return {
        id: String(detail.sync_product.id),
        title,
        location,
        price: parseFloat(cheapest.retail_price),
        currency: cheapest.currency,
        thumbnailUrl: summaries[i].thumbnail_url,
        isLandscape: isLandscape(cheapest.product?.name ?? ''),
      }
    })
    .filter((p): p is PrintProduct => p !== null)
}
