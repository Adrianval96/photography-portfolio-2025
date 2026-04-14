import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header, SiteSetting } from '@/payload-types'

export async function Header() {
  const [headerData, siteSettings] = await Promise.all([
    getCachedGlobal('header', 1)() as Promise<Header>,
    getCachedGlobal('site-settings', 0)() as Promise<SiteSetting>,
  ])

  return <HeaderClient data={headerData} instagramUrl={siteSettings?.instagramUrl ?? null} />
}
