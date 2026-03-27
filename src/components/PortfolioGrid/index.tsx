'use client'

import { useState } from 'react'
import { Media } from '@/components/Media'
import type { Category, Media as MediaType, PortfolioItem } from '@/payload-types'
import './styles.css'

type Props = {
  items: PortfolioItem[]
  categories: Category[]
}

function PortfolioItemCard({ item }: { item: PortfolioItem }) {
  if (!item.media || typeof item.media === 'number') return null
  const media = item.media as MediaType
  const category = item.categories?.find((cat) => typeof cat !== 'number') as Category | undefined

  return (
    <div className="portfolio-item">
      <Media resource={media} imgClassName="portfolio-item__image" />
      {(item.title || item.location || category) && (
        <div className="portfolio-item__overlay">
          {item.title && <p className="portfolio-item__title">{item.title}</p>}
          {item.location && <p className="portfolio-item__location">{item.location}</p>}
          {category && <p className="portfolio-item__category">{category.name}</p>}
        </div>
      )}
    </div>
  )
}

export function PortfolioGrid({ items, categories }: Props) {
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
          <PortfolioItemCard key={item.id} item={item} />
        ))}
      </div>
    </>
  )
}
