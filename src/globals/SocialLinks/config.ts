import type { GlobalConfig } from 'payload'

import { revalidateSocialLinks } from '@/globals/SocialLinks/hooks/revalidateSocialLinks'

export const SocialLinks: GlobalConfig = {
  slug: 'social-links',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Settings',
    description: 'Site-wide social media links.',
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
    afterChange: [revalidateSocialLinks],
  },
}
