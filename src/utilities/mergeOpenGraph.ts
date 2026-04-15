import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { SITE_NAME } from '@/constants'

const DEFAULT_DESCRIPTION =
  'Still frames from a moving world. Live performance, street, and editorial photography by Adrian Valero, Melbourne.'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: DEFAULT_DESCRIPTION,
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`,
    },
  ],
  siteName: SITE_NAME,
  title: SITE_NAME,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
