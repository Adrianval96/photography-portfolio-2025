import type { Block } from 'payload'
import { link } from '@/fields/link'

export const PromoSection: Block = {
  slug: 'promoSection',
  interfaceName: 'PromoSectionBlock',
  labels: {
    singular: 'Promo Section',
    plural: 'Promo Sections',
  },
  fields: [
    {
      name: 'orientation',
      type: 'radio',
      defaultValue: 'vertical',
      options: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' },
      ],
      admin: {
        layout: 'horizontal',
        description: 'Vertical stacks content. Horizontal places image and text side by side.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'text',
    },
    {
      name: 'enableLink',
      type: 'checkbox',
      label: 'Add a link',
    },
    link({
      appearances: false,
      overrides: {
        admin: {
          condition: (_, siblingData) => Boolean(siblingData?.enableLink),
        },
      },
    }),
  ],
}
