import type { GlobalConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const SiteIdentity: GlobalConfig = {
  slug: 'site-identity',
  label: 'Site Identity',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    description:
      'Site-wide identity used for structured data (JSON-LD) and search engine context. Helps Google understand who owns this site.',
  },
  fields: [
    {
      name: 'personName',
      type: 'text',
      label: 'Full name',
      required: true,
      admin: {
        description: 'The person or entity behind this site. E.g. "Adrian Valero".',
      },
    },
    {
      name: 'jobTitle',
      type: 'text',
      label: 'Job title',
      admin: {
        description: 'E.g. "Photographer", "Visual Artist".',
      },
    },
    {
      name: 'schemaDescription',
      type: 'textarea',
      label: 'Description',
      admin: {
        description:
          'One or two sentences describing the person and their work. Used in structured data.',
      },
    },
    {
      name: 'addressLocality',
      type: 'text',
      label: 'City',
      admin: {
        description: 'E.g. "Melbourne".',
      },
    },
    {
      name: 'addressCountry',
      type: 'text',
      label: 'Country code',
      admin: {
        description: 'ISO 3166-1 alpha-2 country code. E.g. "AU" for Australia.',
      },
    },
  ],
}
