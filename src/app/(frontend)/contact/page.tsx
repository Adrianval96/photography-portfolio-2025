import { ContactPage } from '@/components/ContactPage'
import type { Metadata } from 'next'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

const DESCRIPTION =
  'Book a session or get in touch with Adrian Valero — Cinematic State Photography. Response within 48 hours.'

export const metadata: Metadata = {
  title: 'Get in Touch',
  description: DESCRIPTION,
  openGraph: mergeOpenGraph({
    title: 'Get in Touch | Cinematic State Photography',
    description: DESCRIPTION,
    url: '/contact',
  }),
}

export default async function Page() {
  return <ContactPage />
}
