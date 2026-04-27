import { fetchFromCMS } from '@/data/helpers'
import { isFlagEnabled } from '@/utilities/flags'

export const fetchShopEnabled = () => isFlagEnabled('enable-shop-page')

const GLOBAL_SLUGS = {
  homepage: 'homepage',
  contact: 'contact',
  portfolioPage: 'portfolio-page',
  footer: 'footer',
  siteIdentity: 'site-identity',
  socialLinks: 'social-links',
} as const

const CACHE_KEYS = {
  homepage: 'global-homepage',
  contact: 'global-contact',
  portfolioPage: 'global-portfolio-page',
  footer: 'global-footer',
  siteIdentity: 'global-site-identity',
  socialLinks: 'global-social-links',
} as const

export const fetchHomepageGlobal = fetchFromCMS(GLOBAL_SLUGS.homepage, CACHE_KEYS.homepage)
export const fetchContactGlobal = fetchFromCMS(GLOBAL_SLUGS.contact, CACHE_KEYS.contact)
export const fetchPortfolioPageGlobal = fetchFromCMS(
  GLOBAL_SLUGS.portfolioPage,
  CACHE_KEYS.portfolioPage,
)
export const fetchFooter = fetchFromCMS(GLOBAL_SLUGS.footer, CACHE_KEYS.footer)
export const fetchSiteIdentity = fetchFromCMS(GLOBAL_SLUGS.siteIdentity, CACHE_KEYS.siteIdentity, 0)
export const fetchSocialLinks = fetchFromCMS(GLOBAL_SLUGS.socialLinks, CACHE_KEYS.socialLinks, 0)
