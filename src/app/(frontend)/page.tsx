import type { Metadata } from 'next'
import { HomePage } from '@/components/HomePage'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { SITE_NAME } from '@/constants'

const DESCRIPTION =
  'Still frames from a moving world. Live performance, street, and editorial photography by Adrian Valero, Melbourne.'

export const metadata: Metadata = {
  title: `${SITE_NAME} | Adrian Valero — Melbourne Photographer`,
  description: DESCRIPTION,
  openGraph: mergeOpenGraph({
    title: `${SITE_NAME} | Adrian Valero — Melbourne Photographer`,
    description: DESCRIPTION,
    url: '/',
  }),
}

export default function Page() {
  return <HomePage />
}
