import { getCachedGlobal } from '@/utilities/getGlobals'
import { CMSLink } from '@/components/Link'
import { SITE_NAME } from '@/constants'
import type { Footer } from '@/payload-types'
import './Component.css'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems || []
  const copyright = footerData?.copyright

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
      {copyright && <span className="footer__copy">{copyright}</span>}
    </footer>
  )
}
