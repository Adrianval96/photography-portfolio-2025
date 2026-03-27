import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`DO $$ BEGIN
    CREATE TYPE "public"."enum_homepage_cta_section_link_type" AS ENUM('reference', 'custom');
  EXCEPTION WHEN duplicate_object THEN null; END $$`)

  await db.execute(sql`ALTER TABLE "homepage"
    ADD COLUMN IF NOT EXISTS "cta_section_headline" varchar,
    ADD COLUMN IF NOT EXISTS "cta_section_subline" varchar,
    ADD COLUMN IF NOT EXISTS "cta_section_link_type" "enum_homepage_cta_section_link_type" DEFAULT 'reference',
    ADD COLUMN IF NOT EXISTS "cta_section_link_new_tab" boolean,
    ADD COLUMN IF NOT EXISTS "cta_section_link_url" varchar,
    ADD COLUMN IF NOT EXISTS "cta_section_link_label" varchar`)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "homepage_rels_pages_id_idx" ON "homepage_rels" USING btree ("pages_id")`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "homepage"
    DROP COLUMN IF EXISTS "cta_section_headline",
    DROP COLUMN IF EXISTS "cta_section_subline",
    DROP COLUMN IF EXISTS "cta_section_link_type",
    DROP COLUMN IF EXISTS "cta_section_link_new_tab",
    DROP COLUMN IF EXISTS "cta_section_link_url",
    DROP COLUMN IF EXISTS "cta_section_link_label"`)

  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_homepage_cta_section_link_type"`)
}
