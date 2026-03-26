import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "portfolio_items" ADD COLUMN IF NOT EXISTS "slug" varchar`)
  await db.execute(sql`ALTER TABLE "portfolio_items" ADD COLUMN IF NOT EXISTS "slug_lock" boolean DEFAULT true`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_items_slug_idx" ON "portfolio_items" USING btree ("slug")`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP INDEX IF EXISTS "portfolio_items_slug_idx"`)
  await db.execute(sql`ALTER TABLE "portfolio_items" DROP COLUMN IF EXISTS "slug"`)
  await db.execute(sql`ALTER TABLE "portfolio_items" DROP COLUMN IF EXISTS "slug_lock"`)
}
