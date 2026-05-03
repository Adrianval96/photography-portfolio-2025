import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  LinkFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from '@/collections/Categories'
import { FeatureFlags } from '@/collections/FeatureFlags'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { PortfolioItems } from '@/collections/PortfolioItems'
import { Products } from '@/collections/Products'
import { ServiceItems } from '@/collections/ServiceItems'
import { Users } from '@/collections/Users'
import { Contact } from '@/globals/Contact/config'
import { Footer } from '@/globals/Footer/config'
import { Homepage } from '@/globals/Homepage/config'
import { PortfolioPage } from '@/globals/PortfolioPage/config'
import { SiteIdentity } from '@/globals/SiteIdentity/config'
import { SocialLinks } from '@/globals/SocialLinks/config'
import { plugins } from '@/plugins'
import { getServerSideURL } from '@/utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => {
      return [...defaultFeatures, FixedToolbarFeature(), InlineToolbarFeature(), LinkFeature()]
    },
  }),
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),
  collections: [
    Pages,
    Media,
    Users,
    Categories,
    PortfolioItems,
    Products,
    FeatureFlags,
    ServiceItems,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Footer, Homepage, Contact, PortfolioPage, SiteIdentity, SocialLinks],
  plugins: [
    ...plugins,
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      clientUploads: true,
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
  email: resendAdapter({
    defaultFromAddress: 'noreply@cinematicstatephotography.com',
    defaultFromName: 'noreply',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
})
