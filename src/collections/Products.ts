import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'status', 'featured', 'sortOrder', 'lastSyncedAt'],
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'printfulSyncProductId',
      type: 'number',
      required: true,
      unique: true,
      admin: {
        description: 'Printful sync product ID — used as the upsert key on sync.',
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    ...slugField('name'),
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'synced',
      options: [
        { label: 'Synced', value: 'synced' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'imageUrl',
      type: 'text',
      admin: {
        description: 'Primary blank-background mockup URL from Printful.',
        readOnly: true,
      },
    },
    {
      name: 'lastSyncedAt',
      type: 'date',
      admin: {
        description: 'Timestamp of last successful sync from Printful.',
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'variants',
      type: 'array',
      admin: { readOnly: true },
      fields: [
        {
          name: 'printfulVariantId',
          type: 'number',
          required: true,
        },
        {
          name: 'format',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "18 × 24 in — Native Print"' },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          admin: { description: 'Retail price in AUD.' },
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured on homepage',
      defaultValue: false,
      admin: {
        description: 'Surface this print in the homepage Selected Work section.',
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Grid display sequence — lower numbers appear first.',
        position: 'sidebar',
      },
    },
  ],
}
