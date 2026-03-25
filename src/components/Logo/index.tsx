import clsx from 'clsx'
import React from 'react'
import styles from './index.module.css'

interface Props {
  className?: string
}

export const Logo = ({ className }: Props) => {
  return <span className={clsx(styles.logo, className)}>Cinematic State</span>
}
