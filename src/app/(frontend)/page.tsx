import type { Metadata } from 'next'
import { HomePage } from '@/components/HomePage'
import { generateMeta } from '@/utilities/generateMeta'
import { fetchHomepageGlobal } from '@/data/globals'

export async function generateMetadata(): Promise<Metadata> {
  const doc = await fetchHomepageGlobal()
  return generateMeta({ doc })
}

export default function Page() {
  return <HomePage />
}
