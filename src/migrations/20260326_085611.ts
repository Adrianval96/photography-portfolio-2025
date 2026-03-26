import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "portfolio_items" ADD COLUMN IF NOT EXISTS "featured" boolean DEFAULT false`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "portfolio_items" DROP COLUMN IF EXISTS "featured"`)
}
