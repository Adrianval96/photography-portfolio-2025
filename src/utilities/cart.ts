import type { Currency } from '@/utilities/currency'

export type CartItem = {
  printfulVariantId: number
  productSlug: string
  quantity: number
  addedAt: number
  currencyAtAdd: Currency
}

export const MAX_QTY_PER_ITEM = 5
export const CART_STORAGE_KEY = 'cinematic-state.cart'

export function readCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CartItem[]
  } catch {
    return []
  }
}

export function writeCartToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

export function addItemToCart(
  items: CartItem[],
  incoming: Omit<CartItem, 'addedAt' | 'currencyAtAdd'>,
  currencyAtAdd: Currency,
): CartItem[] {
  const existingIndex = items.findIndex(
    (item) => item.printfulVariantId === incoming.printfulVariantId,
  )

  if (existingIndex !== -1) {
    const existingItem = items[existingIndex]!
    const updatedQuantity = Math.min(
      existingItem.quantity + incoming.quantity,
      MAX_QTY_PER_ITEM,
    )
    return items.map((item, index) =>
      index === existingIndex ? { ...item, quantity: updatedQuantity } : item,
    )
  }

  const newItem: CartItem = {
    ...incoming,
    quantity: Math.min(incoming.quantity, MAX_QTY_PER_ITEM),
    addedAt: Date.now(),
    currencyAtAdd,
  }
  return [...items, newItem]
}

export function removeItemFromCart(items: CartItem[], printfulVariantId: number): CartItem[] {
  return items.filter((item) => item.printfulVariantId !== printfulVariantId)
}

export function setItemQuantity(
  items: CartItem[],
  printfulVariantId: number,
  quantity: number,
): CartItem[] {
  if (quantity <= 0) return removeItemFromCart(items, printfulVariantId)

  const clampedQuantity = Math.min(quantity, MAX_QTY_PER_ITEM)
  return items.map((item) =>
    item.printfulVariantId === printfulVariantId ? { ...item, quantity: clampedQuantity } : item,
  )
}

export function getTotalItemCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0)
}
