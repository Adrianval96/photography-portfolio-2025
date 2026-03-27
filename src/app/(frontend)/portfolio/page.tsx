import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { GalleryGrid } from '@/components/GalleryGrid'

export const metadata: Metadata = {
  title: 'Portfolio',
}

export default async function PortfolioPage() {
  const payload = await getPayload({ config: configPromise })

  const [{ docs: items }, { docs: categories }] = await Promise.all([
    payload.find({
      collection: 'portfolio-items',
      limit: 300,
      pagination: false,
      overrideAccess: false,
      depth: 1,
    }),
    payload.find({
      collection: 'categories',
      limit: 100,
      pagination: false,
    }),
  ])

  return (
    <div className="pt-16">
      <GalleryGrid items={items} categories={categories} />
    </div>
  )
}
