import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateTag } from 'next/cache'

import type { PortfolioItem } from '../../../payload-types'

export const CACHE_TAG_PORTFOLIO_ITEMS = 'portfolio-items'

export const revalidatePortfolioItems: CollectionAfterChangeHook<PortfolioItem> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating portfolio items`)
    revalidateTag(CACHE_TAG_PORTFOLIO_ITEMS, {})
  }
  return doc
}

export const revalidatePortfolioItemsOnDelete: CollectionAfterDeleteHook<PortfolioItem> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating portfolio items after delete`)
    revalidateTag(CACHE_TAG_PORTFOLIO_ITEMS, {})
  }
  return doc
}
