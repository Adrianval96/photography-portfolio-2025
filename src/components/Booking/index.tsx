import Link from 'next/link'
import styles from './index.module.css'

export const Booking = () => {
  return (
    <section className={styles.booking}>
      <div className={styles.left}>
        <h2 className={styles.heading}>Let's make something together.</h2>
        <p className={styles.body}>
          Whether it's a live event, an editorial shoot, or something you haven't quite put into
          words yet — get in touch.
        </p>
      </div>
      <Link href="/contact" className={styles.cta}>
        Get in touch →
      </Link>
    </section>
  )
}
