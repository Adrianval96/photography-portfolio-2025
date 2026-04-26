import type { Metadata } from 'next'
import { GalleryGrid } from '@/components/GalleryGrid'
import { generateMeta } from '@/utilities/generateMeta'
import { fetchPortfolioPageGlobal } from '@/data/globals'
import { fetchAllPortfolioItems } from '@/data/portfolio-items'
import { fetchCategories } from '@/data/categories'

export async function generateMetadata(): Promise<Metadata> {
  const doc = await fetchPortfolioPageGlobal()
  return generateMeta({ doc })
}

export default async function PortfolioPage() {
  const [items, categories] = await Promise.all([fetchAllPortfolioItems(), fetchCategories()])

  return (
    <div className="pt-16">
      <GalleryGrid items={items} categories={categories} />
    </div>
  )
}
