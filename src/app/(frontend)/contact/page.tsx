import { isFlagEnabled } from '@/utilities/flags'
import { ContactPage } from '@/components/ContactPage'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import PageClient from '../[slug]/page.client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Cinematic State',
}

export default async function Page() {
  const enabled = await isFlagEnabled('enable-new-contact-page')

  if (enabled) {
    return <ContactPage />
  }

  const { isEnabled: draft } = await draftMode()
  const page = await queryContactPage()
  if (!page) return <PayloadRedirects url="/contact" />
  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url="/contact" />
      {draft && <LivePreviewListener />}
      <RenderHero {...page.hero} />
      <RenderBlocks blocks={page.layout} />
    </article>
  )
}

const queryContactPage = cache(async () => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: 'contact' } },
  })
  return result.docs?.[0] || null
})
