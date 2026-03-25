import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { SITE_NAME } from '@/constants'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: '',
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
