import type { GlobalConfig } from 'payload'

import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'social-links',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Settings',
    description: 'Site-wide settings shared across all components.',
  },
  fields: [
    {
      name: 'instagramUrl',
      type: 'text',
      label: 'Instagram URL',
      admin: {
        description: 'Full URL, e.g. https://www.instagram.com/cinematicstatephotography',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
