'use client'

import React, { createContext, useContext, useSyncExternalStore } from 'react'

import type { CartItem } from '@/utilities/cart'
import {
  CART_STORAGE_KEY,
  addItemToCart,
  getTotalItemCount,
  readCartFromStorage,
  removeItemFromCart,
  setItemQuantity,
  writeCartToStorage,
} from '@/utilities/cart'

type CartContextValue = {
  items: CartItem[]
  totalItemCount: number
  addItem: (incoming: Omit<CartItem, 'addedAt'>) => void
  removeItem: (printfulVariantId: number) => void
  setQuantity: (printfulVariantId: number, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

// Module-level store: one source of truth for cart state on the client.
// Initialised from localStorage when CartProvider first mounts.
// useSyncExternalStore compares snapshots with Object.is, so reference
// stability matters — we update this variable directly instead of
// calling JSON.parse on every render.
let cartStore: CartItem[] = []
let notifySubscriber: (() => void) | null = null

function subscribeToCartStorage(callback: () => void): () => void {
  cartStore = readCartFromStorage()
  notifySubscriber = callback

  function onCrossTabStorageChange(event: StorageEvent) {
    if (event.key === CART_STORAGE_KEY) {
      cartStore = readCartFromStorage()
      callback()
    }
  }

  window.addEventListener('storage', onCrossTabStorageChange)
  return () => {
    window.removeEventListener('storage', onCrossTabStorageChange)
    notifySubscriber = null
  }
}

function getCartSnapshot(): CartItem[] {
  return cartStore
}

// Stable empty array for SSR — useSyncExternalStore uses this value during
// server rendering and hydration before localStorage is accessible.
const EMPTY_CART: CartItem[] = []

function getServerCartSnapshot(): CartItem[] {
  return EMPTY_CART
}

function writeAndNotify(items: CartItem[]): void {
  cartStore = items
  writeCartToStorage(items)
  // Ping React directly for the current tab. Other tabs receive the native
  // 'storage' event that browsers fire automatically on localStorage writes.
  notifySubscriber?.()
}

type CartProviderProps = {
  children: React.ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const items = useSyncExternalStore(subscribeToCartStorage, getCartSnapshot, getServerCartSnapshot)

  function addItem(incoming: Omit<CartItem, 'addedAt'>): void {
    writeAndNotify(addItemToCart(cartStore, incoming))
  }

  function removeItem(printfulVariantId: number): void {
    writeAndNotify(removeItemFromCart(cartStore, printfulVariantId))
  }

  function setQuantity(printfulVariantId: number, quantity: number): void {
    writeAndNotify(setItemQuantity(cartStore, printfulVariantId, quantity))
  }

  function clear(): void {
    writeAndNotify([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemCount: getTotalItemCount(items),
        addItem,
        removeItem,
        setQuantity,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
