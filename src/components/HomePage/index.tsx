import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SELECTED_WORK_LIMIT } from '@/constants'
import { HeroSection } from './HeroSection'
import { PositioningStrip } from './PositioningStrip'
import { SelectedWork } from './SelectedWork'

export async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const [homepage, featuredItems] = await Promise.all([
    payload.findGlobal({ slug: 'homepage', depth: 1 }),
    payload.find({ collection: 'portfolio-items', where: { featured: { equals: true } }, limit: SELECTED_WORK_LIMIT, depth: 1 }),
  ])

  return (
    <main>
      <HeroSection data={homepage} />
      {homepage.positioningStatement && (
        <PositioningStrip statement={homepage.positioningStatement} />
      )}
      {featuredItems.docs.length > 0 && (
        <SelectedWork items={featuredItems.docs} />
      )}
    </main>
  )
}
