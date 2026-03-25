import type { Metadata } from 'next'

import type { Media, Page, Post, Config, SiteSetting } from '../payload-types'

import { getCachedGlobal } from './getGlobals'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const siteSettings = (await getCachedGlobal('site-settings', 1)()) as SiteSetting
  const siteName = siteSettings?.siteName || 'Cinematic State Photography'

  const ogImage = getImageURL(doc?.meta?.image as Media | null)
  const title = doc?.meta?.title ? `${doc.meta.title} | ${siteName}` : siteName

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: [{ url: ogImage }],
      siteName,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
