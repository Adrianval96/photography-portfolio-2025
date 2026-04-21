import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { revalidatePath, revalidateTag } from 'next/cache'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import { CACHE_TAG_PORTFOLIO_ITEMS } from '@/constants'

function revalidatePortfolioItems() {
  revalidateTag(CACHE_TAG_PORTFOLIO_ITEMS)
  revalidatePath('/', 'page')
  revalidatePath('/portfolio', 'page')
}

export const PortfolioItems: CollectionConfig = {
  slug: 'portfolio-items',
  hooks: {
    afterChange: [() => revalidatePortfolioItems()],
    afterDelete: [() => revalidatePortfolioItems()],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'categories', 'location', 'featured', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured on homepage',
      defaultValue: false,
      admin: {
        description: 'Tick to include this image in the Featured Work section on the homepage.',
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
}
