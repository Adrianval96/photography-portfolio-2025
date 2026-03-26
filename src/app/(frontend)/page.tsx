import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Hero } from '@/components/Hero'
import { PositioningStrip } from '@/components/PositioningStrip'
import { SelectedWork } from '@/components/SelectedWork'
import { Booking } from '@/components/Booking'
import { Footer } from '@/components/Footer'
import { SITE_NAME } from '@/constants'

export const metadata: Metadata = {
  title: SITE_NAME,
}

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: featuredItems } = await payload.find({
    collection: 'portfolio-items',
    where: { featured: { equals: true } },
    limit: 6,
    pagination: false,
    overrideAccess: false,
    depth: 1,
  })

  return (
    <main>
      <Hero />
      <PositioningStrip />
      <SelectedWork items={featuredItems} />
      <Booking />
      <Footer />
    </main>
  )
}
