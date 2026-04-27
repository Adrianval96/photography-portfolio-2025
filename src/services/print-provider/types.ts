export interface PrintVariant {
  id: string
  name: string
  priceAud: number
  providerVariantId: string
}

export interface PrintProduct {
  id: string
  name: string
  slug: string
  description: string
  thumbnailUrl: string
  variants: PrintVariant[]
}

export interface OrderPayload {
  stripeSessionId: string
  customer: {
    name: string
    email: string
  }
  shippingAddress: {
    name: string
    address1: string
    address2?: string
    city: string
    state: string
    country: string
    zip: string
  }
  items: Array<{
    providerVariantId: string
    quantity: number
  }>
}

export interface FulfillmentOrder {
  fulfillmentId: string
  status: string
}

export interface FulfillmentStatus {
  fulfillmentId: string
  status: string
  trackingNumber?: string
  trackingUrl?: string
}

export interface PrintProvider {
  getProducts(): Promise<PrintProduct[]>
  getProduct(id: string): Promise<PrintProduct>
  createOrder(order: OrderPayload): Promise<FulfillmentOrder>
  getOrderStatus(fulfillmentId: string): Promise<FulfillmentStatus>
}
