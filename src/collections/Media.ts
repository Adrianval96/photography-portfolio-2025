import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function generateBlurDataURL(buffer: Buffer): Promise<string | null> {
  try {
    const { default: sharp } = await import('sharp')
    const resized = await sharp(buffer)
      .resize(16, 16, { fit: 'inside' })
      .webp({ quality: 20 })
      .toBuffer()
    return `data:image/webp;base64,${resized.toString('base64')}`
  } catch {
    return null
  }
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // req.file is populated during upload operations
        const file = (req as any).file as { data?: Buffer } | undefined
        if (!file?.data) return data

        const blurDataURL = await generateBlurDataURL(file.data)
        if (!blurDataURL) return data

        return { ...data, blurDataUrl: blurDataURL }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe the image for screen readers and search engines. Be specific: subject, mood, location. E.g. "Fire performer surrounded by swirling flames at outdoor night event, Melbourne".',
      },
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'blurDataUrl',
      type: 'text',
      admin: {
        readOnly: true,
        description:
          'Auto-generated blur placeholder for progressive image loading. Set automatically on upload.',
        position: 'sidebar',
      },
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
