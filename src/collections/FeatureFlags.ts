import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { authenticated } from '../access/authenticated'

export const FeatureFlags: CollectionConfig = {
  slug: 'feature-flags',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'key',
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'kebab-case identifier, e.g. shop-enabled',
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'What does this flag control?',
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateTag(`flag-${doc.key}`, {})
      },
    ],
  },
}
