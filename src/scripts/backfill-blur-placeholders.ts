/**
 * Backfill blur placeholders for media items uploaded before the
 * blurDataUrl field was introduced.
 *
 * Usage (from project root, with env vars loaded):
 *   pnpm tsx src/scripts/backfill-blur-placeholders.ts
 *
 * The script is safe to re-run — it skips items that already have a blurDataUrl.
 */

import config from '@payload-config'
import sharp from 'sharp'
import { getPayload } from 'payload'

async function generateBlurDataUrl(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const resized = await sharp(buffer)
    .resize(16, 16, { fit: 'inside' })
    .webp({ quality: 20 })
    .toBuffer()
  return `data:image/webp;base64,${resized.toString('base64')}`
}

async function main(): Promise<void> {
  const payload = await getPayload({ config })

  const { docs, totalDocs } = await payload.find({
    collection: 'media',
    limit: 1000,
    where: {
      blurDataUrl: { exists: false },
    },
  })

  console.log(`Found ${totalDocs} media items missing a blurDataUrl.`)

  let succeeded = 0
  let failed = 0

  for (const media of docs) {
    const imageUrl = media.url
    if (!imageUrl) {
      console.warn(`  [skip] id=${media.id} — no url`)
      continue
    }

    try {
      const blurDataUrl = await generateBlurDataUrl(imageUrl)
      await payload.update({
        collection: 'media',
        id: media.id,
        data: { blurDataUrl },
      })
      console.log(`  [ok]   id=${media.id} ${media.filename}`)
      succeeded++
    } catch (err) {
      console.error(`  [fail] id=${media.id} ${media.filename}:`, err)
      failed++
    }
  }

  console.log(`\nDone. ${succeeded} updated, ${failed} failed.`)
  process.exit(failed > 0 ? 1 : 0)
}

main()
