import { NextRequest, NextResponse } from 'next/server'
import { getSyncProduct } from '@/services/printful'
import { upsertProduct } from '@/data/products'

export const maxDuration = 30

const HANDLED_EVENTS = new Set(['product_synced', 'product_updated'])

interface ProductEvent {
  type: string
  data: {
    sync_product: {
      id: number
    }
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let event: unknown
  try {
    event = JSON.parse(await req.text())
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = event as ProductEvent
  if (!HANDLED_EVENTS.has(parsed?.type)) {
    return NextResponse.json({ received: true })
  }

  const syncProductId = parsed.data?.sync_product?.id
  if (!syncProductId) {
    return NextResponse.json({ error: 'Missing sync_product.id' }, { status: 400 })
  }

  try {
    const detail = await getSyncProduct(syncProductId)
    await upsertProduct(detail)
  } catch (err) {
    console.error('Printful webhook: failed to upsert product', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
