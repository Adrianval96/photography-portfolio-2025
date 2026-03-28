import { ContactPage } from '@/components/ContactPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Cinematic State',
}

export default async function Page() {
  return <ContactPage />
}
