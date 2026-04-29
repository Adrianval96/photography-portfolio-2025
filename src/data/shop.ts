import { unstable_cache } from 'next/cache'
import { fetchPrintProducts } from '@/services/printful'
import { REVALIDATE_SECONDS } from '@/constants'

export const fetchShopProducts = unstable_cache(fetchPrintProducts, ['printful-products'], {
  tags: ['printful-products'],
  revalidate: REVALIDATE_SECONDS,
})
