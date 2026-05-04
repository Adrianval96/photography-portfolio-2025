#!/usr/bin/env node
/**
 * Bulk-seeds the Payload products collection from Printful.
 *
 * For each sync product in your Printful store, the script:
 *   - Creates the record if it doesn't exist in Payload yet
 *   - Updates (upserts) it if it already exists
 *
 * Safe to run multiple times — uses printfulSyncProductId as the upsert key.
 *
 * Usage:
 *   node scripts/seed-printful-products.mjs [--dry-run]
 *   pnpm seed:products [-- --dry-run]
 *
 * Required env vars:
 *   PRINTFUL_API_KEY   — store-scoped Printful API token
 *   PAYLOAD_EMAIL      — Payload admin email (used to obtain a session token)
 *   PAYLOAD_PASSWORD   — Payload admin password
 *
 * Optional env vars:
 *   PAYLOAD_URL        — base URL of the Payload app  (default: http://localhost:3000)
 *
 * All env vars can be placed in .env.local — the script loads it automatically
 * when the variable is not already in the environment.
 */

import { readFileSync } from 'fs'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const PRINTFUL_BASE = 'https://api.printful.com'
const isDryRun = process.argv.includes('--dry-run')

// ---------------------------------------------------------------------------
// Load .env.local
// ---------------------------------------------------------------------------

function loadEnvLocal() {
  try {
    const raw = readFileSync('.env.local', 'utf8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '')
      if (key && !(key in process.env)) process.env[key] = val
    }
  } catch {
    // .env.local absent — that's fine
  }
}

loadEnvLocal()

// ---------------------------------------------------------------------------
// Resolve env vars
// ---------------------------------------------------------------------------

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY
const PAYLOAD_URL = (process.env.PAYLOAD_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const PAYLOAD_EMAIL = process.env.PAYLOAD_EMAIL
const PAYLOAD_PASSWORD = process.env.PAYLOAD_PASSWORD

const missing = []
if (!PRINTFUL_API_KEY) missing.push('PRINTFUL_API_KEY')
if (!PAYLOAD_EMAIL) missing.push('PAYLOAD_EMAIL')
if (!PAYLOAD_PASSWORD) missing.push('PAYLOAD_PASSWORD')

if (missing.length) {
  console.error(`Error: missing required env vars: ${missing.join(', ')}`)
  console.error('Set them in .env.local or export them before running this script.')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Printful helpers
// ---------------------------------------------------------------------------

const printfulHeaders = {
  Authorization: `Bearer ${PRINTFUL_API_KEY}`,
}

async function listSyncProducts() {
  const res = await fetch(`${PRINTFUL_BASE}/sync/products`, { headers: printfulHeaders })
  if (!res.ok) throw new Error(`Printful /sync/products failed: ${res.status}`)
  const data = await res.json()
  return data.result
}

async function getSyncProductDetail(id) {
  const res = await fetch(`${PRINTFUL_BASE}/sync/products/${id}`, { headers: printfulHeaders })
  if (!res.ok) throw new Error(`Printful /sync/products/${id} failed: ${res.status}`)
  const data = await res.json()
  return data.result
}

// ---------------------------------------------------------------------------
// Payload helpers
// ---------------------------------------------------------------------------

async function payloadLogin() {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: PAYLOAD_EMAIL, password: PAYLOAD_PASSWORD }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Payload login failed (${res.status}): ${body}`)
  }
  const data = await res.json()
  const token = data.token
  if (!token) throw new Error('Payload login succeeded but returned no token')
  return token
}

async function findExistingProduct(token, printfulSyncProductId) {
  const params = new URLSearchParams({
    'where[printfulSyncProductId][equals]': String(printfulSyncProductId),
    limit: '1',
  })
  const res = await fetch(`${PAYLOAD_URL}/api/products?${params}`, {
    headers: { Authorization: `JWT ${token}` },
  })
  if (!res.ok) throw new Error(`GET /api/products failed: ${res.status}`)
  const data = await res.json()
  return data.docs?.[0] ?? null
}

async function createProduct(token, productData) {
  const res = await fetch(`${PAYLOAD_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(productData),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`POST /api/products failed (${res.status}): ${body}`)
  }
  return res.json()
}

async function updateProduct(token, payloadId, productData) {
  const res = await fetch(`${PAYLOAD_URL}/api/products/${payloadId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(productData),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`PATCH /api/products/${payloadId} failed (${res.status}): ${body}`)
  }
  return res.json()
}

// ---------------------------------------------------------------------------
// Data mapping — mirrors upsertProduct in src/data/products.ts
// ---------------------------------------------------------------------------

function buildProductData(detail) {
  const { sync_product, sync_variants } = detail

  const thumbnailUrl =
    sync_product.thumbnail_url ??
    sync_variants[0]?.files?.find((f) => f.type === 'preview')?.preview_url ??
    undefined

  return {
    printfulSyncProductId: sync_product.id,
    name: sync_product.name,
    imageUrl: thumbnailUrl ?? null,
    status: 'synced',
    variants: sync_variants.map((v) => ({
      printfulVariantId: v.id,
      format: v.size,
      price: parseFloat(v.retail_price),
    })),
    lastSyncedAt: new Date().toISOString(),
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log(`Payload target: ${PAYLOAD_URL}`)
if (isDryRun) console.log('(dry run — no writes will be made)\n')

// 1. Auth
console.log('Logging in to Payload...')
const token = await payloadLogin()
console.log('Logged in.\n')

// 2. List Printful products
console.log('Fetching Printful sync product list...')
const summaries = await listSyncProducts()
console.log(`Found ${summaries.length} product(s) on Printful.\n`)

// 3. Upsert each
let created = 0
let updated = 0
let failed = 0

for (const summary of summaries) {
  process.stdout.write(`  [${summary.id}] ${summary.name} — `)

  try {
    const detail = await getSyncProductDetail(summary.id)
    const productData = buildProductData(detail)

    const existing = await findExistingProduct(token, summary.id)

    if (isDryRun) {
      console.log(existing ? '(would update)' : '(would create)')
      if (existing) updated++
      else created++
      continue
    }

    if (existing) {
      await updateProduct(token, existing.id, productData)
      console.log('updated')
      updated++
    } else {
      await createProduct(token, productData)
      console.log('created')
      created++
    }
  } catch (err) {
    console.log(`FAILED — ${err.message}`)
    failed++
  }
}

// 4. Summary
console.log(`\nDone.`)
console.log(`  Created : ${created}`)
console.log(`  Updated : ${updated}`)
if (failed > 0) {
  console.log(`  Failed  : ${failed}`)
  process.exit(1)
}
