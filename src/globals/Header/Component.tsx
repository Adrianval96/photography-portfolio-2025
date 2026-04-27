import Link from 'next/link'
import { HeaderClient } from '@/globals/Header/Component.client'
import { fetchSocialLinks, fetchShopEnabled } from '@/data/globals'
import { ROUTES } from '@/constants'
import navStyles from '@/globals/Header/Nav/index.module.css'

export async function Header() {
  const [siteSettings, showShop] = await Promise.all([
    fetchSocialLinks().catch(() => null),
    fetchShopEnabled().catch(() => false),
  ])

  return (
    <HeaderClient instagramUrl={siteSettings?.instagramUrl ?? null}>
      {showShop && (
        <Link href={ROUTES.shop} className={navStyles.navLink}>
          Shop
        </Link>
      )}
    </HeaderClient>
  )
}
