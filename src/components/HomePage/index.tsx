import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { FEATURED_WORK_LIMIT } from '@/constants'
import { HeroSection } from './HeroSection'
import { PositioningStrip } from './PositioningStrip'
import { FeaturedWork } from './FeaturedWork'
import { CTASection } from './CTASection'
import { About } from '@/components/About'
import { isFlagEnabled } from '@/utilities/flags'

export async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const [homepage, featuredItems, aboutEnabled] = await Promise.all([
    payload.findGlobal({ slug: 'homepage', depth: 1 }),
    payload.find({ collection: 'portfolio-items', where: { featured: { equals: true } }, limit: FEATURED_WORK_LIMIT, depth: 1 }),
    isFlagEnabled('enable-about-section'),
  ])

  return (
    <main>
      <HeroSection data={homepage} />
      {homepage.positioningStatement && (
        <PositioningStrip statement={homepage.positioningStatement} />
      )}
      {featuredItems.docs.length > 0 && (
        <FeaturedWork items={featuredItems.docs} />
      )}
      {aboutEnabled && homepage.aboutSection && <About data={homepage.aboutSection} />}
      {homepage.ctaSection && <CTASection data={homepage.ctaSection} />}
    </main>
  )
}
