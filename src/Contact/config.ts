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
      defaultValue: 'Get in touch',
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      defaultValue: 'The work starts with a conversation.',
    },
    {
      name: 'subline',
      type: 'text',
      defaultValue:
        "Whether you have a project in mind or just want to explore what's possible — tell me a little about what you're after and I'll get back to you within a couple of days.",
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
      defaultValue: 'cinematicstatephotography@gmail.com',
    },
  ],
}
