import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Cormorant_Garamond } from 'next/font/google'
import React from 'react'
import { Analytics } from '@vercel/analytics/next'

const font = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-primary',
  display: 'swap',
})

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { SITE_NAME } from '@/constants'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { SiteIdentity, SocialLink } from '@/payload-types'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

async function getPersonJsonLd(): Promise<string | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const [identity, socialLinks] = await Promise.all([
      payload.findGlobal({ slug: 'site-identity' }) as Promise<SiteIdentity>,
      payload.findGlobal({ slug: 'social-links' }) as Promise<SocialLink>,
    ])

    const { personName, jobTitle, schemaDescription, addressLocality, addressCountry } = identity

    if (!personName) return null

    const { instagramUrl } = socialLinks

    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: personName,
      url: getServerSideURL(),
    }

    if (jobTitle) schema.jobTitle = jobTitle
    if (schemaDescription) schema.description = schemaDescription

    if (addressLocality || addressCountry) {
      schema.address = {
        '@type': 'PostalAddress',
        ...(addressLocality && { addressLocality }),
        ...(addressCountry && { addressCountry }),
      }
    }

    const sameAs = [instagramUrl].filter(Boolean)
    if (sameAs.length) schema.sameAs = sameAs

    return JSON.stringify(schema)
  } catch {
    return null
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const personJsonLd = await getPersonJsonLd()

  return (
    <html className={cn(font.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        {personJsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd }} />
        )}
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(getServerSideURL()),
    title: {
      template: `%s | ${SITE_NAME}`,
      default: `${SITE_NAME} | Adrian Valero — Melbourne Photographer`,
    },
    description:
      'Still frames from a moving world. Live performance, street, and editorial photography by Adrian Valero, Melbourne.',
    openGraph: mergeOpenGraph({
      siteName: SITE_NAME,
    }),
    twitter: {
      card: 'summary_large_image',
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
    },
    manifest: '/site.webmanifest',
  }
}
