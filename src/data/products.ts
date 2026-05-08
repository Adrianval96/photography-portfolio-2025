import { getPayload } from 'payload'
import config from '@payload-config'
import type { PrintfulSyncProductDetail } from '@/services/printful'

export async function archiveProduct(syncProductId: number): Promise<void> {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'products',
    where: { printfulSyncProductId: { equals: syncProductId } },
    limit: 1,
  })

  const [existingDoc] = existing.docs
  if (!existingDoc) return

  await payload.update({
    collection: 'products',
    id: existingDoc.id,
    data: { status: 'archived' as const },
  })
}

export async function upsertProduct(detail: PrintfulSyncProductDetail): Promise<void> {
  const { sync_product, sync_variants } = detail

  const firstVariantFiles = sync_variants[0]?.files ?? []

  const defaultFile = firstVariantFiles.find((f) => f.type === 'default')
  const previewFile = firstVariantFiles.find((f) => f.type === 'preview')

  const productImage = {
    url: defaultFile?.preview_url ?? null,
    width: defaultFile?.width ?? null,
    height: defaultFile?.height ?? null,
  }

  type ProductImageEntry = { url: string | null; width: number | null; height: number | null; type: string }

  const productImages: ProductImageEntry[] = [
    ...(defaultFile
      ? [{ url: defaultFile.preview_url, width: defaultFile.width, height: defaultFile.height, type: 'default' }]
      : []),
    ...(previewFile
      ? [{ url: previewFile.preview_url, width: previewFile.width, height: previewFile.height, type: 'preview' }]
      : []),
  ]

  const productData = {
    printfulSyncProductId: sync_product.id,
    name: sync_product.name,
    productImage,
    productImages,
    status: 'synced' as const,
    variants: sync_variants.map((v) => ({
      printfulVariantId: v.id,
      format: v.size,
      price: parseFloat(v.retail_price),
    })),
    lastSyncedAt: new Date().toISOString(),
  }

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'products',
    where: { printfulSyncProductId: { equals: sync_product.id } },
    limit: 1,
  })

  const [existingDoc] = existing.docs
  if (existingDoc) {
    await payload.update({ collection: 'products', id: existingDoc.id, data: productData })
  } else {
    await payload.create({ collection: 'products', data: productData })
  }
}
