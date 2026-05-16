'use client'

import React, { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react'

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
  isHydrated: boolean
}

const CartContext = createContext<CartContextValue | null>(null)

function subscribeToCartStorage(callback: () => void): () => void {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

function getCartSnapshot(): CartItem[] {
  return readCartFromStorage()
}

function getServerCartSnapshot(): CartItem[] {
  return []
}

function writeAndNotify(items: CartItem[]): void {
  writeCartToStorage(items)
  window.dispatchEvent(new StorageEvent('storage', { key: CART_STORAGE_KEY }))
}

type CartProviderProps = {
  children: React.ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const items = useSyncExternalStore(
    subscribeToCartStorage,
    getCartSnapshot,
    getServerCartSnapshot,
  )

  function addItem(incoming: Omit<CartItem, 'addedAt'>): void {
    const current = readCartFromStorage()
    writeAndNotify(addItemToCart(current, incoming))
  }

  function removeItem(printfulVariantId: number): void {
    const current = readCartFromStorage()
    writeAndNotify(removeItemFromCart(current, printfulVariantId))
  }

  function setQuantity(printfulVariantId: number, quantity: number): void {
    const current = readCartFromStorage()
    writeAndNotify(setItemQuantity(current, printfulVariantId, quantity))
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
        isHydrated,
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
