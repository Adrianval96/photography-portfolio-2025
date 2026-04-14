'use client'

import React, { useState } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuIcon, XIcon } from 'lucide-react'
import clsx from 'clsx'
import styles from './index.module.css'

type NavLink = NonNullable<HeaderType['navItems']>[number]['link']

function resolveHref(link: NavLink): string | null {
  if (link.type === 'reference' && typeof link.reference?.value === 'object') {
    const slug = link.reference.value.slug
    const prefix = link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''
    return slug ? `${prefix}/${slug}` : null
  }
  return link.url ?? null
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems = data?.navItems ?? []

  return (
    <>
      {/* Desktop nav */}
      <nav className={styles.desktopNav}>
        {navItems.map(({ link }, i) => {
          const href = resolveHref(link)
          if (!href) return null
          return (
            <Link
              key={i}
              href={href}
              {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={clsx(styles.navLink, pathname === href && styles.navLinkActive)}
            >
              {link.label}
            </Link>
          )
        })}
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

          {navItems.map(({ link }, i) => {
            const href = resolveHref(link)
            if (!href) return null
            return (
              <Link
                key={i}
                href={href}
                {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={() => setMobileOpen(false)}
                className={clsx(styles.mobileNavLink, pathname === href && styles.navLinkActive)}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
