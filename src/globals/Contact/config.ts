import type { GlobalConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Contact: GlobalConfig = {
  slug: 'contact',
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background image',
      admin: {
        description: 'Ambient background shown at low opacity behind the page.',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
    },
    {
      name: 'subline',
      type: 'text',
    },
    {
      name: 'locationNote',
      type: 'text',
      label: 'Location note',
      admin: {
        description: 'Shown below the context panel items.',
      },
    },
    {
      name: 'notificationEmail',
      type: 'email',
      label: 'Notification email',
      admin: {
        description: 'Inquiry submissions are forwarded to this address.',
      },
    },
  ],
}
