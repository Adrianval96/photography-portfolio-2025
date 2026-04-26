import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import {
  CACHE_KEY_GLOBAL_CONTACT,
  CACHE_KEY_GLOBAL_FOOTER,
  CACHE_KEY_GLOBAL_HEADER,
  CACHE_KEY_GLOBAL_HOMEPAGE,
  CACHE_KEY_GLOBAL_PORTFOLIO_PAGE,
  CACHE_KEY_GLOBAL_SITE_IDENTITY,
  CACHE_KEY_GLOBAL_SOCIAL_LINKS,
  REVALIDATE_SECONDS,
} from '@/constants'

export const fetchHomepageGlobal = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'homepage', depth: 1 })
  },
  [CACHE_KEY_GLOBAL_HOMEPAGE],
  { tags: ['global_homepage'], revalidate: REVALIDATE_SECONDS },
)

export const fetchContactGlobal = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'contact', depth: 1 })
  },
  [CACHE_KEY_GLOBAL_CONTACT],
  { tags: ['global_contact'], revalidate: REVALIDATE_SECONDS },
)

export const fetchPortfolioPageGlobal = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'portfolio-page', depth: 1 })
  },
  [CACHE_KEY_GLOBAL_PORTFOLIO_PAGE],
  { tags: ['global_portfolio-page'], revalidate: REVALIDATE_SECONDS },
)

export const fetchHeader = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'header', depth: 1 })
  },
  [CACHE_KEY_GLOBAL_HEADER],
  { tags: ['global_header'], revalidate: REVALIDATE_SECONDS },
)

export const fetchFooter = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'footer', depth: 1 })
  },
  [CACHE_KEY_GLOBAL_FOOTER],
  { tags: ['global_footer'], revalidate: REVALIDATE_SECONDS },
)

export const fetchSiteIdentity = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'site-identity' })
  },
  [CACHE_KEY_GLOBAL_SITE_IDENTITY],
  { tags: ['global_site-identity'], revalidate: REVALIDATE_SECONDS },
)

export const fetchSocialLinks = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'social-links' })
  },
  [CACHE_KEY_GLOBAL_SOCIAL_LINKS],
  { tags: ['global_social-links'], revalidate: REVALIDATE_SECONDS },
)
