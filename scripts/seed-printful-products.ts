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
 *   pnpm payload run scripts/seed-printful-products.ts
 *
 * Required env var:
 *   PRINTFUL_API_KEY — store-scoped Printful API token
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { getSyncProduct } from '@/services/printful'
import { upsertProduct } from '@/data/products'

const PRINTFUL_BASE = 'https://api.printful.com'

const apiKey = process.env.PRINTFUL_API_KEY
if (!apiKey) throw new Error('PRINTFUL_API_KEY is not configured')

const payload = await getPayload({ config })

const res = await fetch(`${PRINTFUL_BASE}/sync/products`, {
  headers: { Authorization: `Bearer ${apiKey}` },
})
if (!res.ok) throw new Error(`Printful /sync/products failed: ${res.status}`)

const { result: summaries } = (await res.json()) as {
  result: Array<{ id: number; name: string }>
}

console.log(`Found ${summaries.length} product(s).\n`)

let synced = 0
let failed = 0

for (const summary of summaries) {
  process.stdout.write(`  [${summary.id}] ${summary.name} — `)
  try {
    const detail = await getSyncProduct(summary.id)
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
