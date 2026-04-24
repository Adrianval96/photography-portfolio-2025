import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-vercel-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    pagination: false,
  })

  const doc = result.docs[0]
  if (doc) {
    await payload.delete({ collection: 'pages', id: doc.id })
    payload.logger.info('Deleted home pages entry — homepage is now driven entirely by the Homepage global')
  }
}

// No down — restoring the home page would require content data we no longer keep
export async function down({}: MigrateDownArgs): Promise<void> {}
