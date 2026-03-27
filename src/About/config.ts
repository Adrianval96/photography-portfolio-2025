import type { GlobalConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const About: GlobalConfig = {
  slug: 'about',
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Photo',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
      label: 'Bio',
    },
  ],
}
