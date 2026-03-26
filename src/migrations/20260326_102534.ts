import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "homepage" (
    "id" serial PRIMARY KEY NOT NULL,
    "hero_image_id" integer NOT NULL,
    "hero_headline" varchar NOT NULL,
    "hero_subline" varchar,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  )`)
  await db.execute(sql`ALTER TABLE "homepage" DROP CONSTRAINT IF EXISTS "homepage_hero_image_id_media_id_fk"`)
  await db.execute(sql`ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "homepage_hero_image_idx" ON "homepage" USING btree ("hero_image_id")`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "homepage" CASCADE`)
}
