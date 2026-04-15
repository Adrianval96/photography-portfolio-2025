import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { HomePage } from '@/components/HomePage'
import { generateMeta } from '@/utilities/generateMeta'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const doc = await payload.findGlobal({ slug: 'homepage', depth: 1 })
  return generateMeta({ doc })
}

export default function Page() {
  return <HomePage />
}
