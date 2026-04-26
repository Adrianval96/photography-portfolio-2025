import { HeaderClient } from './Component.client'
import { fetchSocialLinks } from '@/data/globals'
import React from 'react'

export async function Header() {
  const siteSettings = await fetchSocialLinks().catch(() => null)

  return <HeaderClient instagramUrl={siteSettings?.instagramUrl ?? null} />
}
