import type { GlobalConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { link } from '@/fields/link'

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
    link({
      appearances: false,
      overrides: { name: 'cta', label: 'CTA' },
    }),
    {
      name: 'positioningStatement',
      type: 'text',
      label: 'Positioning Statement',
      admin: {
        description: 'Single-line statement shown in the strip below the hero.',
      },
    },
  ],
}
