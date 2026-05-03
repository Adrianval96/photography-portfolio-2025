#!/usr/bin/env node
/**
 * Registers (or updates) the Printful webhook URL for a store.
 *
 * Usage:
 *   node scripts/register-printful-webhook.mjs <site-url>
 *   npm run webhook:register -- https://your-site.vercel.app
 *
 * The script POSTs to https://api.printful.com/webhooks, replacing any
 * previously registered URL for the store.
 *
 * Required env var:
 *   PRINTFUL_API_KEY  — store-scoped Printful API token
 *
 * Optional env var:
 *   PRINTFUL_WEBHOOK_URL — alternative to passing the URL as a CLI arg
 */

import { readFileSync } from 'fs'

// ---------------------------------------------------------------------------
// Resolve URL — CLI arg takes precedence over env var
// ---------------------------------------------------------------------------

const siteUrl = process.argv[2] ?? process.env.PRINTFUL_WEBHOOK_URL

if (!siteUrl) {
  console.error(
    'Error: no site URL provided.\n' +
      'Pass it as an argument or set PRINTFUL_WEBHOOK_URL.\n\n' +
      '  node scripts/register-printful-webhook.mjs https://your-site.vercel.app',
  )
  process.exit(1)
}

// Normalise — strip trailing slash, then append the route
const webhookUrl = siteUrl.replace(/\/$/, '') + '/api/webhooks/printful'

// ---------------------------------------------------------------------------
// Resolve API key — env var or .env.local fallback
// ---------------------------------------------------------------------------

let apiKey = process.env.PRINTFUL_API_KEY

if (!apiKey) {
  // Try to load from .env.local so the script works without a pre-sourced env
  try {
    const raw = readFileSync('.env.local', 'utf8')
    for (const line of raw.split('\n')) {
      const [key, ...rest] = line.split('=')
      if (key?.trim() === 'PRINTFUL_API_KEY') {
        apiKey = rest.join('=').trim().replace(/^['"]|['"]$/g, '')
        break
      }
    }
  } catch {
    // .env.local absent — that's fine
  }
}

if (!apiKey) {
  console.error(
    'Error: PRINTFUL_API_KEY is not set.\n' +
      'Export it or add it to .env.local before running this script.',
  )
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Event types to subscribe to
// ---------------------------------------------------------------------------

const WEBHOOK_TYPES = [
  'product_synced',
  'product_updated',
  'product_deleted',
]

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------

console.log(`Registering Printful webhook →  ${webhookUrl}`)
console.log(`Events: ${WEBHOOK_TYPES.join(', ')}`)

const response = await fetch('https://api.printful.com/webhooks', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ url: webhookUrl, types: WEBHOOK_TYPES }),
})

const body = await response.json()

if (!response.ok) {
  console.error(`Printful API error ${response.status}:`, JSON.stringify(body, null, 2))
  process.exit(1)
}

console.log('\nRegistered successfully.')
console.log('Current config:', JSON.stringify(body.result, null, 2))
