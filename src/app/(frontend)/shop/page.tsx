import type { Metadata } from 'next'
import { ShopGrid } from '@/components/ShopGrid'

export const metadata: Metadata = {
  title: 'Shop',
}

export default function ShopPage() {
  return (
    <main className="pt-16">
      <ShopGrid />
    </main>
  )
}
