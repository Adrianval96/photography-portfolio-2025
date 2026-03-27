'use client'

import { useState } from 'react'
import type { Category, PortfolioItem } from '@/payload-types'
import { GalleryCard } from '@/components/GalleryCard'
import './styles.css'

type Props = {
  items: PortfolioItem[]
  categories: Category[]
}

export function GalleryGrid({ items, categories }: Props) {
  const [activeFilter, setActiveFilter] = useState<number | null>(null)

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
          className={`filter-btn${activeFilter === null ? ' filter-btn--active' : ''}`}
          onClick={() => setActiveFilter(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-btn${activeFilter === cat.id ? ' filter-btn--active' : ''}`}
            onClick={() => setActiveFilter(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="portfolio-grid">
        {filtered.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </div>
    </>
  )
}
