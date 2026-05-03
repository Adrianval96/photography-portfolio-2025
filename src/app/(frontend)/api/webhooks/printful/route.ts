import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const maxDuration = 30

const PRINTFUL_BASE = 'https://api.printful.com'

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

interface ProductSyncedEvent {
  type: string
  data: {
    sync_product: {
      id: number
    }
  }
}

function verifySignature(rawBody: string, header: string | null): boolean {
  const secret = process.env.PRINTFUL_WEBHOOK_SECRET
  if (!secret || !header) return false
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(header, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

async function fetchSyncProduct(id: number): Promise<PrintfulSyncProductDetail> {
  const key = process.env.PRINTFUL_API_KEY
  if (!key) throw new Error('PRINTFUL_API_KEY is not configured')
  const res = await fetch(`${PRINTFUL_BASE}/sync/products/${id}`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Printful /sync/products/${id} failed: ${res.status}`)
  const data = (await res.json()) as { code: number; result: PrintfulSyncProductDetail }
  return data.result
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.text()
  const signature = req.headers.get('x-printful-signature')

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: unknown
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = event as ProductSyncedEvent
  if (parsed?.type !== 'product_synced') {
    return NextResponse.json({ received: true })
  }

  const syncProductId = parsed.data?.sync_product?.id
  if (!syncProductId) {
    return NextResponse.json({ error: 'Missing sync_product.id' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  try {
    const detail = await fetchSyncProduct(syncProductId)
    const { sync_product, sync_variants } = detail

    const productData = {
      printfulSyncProductId: sync_product.id,
      name: sync_product.name,
      imageUrl: sync_product.thumbnail_url ?? undefined,
      status: 'synced' as const,
      variants: sync_variants.map((v) => ({
        printfulVariantId: v.id,
        format: v.name,
        price: parseFloat(v.retail_price),
      })),
      lastSyncedAt: new Date().toISOString(),
    }

    const existing = await payload.find({
      collection: 'products',
      where: { printfulSyncProductId: { equals: sync_product.id } },
      limit: 1,
    })

    const [existingDoc] = existing.docs
    if (existingDoc) {
      await payload.update({
        collection: 'products',
        id: existingDoc.id,
        data: productData,
      })
    } else {
      await payload.create({
        collection: 'products',
        data: productData,
      })
    }
  } catch (err) {
    payload.logger.error({ err, message: 'Printful webhook: failed to upsert product' })
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
