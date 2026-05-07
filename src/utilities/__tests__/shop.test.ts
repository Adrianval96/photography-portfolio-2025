import { describe, it, expect } from 'vitest'
import {
  FORMAT_COLLECTION,
  getCollectionName,
  groupByCollection,
} from '@/utilities/shop'
import type { Product } from '@/payload-types'

describe('FORMAT_COLLECTION', () => {
  it('maps known Printful size strings to collection names', () => {
    expect(FORMAT_COLLECTION['18 × 24 in']).toBe('EDITORIAL')
    expect(FORMAT_COLLECTION['24 × 18 in']).toBe('DOCUMENTARY')
    expect(FORMAT_COLLECTION['36 × 24 in']).toBe('CINEMA POSTER')
  })
})

describe('getCollectionName', () => {
  it('returns the mapped collection name for a known format', () => {
    expect(getCollectionName('18 × 24 in')).toBe('EDITORIAL')
    expect(getCollectionName('24 × 18 in')).toBe('DOCUMENTARY')
    expect(getCollectionName('36 × 24 in')).toBe('CINEMA POSTER')
  })

  it('falls back to the raw format string for an unknown format', () => {
    expect(getCollectionName('12 × 16 in')).toBe('12 × 16 in')
    expect(getCollectionName('')).toBe('')
  })
})

function makeProduct(id: number, format: string): Product {
  return {
    id,
    printfulSyncProductId: id,
    name: `Product ${id}`,
    status: 'synced',
    updatedAt: '',
    createdAt: '',
    variants: format ? [{ printfulVariantId: id, format, price: 99, id: String(id) }] : null,
  } as Product
}

describe('groupByCollection', () => {
  it('returns an empty array when given no products', () => {
    expect(groupByCollection([])).toEqual([])
  })

  it('groups products by their collection name', () => {
    const products = [
      makeProduct(1, '18 × 24 in'),
      makeProduct(2, '18 × 24 in'),
      makeProduct(3, '24 × 18 in'),
    ]
    const groups = groupByCollection(products)
    expect(groups).toHaveLength(2)
    expect(groups[0].label).toBe('EDITORIAL')
    expect(groups[0].products).toHaveLength(2)
    expect(groups[1].label).toBe('DOCUMENTARY')
    expect(groups[1].products).toHaveLength(1)
  })

  it('sorts groups by ascending physical area, cinema poster last as largest', () => {
    const products = [
      makeProduct(1, '36 × 24 in'),
      makeProduct(2, '18 × 24 in'),
      makeProduct(3, '24 × 18 in'),
    ]
    const groups = groupByCollection(products)
    expect(groups[2].label).toBe('CINEMA POSTER')
    const smallerAreaLabels = [groups[0].label, groups[1].label]
    expect(smallerAreaLabels).toContain('EDITORIAL')
    expect(smallerAreaLabels).toContain('DOCUMENTARY')
  })

  it('places products with no format into an unlabelled group at the end', () => {
    const products = [
      makeProduct(1, '18 × 24 in'),
      makeProduct(2, ''),
    ]
    const groups = groupByCollection(products)
    expect(groups[groups.length - 1].label).toBe('')
    expect(groups[groups.length - 1].products[0].id).toBe(2)
  })

  it('places products with null variants into the unlabelled group', () => {
    const noVariantProduct = makeProduct(99, '')
    noVariantProduct.variants = null
    const groups = groupByCollection([noVariantProduct])
    expect(groups).toHaveLength(1)
    expect(groups[0].label).toBe('')
  })
})
