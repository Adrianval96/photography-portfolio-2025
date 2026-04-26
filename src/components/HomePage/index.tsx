import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import {
  CACHE_KEY_HOMEPAGE_FEATURED_ITEMS,
  CACHE_KEY_HOMEPAGE_GLOBAL,
  CACHE_TAG_PORTFOLIO,
  FEATURED_WORK_LIMIT,
  REVALIDATE_SECONDS,
} from '@/constants'
import { HeroSection } from './HeroSection'
import { PositioningStrip } from './PositioningStrip'
import { FeaturedWork } from './FeaturedWork'
import { CTASection } from './CTASection'
import { About } from '@/components/About'

const getHomepageGlobal = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'homepage', depth: 1 })
  },
  [CACHE_KEY_HOMEPAGE_GLOBAL],
  { revalidate: REVALIDATE_SECONDS },
)

const getFeaturedItems = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'portfolio-items',
      where: { featured: { equals: true } },
      limit: FEATURED_WORK_LIMIT,
      depth: 1,
    })
    return docs
  },
  [CACHE_KEY_HOMEPAGE_FEATURED_ITEMS],
  { tags: [CACHE_TAG_PORTFOLIO], revalidate: REVALIDATE_SECONDS },
)

export async function HomePage() {
  const [
    { heroImage, heroHeadline, heroSubline, cta, positioningStatement, aboutSection, ctaSection },
    featuredItems,
  ] = await Promise.all([getHomepageGlobal(), getFeaturedItems()])

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
