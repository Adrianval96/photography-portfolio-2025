import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-vercel-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  payload.logger.info('mock migration: up')
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('mock migration: down')
}
