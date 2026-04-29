import type { Metadata } from 'next'
import type { PrintProduct } from '@/services/printful'
import { ShopGrid } from '@/components/ShopGrid'
import { fetchShopProducts } from '@/data/shop'

export const metadata: Metadata = {
  title: 'Shop',
}

export default async function ShopPage() {
  let products: PrintProduct[] = []
  try {
    products = await fetchShopProducts()
  } catch (err) {
    console.error('[ShopPage] Failed to fetch Printful products:', err)
  }

  return (
    <main className="pt-16">
      <ShopGrid products={products} />
    </main>
  )
}
