import Link from 'next/link'
import { ROUTES, SITE_NAME } from '@/constants'
import { fetchFooter, fetchSocialLinks } from '@/data/globals'
import './Component.css'

const FOOTER_NAV_LINKS = [
  { label: 'Portfolio', href: ROUTES.portfolio },
  { label: 'Contact', href: ROUTES.contact },
] as const

export async function Footer() {
  const [footerData, siteSettings] = await Promise.all([
    fetchFooter(),
    fetchSocialLinks().catch(() => null),
  ])

  const copyright = footerData?.copyright
  const instagramUrl = siteSettings?.instagramUrl

  return (
    <footer className="footer">
      <span className="footer__logo">{SITE_NAME}</span>
      <ul className="footer__nav">
        {FOOTER_NAV_LINKS.map(({ label, href }) => (
          <li key={href}>
            <Link href={href} className="footer__nav-link">
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="footer__right">
        {instagramUrl && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__social-link"
          >
            Instagram ↗
          </a>
        )}
        {copyright && <span className="footer__copy">{copyright}</span>}
      </div>
    </footer>
  )
}
