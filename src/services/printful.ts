const PRINTFUL_BASE = 'https://api.printful.com'
const REVALIDATE = 3600

export interface PrintProduct {
  id: string
  title: string
  location: string
  price: number
  currency: string
  thumbnailUrl: string | null
  dimensions: { width: number; height: number } | null
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
  product: {
    variant_id: number
    product_id: number
    image: string
    name: string
  }
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

// ---- Dimension parsing from catalog product name (e.g. "Enhanced Matte Paper Poster (in) - 18×24") ----
function parseDimensions(catalogName: string): { width: number; height: number } | null {
  const [, w, h] = catalogName.match(/(\d+)\s*[×x]\s*(\d+)/i) ?? []
  if (!w || !h) return null
  return { width: parseInt(w, 10), height: parseInt(h, 10) }
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
    next: { revalidate: REVALIDATE },
  })
  if (!res.ok) throw new Error(`Printful /sync/products failed: ${res.status}`)
  const data: PrintfulListResponse = await res.json()
  return data.result
}

async function getSyncProduct(id: number): Promise<PrintfulSyncProductDetail> {
  const res = await fetch(`${PRINTFUL_BASE}/sync/products/${id}`, {
    headers: authHeader(),
    next: { revalidate: REVALIDATE },
  })
  if (!res.ok) throw new Error(`Printful /sync/products/${id} failed: ${res.status}`)
  const data: PrintfulDetailResponse = await res.json()
  return data.result
}

// ---- Main export ----
export async function fetchPrintProducts(): Promise<PrintProduct[]> {
  const summaries = await listSyncProducts()
  const products: PrintProduct[] = []

  await Promise.all(
    summaries.map(async (summary) => {
      const detail = await getSyncProduct(summary.id)
      const { title, location } = parseProductName(detail.sync_product.name)

      const cheapest = detail.sync_variants.reduce<PrintfulSyncVariant | null>((best, v) => {
        const price = parseFloat(v.retail_price)
        if (isNaN(price)) return best
        if (!best || price < parseFloat(best.retail_price)) return v
        return best
      }, null)

      if (!cheapest) return

      products.push({
        id: String(detail.sync_product.id),
        title,
        location,
        price: parseFloat(cheapest.retail_price),
        currency: cheapest.currency,
        thumbnailUrl: summary.thumbnail_url,
        dimensions: parseDimensions(cheapest.product?.name ?? ''),
      })
    }),
  )

  return products
}
