import { getCachedGlobal } from '@/utilities/getGlobals'
import { CMSLink } from '@/components/Link'
import { SITE_NAME } from '@/constants'
import type { Footer } from '@/payload-types'
import './NewFooter.css'

export async function NewFooter() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems || []
  const copyright = footerData?.copyright

  return (
    <footer className="new-footer">
      <span className="new-footer__logo">{SITE_NAME}</span>
      {navItems.length > 0 && (
        <ul className="new-footer__nav">
          {navItems.map(({ link }, i) => (
            <li key={i}>
              <CMSLink {...link} className="new-footer__nav-link" />
            </li>
          ))}
        </ul>
      )}
      {copyright && <span className="new-footer__copy">{copyright}</span>}
    </footer>
  )
}
