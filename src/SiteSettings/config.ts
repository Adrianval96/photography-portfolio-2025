import type { GlobalConfig } from 'payload'

import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

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
      defaultValue: 'Cinematic State Photography',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      label: 'Default Site Description',
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
