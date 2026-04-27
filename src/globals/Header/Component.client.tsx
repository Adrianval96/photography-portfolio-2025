'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { Logo } from '@/components/Logo'
import { HeaderNav } from './Nav'
import styles from './Component.module.css'

interface HeaderClientProps {
  instagramUrl: string | null
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ instagramUrl }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header className={styles.header} {...(theme ? { 'data-theme': theme } : {})}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logoLink}>
          <Logo />
        </Link>
        <HeaderNav instagramUrl={instagramUrl} />
      </div>
    </header>
  )
}
