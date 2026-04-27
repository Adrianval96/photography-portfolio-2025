import type { GlobalConfig } from 'payload'

import { revalidateFooter } from '@/globals/Footer/hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright',
      admin: {
        description: 'e.g. © 2026 Adrian Valdes',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
