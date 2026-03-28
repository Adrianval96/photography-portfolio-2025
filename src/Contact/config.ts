import type { GlobalConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Contact: GlobalConfig = {
  slug: 'contact',
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
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
      defaultValue:
        'Based in Melbourne but travel for the right project. Response time is usually 48 hours.',
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
