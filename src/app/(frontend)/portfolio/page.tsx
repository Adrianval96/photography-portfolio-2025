import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { PortfolioItem } from '@/payload-types'
import { PortfolioGrid } from '@/components/PortfolioGrid'

export const metadata: Metadata = {
  title: 'Portfolio',
}

export default async function PortfolioPage() {
  const payload = await getPayload({ config: configPromise })

  const [{ docs: rawItems }, { docs: categories }] = await Promise.all([
    payload.find({
      collection: 'portfolio-items',
      limit: 300,
      pagination: false,
      overrideAccess: false,
      depth: 1,
      select: {
        title: true,
        media: true,
        location: true,
        categories: true,
        slug: true,
      },
    }),
    payload.find({
      collection: 'categories',
      limit: 100,
      pagination: false,
    }),
  ])

  const items = rawItems as unknown as PortfolioItem[]

  return (
    <div className="pt-16">
      <PortfolioGrid items={items} categories={categories} />
    </div>
  )
}
