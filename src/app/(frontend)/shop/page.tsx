import type { Metadata } from 'next'
import { ShopGrid } from '@/components/ShopGrid'
import { fetchShopSections } from '@/data/shop'

export const metadata: Metadata = {
  title: 'Shop',
}

export default async function ShopPage() {
  const sections = await fetchShopSections()

  return (
    <main className="pt-16">
      <ShopGrid sections={sections} />
    </main>
  )
}
