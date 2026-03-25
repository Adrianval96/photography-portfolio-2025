'use client'

import React, { useState } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SearchIcon, MenuIcon, XIcon } from 'lucide-react'
import clsx from 'clsx'
import styles from './index.module.css'

const NAV_LINKS = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/shop', label: 'Shop' },
  { href: '/book', label: 'Book a Session' },
  { href: '/about', label: 'About' },
]

export const HeaderNav: React.FC<{ data: HeaderType }> = () => {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop nav */}
      <nav className={styles.desktopNav}>
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={clsx(styles.navLink, pathname === href && styles.navLinkActive)}
          >
            {label}
          </Link>
        ))}
        <Link href="/search" className={styles.iconLink}>
          <span className="sr-only">Search</span>
          <SearchIcon className={styles.icon} />
        </Link>
      </nav>

      {/* Mobile hamburger button */}
      <button
        className={clsx(styles.iconLink, styles.hamburger)}
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <XIcon className={styles.icon} /> : <MenuIcon className={styles.icon} />}
      </button>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <button
            className={clsx(styles.iconLink, styles.mobileClose)}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <XIcon className={styles.icon} />
          </button>

          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={clsx(styles.mobileNavLink, pathname === href && styles.navLinkActive)}
            >
              {label}
            </Link>
          ))}

          <Link href="/search" onClick={() => setMobileOpen(false)} className={styles.iconLink}>
            <SearchIcon className={styles.icon} />
          </Link>
        </div>
      )}
    </>
  )
}
