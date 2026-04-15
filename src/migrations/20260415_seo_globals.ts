import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "portfolio_page" (
      "id" serial PRIMARY KEY NOT NULL,
      "meta_title" varchar,
      "meta_description" varchar,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    )
  `)

  await db.execute(sql`ALTER TABLE "contact" ADD COLUMN IF NOT EXISTS "meta_title" varchar`)
  await db.execute(sql`ALTER TABLE "contact" ADD COLUMN IF NOT EXISTS "meta_description" varchar`)

  await db.execute(sql`ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "meta_title" varchar`)
  await db.execute(sql`ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "meta_description" varchar`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "portfolio_page"`)

  await db.execute(sql`ALTER TABLE "contact" DROP COLUMN IF EXISTS "meta_title"`)
  await db.execute(sql`ALTER TABLE "contact" DROP COLUMN IF EXISTS "meta_description"`)

  await db.execute(sql`ALTER TABLE "homepage" DROP COLUMN IF EXISTS "meta_title"`)
  await db.execute(sql`ALTER TABLE "homepage" DROP COLUMN IF EXISTS "meta_description"`)
}
