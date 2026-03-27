'use client'

import { useEffect } from 'react'
import { Media } from '@/components/Media'
import type { Category, Media as MediaType, PortfolioItem } from '@/payload-types'

type Props = {
  items: PortfolioItem[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function Lightbox({ items, index, onClose, onPrev, onNext }: Props) {
  const item = items[index]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!item || !item.media || typeof item.media === 'number') return null

  const media = item.media as MediaType
  const category = item.categories?.find((cat) => typeof cat !== 'number') as Category | undefined

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox__close" onClick={onClose}>✕</button>
      <button className="lightbox__nav lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); onPrev() }}>←</button>
      <button className="lightbox__nav lightbox__nav--next" onClick={(e) => { e.stopPropagation(); onNext() }}>→</button>

      <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox__image-wrap">
          <Media resource={media} imgClassName="lightbox__image" />
        </div>
        <div className="lightbox__info">
          {category && <p className="lightbox__category">{category.name}</p>}
          {item.title && <h2 className="lightbox__title">{item.title}</h2>}
          {item.location && <p className="lightbox__location">{item.location}</p>}
        </div>
      </div>
    </div>
  )
}
