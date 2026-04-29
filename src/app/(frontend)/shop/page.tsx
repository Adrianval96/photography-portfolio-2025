import type { Metadata } from 'next'
import { ShopGrid } from '@/components/ShopGrid'
import { fetchShopProducts } from '@/data/shop'

export const metadata: Metadata = {
  title: 'Shop',
}

export default async function ShopPage() {
  const products = await fetchShopProducts()

  return (
    <main className="pt-16">
      <ShopGrid products={products} />
    </main>
  )
}
