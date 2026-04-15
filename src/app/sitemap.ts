import type { MetadataRoute } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getServerSideURL } from '@/utilities/getURL'

const STATIC_ROUTES = ['/', '/portfolio', '/contact']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteURL = getServerSideURL()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteURL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.8,
  }))

  const payload = await getPayload({ config: configPromise })

  const { docs: pages } = await payload.find({
    collection: 'pages',
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1000,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const pageEntries: MetadataRoute.Sitemap = pages
    .filter((page) => Boolean(page.slug))
    .map((page) => ({
      url: `${siteURL}/${page.slug}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

  return [...staticEntries, ...pageEntries]
}
