import { PrintfulProvider } from '@/services/print-provider/printful'
import type { PrintProvider } from '@/services/print-provider/types'

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
} from '@/services/print-provider/types'
