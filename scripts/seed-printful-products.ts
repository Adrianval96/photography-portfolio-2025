/**
 * Bulk-seeds the Payload products collection from Printful.
 *
 * For each sync product in your Printful store:
 *   - Creates the record if it doesn't exist in Payload yet
 *   - Updates it if it does (uses printfulSyncProductId as the upsert key)
 *
 * Safe to run multiple times.
 *
 * Usage:
 *   NODE_ENV=production POSTGRES_URL=<url> PRINTFUL_STORE_ID=<id> pnpm payload run scripts/seed-printful-products.ts
 *
 * Required env vars:
 *   PRINTFUL_API_KEY  — personal access token (or store-scoped token)
 *   PRINTFUL_STORE_ID — Printful store ID (required for personal access tokens)
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { upsertProduct } from '@/data/products'
import type { PrintfulSyncProductDetail } from '@/services/printful'

const PRINTFUL_BASE = 'https://api.printful.com'

const apiKey = process.env.PRINTFUL_API_KEY
if (!apiKey) throw new Error('PRINTFUL_API_KEY is not configured')

const storeId = process.env.PRINTFUL_STORE_ID
if (!storeId) throw new Error('PRINTFUL_STORE_ID is not configured')

const printfulHeaders: HeadersInit = {
  Authorization: `Bearer ${apiKey}`,
  'X-PF-Store-Id': storeId,
}

const payload = await getPayload({ config })

const listRes = await fetch(`${PRINTFUL_BASE}/sync/products`, { headers: printfulHeaders })
if (!listRes.ok) throw new Error(`Printful /sync/products failed: ${listRes.status}`)

const { result: summaries } = (await listRes.json()) as {
  result: Array<{ id: number; name: string }>
}

console.log(`Found ${summaries.length} product(s) in store ${storeId}.\n`)

let synced = 0
let failed = 0

for (const summary of summaries) {
  process.stdout.write(`  [${summary.id}] ${summary.name} — `)
  try {
    const detailRes = await fetch(`${PRINTFUL_BASE}/sync/products/${summary.id}`, {
      headers: printfulHeaders,
    })
    if (!detailRes.ok) throw new Error(`detail fetch failed: ${detailRes.status}`)
    const { result: detail } = (await detailRes.json()) as { result: PrintfulSyncProductDetail }

    await upsertProduct(detail)
    console.log('synced')
    synced++
  } catch (err) {
    console.log(`FAILED — ${err instanceof Error ? err.message : String(err)}`)
    failed++
  }
}

await payload.destroy()

console.log(`\nDone. ${synced} synced${failed ? `, ${failed} failed` : ''}.`)
if (failed) process.exit(1)
