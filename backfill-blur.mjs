// One-time backfill: generate blurDataUrl for all media rows missing it.
// Reads images directly from Vercel Blob using BLOB_READ_WRITE_TOKEN.
// Run with:  node --env-file=.env.preview.local backfill-blur.mjs
import { neon } from '@neondatabase/serverless'
import sharp from 'sharp'
import { list } from '/Users/adrivg96/Documents/projects/photography-portfolio-2025/node_modules/.pnpm/@vercel+blob@0.22.3/node_modules/@vercel/blob/dist/index.js'

const dbUrl = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL
if (!dbUrl) throw new Error('DATABASE_URL / DATABASE_URL_UNPOOLED not set')
const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) throw new Error('BLOB_READ_WRITE_TOKEN not set')

const sql = neon(dbUrl)

// Ensure column exists (idempotent)
await sql`ALTER TABLE media ADD COLUMN IF NOT EXISTS blur_data_url varchar`
console.log('Column ensured.')

// Build a filename → blob URL map by listing all blobs
console.log('Listing blobs…')
const blobMap = new Map()
let cursor
do {
  const page = await list({ token, limit: 1000, cursor })
  for (const blob of page.blobs) {
    // pathname is e.g. "steel.jpg" or "steel-300x200.jpg"
    // only keep originals (no dimensions suffix)
    if (!/\-\d+x\d+\./.test(blob.pathname) && !/\-\d+x\d+$/.test(blob.pathname)) {
      blobMap.set(blob.pathname, blob.url)
    }
  }
  cursor = page.cursor
} while (cursor)
console.log(`Found ${blobMap.size} original blobs.`)

// Fetch media rows missing blurDataUrl
const rows = await sql`
  SELECT id, filename
  FROM media
  WHERE blur_data_url IS NULL
    AND filename IS NOT NULL
`
console.log(`Found ${rows.length} media record(s) to backfill.`)

let ok = 0
let fail = 0
let skipped = 0

for (const row of rows) {
  const blobUrl = blobMap.get(row.filename)
  if (!blobUrl) {
    console.warn(`  -  ${row.filename}: no blob found, skipping`)
    skipped++
    continue
  }
  try {
    const res = await fetch(blobUrl)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    const resized = await sharp(buf)
      .resize(16, 16, { fit: 'inside' })
      .webp({ quality: 20 })
      .toBuffer()
    const blurDataUrl = `data:image/webp;base64,${resized.toString('base64')}`
    await sql`UPDATE media SET blur_data_url = ${blurDataUrl} WHERE id = ${row.id}`
    console.log(`  ✓  ${row.filename}`)
    ok++
  } catch (e) {
    console.error(`  ✗  ${row.filename}: ${e.message}`)
    fail++
  }
}

console.log(`\nDone. ${ok} updated, ${skipped} skipped (no blob), ${fail} failed.`)
