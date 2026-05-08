import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ProductDetail } from '@/components/ProductDetail'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'products',
    where: { status: { equals: 'synced' } },
    limit: 1000,
    pagination: false,
    select: { slug: true },
  })

  return docs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await queryProductBySlug(slug)

  if (!product) return {}

  return { title: product.name }
}

export default async function ShopProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await queryProductBySlug(slug)

  if (!product) notFound()

  return (
    <main className="pt-12">
      <ProductDetail product={product} />
    </main>
  )
}

const queryProductBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug }, status: { equals: 'synced' } },
    limit: 1,
    pagination: false,
  })

  return docs[0] ?? null
})
