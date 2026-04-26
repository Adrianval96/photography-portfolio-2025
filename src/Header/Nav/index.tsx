'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuIcon, XIcon } from 'lucide-react'
import clsx from 'clsx'
import styles from './index.module.css'
import { ROUTES } from '@/constants'

const NAV_LINKS = [
  { label: 'Portfolio', href: ROUTES.portfolio },
  { label: 'Contact', href: ROUTES.contact },
] as const

type Props = {
  instagramUrl?: string | null
}

export const HeaderNav: React.FC<Props> = ({ instagramUrl }) => {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav className={styles.desktopNav}>
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={clsx(styles.navLink, pathname === href && styles.navLinkActive)}
          >
            {label}
          </Link>
        ))}
      </nav>

      <button
        className={clsx(styles.iconLink, styles.hamburger)}
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <XIcon className={styles.icon} /> : <MenuIcon className={styles.icon} />}
      </button>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <button
            className={clsx(styles.iconLink, styles.mobileClose)}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <XIcon className={styles.icon} />
          </button>

          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={clsx(styles.mobileNavLink, pathname === href && styles.navLinkActive)}
            >
              {label}
            </Link>
          ))}

          {instagramUrl && (
            <div className={styles.mobileNavFooter}>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileNavSocial}
              >
                Instagram ↗
              </a>
            </div>
          )}
        </div>
      )}
    </>
  )
}
