import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { PortfolioGrid } from '@/components/PortfolioGrid'

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
      <PortfolioGrid items={items} categories={categories} />
    </div>
  )
}
