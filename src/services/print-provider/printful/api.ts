import type { OrderPayload } from '../types'

const BASE_URL = 'https://api.printful.com'

export interface PrintfulSyncProductSummary {
  id: number
  name: string
  thumbnail_url: string
}

export interface PrintfulSyncVariant {
  id: number
  name: string
  retail_price: string
  variant_id: number
}

export interface PrintfulSyncProductDetail {
  sync_product: PrintfulSyncProductSummary
  sync_variants: PrintfulSyncVariant[]
}

export interface PrintfulShipment {
  tracking_number: string
  tracking_url: string
}

export interface PrintfulOrder {
  id: number
  status: string
  shipments: PrintfulShipment[]
}

function getApiKey(): string {
  const key = process.env.PRINTFUL_API_KEY
  if (!key) throw new Error('PRINTFUL_API_KEY is not set')
  return key
}

async function printfulFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Printful API error ${res.status} at ${path}: ${text}`)
  }

  const json = (await res.json()) as { result: T }
  return json.result
}

export async function fetchPrintfulProducts(): Promise<PrintfulSyncProductSummary[]> {
  return printfulFetch<PrintfulSyncProductSummary[]>('/store/products')
}

export async function fetchPrintfulProduct(id: string): Promise<PrintfulSyncProductDetail> {
  return printfulFetch<PrintfulSyncProductDetail>(`/store/products/${id}`)
}

export async function createPrintfulOrder(payload: OrderPayload): Promise<PrintfulOrder> {
  return printfulFetch<PrintfulOrder>('/orders', {
    method: 'POST',
    body: JSON.stringify({
      external_id: payload.stripeSessionId,
      recipient: {
        name: payload.shippingAddress.name,
        address1: payload.shippingAddress.address1,
        address2: payload.shippingAddress.address2,
        city: payload.shippingAddress.city,
        state_code: payload.shippingAddress.state,
        country_code: payload.shippingAddress.country,
        zip: payload.shippingAddress.zip,
      },
      items: payload.items.map((item) => ({
        variant_id: Number(item.providerVariantId),
        quantity: item.quantity,
      })),
    }),
  })
}

export async function fetchPrintfulOrderStatus(fulfillmentId: string): Promise<PrintfulOrder> {
  return printfulFetch<PrintfulOrder>(`/orders/${fulfillmentId}`)
}
