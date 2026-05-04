const PRINTFUL_BASE = 'https://api.printful.com'

export interface PrintfulSyncVariant {
  id: number
  name: string
  size: string
  retail_price: string
  currency: string
  product: { name: string }
  files: Array<{ type: string; preview_url: string | null }>
}

export interface PrintfulSyncProductDetail {
  sync_product: {
    id: number
    name: string
    thumbnail_url: string | null
  }
  sync_variants: PrintfulSyncVariant[]
}

interface PrintfulDetailResponse {
  code: number
  result: PrintfulSyncProductDetail
}

// ---- API calls ----
function authHeader(): HeadersInit {
  const key = process.env.PRINTFUL_API_KEY
  if (!key) throw new Error('PRINTFUL_API_KEY is not configured')
  return { Authorization: `Bearer ${key}` }
}

export async function getSyncProduct(id: number): Promise<PrintfulSyncProductDetail> {
  const res = await fetch(`${PRINTFUL_BASE}/sync/products/${id}`, {
    headers: authHeader(),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Printful /sync/products/${id} failed: ${res.status}`)
  const data: PrintfulDetailResponse = await res.json()
  return data.result
}
