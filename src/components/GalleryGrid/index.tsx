'use client'

import { useState } from 'react'
import type { Category, PortfolioItem } from '@/payload-types'
import { GalleryCard } from '@/components/GalleryCard'
import './styles.css'

type Props = {
  items: PortfolioItem[]
  categories: Category[]
}

const getFilterButtonClass = (isActive: boolean) =>
  `filter-btn${isActive ? ' filter-btn--active' : ''}`

export function GalleryGrid({ items, categories }: Props) {
  const [activeFilter, setActiveFilter] = useState<number | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filtered =
    activeFilter === null
      ? items
      : items.filter((item) =>
          item.categories?.some(
            (cat) => typeof cat !== 'number' && cat.id === activeFilter,
          ),
        )

  return (
    <>
      <div className="filter-bar">
        <span className="filter-bar__label">Filter</span>
        <button
          className={getFilterButtonClass(activeFilter === null)}
          onClick={() => setActiveFilter(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={getFilterButtonClass(activeFilter === cat.id)}
            onClick={() => setActiveFilter(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {filtered.map((item, index) => (
          <GalleryCard key={item.id} item={item} onOpen={() => setLightboxIndex(index)} />
        ))}
      </div>
    </>
  )
}
