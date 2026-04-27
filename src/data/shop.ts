import { unstable_cache } from 'next/cache'
import { fetchPrintSections } from '@/services/printful'
import { REVALIDATE_SECONDS } from '@/constants'

export const fetchShopSections = unstable_cache(fetchPrintSections, ['printful-sections'], {
  tags: ['printful-products'],
  revalidate: REVALIDATE_SECONDS,
})
