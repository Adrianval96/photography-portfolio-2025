import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { is_flag_active } from './helpers'

const fetchFlag = async (key: string): Promise<boolean> => {
  const payload = await getPayload({ config })
  return is_flag_active(payload, key)
}

export const isEnabled = (key: string) =>
  unstable_cache(
    () => fetchFlag(key),
    [`flag-${key}`],
    { revalidate: 60, tags: [`flag-${key}`] },
  )()
