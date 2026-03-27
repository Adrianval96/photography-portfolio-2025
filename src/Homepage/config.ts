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
    {
      name: 'aboutSection',
      type: 'group',
      label: 'About Section',
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Photo',
        },
        {
          name: 'name',
          type: 'text',
          label: 'Name',
        },
        {
          name: 'bio',
          type: 'textarea',
          label: 'Bio',
        },
      ],
    },
    {
      name: 'ctaSection',
      type: 'group',
      label: 'CTA Section',
      admin: {
        description: 'Bottom CTA section shown after the featured work grid.',
      },
      fields: [
        {
          name: 'headline',
          type: 'text',
          label: 'Headline',
        },
        {
          name: 'subline',
          type: 'text',
          label: 'Subline',
        },
        {
          name: 'link',
          type: 'group',
          admin: { hideGutter: true },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'type',
                  type: 'radio',
                  defaultValue: 'reference',
                  options: [
                    { label: 'Internal link', value: 'reference' },
                    { label: 'Custom URL', value: 'custom' },
                  ],
                  admin: { layout: 'horizontal', width: '50%' },
                },
                {
                  name: 'newTab',
                  type: 'checkbox',
                  label: 'Open in new tab',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'reference',
                  type: 'relationship',
                  relationTo: ['pages'],
                  label: 'Document to link to',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'reference',
                    width: '50%',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'Custom URL',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'custom',
                    width: '50%',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Label',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
