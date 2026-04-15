import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ContactPage } from '@/components/ContactPage'
import { generateMeta } from '@/utilities/generateMeta'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const doc = await payload.findGlobal({ slug: 'contact', depth: 1 })
  return generateMeta({ doc })
}

export default async function Page() {
  return <ContactPage />
}
