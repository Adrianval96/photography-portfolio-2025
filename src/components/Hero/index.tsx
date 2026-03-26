import Image from 'next/image'
import Link from 'next/link'
import styles from './index.module.css'

export const Hero = () => {
  return (
    <section className={styles.hero}>
      <Image
        src="https://picsum.photos/1920/1080?grayscale"
        alt=""
        fill
        priority
        className={styles.image}
      />
      <div className={styles.content}>
        <h1 className={styles.headline}>Still frames from a moving world.</h1>
        <p className={styles.subline}>
          Based in Australia, I explore the cinematic in both the everyday and the unexpected.
        </p>
        <Link href="/portfolio" className={styles.cta}>View the work →</Link>
      </div>
    </section>
  )
}
