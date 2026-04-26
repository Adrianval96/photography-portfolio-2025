import { HeaderClient } from './Component.client'
import { fetchHeader, fetchSocialLinks } from '@/data/globals'
import React from 'react'

export async function Header() {
  const [headerData, siteSettings] = await Promise.all([
    fetchHeader(),
    fetchSocialLinks().catch(() => null),
  ])

  return <HeaderClient data={headerData} instagramUrl={siteSettings?.instagramUrl ?? null} />
}
