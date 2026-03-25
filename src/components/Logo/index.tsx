import clsx from 'clsx'
import NextImage from 'next/image'
import React from 'react'
import styles from './index.module.css'

interface Props {
  className?: string
}

export const Logo = ({ className }: Props) => {
  return (
    <NextImage
      src="/logo.png"
      alt="Cinematic State"
      width={160}
      height={40}
      className={clsx(styles.logoImage, className)}
      priority
    />
  )
}
