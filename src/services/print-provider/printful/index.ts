import type {
  PrintProduct,
  PrintVariant,
  PrintProvider,
  OrderPayload,
  FulfillmentOrder,
  FulfillmentStatus,
} from '@/services/print-provider/types'
import {
  fetchPrintfulProducts,
  fetchPrintfulProduct,
  createPrintfulOrder,
  fetchPrintfulOrderStatus,
  type PrintfulSyncVariant,
  type PrintfulSyncProductDetail,
} from '@/services/print-provider/printful/api'

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function toCents(price: string): number {
  return Math.round(parseFloat(price) * 100)
}

function mapVariant(v: PrintfulSyncVariant): PrintVariant {
  return {
    id: String(v.id),
    name: v.name,
    priceAud: toCents(v.retail_price),
    providerVariantId: String(v.variant_id),
  }
}

function mapProduct(detail: PrintfulSyncProductDetail): PrintProduct {
  const { sync_product, sync_variants } = detail
  return {
    id: String(sync_product.id),
    name: sync_product.name,
    slug: toSlug(sync_product.name),
    description: '',
    thumbnailUrl: sync_product.thumbnail_url,
    variants: sync_variants.map(mapVariant),
  }
}

export class PrintfulProvider implements PrintProvider {
  async getProducts(): Promise<PrintProduct[]> {
    const summaries = await fetchPrintfulProducts()
    const details = await Promise.all(summaries.map((p) => fetchPrintfulProduct(String(p.id))))
    return details.map(mapProduct)
  }

  async getProduct(id: string): Promise<PrintProduct> {
    const detail = await fetchPrintfulProduct(id)
    return mapProduct(detail)
  }

  async createOrder(order: OrderPayload): Promise<FulfillmentOrder> {
    const result = await createPrintfulOrder(order)
    return {
      fulfillmentId: String(result.id),
      status: result.status,
    }
  }

  async getOrderStatus(fulfillmentId: string): Promise<FulfillmentStatus> {
    const result = await fetchPrintfulOrderStatus(fulfillmentId)
    const shipment = result.shipments[0]
    return {
      fulfillmentId: String(result.id),
      status: result.status,
      trackingNumber: shipment?.tracking_number,
      trackingUrl: shipment?.tracking_url,
    }
  }
}
