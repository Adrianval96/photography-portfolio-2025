import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Cormorant_Garamond } from 'next/font/google'
import React from 'react'

const font = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-primary',
  display: 'swap',
})

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { NewFooter } from '@/Footer/NewFooter'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { SITE_NAME } from '@/constants'
import { isEnabled } from '@/utilities/flags'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraftMode } = await draftMode()
  const newFooterEnabled = await isEnabled('enable-new-footer')

  return (
    <html className={cn(font.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isDraftMode,
            }}
          />

          <Header />
          {children}
          {newFooterEnabled ? <NewFooter /> : <Footer />}
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(getServerSideURL()),
    openGraph: mergeOpenGraph({
      siteName: SITE_NAME,
    }),
  }
}
