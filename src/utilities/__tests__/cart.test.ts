// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest'
import {
  addItemToCart,
  removeItemFromCart,
  setItemQuantity,
  getTotalItemCount,
  readCartFromStorage,
  writeCartToStorage,
  MAX_QTY_PER_ITEM,
  CART_STORAGE_KEY,
} from '../cart'
import type { CartItem } from '../cart'

function makeCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    printfulVariantId: 1,
    productSlug: 'test-print',
    quantity: 1,
    addedAt: 1000000,
    currencyAtAdd: 'AUD',
    ...overrides,
  }
}

// ─── addItemToCart ────────────────────────────────────────────────────────────

describe('addItemToCart', () => {
  it('appends a new item when the variant is not already in the cart', () => {
    const existing = makeCartItem({ printfulVariantId: 1 })
    const result = addItemToCart(
      [existing],
      { printfulVariantId: 2, productSlug: 'other-print', quantity: 1 },
      'AUD',
    )
    expect(result).toHaveLength(2)
    expect(result[1]!.printfulVariantId).toBe(2)
  })

  it('bumps quantity when the same variant is added again', () => {
    const existing = makeCartItem({ printfulVariantId: 1, quantity: 2 })
    const result = addItemToCart(
      [existing],
      { printfulVariantId: 1, productSlug: 'test-print', quantity: 2 },
      'AUD',
    )
    expect(result).toHaveLength(1)
    expect(result[0]!.quantity).toBe(4)
  })

  it('clamps quantity at MAX_QTY_PER_ITEM when merging a duplicate', () => {
    const existing = makeCartItem({ printfulVariantId: 1, quantity: MAX_QTY_PER_ITEM })
    const result = addItemToCart(
      [existing],
      { printfulVariantId: 1, productSlug: 'test-print', quantity: 3 },
      'AUD',
    )
    expect(result[0]!.quantity).toBe(MAX_QTY_PER_ITEM)
  })

  it('clamps quantity at MAX_QTY_PER_ITEM for a new item', () => {
    const result = addItemToCart(
      [],
      { printfulVariantId: 1, productSlug: 'test-print', quantity: MAX_QTY_PER_ITEM + 10 },
      'EUR',
    )
    expect(result[0]!.quantity).toBe(MAX_QTY_PER_ITEM)
  })

  it('stamps the new item with the provided currency', () => {
    const result = addItemToCart(
      [],
      { printfulVariantId: 1, productSlug: 'test-print', quantity: 1 },
      'EUR',
    )
    expect(result[0]!.currencyAtAdd).toBe('EUR')
  })

  it('does not mutate the input array', () => {
    const items: CartItem[] = []
    const result = addItemToCart(
      items,
      { printfulVariantId: 1, productSlug: 'test-print', quantity: 1 },
      'AUD',
    )
    expect(items).toHaveLength(0)
    expect(result).toHaveLength(1)
  })
})

// ─── removeItemFromCart ───────────────────────────────────────────────────────

describe('removeItemFromCart', () => {
  it('removes the item with the matching variant id', () => {
    const items = [makeCartItem({ printfulVariantId: 1 }), makeCartItem({ printfulVariantId: 2 })]
    const result = removeItemFromCart(items, 1)
    expect(result).toHaveLength(1)
    expect(result[0]!.printfulVariantId).toBe(2)
  })

  it('is a no-op when the variant id is not in the cart', () => {
    const items = [makeCartItem({ printfulVariantId: 1 })]
    const result = removeItemFromCart(items, 99)
    expect(result).toHaveLength(1)
  })

  it('does not mutate the input array', () => {
    const items = [makeCartItem({ printfulVariantId: 1 })]
    removeItemFromCart(items, 1)
    expect(items).toHaveLength(1)
  })
})

// ─── setItemQuantity ──────────────────────────────────────────────────────────

describe('setItemQuantity', () => {
  it('updates the quantity of the matching item', () => {
    const items = [makeCartItem({ printfulVariantId: 1, quantity: 1 })]
    const result = setItemQuantity(items, 1, 3)
    expect(result[0]!.quantity).toBe(3)
  })

  it('clamps quantity at MAX_QTY_PER_ITEM', () => {
    const items = [makeCartItem({ printfulVariantId: 1, quantity: 1 })]
    const result = setItemQuantity(items, 1, MAX_QTY_PER_ITEM + 99)
    expect(result[0]!.quantity).toBe(MAX_QTY_PER_ITEM)
  })

  it('removes the item when quantity is set to zero', () => {
    const items = [makeCartItem({ printfulVariantId: 1 })]
    const result = setItemQuantity(items, 1, 0)
    expect(result).toHaveLength(0)
  })

  it('removes the item when quantity is negative', () => {
    const items = [makeCartItem({ printfulVariantId: 1 })]
    const result = setItemQuantity(items, 1, -2)
    expect(result).toHaveLength(0)
  })

  it('leaves other items unchanged', () => {
    const items = [
      makeCartItem({ printfulVariantId: 1, quantity: 1 }),
      makeCartItem({ printfulVariantId: 2, quantity: 2 }),
    ]
    const result = setItemQuantity(items, 1, 4)
    expect(result[1]!.quantity).toBe(2)
  })
})

// ─── getTotalItemCount ────────────────────────────────────────────────────────

describe('getTotalItemCount', () => {
  it('returns 0 for an empty cart', () => {
    expect(getTotalItemCount([])).toBe(0)
  })

  it('sums quantities across all items', () => {
    const items = [
      makeCartItem({ quantity: 2 }),
      makeCartItem({ printfulVariantId: 2, quantity: 3 }),
    ]
    expect(getTotalItemCount(items)).toBe(5)
  })
})

// ─── readCartFromStorage ──────────────────────────────────────────────────────

describe('readCartFromStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns an empty array when the key is absent', () => {
    expect(readCartFromStorage()).toEqual([])
  })

  it('returns parsed items when valid JSON is stored', () => {
    const items = [makeCartItem()]
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    expect(readCartFromStorage()).toEqual(items)
  })

  it('returns an empty array when stored JSON is malformed', () => {
    localStorage.setItem(CART_STORAGE_KEY, 'not-valid-json{{{')
    expect(readCartFromStorage()).toEqual([])
  })
})

// ─── writeCartToStorage ───────────────────────────────────────────────────────

describe('writeCartToStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists items so that readCartFromStorage can retrieve them', () => {
    const items = [makeCartItem(), makeCartItem({ printfulVariantId: 2, quantity: 2 })]
    writeCartToStorage(items)
    expect(readCartFromStorage()).toEqual(items)
  })

  it('overwrites previously stored items', () => {
    writeCartToStorage([makeCartItem()])
    writeCartToStorage([])
    expect(readCartFromStorage()).toEqual([])
  })

  it('is a no-op in SSR (window undefined)', () => {
    const originalWindow = global.window
    // @ts-expect-error — intentionally removing window to simulate SSR
    delete global.window
    expect(() => writeCartToStorage([makeCartItem()])).not.toThrow()
    global.window = originalWindow
  })
})
