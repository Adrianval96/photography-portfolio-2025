import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { HomePage } from '@/components/HomePage'
import { generateMeta } from '@/utilities/generateMeta'
import { getServerSideURL } from '@/utilities/getURL'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const doc = await payload.findGlobal({ slug: 'homepage', depth: 1 })
  return generateMeta({ doc })
}

export default async function Page() {
  const payload = await getPayload({ config: configPromise })
  const socialLinks = await payload.findGlobal({ slug: 'social-links', depth: 0 })

  const siteURL = getServerSideURL()

  const sameAs = [socialLinks.instagramUrl].filter(Boolean) as string[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Adrian Valero',
    url: siteURL,
    jobTitle: 'Photographer',
    description:
      'Still frames from a moving world. Live performance, street, and editorial photography by Adrian Valero, Melbourne.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Melbourne',
      addressCountry: 'AU',
    },
    ...(sameAs.length > 0 && { sameAs }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage />
    </>
  )
}
