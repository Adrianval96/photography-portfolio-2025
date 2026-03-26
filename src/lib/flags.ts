import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const fetchFlag = async (key: string): Promise<boolean> => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'feature-flags',
    where: { key: { equals: key } },
    limit: 1,
  })
  const [flag] = result.docs
  return flag?.enabled ?? false
}

export const isEnabled = (key: string) =>
  unstable_cache(
    () => fetchFlag(key),
    [`flag-${key}`],
    { revalidate: 60, tags: [`flag-${key}`] },
  )()
