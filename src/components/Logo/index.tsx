import clsx from 'clsx'
import React from 'react'
import styles from './index.module.css'
import { SITE_NAME } from '@/constants'

interface Props {
  className?: string
}

export const Logo = ({ className }: Props) => {
  return <span className={clsx(styles.logo, className)}>{SITE_NAME}</span>
}
