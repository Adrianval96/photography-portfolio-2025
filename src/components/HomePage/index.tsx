import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { HeroSection } from './HeroSection'
import { PositioningStrip } from './PositioningStrip'

export async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const homepage = await payload.findGlobal({ slug: 'homepage', depth: 1 })

  return (
    <main>
      <HeroSection data={homepage} />
      {homepage.positioningStatement && (
        <PositioningStrip statement={homepage.positioningStatement} />
      )}
    </main>
  )
}
