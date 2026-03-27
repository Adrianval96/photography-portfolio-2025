import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { HeroSection } from './HeroSection'

export async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const homepage = await payload.findGlobal({ slug: 'homepage', depth: 1 })

  return (
    <main>
      <HeroSection data={homepage} />
    </main>
  )
}
