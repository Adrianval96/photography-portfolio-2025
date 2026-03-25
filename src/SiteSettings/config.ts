import type { GlobalConfig } from 'payload'

import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'
import { SITE_NAME } from '@/constants'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: SITE_NAME,
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
