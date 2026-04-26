import { fetchHomepageGlobal } from '@/data/globals'
import { fetchFeaturedPortfolioItems } from '@/data/portfolio-items'
import { HeroSection } from './HeroSection'
import { PositioningStrip } from './PositioningStrip'
import { FeaturedWork } from './FeaturedWork'
import { CTASection } from './CTASection'
import { About } from '@/components/About'

export async function HomePage() {
  const [
    { heroImage, heroHeadline, heroSubline, cta, positioningStatement, aboutSection, ctaSection },
    featuredItems,
  ] = await Promise.all([fetchHomepageGlobal(), fetchFeaturedPortfolioItems()])

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
