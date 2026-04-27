import type { GlobalConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const PortfolioPage: GlobalConfig = {
  slug: 'portfolio-page',
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [],
}
