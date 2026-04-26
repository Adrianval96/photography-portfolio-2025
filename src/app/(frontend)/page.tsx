import type { Metadata } from 'next'
import { HomePage } from '@/components/HomePage'
import { generateMeta } from '@/utilities/generateMeta'
import { fetchHomepageGlobal } from '@/data/globals'

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await fetchHomepageGlobal()
  return generateMeta({ doc: homepage })
}

export default function Page() {
  return <HomePage />
}
