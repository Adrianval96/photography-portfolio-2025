const PRINTFUL_BASE = 'https://api.printful.com'
const REVALIDATE = 3600

export type PrintFormat = 'portrait' | 'landscape' | 'cinema'

export interface PrintProduct {
  id: string
  title: string
  location: string
  price: number
  currency: string
  format: PrintFormat
  thumbnailUrl: string | null
}

export interface PrintSection {
  format: PrintFormat
  label: string
  dims: string
  products: PrintProduct[]
}

const SECTION_META: Record<PrintFormat, { label: string; dims: string }> = {
  portrait: { label: 'Native Print — Portrait', dims: '18 × 24 in' },
  landscape: { label: 'Native Print — Landscape', dims: '24 × 18 in' },
  cinema: { label: 'Cinema Poster', dims: '36 × 24 in' },
}

const SECTION_ORDER: PrintFormat[] = ['portrait', 'landscape', 'cinema']

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

// ---- Dimension classification ----
const DIMENSION_PATTERN = /(\d+)\s*[×xX]\s*(\d+)/

function parseDimensions(text: string): { width: number; height: number } | null {
  const match = text.match(DIMENSION_PATTERN)
  if (!match) return null
  return { width: Number(match[1]), height: Number(match[2]) }
}

function classifyFormat(width: number, height: number): PrintFormat {
  if (width < height) return 'portrait'
  return width / height >= 1.4 ? 'cinema' : 'landscape'
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
export async function fetchPrintSections(): Promise<PrintSection[]> {
  const summaries = await listSyncProducts()

  const productMap = new Map<string, PrintProduct>()

  await Promise.all(
    summaries.map(async (summary) => {
      const detail = await getSyncProduct(summary.id)
      const { title, location } = parseProductName(detail.sync_product.name)

      for (const variant of detail.sync_variants) {
        const dims = parseDimensions(variant.name) ?? parseDimensions(detail.sync_product.name)
        if (!dims) continue

        const format = classifyFormat(dims.width, dims.height)
        const price = parseFloat(variant.retail_price)
        if (isNaN(price)) continue

        const key = `${detail.sync_product.id}-${format}`
        const existing = productMap.get(key)

        if (!existing || price < existing.price) {
          productMap.set(key, {
            id: key,
            title,
            location,
            price,
            currency: variant.currency,
            format,
            thumbnailUrl: summary.thumbnail_url,
          })
        }
      }
    }),
  )

  return SECTION_ORDER.map((format) => ({
    format,
    ...SECTION_META[format],
    products: Array.from(productMap.values()).filter((p) => p.format === format),
  }))
}
