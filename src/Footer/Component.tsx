import { getCachedGlobal } from '@/utilities/getGlobals'
import { CMSLink } from '@/components/Link'
import { SITE_NAME } from '@/constants'
import type { Footer } from '@/payload-types'
import type { SiteSetting } from '@/payload-types'
import './Component.css'

export async function Footer() {
  const [footerData, siteSettings] = await Promise.all([
    getCachedGlobal('footer', 1)() as Promise<Footer>,
    getCachedGlobal('site-settings', 0)() as Promise<SiteSetting>,
  ])

  const navItems = footerData?.navItems || []
  const copyright = footerData?.copyright
  const instagramUrl = siteSettings?.instagramUrl

  return (
    <footer className="footer">
      <span className="footer__logo">{SITE_NAME}</span>
      {navItems.length > 0 && (
        <ul className="footer__nav">
          {navItems.map(({ link }, i) => (
            <li key={i}>
              <CMSLink {...link} className="footer__nav-link" />
            </li>
          ))}
        </ul>
      )}
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
