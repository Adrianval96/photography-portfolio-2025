import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`DO $$ BEGIN
    CREATE TYPE "public"."enum_homepage_cta_type" AS ENUM('reference', 'custom');
  EXCEPTION WHEN duplicate_object THEN null; END $$`)

  await db.execute(sql`CREATE TABLE IF NOT EXISTS "homepage" (
    "id" serial PRIMARY KEY NOT NULL,
    "hero_image_id" integer NOT NULL,
    "hero_headline" varchar NOT NULL,
    "hero_subline" varchar,
    "cta_type" "enum_homepage_cta_type" DEFAULT 'reference',
    "cta_new_tab" boolean,
    "cta_url" varchar,
    "cta_label" varchar,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  )`)

  await db.execute(sql`ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "cta_type" "enum_homepage_cta_type" DEFAULT 'reference'`)
  await db.execute(sql`ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "cta_new_tab" boolean`)
  await db.execute(sql`ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "cta_url" varchar`)
  await db.execute(sql`ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "cta_label" varchar`)

  await db.execute(sql`CREATE TABLE IF NOT EXISTS "homepage_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "pages_id" integer
  )`)

  await db.execute(sql`ALTER TABLE "homepage" DROP CONSTRAINT IF EXISTS "homepage_hero_image_id_media_id_fk"`)
  await db.execute(sql`ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action`)

  await db.execute(sql`ALTER TABLE "homepage_rels" DROP CONSTRAINT IF EXISTS "homepage_rels_parent_fk"`)
  await db.execute(sql`ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action`)

  await db.execute(sql`ALTER TABLE "homepage_rels" DROP CONSTRAINT IF EXISTS "homepage_rels_pages_fk"`)
  await db.execute(sql`ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action`)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "homepage_hero_image_idx" ON "homepage" USING btree ("hero_image_id")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "homepage_rels_pages_id_idx" ON "homepage_rels" USING btree ("pages_id")`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "homepage_rels" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "homepage" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_homepage_cta_type"`)
}
