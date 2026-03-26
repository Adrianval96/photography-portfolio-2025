import type { Payload } from 'payload'

export const isFlagActive = async (payload: Payload, key: string): Promise<boolean> => {
  const result = await payload.find({
    collection: 'feature-flags',
    where: { key: { equals: key } },
    limit: 1,
  })
  const [flag] = result.docs
  return flag?.enabled ?? false
}
