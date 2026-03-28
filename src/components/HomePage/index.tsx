import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { FEATURED_WORK_LIMIT } from '@/constants'
import { HeroSection } from './HeroSection'
import { PositioningStrip } from './PositioningStrip'
import { FeaturedWork } from './FeaturedWork'
import { CTASection } from './CTASection'
import { About } from '@/components/About'

export async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const [
    { heroImage, heroHeadline, heroSubline, cta, positioningStatement, aboutSection, ctaSection },
    featuredItems,
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
      {featuredItems.docs.length > 0 && <FeaturedWork items={featuredItems.docs} />}
      {aboutSection && <About data={aboutSection} />}
      {ctaSection && <CTASection data={ctaSection} />}
    </main>
  )
}
