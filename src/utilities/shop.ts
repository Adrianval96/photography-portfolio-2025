import type { Product } from '@/payload-types'

export const FORMAT_COLLECTION: Record<string, string> = {
  '18 × 24 in': 'EDITORIAL',
  '24 × 18 in': 'DOCUMENTARY',
  '36 × 24 in': 'CINEMA POSTER',
}

export function getCollectionName(format: string): string {
  return FORMAT_COLLECTION[format] ?? format
}

function parseAreaFromFormat(format: string): number {
  const match = format.match(/(\d+(?:\.\d+)?)\s*[×xX]\s*(\d+(?:\.\d+)?)/)
  if (!match) return Infinity
  return parseFloat(match[1]) * parseFloat(match[2])
}

export interface ProductGroup {
  label: string
  products: Product[]
}

export function groupByCollection(products: Product[]): ProductGroup[] {
  const groupMap = new Map<string, { products: Product[]; area: number }>()
  const unlabelledProducts: Product[] = []

  for (const product of products) {
    const format = product.variants?.[0]?.format ?? ''
    if (!format) {
      unlabelledProducts.push(product)
      continue
    }
    const collectionLabel = getCollectionName(format)
    const physicalArea = parseAreaFromFormat(format)

    if (!groupMap.has(collectionLabel)) {
      groupMap.set(collectionLabel, { products: [], area: physicalArea })
    }
    groupMap.get(collectionLabel)!.products.push(product)
  }

  const sortedGroups = Array.from(groupMap.entries())
    .sort(([, groupA], [, groupB]) => groupA.area - groupB.area)
    .map(([label, { products: groupProducts }]) => ({ label, products: groupProducts }))

  if (unlabelledProducts.length > 0) {
    sortedGroups.push({ label: '', products: unlabelledProducts })
  }

  return sortedGroups
}
