import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { REVALIDATE_SECONDS } from '@/constants'

const GLOBAL_SLUGS = {
  homepage: 'homepage',
  contact: 'contact',
  portfolioPage: 'portfolio-page',
  header: 'header',
  footer: 'footer',
  siteIdentity: 'site-identity',
  socialLinks: 'social-links',
} as const

const CACHE_KEYS = {
  homepage: 'global-homepage',
  contact: 'global-contact',
  portfolioPage: 'global-portfolio-page',
  header: 'global-header',
  footer: 'global-footer',
  siteIdentity: 'global-site-identity',
  socialLinks: 'global-social-links',
} as const

export const fetchHomepageGlobal = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: GLOBAL_SLUGS.homepage, depth: 1 })
  },
  [CACHE_KEYS.homepage],
  { tags: ['global_homepage'], revalidate: REVALIDATE_SECONDS },
)

export const fetchContactGlobal = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: GLOBAL_SLUGS.contact, depth: 1 })
  },
  [CACHE_KEYS.contact],
  { tags: ['global_contact'], revalidate: REVALIDATE_SECONDS },
)

export const fetchPortfolioPageGlobal = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: GLOBAL_SLUGS.portfolioPage, depth: 1 })
  },
  [CACHE_KEYS.portfolioPage],
  { tags: ['global_portfolio-page'], revalidate: REVALIDATE_SECONDS },
)

export const fetchHeader = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: GLOBAL_SLUGS.header, depth: 1 })
  },
  [CACHE_KEYS.header],
  { tags: ['global_header'], revalidate: REVALIDATE_SECONDS },
)

export const fetchFooter = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: GLOBAL_SLUGS.footer, depth: 1 })
  },
  [CACHE_KEYS.footer],
  { tags: ['global_footer'], revalidate: REVALIDATE_SECONDS },
)

export const fetchSiteIdentity = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: GLOBAL_SLUGS.siteIdentity })
  },
  [CACHE_KEYS.siteIdentity],
  { tags: ['global_site-identity'], revalidate: REVALIDATE_SECONDS },
)

export const fetchSocialLinks = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: GLOBAL_SLUGS.socialLinks })
  },
  [CACHE_KEYS.socialLinks],
  { tags: ['global_social-links'], revalidate: REVALIDATE_SECONDS },
)
