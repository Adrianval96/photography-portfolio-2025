import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { FEATURED_WORK_LIMIT } from '@/constants'
import { unstable_noStore } from 'next/cache'
import { HeroSection } from './HeroSection'
import { PositioningStrip } from './PositioningStrip'
import { FeaturedWork } from './FeaturedWork'
import { CTASection } from './CTASection'
import { About } from '@/components/About'

export async function HomePage() {
  unstable_noStore()
  const payload = await getPayload({ config: configPromise })
  const [
    { heroImage, heroHeadline, heroSubline, cta, positioningStatement, aboutSection, ctaSection },
    { docs: featuredItems },
  ] = await Promise.all([
    payload.findGlobal({ slug: 'homepage', depth: 1 }),
    payload.find({
      collection: 'portfolio-items',
      where: { featured: { equals: true } },
      limit: FEATURED_WORK_LIMIT,
      depth: 1,
    }),
  ])

  return (
    <main>
      <HeroSection
        heroImage={heroImage}
        heroHeadline={heroHeadline}
        heroSubline={heroSubline}
        cta={cta}
      />
      {positioningStatement && <PositioningStrip statement={positioningStatement} />}
      {featuredItems.length > 0 && <FeaturedWork items={featuredItems} />}
      {aboutSection && <About data={aboutSection} />}
      {ctaSection && <CTASection data={ctaSection} />}
    </main>
  )
}
