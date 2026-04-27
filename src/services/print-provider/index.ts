import { PrintfulProvider } from './printful'
import type { PrintProvider } from './types'

export function getPrintProvider(): PrintProvider {
  const provider = process.env.PRINT_PROVIDER ?? 'printful'
  if (provider === 'printful') {
    return new PrintfulProvider()
  }
  throw new Error(`Unknown PRINT_PROVIDER: ${provider}`)
}

export type {
  PrintProduct,
  PrintVariant,
  PrintProvider,
  OrderPayload,
  FulfillmentOrder,
  FulfillmentStatus,
} from './types'
