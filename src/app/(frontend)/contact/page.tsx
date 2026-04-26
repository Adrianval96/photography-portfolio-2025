import type { Metadata } from 'next'
import { ContactPage } from '@/components/ContactPage'
import { generateMeta } from '@/utilities/generateMeta'
import { fetchContactGlobal } from '@/data/globals'

export async function generateMetadata(): Promise<Metadata> {
  const doc = await fetchContactGlobal()
  return generateMeta({ doc })
}

export default async function Page() {
  return <ContactPage />
}
