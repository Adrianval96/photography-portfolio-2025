import { fetchCollectionDocs } from '@/data/helpers'

export const fetchShopProducts = fetchCollectionDocs(
  'products',
  'shop-products',
  {
    where: { status: { equals: 'synced' } },
    sort: 'sortOrder',
    limit: 100,
  },
  ['products'],
)
