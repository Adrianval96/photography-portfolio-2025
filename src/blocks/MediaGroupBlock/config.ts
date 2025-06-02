import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const MediaGroupBlock: Block = {
  slug: 'mediaGroupBlock',
  interfaceName: 'mediaGroupBlock',
  fields: [
    {
      name: 'header',
      type: 'richText',
      required: false,
      editor: lexicalEditor({
        features: [HeadingFeature()],
      }),
    },
    {
      name: 'mediaItems',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      required: true,
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'richText',
          required: false,
        },
      ],
    },
  ],
}
