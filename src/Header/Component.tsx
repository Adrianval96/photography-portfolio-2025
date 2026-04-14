import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header, SocialLink } from '@/payload-types'

export async function Header() {
  const headerData = (await getCachedGlobal('header', 1)()) as Header
  const siteSettings = await (getCachedGlobal('social-links', 0)() as Promise<SocialLink>).catch(
    () => null,
  )

  return <HeaderClient data={headerData} instagramUrl={siteSettings?.instagramUrl ?? null} />
}
