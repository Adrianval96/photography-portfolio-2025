import type { Config } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { REVALIDATE_SECONDS } from '@/constants'

type GlobalSlug = keyof Config['globals']

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

function makeGlobalFetch<S extends GlobalSlug>(slug: S, cacheKey: string, depth = 1) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      return payload.findGlobal({ slug, depth })
    },
    [cacheKey],
    { tags: [`global_${slug}`], revalidate: REVALIDATE_SECONDS },
  )
}

export const fetchHomepageGlobal = makeGlobalFetch(GLOBAL_SLUGS.homepage, CACHE_KEYS.homepage)
export const fetchContactGlobal = makeGlobalFetch(GLOBAL_SLUGS.contact, CACHE_KEYS.contact)
export const fetchPortfolioPageGlobal = makeGlobalFetch(GLOBAL_SLUGS.portfolioPage, CACHE_KEYS.portfolioPage)
export const fetchHeader = makeGlobalFetch(GLOBAL_SLUGS.header, CACHE_KEYS.header)
export const fetchFooter = makeGlobalFetch(GLOBAL_SLUGS.footer, CACHE_KEYS.footer)
export const fetchSiteIdentity = makeGlobalFetch(GLOBAL_SLUGS.siteIdentity, CACHE_KEYS.siteIdentity, 0)
export const fetchSocialLinks = makeGlobalFetch(GLOBAL_SLUGS.socialLinks, CACHE_KEYS.socialLinks, 0)
