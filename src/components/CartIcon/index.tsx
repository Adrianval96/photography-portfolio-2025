'use client'

import React from 'react'

import { useCart } from '@/context/CartContext'
import './styles.css'

export function CartIcon() {
  const { totalItemCount, isHydrated } = useCart()

  if (!isHydrated || totalItemCount === 0) return null

  return (
    <button type="button" className="cart-icon" aria-label={`Cart — ${totalItemCount} item${totalItemCount === 1 ? '' : 's'}`}>
      <span className="cart-icon__count">{totalItemCount}</span>
    </button>
  )
}
