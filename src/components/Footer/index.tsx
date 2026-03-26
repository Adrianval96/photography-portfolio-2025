import Link from 'next/link'
import styles from './index.module.css'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <span className={styles.brand}>Cinematic State</span>
      <nav className={styles.nav}>
        <Link href="/portfolio" className={styles.link}>Portfolio</Link>
        <Link href="/contact" className={styles.link}>Contact</Link>
      </nav>
      <span className={styles.copyright}>© 2026 Adrian Valdes</span>
    </footer>
  )
}
