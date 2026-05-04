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

  const defaultFile = sync_variants[0]?.files?.find((f) => f.type === 'default')

  const productImage = {
    url: defaultFile?.preview_url ?? null,
    width: defaultFile?.width ?? null,
    height: defaultFile?.height ?? null,
  }

  const productData = {
    printfulSyncProductId: sync_product.id,
    name: sync_product.name,
    productImage,
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
