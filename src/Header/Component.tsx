import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header, SiteSetting } from '@/payload-types'

export async function Header() {
  const headerData = (await getCachedGlobal('header', 1)()) as Header
  const siteSettings = await (getCachedGlobal('site-settings', 0)() as Promise<SiteSetting>).catch(
    () => null,
  )

  return <HeaderClient data={headerData} instagramUrl={siteSettings?.instagramUrl ?? null} />
}
