import Link from 'next/link'
import styles from './index.module.css'

export const Nav = () => {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        Cinematic State Photography
      </Link>
      <div className={styles.links}>
        <Link href="/portfolio" className={styles.link}>Portfolio</Link>
        <Link href="/contact" className={styles.link}>Contact</Link>
      </div>
    </nav>
  )
}
