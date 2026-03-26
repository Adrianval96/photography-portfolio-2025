import type { GlobalConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Hero Image',
    },
    {
      name: 'heroHeadline',
      type: 'text',
      required: true,
      label: 'Hero Headline',
    },
    {
      name: 'heroSubline',
      type: 'text',
      label: 'Hero Subline',
    },
  ],
}
