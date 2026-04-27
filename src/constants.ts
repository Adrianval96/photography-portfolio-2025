export const SITE_NAME = 'Cinematic State Photography'

export const DEFAULT_SERVER_URL = 'http://localhost:3000'

export const REVALIDATE_SECONDS = 3600

export const FEATURED_WORK_LIMIT = 6

export const CACHE_TAG_PAGES_SITEMAP = 'pages-sitemap'
export const CACHE_TAG_REDIRECTS = 'redirects'
export const CACHE_TAG_PORTFOLIO = 'portfolio'

export const ROUTES = {
  home: '/',
  portfolio: '/portfolio',
  shop: '/shop',
  contact: '/contact',
} as const

export const NAV_LINKS = [
  { label: 'Portfolio', href: ROUTES.portfolio },
  { label: 'Contact', href: ROUTES.contact },
] as const
